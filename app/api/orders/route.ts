import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';

type CartLine = { id: string; quantity: number };

async function releaseCheckoutReservation(orderId: string, paymentId: string, lines: CartLine[]) {
  await prisma.$transaction(async (transaction) => {
    const failed = await transaction.payment.updateMany({
      where: { id: paymentId, status: 'PENDING' },
      data: { status: 'FAILED' },
    });
    if (failed.count !== 1) return;
    for (const line of lines) {
      await transaction.product.update({
        where: { id: line.id },
        data: { stockQuantity: { increment: line.quantity } },
      });
    }
    await transaction.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });
  });
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لعرض الطلبات.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });

  try {
    const where = { userId: user.id };
    const totalCount = await prisma.order.count({ where });
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return NextResponse.json({ orders: [], page, limit, totalCount, hasMore: false });
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        shippingCity: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
            product: { select: { id: true, title: true, images: true, categoryName: true } },
            vendorOrder: { select: { id: true, status: true, trackingNumber: true, shippedAt: true, deliveredAt: true, seller: { select: { storeName: true, slug: true } } } },
          },
        },
        payments: {
          select: { id: true, amount: true, method: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      orders,
      page,
      limit,
      totalCount,
      hasMore: skip + orders.length < totalCount,
    });
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
  const body = parsed.value as { items?: unknown };
  const rawBody = parsed.value as Record<string, unknown> | null;
  const paymentMethod = rawBody?.paymentMethod === undefined ? 'CASH_ON_DELIVERY' : rawBody.paymentMethod;
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
  const customerName = typeof rawBody?.customerName === 'string' ? rawBody.customerName.trim() : '';
  const phoneNumber = typeof rawBody?.phoneNumber === 'string' ? rawBody.phoneNumber.trim() : '';
  const shippingCity = typeof rawBody?.shippingCity === 'string' ? rawBody.shippingCity.trim() : '';
  const shippingAddress = typeof rawBody?.shippingAddress === 'string' ? rawBody.shippingAddress.trim() : '';
  if (
    !customerName ||
    customerName.length > 100 ||
    !/^[+()\d\s-]{7,40}$/.test(phoneNumber) ||
    !shippingCity ||
    shippingCity.length > 100 ||
    !shippingAddress ||
    shippingAddress.length > 300
  ) {
    return NextResponse.json({ error: 'بيانات التوصيل مطلوبة ويجب التحقق من الاسم والهاتف والعنوان والمدينة.' }, { status: 400 });
  }
  if (!Array.isArray(body?.items) || body.items.length === 0 || body.items.length > 50) {
    return NextResponse.json({ error: 'السلة فارغة أو تحتوي على عدد غير صالح من المنتجات.' }, { status: 400 });
  }

  const lines: CartLine[] = [];
  const seenIds = new Set<string>();
  for (const item of body.items) {
    if (
      !item ||
      typeof item !== 'object' ||
      !('id' in item) ||
      !('quantity' in item) ||
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 1_000
    ) {
      return NextResponse.json({ error: 'تتضمن السلة منتجًا أو كمية غير صالحة.' }, { status: 400 });
    }
    if (seenIds.has(item.id)) {
      return NextResponse.json({ error: 'السلة تتضمن المنتج نفسه أكثر من مرة.' }, { status: 400 });
    }
    seenIds.add(item.id);
    lines.push({ id: item.id, quantity: item.quantity });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: lines.map((line) => line.id) },
        isActive: true,
        isDeleted: false,
        approvalStatus: 'APPROVED',
        category: { isActive: true },
      },
      select: {
        id: true,
        title: true,
        basePrice: true,
        usdPriceCents: true,
        stockQuantity: true,
        sellerId: true,
        seller: { select: { id: true, status: true, isVerified: true } },
      },
    });
    if (products.length !== lines.length) {
      return NextResponse.json({ error: 'بعض المنتجات لم تعد متاحة للشراء.' }, { status: 409 });
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
      const lineTotal = product.basePrice * quantity;
      if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(sum + lineTotal)) {
        throw new Error('TOTAL_OUT_OF_RANGE');
      }
      return sum + lineTotal;
    }, 0);

    const totalUsdCents = paymentMethod === 'STRIPE'
      ? products.reduce((sum, product) => {
        const quantity = quantityById.get(product.id) || 0;
        if (!Number.isSafeInteger(product.usdPriceCents) || (product.usdPriceCents ?? 0) < 50) {
          throw new Error('USD_PRICE_UNAVAILABLE');
        }
        const lineTotal = product.usdPriceCents * quantity;
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
            isActive: true,
            isDeleted: false,
            approvalStatus: 'APPROVED',
            basePrice: products.find((product) => product.id === line.id)?.basePrice,
            stockQuantity: { gte: line.quantity },
          },
          data: { stockQuantity: { decrement: line.quantity } },
        });
        if (updated.count !== 1) throw new Error('STOCK_CONFLICT');
      }

      const createdOrder = await transaction.order.create({
        data: {
          userId: user.id,
          customerName,
          phoneNumber,
          shippingCity,
          shippingAddress,
          totalPrice,
          status: 'PENDING',
        },
        select: { id: true, totalPrice: true, status: true, createdAt: true },
      });

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
          const unitPrice = product.basePrice as number;
          return {
            orderId: createdOrder.id,
            productId: product.id,
            vendorOrderId: vendorOrderBySeller.get(product.sellerId as string),
            quantity,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };
        }),
      });
      const payment = await transaction.payment.create({
        data: {
          orderId: createdOrder.id,
          userId: user.id,
          amount: paymentMethod === 'STRIPE' ? totalUsdCents! : totalPrice,
          currency: paymentMethod === 'STRIPE' ? 'USD' : 'SYP',
          method: paymentMethod,
          status: 'PENDING',
        },
        select: { id: true },
      });
      return { order: createdOrder, payment };
    });

    if (paymentMethod === 'CASH_ON_DELIVERY') {
      return NextResponse.json({ order: created.order }, { status: 201 });
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
      stripeParams.set('success_url', new URL(`/orders?checkout=success&orderId=${encodeURIComponent(created.order.id)}`, origin).toString());
      stripeParams.set('cancel_url', new URL('/cart?checkout=cancelled', origin).toString());
      stripeParams.set('customer_email', user.email);
      stripeParams.set('client_reference_id', created.order.id);
      stripeParams.set('expires_at', String(Math.floor(Date.now() / 1000) + 60 * 60));
      stripeParams.set('metadata[paymentId]', created.payment.id);
      stripeParams.set('metadata[orderId]', created.order.id);

      products.forEach((product, index) => {
        const prefix = `line_items[${index}]`;
        stripeParams.set(`${prefix}[quantity]`, String(quantityById.get(product.id)));
        stripeParams.set(`${prefix}[price_data][currency]`, 'usd');
        stripeParams.set(`${prefix}[price_data][unit_amount]`, String(product.usdPriceCents));
        stripeParams.set(`${prefix}[price_data][product_data][name]`, product.title.slice(0, 200));
      });

      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': created.payment.id,
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

      await prisma.payment.update({
        where: { id: created.payment.id },
        data: { providerReference: stripeSession.id },
      });
      return NextResponse.json({ order: created.order, checkoutUrl: stripeSession.url }, { status: 201 });
    } catch (stripeError) {
      try {
        await releaseCheckoutReservation(created.order.id, created.payment.id, lines);
      } catch (releaseError) {
        console.error('Unable to release failed Stripe checkout reservation:', releaseError);
      }
      throw stripeError;
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'USD_PRICE_UNAVAILABLE') {
      return NextResponse.json({ error: 'أحد المنتجات لا يملك سعرًا صالحًا بالدولار للدفع الإلكتروني.' }, { status: 400 });
    }
    if (error instanceof Error && ['PRODUCT_UNAVAILABLE', 'STOCK_CONFLICT'].includes(error.message)) {
      return NextResponse.json({ error: 'أحد المنتجات لم يعد متاحًا بالكمية المطلوبة.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'TOTAL_OUT_OF_RANGE') {
      return NextResponse.json({ error: 'إجمالي الطلب خارج النطاق المسموح.' }, { status: 400 });
    }
    if (error instanceof Error && error.message.startsWith('STRIPE_')) {
      console.error('Unable to create Stripe sandbox checkout:', error.message);
      return NextResponse.json({ error: 'تعذر إنشاء جلسة الدفع. لم يتم تحصيل أي مبلغ.' }, { status: 502 });
    }
    console.error('Unable to place order:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الطلب.' }, { status: 500 });
  }
}
