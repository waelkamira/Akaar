import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

const customerOrderSelection = {
  id: true,
  orderNumber: true,
  status: true,
  grandTotal: true,
  subtotal: true,
  shippingTotal: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    where: { type: { in: ['SHIPPING', 'BOTH'] } },
    orderBy: { createdAt: 'asc' },
    take: 1,
    select: { fullName: true, phone: true, countryCode: true, city: true, address1: true },
  },
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      currency: true,
      productName: true,
      imageSnapshot: true,
      sellerName: true,
      variant: { select: { productId: true } },
      vendorOrder: {
        select: {
          id: true,
          status: true,
          seller: {
            select: {
              stores: {
                where: { isActive: true },
                take: 1,
                select: { name: true, slug: true },
              },
            },
          },
          shipments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              trackingNumber: true,
              shippedAt: true,
              deliveredAt: true,
              events: {
                orderBy: { occurredAt: 'desc' },
                take: 10,
                select: { id: true, status: true, description: true, location: true, occurredAt: true },
              },
              carrier: { select: { name: true } },
              service: { select: { name: true } },
            },
          },
        },
      },
    },
  },
  payments: {
    select: { id: true, amount: true, currency: true, provider: true, status: true, createdAt: true, paidAt: true },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.OrderSelect;

type CustomerOrderRecord = Prisma.OrderGetPayload<{ select: typeof customerOrderSelection }>;

function mapOrder(order: CustomerOrderRecord) {
  const address = order.addresses[0] || null;
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalPrice: Number(order.grandTotal),
    subtotal: Number(order.subtotal),
    shippingTotal: Number(order.shippingTotal),
    currency: order.currency,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customerName: address?.fullName || null,
    phoneNumber: address?.phone || null,
    shippingCountryCode: address?.countryCode || null,
    shippingCity: address?.city || null,
    shippingAddress: address?.address1 || null,
    items: order.items.map((item) => {
      const shipment = item.vendorOrder.shipments[0] || null;
      const store = item.vendorOrder.seller.stores[0] || null;
      return {
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        currency: item.currency,
        product: {
          id: item.variant.productId,
          title: item.productName,
          images: item.imageSnapshot ? [item.imageSnapshot] : [],
        },
        vendorOrder: {
          id: item.vendorOrder.id,
          status: item.vendorOrder.status,
          trackingNumber: shipment?.trackingNumber || null,
          shipments: item.vendorOrder.shipments,
          seller: { storeName: store?.name || item.sellerName || 'البائع', slug: store?.slug || '' },
        },
      };
    }),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.provider,
      status: payment.status,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
    })),
  };
}

export async function listCustomerOrders(userId: string, page: number, limit: number) {
  const where = { userId };
  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: customerOrderSelection,
    }),
  ]);
  return { totalCount, orders: orders.map(mapOrder) };
}

export async function findCustomerOrderReceipt(id: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    select: customerOrderSelection,
  });
  return order ? mapOrder(order) : null;
}
