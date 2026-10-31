import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readMarketplaceSettings } from '@/lib/marketplace/settings';

type MonthlyMetric = { month: string; revenue: bigint; sales: bigint; newUsers: bigint; newVendors: bigint };
type DailyVisitMetric = { day: string; views: bigint };

function toSafeNumber(value: bigint) {
  const result = Number(value);
  if (!Number.isSafeInteger(result)) throw new Error('Dashboard metric exceeds the supported numeric range.');
  return result;
}

async function readMonthlyMetrics(start: Date, hasCanonicalPaymentTable: boolean) {
  if (hasCanonicalPaymentTable) {
    return prisma.$queryRaw<MonthlyMetric[]>`
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', ${start}::timestamp),
          date_trunc('month', CURRENT_TIMESTAMP),
          interval '1 month'
        ) AS month
      ),
      sales AS (
        SELECT date_trunc('month', "paidAt") AS month, SUM("amount") AS revenue, COUNT(*) AS sales
        FROM "Payment"
        WHERE "paidAt" >= ${start}
          AND "status" = 'COMPLETED'
        GROUP BY 1
      ),
      new_users AS (
        SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
        FROM "users"
        WHERE "createdAt" >= ${start}
        GROUP BY 1
      ),
      new_vendors AS (
        SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
        FROM "sellers"
        WHERE "createdAt" >= ${start}
        GROUP BY 1
      )
      SELECT to_char(months.month, 'YYYY-MM') AS month,
        COALESCE(sales.revenue, 0)::bigint AS revenue,
        COALESCE(sales.sales, 0)::bigint AS sales,
        COALESCE(new_users.count, 0)::bigint AS "newUsers",
        COALESCE(new_vendors.count, 0)::bigint AS "newVendors"
      FROM months
      LEFT JOIN sales USING (month)
      LEFT JOIN new_users USING (month)
      LEFT JOIN new_vendors USING (month)
      ORDER BY months.month
    `;
  }

  return prisma.$queryRaw<MonthlyMetric[]>`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', ${start}::timestamp),
        date_trunc('month', CURRENT_TIMESTAMP),
        interval '1 month'
      ) AS month
    ),
    sales AS (
      SELECT date_trunc('month', "createdAt") AS month, SUM("amount") AS revenue, COUNT(*) AS sales
      FROM public.payments
      WHERE "createdAt" >= ${start}
        AND "status" = 'COMPLETED'
      GROUP BY 1
    ),
    new_users AS (
      SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
      FROM "users"
      WHERE "createdAt" >= ${start}
      GROUP BY 1
    ),
    new_vendors AS (
      SELECT date_trunc('month', "createdAt") AS month, COUNT(*) AS count
      FROM "sellers"
      WHERE "createdAt" >= ${start}
      GROUP BY 1
    )
    SELECT to_char(months.month, 'YYYY-MM') AS month,
      COALESCE(sales.revenue, 0)::bigint AS revenue,
      COALESCE(sales.sales, 0)::bigint AS sales,
      COALESCE(new_users.count, 0)::bigint AS "newUsers",
      COALESCE(new_vendors.count, 0)::bigint AS "newVendors"
    FROM months
    LEFT JOIN sales USING (month)
    LEFT JOIN new_users USING (month)
    LEFT JOIN new_vendors USING (month)
    ORDER BY months.month
  `;
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });
  }

  try {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const [tables] = await prisma.$queryRaw<Array<{
      hasCanonicalOrderTable: boolean;
      hasLegacyOrderTable: boolean;
      hasCanonicalPaymentTable: boolean;
      hasLegacyPaymentTable: boolean;
      hasLegacyReturnTable: boolean;
      hasCanonicalReturnTable: boolean;
      hasSiteVisitTable: boolean;
      hasSubscriberTable: boolean;
    }>>`
      SELECT
        to_regclass('public."Order"') IS NOT NULL AS "hasCanonicalOrderTable",
        to_regclass('public.orders') IS NOT NULL AS "hasLegacyOrderTable",
        to_regclass('public."Payment"') IS NOT NULL AS "hasCanonicalPaymentTable",
        to_regclass('public.payments') IS NOT NULL AS "hasLegacyPaymentTable",
        to_regclass('public."Return"') IS NOT NULL AS "hasCanonicalReturnTable",
        to_regclass('public.returns') IS NOT NULL AS "hasLegacyReturnTable",
        to_regclass('public.daily_site_visits') IS NOT NULL AS "hasSiteVisitTable",
        to_regclass('public.newsletter_subscribers') IS NOT NULL AS "hasSubscriberTable"
    `;
    if ((!tables.hasCanonicalOrderTable && !tables.hasLegacyOrderTable)
      || (!tables.hasCanonicalPaymentTable && !tables.hasLegacyPaymentTable)) {
      throw new Error('Order or payment tables are missing from the configured database.');
    }

    const orderCount = tables.hasCanonicalOrderTable
      ? prisma.order.count()
      : prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*)::bigint AS count FROM public.orders`
        .then(([{ count }]) => toSafeNumber(count));
    const completedSalesCount = tables.hasCanonicalPaymentTable
      ? prisma.payment.count({ where: { status: 'COMPLETED' } })
      : prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*)::bigint AS count FROM public.payments WHERE "status" = 'COMPLETED'`
        .then(([{ count }]) => toSafeNumber(count));
    const returnCount = tables.hasCanonicalReturnTable
      ? prisma.return.count()
      : tables.hasLegacyReturnTable
        ? prisma.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*)::bigint AS count FROM public.returns`
          .then(([{ count }]) => toSafeNumber(count))
        : Promise.resolve(0);
    const visitorMetrics = tables.hasSiteVisitTable
      ? prisma.$queryRaw<Array<{ total: bigint; last30Days: bigint }>>`
          SELECT
            COALESCE(SUM(views), 0)::bigint AS total,
            COALESCE(SUM(views) FILTER (WHERE day >= CURRENT_DATE - INTERVAL '29 days'), 0)::bigint AS "last30Days"
          FROM public.daily_site_visits
        `.then(([row]) => ({ total: toSafeNumber(row.total), last30Days: toSafeNumber(row.last30Days) }))
      : Promise.resolve({ total: 0, last30Days: 0 });
    const dailyVisits = tables.hasSiteVisitTable
      ? prisma.$queryRaw<DailyVisitMetric[]>`
          SELECT to_char(day, 'MM-DD') AS day, SUM(views)::bigint AS views
          FROM public.daily_site_visits
          WHERE day >= CURRENT_DATE - INTERVAL '29 days'
          GROUP BY day
          ORDER BY day
        `
      : Promise.resolve([]);
    const subscriberCount = tables.hasSubscriberTable
      ? prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint AS count
          FROM public.newsletter_subscribers
          WHERE "confirmedAt" IS NOT NULL
            AND "unsubscribedAt" IS NULL
        `.then(([{ count }]) => toSafeNumber(count))
      : Promise.resolve(0);
    const monthlyMetrics = readMonthlyMetrics(start, tables.hasCanonicalPaymentTable);
    const [
      users,
      totalUsers,
      activeVendors,
      totalVendors,
      pendingVendors,
      productQueue,
      products,
      orders,
      completedSales,
      returns,
      visitors,
      visitsByDay,
      subscribers,
      monthly,
      settings,
      pendingProducts,
      recentVendors,
    ] = await Promise.all([
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count(),
      prisma.seller.count({ where: { status: 'ACTIVE', isVerified: true } }),
      prisma.seller.count(),
      prisma.seller.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { approvalStatus: 'PENDING', isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false } }),
      orderCount,
      completedSalesCount,
      returnCount,
      visitorMetrics,
      dailyVisits,
      subscriberCount,
      monthlyMetrics,
      readMarketplaceSettings(),
      prisma.product.findMany({
        where: { approvalStatus: 'PENDING', isDeleted: false },
        orderBy: { createdAt: 'asc' },
        take: 8,
        select: { id: true, title: true, description: true, categoryName: true, basePrice: true, createdAt: true, userName: true, images: true },
      }),
      prisma.seller.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'asc' },
        take: 8,
        select: { id: true, storeName: true, slug: true, createdAt: true, user: { select: { email: true } } },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        users: totalUsers,
        activeUsers: users,
        activeVendors,
        totalVendors,
        pendingVendors,
        productQueue,
        products,
        orders,
        completedSales,
        returns,
        pageViews: visitors.total,
        pageViewsLast30Days: visitors.last30Days,
        pageViewsByDay: visitsByDay.map((row) => ({ day: row.day, views: toSafeNumber(row.views) })),
        analyticsEnabled: tables.hasSiteVisitTable,
        subscribers,
        pendingItems: productQueue + pendingVendors,
      },
      monthly: monthly.map((row) => ({
        month: row.month,
        revenue: toSafeNumber(row.revenue),
        sales: toSafeNumber(row.sales),
        newUsers: toSafeNumber(row.newUsers),
        newVendors: toSafeNumber(row.newVendors),
      })),
      settings,
      pendingProducts,
      pendingVendorsList: recentVendors,
    });
  } catch (error) {
    console.error('Unable to load admin dashboard:', error);
    return NextResponse.json({ error: 'تعذر تحميل لوحة الإدارة.' }, { status: 500 });
  }
}
