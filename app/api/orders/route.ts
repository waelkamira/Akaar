import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type CartLine = { id: string; quantity: number };

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

    const order = await prisma.$transaction(async (transaction) => {
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
      await transaction.payment.create({
        data: {
          orderId: createdOrder.id,
          userId: user.id,
          amount: totalPrice,
          method: 'CASH_ON_DELIVERY',
          status: 'PENDING',
        },
      });
      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && ['PRODUCT_UNAVAILABLE', 'STOCK_CONFLICT'].includes(error.message)) {
      return NextResponse.json({ error: 'أحد المنتجات لم يعد متاحًا بالكمية المطلوبة.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'TOTAL_OUT_OF_RANGE') {
      return NextResponse.json({ error: 'إجمالي الطلب خارج النطاق المسموح.' }, { status: 400 });
    }
    console.error('Unable to place order:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الطلب.' }, { status: 500 });
  }
}
