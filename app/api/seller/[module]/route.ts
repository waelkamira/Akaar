import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type ModuleName = 'inventory' | 'customers' | 'reviews' | 'finance' | 'shipping' | 'marketing' | 'staff' | 'reports';
type JsonRecord = Record<string, unknown>;

const sellerPermissions = [
  'seller.products.manage',
  'seller.inventory.manage',
  'seller.orders.manage',
  'seller.customers.read',
  'seller.reviews.manage',
  'seller.finance.read',
  'seller.shipping.manage',
  'seller.marketing.manage',
  'seller.store.manage',
  'seller.staff.manage',
  'seller.reports.read',
];

class SellerModuleError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(body: JsonRecord, key: string, maxLength: number) {
  const value = body[key];
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new SellerModuleError('تحقق من البيانات المدخلة.', 400);
  }
  return value.trim();
}

function positiveInteger(value: unknown, maximum = 1_000_000): value is number {
  return Number.isInteger(value) && typeof value === 'number' && value > 0 && value <= maximum;
}

function ledgerBalanceContribution(type: string, value: Prisma.Decimal) {
  const amount = value.abs();
  if (['COMMISSION', 'REFUND', 'PAYOUT', 'FEE', 'TAX', 'CHARGEBACK'].includes(type)) {
    return amount.negated();
  }
  return type === 'SALE' ? amount : value;
}

async function readBody(request: Request): Promise<JsonRecord> {
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) throw new SellerModuleError(parsed.error, parsed.status);
  if (!isRecord(parsed.value)) throw new SellerModuleError('صيغة الطلب غير صالحة.', 400);
  return parsed.value;
}

function handleError(error: unknown, module: string) {
  if (error instanceof SellerModuleError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return NextResponse.json({ error: 'توجد بيانات مسجلة مسبقًا.' }, { status: 409 });
  }
  console.error(`Unable to process seller ${module} request:`, error);
  return NextResponse.json({ error: 'تعذر إكمال العملية.' }, { status: 500 });
}

function moduleName(value: string): ModuleName | null {
  return ['inventory', 'customers', 'reviews', 'finance', 'shipping', 'marketing', 'staff', 'reports']
    .includes(value) ? value as ModuleName : null;
}

function requiredPermission(section: ModuleName) {
  const permissions: Record<ModuleName, string> = {
    inventory: 'seller.inventory.manage',
    customers: 'seller.customers.read',
    reviews: 'seller.reviews.manage',
    finance: 'seller.finance.read',
    shipping: 'seller.shipping.manage',
    marketing: 'seller.marketing.manage',
    staff: 'seller.staff.manage',
    reports: 'seller.reports.read',
  };
  return permissions[section];
}

export async function GET(_request: Request, context: { params: Promise<{ module: string }> }) {
  const { module: rawModule } = await context.params;
  const section = moduleName(rawModule);
  if (!section) return NextResponse.json({ error: 'القسم غير موجود.' }, { status: 404 });

  const { seller } = await getActiveSeller(requiredPermission(section));
  if (!seller) {
    const user = await getAuthenticatedUser();
    if (section === 'staff' && user) {
      const invitations = await prisma.sellerStaff.findMany({
        where: { userId: user.id, acceptedAt: null, revokedAt: null, seller: { is: { status: 'ACTIVE', isVerified: true } } },
        select: { id: true, invitedAt: true, seller: { select: { displayName: true } }, role: { select: { name: true } } },
        orderBy: { invitedAt: 'desc' },
      });
      return NextResponse.json({ canManage: false, invitations, staff: [], roles: [], availablePermissions: [] });
    }
    return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });
  }

  try {
    if (section === 'inventory') {
      const [warehouses, inventory, transfers, variants] = await Promise.all([
        prisma.warehouse.findMany({
          where: { sellerId: seller.id, isActive: true },
          select: { id: true, name: true, code: true, countryCode: true, city: true },
          orderBy: { name: 'asc' },
        }),
        prisma.inventory.findMany({
          where: {
            warehouse: { sellerId: seller.id },
            variant: { product: { store: { sellerId: seller.id }, deletedAt: null } },
          },
          select: {
            id: true,
            onHand: true,
            reserved: true,
            warehouse: { select: { id: true, name: true } },
            variant: {
              select: {
                id: true,
                sku: true,
                title: true,
                product: { select: { id: true, title: true } },
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }],
          take: 500,
        }),
        prisma.stockTransfer.findMany({
          where: {
            sourceWarehouse: { sellerId: seller.id },
            targetWarehouse: { sellerId: seller.id },
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            sourceWarehouse: { select: { name: true } },
            targetWarehouse: { select: { name: true } },
            items: { select: { id: true, quantity: true, variant: { select: { sku: true, title: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        prisma.productVariant.findMany({
          where: { status: 'ACTIVE', product: { store: { sellerId: seller.id }, deletedAt: null } },
          select: { id: true, sku: true, title: true, product: { select: { title: true } } },
          orderBy: { product: { title: 'asc' } },
          take: 500,
        }),
      ]);
      return NextResponse.json({ warehouses, inventory, transfers, variants });
    }

    if (section === 'customers') {
      const orders = await prisma.vendorOrder.findMany({
        where: { sellerId: seller.id },
        select: {
          grandTotal: true,
          createdAt: true,
          order: {
            select: {
              id: true,
              userId: true,
              guestEmail: true,
              currency: true,
              user: { select: { email: true, userName: true } },
              addresses: {
                where: { type: { in: ['SHIPPING', 'BOTH'] } },
                take: 1,
                orderBy: { createdAt: 'asc' },
                select: { fullName: true, phone: true, city: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      });
      const customers = new Map<string, {
        id: string | null;
        name: string;
        email: string | null;
        phone: string | null;
        city: string | null;
        orders: number;
        totalSpent: number;
        currency: string;
        lastOrderAt: Date;
      }>();
      for (const entry of orders) {
        const order = entry.order;
        const address = order.addresses[0];
        const key = `${order.userId ?? order.guestEmail ?? `guest:${order.id}`}:${order.currency}`;
        const current = customers.get(key);
        if (current) {
          current.orders += 1;
          current.totalSpent += Number(entry.grandTotal);
          if (entry.createdAt > current.lastOrderAt) current.lastOrderAt = entry.createdAt;
        } else {
          customers.set(key, {
            id: order.userId,
            name: address?.fullName ?? order.user?.userName ?? 'عميل زائر',
            email: order.user?.email ?? order.guestEmail,
            phone: address?.phone ?? null,
            city: address?.city ?? null,
            orders: 1,
            totalSpent: Number(entry.grandTotal),
            currency: order.currency,
            lastOrderAt: entry.createdAt,
          });
        }
      }
      return NextResponse.json({ customers: [...customers.values()] });
    }

    if (section === 'reviews') {
      const [productReviews, storeReviews, productStats, storeStats] = await Promise.all([
        prisma.review.findMany({
          where: { product: { store: { sellerId: seller.id } } },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            sellerReply: true,
            sellerRepliedAt: true,
            createdAt: true,
            user: { select: { userName: true } },
            product: { select: { title: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        prisma.storeReview.findMany({
          where: { sellerId: seller.id },
          select: {
            id: true,
            rating: true,
            comment: true,
            sellerReply: true,
            sellerRepliedAt: true,
            createdAt: true,
            user: { select: { userName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        prisma.review.aggregate({
          where: { product: { store: { sellerId: seller.id } } },
          _avg: { rating: true },
          _count: { _all: true },
        }),
        prisma.storeReview.aggregate({
          where: { sellerId: seller.id },
          _avg: { rating: true },
          _count: { _all: true },
        }),
      ]);
      const reviewCount = productStats._count._all + storeStats._count._all;
      const average = reviewCount
        ? ((productStats._avg.rating ?? 0) * productStats._count._all
          + (storeStats._avg.rating ?? 0) * storeStats._count._all) / reviewCount
        : 0;
      return NextResponse.json({
        averageRating: average,
        reviewCount,
        productReviews: productReviews.map((review) => ({
          ...review,
          kind: 'product',
          reviewer: review.user.userName ?? 'عميل',
          subject: review.product.title,
        })),
        storeReviews: storeReviews.map((review) => ({
          ...review,
          kind: 'store',
          reviewer: review.user.userName ?? 'عميل',
          subject: 'تقييم المتجر',
        })),
      });
    }

    if (section === 'finance') {
      const [ledger, ledgerTotals, payouts, payoutMethods, taxRegistrations, invoices] = await Promise.all([
        prisma.sellerLedgerEntry.findMany({
          where: { sellerId: seller.id },
          select: { id: true, type: true, amount: true, currency: true, description: true, reference: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 200,
        }),
        prisma.sellerLedgerEntry.groupBy({
          by: ['currency', 'type'],
          where: { sellerId: seller.id },
          _sum: { amount: true },
        }),
        prisma.payout.findMany({
          where: { sellerId: seller.id },
          select: { id: true, amount: true, currency: true, status: true, requestedAt: true, processedAt: true },
          orderBy: { requestedAt: 'desc' },
          take: 100,
        }),
        prisma.payoutMethod.findMany({
          where: { sellerId: seller.id },
          select: { id: true, provider: true, currency: true, isDefault: true, isVerified: true },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        }),
        prisma.sellerTaxRegistration.findMany({
          where: { sellerId: seller.id },
          select: { id: true, countryCode: true, taxType: true, taxNumber: true, isVerified: true, validUntil: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.invoice.findMany({
          where: { order: { vendorOrders: { some: { sellerId: seller.id } } } },
          select: { id: true, invoiceNumber: true, currency: true, subtotal: true, taxTotal: true, total: true, issuedAt: true },
          orderBy: { issuedAt: 'desc' },
          take: 100,
        }),
      ]);
      const balanceByCurrency = new Map<string, number>();
      for (const entry of ledgerTotals) {
        const contribution = ledgerBalanceContribution(entry.type, entry._sum.amount ?? new Prisma.Decimal(0));
        balanceByCurrency.set(entry.currency, (balanceByCurrency.get(entry.currency) ?? 0) + contribution.toNumber());
      }
      for (const payout of payouts) {
        if (payout.status === 'PENDING' || payout.status === 'PROCESSING') {
          balanceByCurrency.set(payout.currency, (balanceByCurrency.get(payout.currency) ?? 0) - Number(payout.amount));
        }
      }
      return NextResponse.json({
        ledger: ledger.map((entry) => ({
          ...entry,
          amount: ledgerBalanceContribution(entry.type, entry.amount).toNumber(),
        })),
        payouts: payouts.map((payout) => ({ ...payout, amount: Number(payout.amount) })),
        payoutMethods,
        taxRegistrations,
        invoices: invoices.map((invoice) => ({
          ...invoice,
          subtotal: Number(invoice.subtotal),
          taxTotal: Number(invoice.taxTotal),
          total: Number(invoice.total),
        })),
        balances: [...balanceByCurrency].map(([currency, amount]) => ({ currency, amount })),
      });
    }

    if (section === 'shipping') {
      const [carriers, shipments, returns] = await Promise.all([
        prisma.shippingCarrier.findMany({
          where: { isActive: true },
          select: { id: true, name: true, code: true, website: true },
          orderBy: { name: 'asc' },
        }),
        prisma.shipment.findMany({
          where: { vendorOrder: { sellerId: seller.id } },
          select: {
            id: true,
            trackingNumber: true,
            status: true,
            shippedAt: true,
            deliveredAt: true,
            vendorOrder: {
              select: {
                id: true,
                order: { select: { orderNumber: true, createdAt: true } },
              },
            },
            carrier: { select: { id: true, name: true } },
            events: {
              select: { id: true, status: true, description: true, occurredAt: true },
              orderBy: { occurredAt: 'desc' },
              take: 5,
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        prisma.returnRequest.findMany({
          where: { order: { vendorOrders: { some: { sellerId: seller.id } } } },
          select: {
            id: true,
            status: true,
            reason: true,
            description: true,
            createdAt: true,
            order: { select: { orderNumber: true } },
            items: {
              where: { orderItem: { vendorOrder: { sellerId: seller.id } } },
              select: {
                id: true,
                quantity: true,
                refundAmount: true,
                orderItem: { select: { productName: true, sku: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
      ]);
      return NextResponse.json({
        carriers,
        shipments,
        returns: returns.map((item) => ({
          ...item,
          items: item.items.map((returnItem) => ({
            ...returnItem,
            refundAmount: Number(returnItem.refundAmount),
          })),
        })),
      });
    }

    if (section === 'marketing') {
      const promotions = await prisma.promotion.findMany({
        where: { sellers: { some: { sellerId: seller.id } } },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          startsAt: true,
          endsAt: true,
          coupons: {
            select: {
              id: true,
              code: true,
              discountType: true,
              discountValue: true,
              maxUses: true,
              usedCount: true,
              status: true,
              _count: { select: { redemptions: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return NextResponse.json({
        promotions: promotions.map((promotion) => ({
          ...promotion,
          coupons: promotion.coupons.map((coupon) => ({
            ...coupon,
            discountValue: Number(coupon.discountValue),
            redemptions: coupon._count.redemptions,
          })),
        })),
      });
    }

    if (section === 'staff') {
      const [staff, roles, pendingInvitations] = await Promise.all([
        prisma.sellerStaff.findMany({
          where: { sellerId: seller.id, revokedAt: null },
          select: {
            id: true,
            invitedAt: true,
            acceptedAt: true,
            user: { select: { id: true, email: true, userName: true } },
            role: { select: { id: true, name: true, permissions: { select: { permission: { select: { name: true } } } } } },
          },
          orderBy: { invitedAt: 'desc' },
        }),
        prisma.role.findMany({
          where: { sellerId: seller.id },
          select: { id: true, name: true, permissions: { select: { permission: { select: { name: true } } } } },
          orderBy: { name: 'asc' },
        }),
        prisma.sellerStaff.count({ where: { sellerId: seller.id, revokedAt: null, acceptedAt: null } }),
      ]);
      return NextResponse.json({
        staff: staff.map((member) => ({
          ...member,
          permissions: member.role.permissions.map((item) => item.permission.name),
        })),
        roles: roles.map((role) => ({
          id: role.id,
          name: role.name,
          permissions: role.permissions.map((item) => item.permission.name),
        })),
        pendingInvitations,
        canManage: true,
        availablePermissions: sellerPermissions,
      });
    }

    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const orders = await prisma.vendorOrder.findMany({
      where: { sellerId: seller.id, status: { in: ['DELIVERED'] }, createdAt: { gte: from } },
      select: {
        grandTotal: true,
        createdAt: true,
        order: { select: { currency: true } },
        items: { select: { productName: true, quantity: true, totalPrice: true, currency: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 5000,
    });
    const dailySales = new Map<string, { date: string; currency: string; amount: number; orders: number }>();
    const monthlySales = new Map<string, { month: string; currency: string; amount: number; orders: number }>();
    const productSales = new Map<string, { title: string; quantity: number; amount: number; currency: string }>();
    for (const order of orders) {
      const day = order.createdAt.toISOString().slice(0, 10);
      const month = day.slice(0, 7);
      const dailyKey = `${day}:${order.order.currency}`;
      const monthlyKey = `${month}:${order.order.currency}`;
      const daily = dailySales.get(dailyKey) ?? { date: day, currency: order.order.currency, amount: 0, orders: 0 };
      daily.amount += Number(order.grandTotal);
      daily.orders += 1;
      dailySales.set(dailyKey, daily);
      const monthly = monthlySales.get(monthlyKey) ?? { month, currency: order.order.currency, amount: 0, orders: 0 };
      monthly.amount += Number(order.grandTotal);
      monthly.orders += 1;
      monthlySales.set(monthlyKey, monthly);
      for (const item of order.items) {
        const product = productSales.get(item.productName) ?? {
          title: item.productName,
          quantity: 0,
          amount: 0,
          currency: item.currency,
        };
        product.quantity += item.quantity;
        product.amount += Number(item.totalPrice);
        productSales.set(item.productName, product);
      }
    }
    const [productCount, pendingOrders, lowStock] = await Promise.all([
      prisma.product.count({ where: { store: { sellerId: seller.id }, deletedAt: null } }),
      prisma.vendorOrder.count({ where: { sellerId: seller.id, status: { in: ['PENDING', 'ACCEPTED', 'PROCESSING', 'READY_TO_SHIP'] } } }),
      prisma.inventory.count({
        where: { warehouse: { sellerId: seller.id }, onHand: { lte: 5 }, variant: { product: { store: { sellerId: seller.id }, deletedAt: null } } },
      }),
    ]);
    return NextResponse.json({
      period: { from, to: now },
      dailySales: [...dailySales.values()].slice(-90),
      monthlySales: [...monthlySales.values()],
      bestSellers: [...productSales.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 10),
      performance: { deliveredOrders: orders.length, productCount, pendingOrders, lowStock },
    });
  } catch (error) {
    return handleError(error, section);
  }
}

export async function POST(request: Request, context: { params: Promise<{ module: string }> }) {
  const { module: rawModule } = await context.params;
  const section = moduleName(rawModule);
  if (!section) return NextResponse.json({ error: 'القسم غير موجود.' }, { status: 404 });

  let body: JsonRecord;
  try {
    body = await readBody(request);
  } catch (error) {
    return handleError(error, section);
  }

  if (section === 'staff' && body.action === 'accept') {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: 'سجّل الدخول لقبول الدعوة.' }, { status: 401 });
    try {
      const staffId = requiredString(body, 'staffId', 64);
      const result = await prisma.$transaction(async (transaction) => {
        const invitation = await transaction.sellerStaff.findFirst({
          where: {
            id: staffId,
            userId: user.id,
            acceptedAt: null,
            revokedAt: null,
            seller: { is: { status: 'ACTIVE', isVerified: true } },
          },
          select: { id: true, sellerId: true, roleId: true, seller: { select: { displayName: true, userId: true } } },
        });
        if (!invitation) throw new SellerModuleError('الدعوة غير موجودة أو لم تعد صالحة.', 404);
        const acceptedAt = new Date();
        const accepted = await transaction.sellerStaff.updateMany({
          where: { id: invitation.id, userId: user.id, acceptedAt: null, revokedAt: null },
          data: { acceptedAt },
        });
        if (!accepted.count) throw new SellerModuleError('تم قبول الدعوة مسبقًا.', 409);
        const assignment = await transaction.userRoleAssignment.findFirst({
          where: { userId: user.id, roleId: invitation.roleId, scopeType: 'SELLER', scopeId: invitation.sellerId },
          select: { id: true },
        });
        if (!assignment) {
          await transaction.userRoleAssignment.create({
            data: { userId: user.id, roleId: invitation.roleId, scopeType: 'SELLER', scopeId: invitation.sellerId },
          });
        }
        await transaction.notification.create({
          data: {
            userId: invitation.seller.userId,
            type: 'SELLER_STAFF_ACCEPTED',
            title: 'تم قبول دعوة الفريق',
            message: `${user.userName || user.email} انضم إلى فريق ${invitation.seller.displayName}.`,
            data: { staffId: invitation.id },
          },
        });
        return { staffId: invitation.id, acceptedAt };
      });
      return NextResponse.json({ invitation: result });
    } catch (error) {
      return handleError(error, section);
    }
  }

  const { user, seller } = await getActiveSeller(requiredPermission(section));
  if (!user || !seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  try {

    if (section === 'inventory') {
      const action = requiredString(body, 'action', 20);
      if (action === 'warehouse') {
        const name = requiredString(body, 'name', 120);
        const code = requiredString(body, 'code', 32).toUpperCase();
        const countryCode = requiredString(body, 'countryCode', 2).toUpperCase();
        const country = await prisma.country.findUnique({ where: { code: countryCode }, select: { code: true } });
        if (!country) throw new SellerModuleError('الدولة المحددة غير موجودة.', 400);
        const warehouse = await prisma.warehouse.create({
          data: {
            sellerId: seller.id,
            name,
            code,
            countryCode,
            city: typeof body.city === 'string' ? body.city.trim().slice(0, 120) || null : null,
          },
          select: { id: true, name: true, code: true, countryCode: true, city: true },
        });
        return NextResponse.json({ warehouse }, { status: 201 });
      }

      if (action === 'adjust') {
        const variantId = requiredString(body, 'variantId', 64);
        const warehouseId = requiredString(body, 'warehouseId', 64);
        if (!Number.isInteger(body.onHand) || typeof body.onHand !== 'number' || body.onHand < 0 || body.onHand > 1_000_000) {
          throw new SellerModuleError('كمية المخزون غير صالحة.', 400);
        }
        const onHand = body.onHand;
        const result = await prisma.$transaction(async (transaction) => {
          const [variant, warehouse, current] = await Promise.all([
            transaction.productVariant.findFirst({
              where: { id: variantId, product: { store: { sellerId: seller.id }, deletedAt: null } },
              select: { id: true },
            }),
            transaction.warehouse.findFirst({ where: { id: warehouseId, sellerId: seller.id }, select: { id: true } }),
            transaction.inventory.findUnique({
              where: { variantId_warehouseId: { variantId, warehouseId } },
              select: { id: true, onHand: true, reserved: true },
            }),
          ]);
          if (!variant || !warehouse) throw new SellerModuleError('المنتج أو المستودع غير موجود في متجرك.', 404);
          if (current && onHand < current.reserved) {
            throw new SellerModuleError('لا يمكن خفض المخزون عن الكمية المحجوزة للطلبات.', 409);
          }
          const previous = current?.onHand ?? 0;
          const nextQuantity = onHand;
          if (current) {
            const updated = await transaction.inventory.updateMany({
              where: { id: current.id, onHand: current.onHand, reserved: current.reserved },
              data: { onHand: nextQuantity },
            });
            if (updated.count !== 1) throw new SellerModuleError('تغير المخزون بالتزامن. أعد المحاولة.', 409);
          } else {
            await transaction.inventory.create({ data: { variantId, warehouseId, onHand: nextQuantity } });
          }
          if (previous !== nextQuantity) {
            await transaction.inventoryMovement.create({
              data: {
                variantId,
                warehouseId,
                type: 'ADJUSTMENT',
                quantity: nextQuantity - previous,
                note: typeof body.note === 'string' ? body.note.trim().slice(0, 300) || null : null,
              },
            });
          }
          return { variantId, warehouseId, onHand: nextQuantity };
        });
        return NextResponse.json({ inventory: result });
      }

      if (action === 'transfer') {
        const sourceWarehouseId = requiredString(body, 'sourceWarehouseId', 64);
        const targetWarehouseId = requiredString(body, 'targetWarehouseId', 64);
        if (sourceWarehouseId === targetWarehouseId || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) {
          throw new SellerModuleError('بيانات النقل بين المستودعات غير صالحة.', 400);
        }
        const items = body.items.map((value) => {
          if (!isRecord(value) || typeof value.variantId !== 'string' || !positiveInteger(value.quantity)) {
            throw new SellerModuleError('تحقق من المنتجات والكميات المنقولة.', 400);
          }
          return { variantId: value.variantId, quantity: value.quantity };
        });
        const result = await prisma.$transaction(async (transaction) => {
          const [source, target] = await Promise.all([
            transaction.warehouse.findFirst({ where: { id: sourceWarehouseId, sellerId: seller.id }, select: { id: true } }),
            transaction.warehouse.findFirst({ where: { id: targetWarehouseId, sellerId: seller.id }, select: { id: true } }),
          ]);
          if (!source || !target) throw new SellerModuleError('المستودع غير موجود في متجرك.', 404);
          for (const item of items) {
            const [variant, sourceInventory] = await Promise.all([
              transaction.productVariant.findFirst({
                where: { id: item.variantId, product: { store: { sellerId: seller.id }, deletedAt: null } },
                select: { id: true },
              }),
              transaction.inventory.findUnique({
                where: { variantId_warehouseId: { variantId: item.variantId, warehouseId: sourceWarehouseId } },
                select: { id: true, onHand: true, reserved: true },
              }),
            ]);
            if (!variant || !sourceInventory || sourceInventory.onHand - sourceInventory.reserved < item.quantity) {
              throw new SellerModuleError('المخزون المتاح لا يكفي لإتمام النقل.', 409);
            }
            const updated = await transaction.inventory.updateMany({
              where: { id: sourceInventory.id, onHand: sourceInventory.onHand, reserved: sourceInventory.reserved },
              data: { onHand: { decrement: item.quantity } },
            });
            if (updated.count !== 1) throw new SellerModuleError('تغير المخزون بالتزامن. أعد المحاولة.', 409);
            await transaction.inventory.upsert({
              where: { variantId_warehouseId: { variantId: item.variantId, warehouseId: targetWarehouseId } },
              create: { variantId: item.variantId, warehouseId: targetWarehouseId, onHand: item.quantity },
              update: { onHand: { increment: item.quantity } },
            });
            await transaction.inventoryMovement.createMany({
              data: [
                { variantId: item.variantId, warehouseId: sourceWarehouseId, type: 'TRANSFER_OUT', quantity: -item.quantity },
                { variantId: item.variantId, warehouseId: targetWarehouseId, type: 'TRANSFER_IN', quantity: item.quantity },
              ],
            });
          }
          return transaction.stockTransfer.create({
            data: {
              sourceWarehouseId,
              targetWarehouseId,
              status: 'COMPLETED',
              completedAt: new Date(),
              items: { create: items },
            },
            select: { id: true, status: true, completedAt: true },
          });
        });
        return NextResponse.json({ transfer: result }, { status: 201 });
      }
      throw new SellerModuleError('عملية المخزون غير مدعومة.', 400);
    }

    if (section === 'customers' && body.action === 'conversation') {
      const customerId = requiredString(body, 'customerId', 64);
      const hasOrder = await prisma.vendorOrder.count({
        where: { sellerId: seller.id, order: { userId: customerId } },
      });
      if (!hasOrder) throw new SellerModuleError('لا يوجد طلب لهذا العميل في متجرك.', 404);
      const conversation = await prisma.storeConversation.upsert({
        where: { customerId_sellerId: { customerId, sellerId: seller.id } },
        create: { customerId, sellerId: seller.id },
        update: {},
        select: { id: true },
      });
      return NextResponse.json({ conversation }, { status: 201 });
    }

    if (section === 'finance' && body.action === 'payout') {
      const methodId = requiredString(body, 'payoutMethodId', 64);
      const currency = requiredString(body, 'currency', 3).toUpperCase();
      const amountValue = body.amount;
      if (typeof amountValue !== 'string' || !/^\d+(?:\.\d{1,4})?$/.test(amountValue)) {
        throw new SellerModuleError('مبلغ السحب غير صالح.', 400);
      }
      const amount = new Prisma.Decimal(amountValue);
      if (!amount.greaterThan(0)) throw new SellerModuleError('يجب أن يكون مبلغ السحب أكبر من صفر.', 400);
      const payout = await prisma.$transaction(async (transaction) => {
        const method = await transaction.payoutMethod.findFirst({
          where: { id: methodId, sellerId: seller.id, isVerified: true, currency },
          select: { id: true },
        });
        if (!method) throw new SellerModuleError('اختر وسيلة سحب موثقة وبالعملة نفسها.', 400);
        const [ledger, reserved] = await Promise.all([
          transaction.sellerLedgerEntry.groupBy({
            by: ['type'],
            where: { sellerId: seller.id, currency },
            _sum: { amount: true },
          }),
          transaction.payout.aggregate({
            where: { sellerId: seller.id, currency, status: { in: ['PENDING', 'PROCESSING'] } },
            _sum: { amount: true },
          }),
        ]);
        const ledgerBalance = ledger.reduce(
          (balance, entry) => balance.plus(ledgerBalanceContribution(entry.type, entry._sum.amount ?? new Prisma.Decimal(0))),
          new Prisma.Decimal(0),
        );
        const available = ledgerBalance.minus(reserved._sum.amount ?? new Prisma.Decimal(0));
        if (amount.greaterThan(available)) throw new SellerModuleError('رصيدك المتاح لا يكفي لهذا المبلغ.', 409);
        return transaction.payout.create({
          data: {
            sellerId: seller.id,
            payoutMethodId: method.id,
            amount,
            currency,
            idempotencyKey: randomUUID(),
          },
          select: { id: true, amount: true, currency: true, status: true, requestedAt: true },
        });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return NextResponse.json({ payout: { ...payout, amount: Number(payout.amount) } }, { status: 201 });
    }

    if (section === 'marketing' && body.action === 'coupon') {
      const name = requiredString(body, 'name', 120);
      const code = requiredString(body, 'code', 40).toUpperCase();
      const discountType = body.discountType;
      if (!['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'].includes(String(discountType))) {
        throw new SellerModuleError('نوع الخصم غير صالح.', 400);
      }
      if (typeof body.discountValue !== 'number' || !Number.isFinite(body.discountValue) || body.discountValue <= 0 || body.discountValue > 1_000_000) {
        throw new SellerModuleError('قيمة الخصم غير صالحة.', 400);
      }
      if (discountType === 'PERCENTAGE' && body.discountValue > 100) {
        throw new SellerModuleError('لا يمكن أن تتجاوز نسبة الخصم 100٪.', 400);
      }
      const startsAt = typeof body.startsAt === 'string' ? new Date(body.startsAt) : new Date();
      const endsAt = typeof body.endsAt === 'string' ? new Date(body.endsAt) : new Date(NaN);
      if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
        throw new SellerModuleError('تحقق من تاريخ بداية العرض ونهايته.', 400);
      }
      const maxUses = body.maxUses === undefined || body.maxUses === null || body.maxUses === ''
        ? null
        : Number(body.maxUses);
      if (maxUses !== null && !positiveInteger(maxUses)) throw new SellerModuleError('عدد مرات الاستخدام غير صالح.', 400);
      const promotion = await prisma.promotion.create({
        data: {
          name,
          startsAt,
          endsAt,
          sellers: { create: { sellerId: seller.id } },
          coupons: {
            create: {
              code,
              discountType: discountType as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING',
              discountValue: new Prisma.Decimal(body.discountValue),
              maxUses,
            },
          },
        },
        select: { id: true, name: true, startsAt: true, endsAt: true },
      });
      return NextResponse.json({ promotion }, { status: 201 });
    }

    if (section === 'staff' && body.action === 'invite') {
      const email = requiredString(body, 'email', 320).toLowerCase();
      const roleId = requiredString(body, 'roleId', 64);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SellerModuleError('البريد الإلكتروني غير صالح.', 400);
      const invitedUser = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
      if (!invitedUser) throw new SellerModuleError('يجب أن يكون العضو مدونًا في المنصة قبل دعوته.', 404);
      if (invitedUser.id === user.id) throw new SellerModuleError('لا يمكنك دعوة حسابك كعضو.', 400);
      const role = await prisma.role.findFirst({
        where: { id: roleId, sellerId: seller.id },
        select: { id: true },
      });
      if (!role) throw new SellerModuleError('الدور المحدد غير موجود.', 404);
      const membership = await prisma.$transaction(async (transaction) => {
        const staffMember = await transaction.sellerStaff.upsert({
          where: { sellerId_userId: { sellerId: seller.id, userId: invitedUser.id } },
          create: { sellerId: seller.id, userId: invitedUser.id, roleId, invitedAt: new Date() },
          update: { roleId, invitedAt: new Date(), acceptedAt: null, revokedAt: null },
          select: { id: true },
        });
        await transaction.notification.create({
          data: {
            userId: invitedUser.id,
            type: 'SELLER_STAFF_INVITATION',
            title: 'دعوة للانضمام إلى فريق متجر',
            message: `تمت دعوتك للانضمام إلى فريق ${seller.displayName}.`,
            data: { staffId: staffMember.id, sellerId: seller.id },
          },
        });
        return staffMember;
      });
      return NextResponse.json({ invitation: membership }, { status: 201 });
    }

    if (section === 'staff' && body.action === 'role') {
      const name = requiredString(body, 'name', 80);
      const permissions = body.permissions;
      if (!Array.isArray(permissions) || permissions.some((permission) => typeof permission !== 'string' || !sellerPermissions.includes(permission))) {
        throw new SellerModuleError('اختر صلاحية واحدة على الأقل من القائمة.', 400);
      }
      const selectedPermissions = [...new Set(permissions.filter((permission): permission is string => typeof permission === 'string'))];
      if (!selectedPermissions.length) throw new SellerModuleError('اختر صلاحية واحدة على الأقل.', 400);
      const role = await prisma.$transaction(async (transaction) => {
        const created = await transaction.role.create({ data: { sellerId: seller.id, name } });
        for (const permissionName of selectedPermissions) {
          const permission = await transaction.permission.upsert({
            where: { name: permissionName },
            create: { name: permissionName },
            update: {},
            select: { id: true },
          });
          await transaction.rolePermission.create({
            data: { roleId: created.id, permissionId: permission.id },
          });
        }
        return { id: created.id, name: created.name, permissions: selectedPermissions };
      });
      return NextResponse.json({ role }, { status: 201 });
    }

    throw new SellerModuleError('عملية الإضافة غير مدعومة لهذا القسم.', 400);
  } catch (error) {
    return handleError(error, section);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ module: string }> }) {
  const { module: rawModule } = await context.params;
  const section = moduleName(rawModule);
  if (!section) return NextResponse.json({ error: 'القسم غير موجود.' }, { status: 404 });

  const { seller } = await getActiveSeller(requiredPermission(section));
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  try {
    const body = await readBody(request);
    if (section === 'reviews') {
      const id = requiredString(body, 'id', 64);
      const reply = typeof body.reply === 'string' ? body.reply.trim() : null;
      if (reply === null || reply.length > 2000) throw new SellerModuleError('الرد غير صالح.', 400);
      const repliedAt = reply ? new Date() : null;
      if (body.kind === 'store') {
        const updated = await prisma.storeReview.updateMany({
          where: { id, sellerId: seller.id },
          data: { sellerReply: reply || null, sellerRepliedAt: repliedAt },
        });
        if (!updated.count) throw new SellerModuleError('التقييم غير موجود في متجرك.', 404);
      } else if (body.kind === 'product') {
        const updated = await prisma.review.updateMany({
          where: { id, product: { store: { sellerId: seller.id } } },
          data: { sellerReply: reply || null, sellerRepliedAt: repliedAt },
        });
        if (!updated.count) throw new SellerModuleError('التقييم غير موجود في متجرك.', 404);
      } else {
        throw new SellerModuleError('نوع التقييم غير صالح.', 400);
      }
      return NextResponse.json({ id, sellerReply: reply || null, sellerRepliedAt: repliedAt });
    }

    if (section === 'inventory') {
      const id = requiredString(body, 'inventoryId', 64);
      if (!Number.isInteger(body.onHand) || typeof body.onHand !== 'number' || body.onHand < 0 || body.onHand > 1_000_000) {
        throw new SellerModuleError('كمية المخزون غير صالحة.', 400);
      }
      const onHand = body.onHand;
      const result = await prisma.$transaction(async (transaction) => {
        const current = await transaction.inventory.findFirst({
          where: { id, warehouse: { sellerId: seller.id }, variant: { product: { store: { sellerId: seller.id } } } },
          select: { id: true, variantId: true, warehouseId: true, onHand: true, reserved: true },
        });
        if (!current) throw new SellerModuleError('سجل المخزون غير موجود في متجرك.', 404);
        if (onHand < current.reserved) throw new SellerModuleError('لا يمكن خفض المخزون عن الكمية المحجوزة.', 409);
        const updated = await transaction.inventory.updateMany({
          where: { id, onHand: current.onHand, reserved: current.reserved },
          data: { onHand },
        });
        if (!updated.count) throw new SellerModuleError('تغير المخزون بالتزامن. أعد المحاولة.', 409);
        const change = onHand - current.onHand;
        if (change) {
          await transaction.inventoryMovement.create({
            data: {
              variantId: current.variantId,
              warehouseId: current.warehouseId,
              type: 'ADJUSTMENT',
              quantity: change,
              note: typeof body.note === 'string' ? body.note.trim().slice(0, 300) || null : null,
            },
          });
        }
        return { id, onHand };
      });
      return NextResponse.json({ inventory: result });
    }

    if (section === 'shipping' && body.action === 'shipment') {
      const id = requiredString(body, 'shipmentId', 64);
      const trackingNumber = typeof body.trackingNumber === 'string' ? body.trackingNumber.trim() : '';
      if (trackingNumber.length > 128) throw new SellerModuleError('رقم التتبع طويل جدًا.', 400);
      const carrierId = typeof body.carrierId === 'string' && body.carrierId ? body.carrierId : null;
      if (carrierId) {
        const carrier = await prisma.shippingCarrier.findFirst({ where: { id: carrierId, isActive: true }, select: { id: true } });
        if (!carrier) throw new SellerModuleError('شركة الشحن المحددة غير متاحة.', 404);
      }
      const updated = await prisma.shipment.updateMany({
        where: { id, vendorOrder: { sellerId: seller.id } },
        data: { trackingNumber: trackingNumber || null, carrierId },
      });
      if (!updated.count) throw new SellerModuleError('الشحنة غير موجودة في متجرك.', 404);
      return NextResponse.json({ shipmentId: id, trackingNumber: trackingNumber || null, carrierId });
    }

    if (section === 'shipping' && body.action === 'return') {
      const id = requiredString(body, 'returnId', 64);
      const status = body.status;
      if (status !== 'APPROVED' && status !== 'REJECTED' && status !== 'RECEIVED') {
        throw new SellerModuleError('حالة الإرجاع غير مدعومة.', 400);
      }
      const request = await prisma.returnRequest.findFirst({
        where: { id, order: { vendorOrders: { some: { sellerId: seller.id } } } },
        select: {
          status: true,
          items: { select: { orderItem: { select: { vendorOrder: { select: { sellerId: true } } } } } },
        },
      });
      if (!request) throw new SellerModuleError('طلب الإرجاع غير موجود في متجرك.', 404);
      if (request.items.some((item) => item.orderItem.vendorOrder.sellerId !== seller.id)) {
        throw new SellerModuleError('يجب معالجة طلبات الإرجاع متعددة البائعين عبر خدمة الدعم.', 409);
      }
      const allowed: Record<string, string[]> = {
        REQUESTED: ['APPROVED', 'REJECTED'],
        APPROVED: ['RECEIVED'],
      };
      if (!allowed[request.status]?.includes(status)) throw new SellerModuleError('لا يمكن الانتقال إلى حالة الإرجاع المطلوبة.', 409);
      const updated = await prisma.returnRequest.updateMany({
        where: { id, status: request.status },
        data: { status },
      });
      if (!updated.count) throw new SellerModuleError('تغيرت حالة طلب الإرجاع. أعد المحاولة.', 409);
      return NextResponse.json({ returnId: id, status });
    }

    if (section === 'marketing') {
      const couponId = requiredString(body, 'couponId', 64);
      const status = body.status;
      if (status !== 'ACTIVE' && status !== 'DISABLED') throw new SellerModuleError('حالة القسيمة غير صالحة.', 400);
      const coupon = await prisma.coupon.findFirst({
        where: { id: couponId, promotion: { sellers: { some: { sellerId: seller.id } } } },
        select: { id: true, promotion: { select: { startsAt: true, endsAt: true } } },
      });
      if (!coupon) throw new SellerModuleError('القسيمة غير موجودة في متجرك.', 404);
      if (status === 'ACTIVE' && (coupon.promotion.endsAt < new Date() || coupon.promotion.startsAt > new Date())) {
        throw new SellerModuleError('لا يمكن تفعيل قسيمة خارج فترة العرض.', 409);
      }
      await prisma.coupon.update({ where: { id: coupon.id }, data: { status } });
      return NextResponse.json({ couponId, status });
    }

    if (section === 'staff') {
      const id = requiredString(body, 'staffId', 64);
      const action = requiredString(body, 'action', 20);
      if (action === 'revoke') {
        const updated = await prisma.$transaction(async (transaction) => {
          const member = await transaction.sellerStaff.findFirst({
            where: { id, sellerId: seller.id, revokedAt: null },
            select: { id: true, userId: true, roleId: true },
          });
          if (!member) return false;
          await transaction.sellerStaff.update({ where: { id }, data: { revokedAt: new Date() } });
          await transaction.userRoleAssignment.deleteMany({
            where: { userId: member.userId, roleId: member.roleId, scopeType: 'SELLER', scopeId: seller.id },
          });
          return true;
        });
        if (!updated) throw new SellerModuleError('عضو الفريق غير موجود.', 404);
        return NextResponse.json({ staffId: id, revoked: true });
      }
      if (action === 'role') {
        const roleId = requiredString(body, 'roleId', 64);
        const result = await prisma.$transaction(async (transaction) => {
          const [member, role] = await Promise.all([
            transaction.sellerStaff.findFirst({
              where: { id, sellerId: seller.id, revokedAt: null },
              select: { id: true, userId: true, roleId: true, acceptedAt: true },
            }),
            transaction.role.findFirst({
              where: { id: roleId, sellerId: seller.id },
              select: { id: true },
            }),
          ]);
          if (!member || !role) return false;
          await transaction.sellerStaff.update({ where: { id }, data: { roleId } });
          if (member.acceptedAt) {
            await transaction.userRoleAssignment.deleteMany({
              where: { userId: member.userId, roleId: member.roleId, scopeType: 'SELLER', scopeId: seller.id },
            });
            await transaction.userRoleAssignment.create({
              data: { userId: member.userId, roleId, scopeType: 'SELLER', scopeId: seller.id },
            });
          }
          return true;
        });
        if (!result) throw new SellerModuleError('عضو الفريق أو الدور غير موجود.', 404);
        return NextResponse.json({ staffId: id, roleId });
      }
      throw new SellerModuleError('عملية الفريق غير مدعومة.', 400);
    }

    throw new SellerModuleError('عملية التحديث غير مدعومة لهذا القسم.', 400);
  } catch (error) {
    return handleError(error, section);
  }
}
