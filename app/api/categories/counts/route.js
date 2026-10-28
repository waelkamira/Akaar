import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(request) {
  const rateLimit = await consumeDurableRateLimit({ request, scope: 'category-counts', limit: 120, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json({ error: status === 429 ? 'تم تجاوز حد طلبات إحصاءات الفئات. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' }, { status, headers });
  }

  try {
    const categoryCounts = await prisma.product.groupBy({
      by: ['categoryId'],
      where: { isDeleted: false, isActive: true, category: { isActive: true } },
      _count: { _all: true },
    });

    const counts = Object.fromEntries(
      categoryCounts.map(({ categoryId, _count }) => [
        categoryId,
        _count._all,
      ]),
    );

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Unable to load category product counts:', error);
    return NextResponse.json(
      { error: 'Unable to load category product counts.' },
      { status: 500 },
    );
  }
}
