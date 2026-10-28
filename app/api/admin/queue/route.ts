import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { getPagination } from '@/lib/api/validation.mjs';

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  if (type !== 'products' && type !== 'sellers') {
    return NextResponse.json({ error: 'نوع قائمة المراجعة غير صالح.' }, { status: 400 });
  }
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 10, maxLimit: 50 });

  try {
    const [items, totalCount] = type === 'products'
      ? await Promise.all([
          prisma.product.findMany({
            where: { approvalStatus: 'PENDING', isDeleted: false },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
            select: { id: true, title: true, description: true, categoryName: true, basePrice: true, createdAt: true, userName: true, images: true },
          }),
          prisma.product.count({ where: { approvalStatus: 'PENDING', isDeleted: false } }),
        ])
      : await Promise.all([
          prisma.seller.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
            select: { id: true, storeName: true, slug: true, createdAt: true, user: { select: { email: true } } },
          }),
          prisma.seller.count({ where: { status: 'PENDING' } }),
        ]);

    return NextResponse.json({
      items,
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
    });
  } catch (error) {
    console.error('Unable to load admin review queue:', error);
    return NextResponse.json({ error: 'تعذر تحميل قائمة المراجعة.' }, { status: 500 });
  }
}
