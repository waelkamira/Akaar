import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { getPagination, isPaginationOffsetOutOfRange, isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';
import { prisma } from '@/lib/db/prisma';
import { releaseOrderReservations } from '@/lib/orders/inventory';
import { calculateShippingQuotes, getWeightInKilograms } from '@/lib/shipping/quotes.mjs';
import { listCustomerOrders } from '@/lib/orders/repository';

type CheckoutLine = { variantId: string; quantity: number };

function parseLines(value: unknown): CheckoutLine[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;
  const seen = new Set<string>();
  const lines: CheckoutLine[] = [];

  for (const item of value) {
    if (!isPlainObject(item)
      || typeof item.variantId !== 'string'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.variantId)
      || typeof item.quantity !== 'number'
      || !Number.isSafeInteger(item.quantity)
      || item.quantity < 1
      || item.quantity > 1_000
      || seen.has(item.variantId)) {
      return null;
    }
    seen.add(item.variantId);
    lines.push({ variantId: item.variantId, quantity: item.quantity });
  }
  return lines;
}

function roundAmount(amount: Prisma.Decimal, minorUnits: number) {
  return amount.toDecimalPlaces(minorUnits);
}

function amountInMinorUnits(amount: Prisma.Decimal, minorUnits: number) {
  const scaled = amount.mul(10 ** minorUnits);
  if (!scaled.isInteger() || scaled.abs().greaterThan(Number.MAX_SAFE_INTEGER)) {
    throw new Error('TOTAL_OUT_OF_RANGE');
  }
  return scaled.toNumber();
}

function planInventoryAllocations(variant: {
  inventory: Array<{
    id: string;
    onHand: number;
    reserved: number;
    warehouse: { id: string; sellerId: string | null; isActive: boolean };
  }>;
  product: { store: { seller: { id: string } } };
}, quantity: number) {
  let remaining = quantity;
  const allocations: Array<{ inventoryId: string; warehouseId: string; quantity: number; onHand: number; reserved: number }> = [];
  for (const inventory of variant.inventory) {
    if (!inventory.warehouse.isActive || inventory.warehouse.sellerId !== variant.product.store.seller.id) continue;
    const available = Math.max(0, inventory.onHand - inventory.reserved);
    const allocated = Math.min(available, remaining);
    if (allocated > 0) {
      allocations.push({
        inventoryId: inventory.id,
        warehouseId: inventory.warehouse.id,
        quantity: allocated,
        onHand: inventory.onHand,
        reserved: inventory.reserved,
      });
      remaining -= allocated;
    }
    if (remaining === 0) break;
  }
  return remaining === 0 ? allocations : null;
}

async function releaseFailedCheckout(orderId: string, paymentId: string) {
  await prisma.$transaction(async (transaction) => {
    const payment = await transaction.payment.updateMany({
      where: { id: paymentId, status: 'PENDING' },
      data: { status: 'FAILED' },
    });
    if (payment.count !== 1) return;

    await releaseOrderReservations(transaction, orderId);
    await transaction.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    await transaction.orderStatusHistory.create({
      data: { orderId, status: 'CANCELLED', note: 'Stripe checkout could not be created.' },
    });
    await transaction.paymentAttempt.updateMany({
      where: { paymentId, status: 'PENDING' },
      data: { status: 'FAILED', errorCode: 'CHECKOUT_SESSION_FAILED' },
    });
  });
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لعرض الطلبات.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });
  try {
    const { totalCount, orders } = await listCustomerOrders(user.id, page, limit);
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return NextResponse.json({ orders: [], page, limit, totalCount, hasMore: false });
    }
    return NextResponse.json({ orders, page, limit, totalCount, hasMore: skip + orders.length < totalCount });
  } catch (error) {
    console.error('Unable to load order history:', error);
    return NextResponse.json({ error: 'تعذر تحميل الطلبات حاليًا.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإتمام الطلب.' }, { status: 401 });
  if (!(await isMarketplaceEnabled('marketplaceEnabled'))) {
    return NextResponse.json({ error: 'الشراء متوقف مؤقتًا.' }, { status: 503 });
  }

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }

  const body = parsed.value;
  const lines = parseLines(body.items);
  const paymentMethod = body.paymentMethod === undefined ? 'CASH_ON_DELIVERY' : body.paymentMethod;
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber.trim() : '';
  const shippingCity = typeof body.shippingCity === 'string' ? body.shippingCity.trim() : '';
  const shippingAddress = typeof body.shippingAddress === 'string' ? body.shippingAddress.trim() : '';
  const countryCode = typeof body.shippingCountryCode === 'string' ? body.shippingCountryCode.toUpperCase() : '';
  const currency = typeof body.currency === 'string' ? body.currency.toUpperCase() : '';
  const shippingRateId = body.shippingRateId;

  if (paymentMethod !== 'CASH_ON_DELIVERY' && paymentMethod !== 'STRIPE') {
    return NextResponse.json({ error: 'وسيلة الدفع المحددة غير مدعومة.' }, { status: 400 });
  }
  if (paymentMethod === 'CASH_ON_DELIVERY' && !(await isMarketplaceEnabled('cashOnDeliveryEnabled'))) {
    return NextResponse.json({ error: 'الدفع عند الاستلام متوقف مؤقتًا.' }, { status: 503 });
  }
  if (paymentMethod === 'STRIPE' && (
    !(await isMarketplaceEnabled('stripeSandboxCheckoutEnabled'))
    || !isStripeSandboxConfigured()
  )) {
    return NextResponse.json({ error: 'الدفع بالبطاقة في وضع الاختبار غير متاح حاليًا.' }, { status: 503 });
  }
  if (!lines
    || !customerName
    || customerName.length > 100
    || !/^[+()\d\s-]{7,40}$/.test(phoneNumber)
    || !shippingCity
    || shippingCity.length > 100
    || !shippingAddress
    || shippingAddress.length > 300
    || !/^[A-Z]{2}$/.test(countryCode)
    || !/^[A-Z]{3}$/.test(currency)
    || typeof shippingRateId !== 'string'
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(shippingRateId)) {
    return NextResponse.json({ error: 'يرجى التحقق من المنتجات وبيانات التوصيل وخدمة الشحن.' }, { status: 400 });
  }

  try {
    const checkout = await prisma.$transaction(async (transaction) => {
      const country = await transaction.country.findFirst({
        where: { code: countryCode, isActive: true },
        select: { code: true },
      });
      const currencyRecord = await transaction.currency.findFirst({
        where: { code: currency, isActive: true },
        select: { code: true, minorUnits: true },
      });
      if (!country || !currencyRecord) throw new Error('DESTINATION_UNAVAILABLE');
      if (paymentMethod === 'STRIPE' && currency !== 'USD') throw new Error('STRIPE_REQUIRES_USD');

<<<<<<< HEAD
    if (rawBody?.discountCode !== undefined && typeof rawBody.discountCode !== 'string') {
      return NextResponse.json({ error: 'رمز الخصم غير صالح.' }, { status: 400 });
    }
    const discountCode = typeof rawBody?.discountCode === 'string' ? rawBody.discountCode.trim().toUpperCase() : '';
    if (discountCode && paymentMethod === 'STRIPE') {
      return NextResponse.json({ error: 'رموز الخصم غير متاحة حاليًا للدفع بالبطاقة؛ اختر الدفع عند الاستلام أو أزل الرمز.' }, { status: 400 });
    }
    if (discountCode && !/^[A-Z0-9_-]{3,40}$/.test(discountCode)) {
      return NextResponse.json({ error: 'صيغة رمز الخصم غير صالحة.' }, { status: 400 });
    }
    const discount = discountCode ? await prisma.discount.findFirst({
      where: { code: discountCode, productId: { in: lines.map((line) => line.id) }, validFrom: { lte: new Date() }, validTo: { gte: new Date() } },
      select: { id: true, productId: true, percentage: true },
    }) : null;
    if (discountCode && !discount) {
      return NextResponse.json({ error: 'رمز الخصم غير صالح أو منتهي أو لا ينطبق على أي منتج في سلتك.' }, { status: 400 });
    }

    const quantityById = new Map(lines.map((line) => [line.id, line.quantity]));
    const totalPrice = products.reduce((sum, product) => {
      const quantity = quantityById.get(product.id) || 0;
      if (
        product.basePrice === null ||
        !Number.isSafeInteger(product.basePrice) ||
        !product.sellerId ||
        product.seller?.status !== 'ACTIVE' ||
        !product.seller.isVerified ||
        product.stockQuantity === null ||
        product.stockQuantity < quantity
      ) {
        throw new Error('PRODUCT_UNAVAILABLE');
      }
      const unitPrice = discount?.productId === product.id
        ? Math.floor(product.basePrice * (100 - discount.percentage) / 100)
        : product.basePrice;
      const lineTotal = unitPrice * quantity;
      if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(sum + lineTotal)) {
        throw new Error('TOTAL_OUT_OF_RANGE');
      }
      return sum + lineTotal;
    }, 0);

    const totalUsdCents = paymentMethod === 'STRIPE'
      ? products.reduce((sum, product) => {
        const quantity = quantityById.get(product.id) || 0;
        const usdPriceCents = product.usdPriceCents;
        if (
          typeof usdPriceCents !== 'number' ||
          !Number.isSafeInteger(usdPriceCents) ||
          usdPriceCents < 50
        ) {
          throw new Error('USD_PRICE_UNAVAILABLE');
        }
        const lineTotal = usdPriceCents * quantity;
        if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(sum + lineTotal) || sum + lineTotal > 99_999_999) {
          throw new Error('TOTAL_OUT_OF_RANGE');
        }
        return sum + lineTotal;
      }, 0)
      : null;

    const created = await prisma.$transaction(async (transaction) => {
      for (const line of lines) {
        const updated = await transaction.product.updateMany({
          where: {
            id: line.id,
=======
      const now = new Date();
      const variants = await transaction.productVariant.findMany({
        where: {
          id: { in: lines.map((line) => line.variantId) },
          status: 'ACTIVE',
          product: {
>>>>>>> wael-work-in-progress
            isActive: true,
            status: 'APPROVED',
            store: { isActive: true, seller: { status: 'ACTIVE', isVerified: true } },
          },
          prices: {
            some: {
              currency,
              validFrom: { lte: now },
              OR: [{ validUntil: null }, { validUntil: { gt: now } }],
              currencyRef: { isActive: true },
            },
          },
        },
        select: {
          id: true,
          sku: true,
          title: true,
          weight: true,
          weightUnit: true,
          product: {
            select: {
              id: true,
              title: true,
              media: {
                where: { mediaType: 'IMAGE' },
                orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                take: 1,
                select: { storageKey: true },
              },
              store: {
                select: {
                  name: true,
                  seller: { select: { id: true, status: true, isVerified: true } },
                },
              },
            },
          },
          prices: {
            where: {
              currency,
              validFrom: { lte: now },
              OR: [{ validUntil: null }, { validUntil: { gt: now } }],
              currencyRef: { isActive: true },
            },
            orderBy: { validFrom: 'desc' },
            take: 1,
            select: { id: true, amount: true, compareAt: true },
          },
          inventory: {
            where: { warehouse: { isActive: true } },
            orderBy: { warehouseId: 'asc' },
            select: {
              id: true,
              onHand: true,
              reserved: true,
              warehouse: { select: { id: true, sellerId: true, isActive: true } },
            },
          },
        },
      });
      if (variants.length !== lines.length) throw new Error('PRODUCT_UNAVAILABLE');

      const variantById = new Map<string, (typeof variants)[number]>(
        variants.map((variant) => [variant.id, variant]),
      );
      let totalWeightKg = 0;
      const lineData = lines.map((line) => {
        const variant = variantById.get(line.variantId);
        const price = variant?.prices[0];
        if (!variant || !price) throw new Error('PRODUCT_UNAVAILABLE');
        const allocation = planInventoryAllocations(variant, line.quantity);
        if (!allocation) throw new Error('PRODUCT_UNAVAILABLE');
        totalWeightKg += getWeightInKilograms(variant.weight, variant.weightUnit) * line.quantity;
        const unitPrice = roundAmount(new Prisma.Decimal(price.amount), currencyRecord.minorUnits);
        if (unitPrice.lessThanOrEqualTo(0)) throw new Error('INVALID_PRODUCT_PRICE');
        return {
          ...line,
          variant,
          price,
          allocation,
          unitPrice,
          lineTotal: unitPrice.mul(line.quantity),
          sellerId: variant.product.store.seller.id,
          sellerName: variant.product.store.name,
        };
      });
      const subtotal = lineData.reduce((total, line) => total.plus(line.lineTotal), new Prisma.Decimal(0));

      const [zones, services] = await Promise.all([
        transaction.shippingZone.findMany({
          where: { isActive: true, countries: { has: countryCode } },
          select: {
            id: true,
            countries: true,
            isActive: true,
            rates: {
              where: { currency },
              select: { id: true, serviceCode: true, currency: true, baseCost: true, perKgCost: true },
            },
          },
        }),
        transaction.shippingService.findMany({
          select: {
            id: true,
            code: true,
            name: true,
            isActive: true,
            carrier: { select: { id: true, name: true, isActive: true } },
          },
        }),
      ]);
      const quotes = calculateShippingQuotes({
        countryCode,
        currency,
        weightKg: totalWeightKg,
        minorUnits: currencyRecord.minorUnits,
        zones,
        services,
      });
      const selectedQuote = quotes.find((quote) => quote.rateId === shippingRateId);
      if (!selectedQuote) throw new Error('SHIPPING_QUOTE_EXPIRED');

      const shippingTotal = roundAmount(new Prisma.Decimal(selectedQuote.amount), currencyRecord.minorUnits);
      const grandTotal = subtotal.plus(shippingTotal);
      if (paymentMethod === 'STRIPE') {
        const totalCents = amountInMinorUnits(grandTotal, 2);
        if (totalCents < 50 || totalCents > 99_999_999) throw new Error('TOTAL_OUT_OF_RANGE');
      }

      const sellerSubtotals = new Map<string, Prisma.Decimal>();
      for (const line of lineData) {
        sellerSubtotals.set(
          line.sellerId,
          (sellerSubtotals.get(line.sellerId) || new Prisma.Decimal(0)).plus(line.lineTotal),
        );
      }

      const orderNumber = `AK-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const order = await transaction.order.create({
        data: {
          orderNumber,
          userId: user.id,
<<<<<<< HEAD
          customerName,
          phoneNumber,
          shippingCity,
          shippingAddress,
          totalPrice,
          discountId: discount?.id ?? null,
=======
>>>>>>> wael-work-in-progress
          status: 'PENDING',
          currency,
          subtotal,
          discountTotal: 0,
          taxTotal: 0,
          shippingTotal,
          grandTotal,
          placedAt: new Date(),
          addresses: {
            create: {
              type: 'SHIPPING',
              fullName: customerName,
              phone: phoneNumber,
              countryCode,
              city: shippingCity,
              address1: shippingAddress,
            },
          },
          statusHistory: { create: { status: 'PENDING', note: 'Order created at checkout.' } },
        },
        select: { id: true, orderNumber: true, grandTotal: true, currency: true, status: true, createdAt: true },
      });

<<<<<<< HEAD
      const sellerIds = [...new Set(products.map((product) => product.sellerId).filter((id): id is string => Boolean(id)))];
      const vendorOrders = await Promise.all(
        sellerIds.map((sellerId) =>
          transaction.vendorOrder.create({
            data: { orderId: createdOrder.id, sellerId, status: 'PENDING' },
            select: { id: true, sellerId: true },
          }),
        ),
      );
      const vendorOrderBySeller = new Map(vendorOrders.map((vendorOrder) => [vendorOrder.sellerId, vendorOrder.id]));
      await transaction.orderItem.createMany({
        data: products.map((product) => {
          const quantity = quantityById.get(product.id) || 0;
          const basePrice = product.basePrice as number;
          const unitPrice = discount?.productId === product.id
            ? Math.floor(basePrice * (100 - discount.percentage) / 100)
            : basePrice;
          return {
            orderId: createdOrder.id,
            productId: product.id,
            vendorOrderId: vendorOrderBySeller.get(product.sellerId as string),
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
        }),
=======
      const providerCode = paymentMethod === 'STRIPE' ? 'STRIPE' : 'CASH_ON_DELIVERY';
      await transaction.paymentProvider.upsert({
        where: { code: providerCode },
        update: {},
        create: { code: providerCode, name: paymentMethod === 'STRIPE' ? 'Stripe' : 'Cash on delivery' },
>>>>>>> wael-work-in-progress
      });
      const payment = await transaction.payment.create({
        data: {
          orderId: order.id,
          amount: grandTotal,
          currency,
          provider: providerCode,
          status: 'PENDING',
          idempotencyKey: randomUUID(),
          attempts: {
            create: { idempotencyKey: randomUUID(), status: 'PENDING' },
          },
        },
        select: { id: true, attempts: { select: { id: true }, take: 1 } },
      });

      const vendorOrderBySeller = new Map<string, string>();
      const vendorShipping = new Map<string, Prisma.Decimal>();
      let remainingShipping = shippingTotal;
      const sellerEntries = [...sellerSubtotals.entries()];
      sellerEntries.forEach(([sellerId, sellerSubtotal], index) => {
        const amount = index === sellerEntries.length - 1
          ? remainingShipping
          : roundAmount(shippingTotal.mul(sellerSubtotal).div(subtotal), currencyRecord.minorUnits);
        vendorShipping.set(sellerId, amount);
        remainingShipping = remainingShipping.minus(amount);
      });

      for (const [sellerId, sellerSubtotal] of sellerEntries) {
        const shippingAmount = vendorShipping.get(sellerId) || new Prisma.Decimal(0);
        const vendorOrder = await transaction.vendorOrder.create({
          data: {
            orderId: order.id,
            sellerId,
            status: 'PENDING',
            subtotal: sellerSubtotal,
            taxTotal: 0,
            shippingTotal: shippingAmount,
            grandTotal: sellerSubtotal.plus(shippingAmount),
          },
          select: { id: true },
        });
        vendorOrderBySeller.set(sellerId, vendorOrder.id);
      }

      const orderItemsBySeller = new Map<string, Array<{ id: string; quantity: number }>>();
      for (const line of lineData) {
        const vendorOrderId = vendorOrderBySeller.get(line.sellerId);
        if (!vendorOrderId) throw new Error('VENDOR_ORDER_MISSING');
        const sellerSubtotal = sellerSubtotals.get(line.sellerId) || new Prisma.Decimal(0);
        const sellerShipping = vendorShipping.get(line.sellerId) || new Prisma.Decimal(0);
        const itemShipping = sellerSubtotal.isZero()
          ? new Prisma.Decimal(0)
          : roundAmount(sellerShipping.mul(line.lineTotal).div(sellerSubtotal), currencyRecord.minorUnits);
        const orderItem = await transaction.orderItem.create({
          data: {
            orderId: order.id,
            vendorOrderId,
            variantId: line.variant.id,
            productName: line.variant.product.title,
            variantName: line.variant.title,
            sku: line.variant.sku,
            imageSnapshot: line.variant.product.media[0]?.storageKey || null,
            sellerName: line.sellerName,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            originalUnitPrice: line.price.compareAt
              ? roundAmount(new Prisma.Decimal(line.price.compareAt), currencyRecord.minorUnits)
              : line.unitPrice,
            discountAmount: 0,
            taxAmount: 0,
            shippingAmount: itemShipping,
            totalPrice: line.lineTotal,
            currency,
          },
          select: { id: true, quantity: true },
        });
        const sellerItems = orderItemsBySeller.get(line.sellerId) || [];
        sellerItems.push(orderItem);
        orderItemsBySeller.set(line.sellerId, sellerItems);

        for (const allocation of line.allocation) {
          const reserved = await transaction.inventory.updateMany({
            where: {
              id: allocation.inventoryId,
              onHand: allocation.onHand,
              reserved: allocation.reserved,
            },
            data: { reserved: { increment: allocation.quantity } },
          });
          if (reserved.count !== 1) throw new Error('STOCK_CONFLICT');
          await transaction.inventoryReservation.create({
            data: {
              variantId: line.variant.id,
              warehouseId: allocation.warehouseId,
              orderItemId: orderItem.id,
              quantity: allocation.quantity,
              expiresAt: new Date(Date.now() + (paymentMethod === 'STRIPE' ? 60 : 30 * 24 * 60) * 60_000),
              idempotencyKey: randomUUID(),
            },
          });
          await transaction.inventoryMovement.create({
            data: {
              variantId: line.variant.id,
              warehouseId: allocation.warehouseId,
              type: 'RESERVATION',
              quantity: allocation.quantity,
              referenceType: 'ORDER',
              referenceId: order.id,
              idempotencyKey: randomUUID(),
            },
          });
        }
      }

      for (const [sellerId, vendorOrderId] of vendorOrderBySeller) {
        const shipment = await transaction.shipment.create({
          data: {
            vendorOrderId,
            carrierId: selectedQuote.carrierId,
            serviceId: selectedQuote.serviceId,
            status: 'PENDING',
            shippingCost: vendorShipping.get(sellerId) || new Prisma.Decimal(0),
            currency,
          },
          select: { id: true },
        });
        const shipmentItems = orderItemsBySeller.get(sellerId) || [];
        await transaction.shipmentItem.createMany({
          data: shipmentItems.map((item) => ({
            shipmentId: shipment.id,
            orderItemId: item.id,
            quantity: item.quantity,
          })),
        });
        await transaction.shipmentTrackingEvent.create({
          data: { shipmentId: shipment.id, status: 'PENDING', description: 'Shipment record created.', occurredAt: new Date() },
        });
      }

      return {
        order,
        payment,
        currencyMinorUnits: currencyRecord.minorUnits,
        shippingAmount: shippingTotal,
        stripeLines: lineData.map((line) => ({
          title: line.variant.product.title,
          quantity: line.quantity,
          unitAmount: amountInMinorUnits(line.unitPrice, currencyRecord.minorUnits),
        })),
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    if (paymentMethod === 'CASH_ON_DELIVERY') {
      return NextResponse.json({ order: checkout.order }, { status: 201 });
    }

    try {
      const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
      if (!appUrl) throw new Error('STRIPE_APP_URL_NOT_CONFIGURED');
      const origin = new URL(appUrl);
      if (origin.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
        throw new Error('STRIPE_APP_URL_MUST_USE_HTTPS');
      }
      const stripeParams = new URLSearchParams();
      stripeParams.set('mode', 'payment');
      stripeParams.set('payment_method_types[0]', 'card');
      stripeParams.set('success_url', new URL(`/orders?checkout=success&orderId=${encodeURIComponent(checkout.order.id)}`, origin).toString());
      stripeParams.set('cancel_url', new URL('/cart?checkout=cancelled', origin).toString());
      if (user.email) stripeParams.set('customer_email', user.email);
      stripeParams.set('client_reference_id', checkout.order.id);
      stripeParams.set('expires_at', String(Math.floor(Date.now() / 1000) + 60 * 60));
      stripeParams.set('metadata[paymentId]', checkout.payment.id);
      stripeParams.set('metadata[orderId]', checkout.order.id);

      checkout.stripeLines.forEach((line, index) => {
        const prefix = `line_items[${index}]`;
        stripeParams.set(`${prefix}[quantity]`, String(line.quantity));
        stripeParams.set(`${prefix}[price_data][currency]`, 'usd');
        stripeParams.set(`${prefix}[price_data][unit_amount]`, String(line.unitAmount));
        stripeParams.set(`${prefix}[price_data][product_data][name]`, line.title.slice(0, 200));
      });
      const shippingMinor = amountInMinorUnits(checkout.shippingAmount, checkout.currencyMinorUnits);
      if (shippingMinor > 0) {
        const prefix = `line_items[${checkout.stripeLines.length}]`;
        stripeParams.set(`${prefix}[quantity]`, '1');
        stripeParams.set(`${prefix}[price_data][currency]`, 'usd');
        stripeParams.set(`${prefix}[price_data][unit_amount]`, String(shippingMinor));
        stripeParams.set(`${prefix}[price_data][product_data][name]`, 'Shipping');
      }

      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': checkout.payment.id,
        },
        body: stripeParams,
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      });
      const stripeSession = await stripeResponse.json().catch(() => ({}));
      if (!stripeResponse.ok || typeof stripeSession.id !== 'string'
        || typeof stripeSession.url !== 'string' || stripeSession.livemode !== false) {
        throw new Error(`STRIPE_CHECKOUT_FAILED_${stripeResponse.status}`);
      }

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: checkout.payment.id },
          data: { providerReference: stripeSession.id },
        }),
        prisma.paymentAttempt.updateMany({
          where: { paymentId: checkout.payment.id, status: 'PENDING' },
          data: { providerReference: stripeSession.id },
        }),
      ]);
      return NextResponse.json({ order: checkout.order, checkoutUrl: stripeSession.url }, { status: 201 });
    } catch (stripeError) {
      try {
        await releaseFailedCheckout(checkout.order.id, checkout.payment.id);
      } catch (releaseError) {
        console.error('Unable to release failed Stripe checkout reservation:', releaseError);
      }
      throw stripeError;
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'PRODUCT_UNAVAILABLE') {
      return NextResponse.json({ error: 'بعض المنتجات لم تعد متاحة بالكمية والسعر المحددين.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'STOCK_CONFLICT') {
      return NextResponse.json({ error: 'تغير المخزون أثناء إتمام الطلب. أعد المحاولة.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'DESTINATION_UNAVAILABLE') {
      return NextResponse.json({ error: 'بلد الشحن أو العملة غير مفعّلين.' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'SHIPPING_QUOTE_EXPIRED') {
      return NextResponse.json({ error: 'تغير سعر الشحن أو انتهت صلاحيته. أعد اختيار خدمة الشحن.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'STRIPE_REQUIRES_USD') {
      return NextResponse.json({ error: 'الدفع الإلكتروني متاح للطلبات المسعّرة بالدولار فقط.' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'INVALID_PRODUCT_PRICE') {
      return NextResponse.json({ error: 'يوجد منتج بسعر غير صالح.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'TOTAL_OUT_OF_RANGE') {
      return NextResponse.json({ error: 'إجمالي الطلب خارج النطاق المسموح.' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'UNSUPPORTED_WEIGHT_UNIT') {
      return NextResponse.json({ error: 'وحدة وزن أحد المنتجات غير مدعومة لحساب الشحن.' }, { status: 422 });
    }
    if (error instanceof Error && [
      'AMBIGUOUS_SHIPPING_ZONES',
      'AMBIGUOUS_SHIPPING_SERVICE_CODE',
      'INVALID_SHIPPING_RATE',
    ].includes(error.message)) {
      console.error('Shipping configuration is invalid:', error.message);
      return NextResponse.json({ error: 'إعدادات أسعار الشحن غير صالحة. يرجى التواصل مع الإدارة.' }, { status: 503 });
    }
    if (error instanceof Error && error.message.startsWith('STRIPE_')) {
      console.error('Unable to create Stripe sandbox checkout:', error.message);
      return NextResponse.json({ error: 'تعذر إنشاء جلسة الدفع. لم يتم تحصيل أي مبلغ.' }, { status: 502 });
    }
    console.error('Unable to place order:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الطلب.' }, { status: 500 });
  }
}
