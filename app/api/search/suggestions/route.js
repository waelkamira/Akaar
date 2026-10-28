import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';

const CATEGORY_SEARCH_TERM_IDS = {
  car: 2,
  cars: 2,
  automobile: 2,
  automobiles: 2,
  vehicle: 2,
  vehicles: 2,
};

export async function GET(request) {
  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'search-suggestions',
    limit: 120,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json(
      { error: status === 429 ? 'تم تجاوز حد اقتراحات البحث. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' },
      { status, headers },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim().slice(0, 120) || '';

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const categoryId = CATEGORY_SEARCH_TERM_IDS[query.toLowerCase()];
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        approvalStatus: 'APPROVED',
        category: { isActive: true },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { categoryName: { contains: query, mode: 'insensitive' } },
          ...(categoryId ? [{ categoryId }] : []),
        ],
      },
      select: { title: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      distinct: ['title'],
    });

    return NextResponse.json({
      suggestions: products.map((product) => product.title).filter(Boolean),
    });
  } catch (error) {
    console.error('Search suggestions request failed:', error);
    return NextResponse.json(
      { error: 'Unable to load search suggestions.' },
      { status: 500 },
    );
  }
}
