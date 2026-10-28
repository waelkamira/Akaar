import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readMarketplaceSettings } from '@/lib/marketplace/settings';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });
  }

  try {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
    const [
      users,
      activeVendors,
      pendingVendors,
      productQueue,
      products,
      orders,
      monthly,
      settings,
      pendingProducts,
      recentVendors,
    ] = await Promise.all([
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.seller.count({ where: { status: 'ACTIVE', isVerified: true } }),
      prisma.seller.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { approvalStatus: 'PENDING', isDeleted: false } }),
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.order.count(),
      prisma.$queryRaw<Array<{ month: string; revenue: bigint; newUsers: bigint; newVendors: bigint }>>`
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', ${start}::timestamp),
            date_trunc('month', CURRENT_TIMESTAMP),
            interval '1 month'
          ) AS month
        ),
        sales AS (
          SELECT date_trunc('month', "paidAt") AS month, SUM("amount") AS revenue
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
          COALESCE(new_users.count, 0)::bigint AS "newUsers",
          COALESCE(new_vendors.count, 0)::bigint AS "newVendors"
        FROM months
        LEFT JOIN sales USING (month)
        LEFT JOIN new_users USING (month)
        LEFT JOIN new_vendors USING (month)
        ORDER BY months.month
      `,
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
      metrics: { users, activeVendors, pendingVendors, productQueue, products, orders },
      monthly: monthly.map((row) => ({
        month: row.month,
        revenue: Number(row.revenue),
        newUsers: Number(row.newUsers),
        newVendors: Number(row.newVendors),
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
