import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { getPagination } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });

  try {
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          title: true,
          price: true,
          currency: true,
          location: true,
          city: true,
          status: true,
          isPublished: true,
          createdAt: true,
          owner: { select: { id: true, email: true, userName: true } },
          store: { select: { name: true, slug: true } },
        },
      }),
      prisma.property.count(),
    ]);

    return NextResponse.json({
      items: properties,
      page,
      limit,
      totalCount,
      hasMore: skip + properties.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load admin property list:', error);
    return NextResponse.json({ error: 'تعذر تحميل الإعلانات العقارية.' }, { status: 500 });
  }
}
