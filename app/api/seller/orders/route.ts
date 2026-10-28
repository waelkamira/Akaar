import { NextResponse } from 'next/server';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const { seller } = await getActiveSeller();
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  try {
    const orders = await prisma.vendorOrder.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
            customerName: true,
            phoneNumber: true,
            shippingCity: true,
            shippingAddress: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            totalPrice: true,
            product: { select: { title: true } },
          },
        },
      },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Unable to load seller orders:', error);
    return NextResponse.json({ error: 'تعذر تحميل طلبات المتجر.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { seller } = await getActiveSeller();
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { vendorOrderId?: unknown; status?: unknown; trackingNumber?: unknown };

  if (
    typeof body.vendorOrderId !== 'string' ||
    !body.vendorOrderId.trim() ||
    !['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(String(body.status))
  ) {
    return NextResponse.json({ error: 'بيانات تحديث الشحنة غير صالحة.' }, { status: 400 });
  }
  const trackingNumber = typeof body.trackingNumber === 'string' ? body.trackingNumber.trim() : '';
  if (trackingNumber.length > 128) {
    return NextResponse.json({ error: 'رقم التتبع طويل جدًا.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const current = await transaction.vendorOrder.findFirst({
        where: { id: body.vendorOrderId as string, sellerId: seller.id },
        select: { id: true, orderId: true, status: true },
      });
      if (!current) return { error: 'الطلب غير موجود في متجرك.', status: 404 as const };

      const nextStatus = body.status as 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
      const allowedNext: Record<string, string[]> = {
        PENDING: ['PROCESSING'],
        PROCESSING: ['SHIPPED'],
        SHIPPED: ['DELIVERED'],
      };
      if (!allowedNext[current.status]?.includes(nextStatus)) {
        return { error: 'لا يمكن الانتقال إلى حالة الشحن المطلوبة.', status: 409 as const };
      }

      const update = await transaction.vendorOrder.updateMany({
        where: { id: current.id, sellerId: seller.id, status: current.status },
        data: {
          status: nextStatus,
          ...(nextStatus === 'SHIPPED' ? { shippedAt: new Date(), trackingNumber: trackingNumber || null } : {}),
          ...(nextStatus === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
        },
      });
      if (!update.count) return { error: 'تغيرت حالة الطلب. أعد تحميل الصفحة.', status: 409 as const };

      const vendorOrders = await transaction.vendorOrder.findMany({
        where: { orderId: current.orderId },
        select: { status: true },
      });
      const allDelivered = vendorOrders.every((item) => item.status === 'DELIVERED' || item.status === 'CANCELLED');
      const anyShipped = vendorOrders.some((item) => ['SHIPPED', 'DELIVERED'].includes(item.status));
      if (allDelivered) {
        await transaction.order.update({ where: { id: current.orderId }, data: { status: 'DELIVERED' } });
        await transaction.payment.updateMany({
          where: { orderId: current.orderId, status: 'PENDING' },
          data: { status: 'COMPLETED', paidAt: new Date() },
        });
      } else if (anyShipped) {
        await transaction.order.update({ where: { id: current.orderId }, data: { status: 'SHIPPED' } });
      }

      return { id: current.id, status: nextStatus };
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Unable to update seller order status:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الطلب.' }, { status: 500 });
  }
}
