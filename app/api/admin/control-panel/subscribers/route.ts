import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  try {
    const [items, totalCount] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where: { confirmedAt: { not: null }, unsubscribedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, confirmedAt: true, createdAt: true },
      }),
      prisma.newsletterSubscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
    ]);
    return NextResponse.json({ items, page, totalCount, hasMore: skip + items.length < totalCount }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('Unable to load newsletter subscribers:', error);
    return NextResponse.json({ error: 'تعذر تحميل المشتركين.' }, { status: 500 });
  }
}
