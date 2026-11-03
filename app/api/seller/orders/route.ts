import { NextResponse } from 'next/server';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';
<<<<<<< HEAD
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import { consumeOrderReservations } from '@/lib/orders/inventory';

function mapSellerOrder(order: {
  id: string;
  status: string;
  subtotal: unknown;
  grandTotal: unknown;
  order: {
    id: string;
    orderNumber: string;
    createdAt: Date;
    currency: string;
    addresses: Array<{ fullName: string; phone: string; city: string; address1: string }>;
  };
  items: Array<{ id: string; quantity: number; unitPrice: unknown; totalPrice: unknown; currency: string; productName: string }>;
  shipments: Array<{
    id: string;
    trackingNumber: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
    status: string;
    carrier: { name: string } | null;
  }>;
}) {
  const address = order.order.addresses[0];
  const shipment = order.shipments[0];
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    totalPrice: Number(order.grandTotal),
    trackingNumber: shipment?.trackingNumber || null,
    shippedAt: shipment?.shippedAt || null,
    deliveredAt: shipment?.deliveredAt || null,
    shipmentStatus: shipment?.status || 'PENDING',
    carrierName: shipment?.carrier?.name || null,
    currency: order.order.currency,
    order: {
      id: order.order.id,
      orderNumber: order.order.orderNumber,
      createdAt: order.order.createdAt,
      customerName: address?.fullName || null,
      phoneNumber: address?.phone || null,
      shippingCity: address?.city || null,
      shippingAddress: address?.address1 || null,
    },
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
      currency: item.currency,
      product: { title: item.productName },
    })),
  };
}
>>>>>>> wael-work-in-progress

export async function GET() {
  const { seller } = await getActiveSeller();
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  try {
    const orders = await prisma.vendorOrder.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        status: true,
        subtotal: true,
        grandTotal: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            currency: true,
            addresses: {
              where: { type: { in: ['SHIPPING', 'BOTH'] } },
              take: 1,
              orderBy: { createdAt: 'asc' },
              select: { fullName: true, phone: true, city: true, address1: true },
            },
          },
        },
        items: {
          select: { id: true, quantity: true, unitPrice: true, totalPrice: true, currency: true, productName: true },
        },
        shipments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            trackingNumber: true,
            shippedAt: true,
            deliveredAt: true,
            status: true,
            carrier: { select: { name: true } },
          },
        },
      },
    });
    return NextResponse.json({ orders: orders.map(mapSellerOrder) });
  } catch (error) {
    console.error('Unable to load seller orders:', error);
    return NextResponse.json({ error: 'تعذر تحميل طلبات المتجر.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { seller } = await getActiveSeller();
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { vendorOrderId?: unknown; status?: unknown; trackingNumber?: unknown };
  if (typeof body.vendorOrderId !== 'string'
    || !body.vendorOrderId.trim()
    || !['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(String(body.status))) {
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

      const shipments = await transaction.shipment.findMany({
        where: { vendorOrderId: current.id },
        select: { id: true, status: true, shippedAt: true, deliveredAt: true },
      });
      if (shipments.length === 0) return { error: 'سجل الشحنة غير موجود لهذا الطلب.', status: 409 as const };

      const vendorUpdate = await transaction.vendorOrder.updateMany({
        where: { id: current.id, sellerId: seller.id, status: current.status },
        data: { status: nextStatus },
      });
      if (vendorUpdate.count !== 1) return { error: 'تغيرت حالة الطلب. أعد تحميل الصفحة.', status: 409 as const };

      const eventStatus = nextStatus === 'SHIPPED' ? 'IN_TRANSIT' : nextStatus === 'DELIVERED' ? 'DELIVERED' : null;
      if (nextStatus === 'SHIPPED') {
        await transaction.shipment.updateMany({
          where: { vendorOrderId: current.id },
          data: { status: 'IN_TRANSIT', trackingNumber: trackingNumber || null, shippedAt: new Date() },
        });
        const shipmentItems = await transaction.shipmentItem.findMany({
          where: { shipment: { vendorOrderId: current.id } },
          select: { orderItemId: true, quantity: true },
        });
        for (const shipmentItem of shipmentItems) {
          await transaction.orderItem.update({
            where: { id: shipmentItem.orderItemId },
            data: { quantityShipped: { increment: shipmentItem.quantity } },
          });
        }
      } else if (nextStatus === 'DELIVERED') {
        await transaction.shipment.updateMany({
          where: { vendorOrderId: current.id },
          data: { status: 'DELIVERED', deliveredAt: new Date() },
        });
      }

      if (eventStatus) {
        const occurredAt = new Date();
        await transaction.shipmentTrackingEvent.createMany({
          data: shipments.map((shipment) => ({
            shipmentId: shipment.id,
            status: eventStatus,
            description: nextStatus === 'SHIPPED' ? 'Shipment is in transit.' : 'Shipment delivered.',
            occurredAt,
          })),
        });
      }

      const vendorOrders = await transaction.vendorOrder.findMany({
        where: { orderId: current.orderId },
        select: { status: true },
      });
      const allDelivered = vendorOrders.every((item) => item.status === 'DELIVERED' || item.status === 'CANCELLED');
      const anyShipped = vendorOrders.some((item) => item.status === 'SHIPPED' || item.status === 'DELIVERED');
      const anyProcessing = vendorOrders.some((item) => item.status === 'PROCESSING');
      const orderStatus = allDelivered
        ? 'DELIVERED'
        : anyShipped
          ? vendorOrders.some((item) => item.status === 'PROCESSING' || item.status === 'PENDING')
            ? 'PARTIALLY_SHIPPED'
            : 'SHIPPED'
          : anyProcessing
            ? 'PROCESSING'
            : null;
      if (orderStatus) {
        await transaction.order.update({ where: { id: current.orderId }, data: { status: orderStatus } });
        await transaction.orderStatusHistory.create({
          data: { orderId: current.orderId, status: orderStatus, note: `Seller fulfillment moved to ${nextStatus}.` },
        });
      }
      if (allDelivered) {
        await consumeOrderReservations(transaction, current.orderId);
        await transaction.payment.updateMany({
          where: { orderId: current.orderId, provider: 'CASH_ON_DELIVERY', status: 'PENDING' },
          data: { status: 'COMPLETED', paidAt: new Date() },
        });
      }

      return { id: current.id, status: nextStatus };
    }, { isolationLevel: 'Serializable' });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Unable to update seller order status:', error);
    return NextResponse.json({ error: 'تعذر تحديث حالة الطلب.' }, { status: 500 });
  }
}
