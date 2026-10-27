import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { parseCategoryIds } from '@/lib/api/category-ids.mjs';
import { getCategoryIds } from '@/lib/catalog/categories.mjs';

export const revalidate = 60;
const MAX_CATEGORIES = 24;
const PREVIEW_SIZE = 2;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCategories = searchParams.get('categories');
    let categoryIds = parseCategoryIds(requestedCategories);

    // Category records in the deployed database use legacy text IDs and are empty.
    // Product.categoryId is numeric, so use the server-owned numeric registry instead.
    const allowedIds = new Set(getCategoryIds(MAX_CATEGORIES));
    if (!requestedCategories?.trim()) {
      categoryIds = getCategoryIds(MAX_CATEGORIES);
    } else if (categoryIds.length) {
      categoryIds = categoryIds.filter((id) => allowedIds.has(id));
    }

    if (!categoryIds.length) {
      return NextResponse.json(
        { data: {}, counts: {}, source: 'database' },
        { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } },
      );
    }

    const [groupedCounts, previews] = await Promise.all([
      prisma.product.groupBy({
        by: ['categoryId'],
        where: { categoryId: { in: categoryIds }, isDeleted: false },
        _count: { _all: true },
      }),
      Promise.all(categoryIds.map(async (categoryId) => {
        const products = await prisma.product.findMany({
          where: { categoryId, isDeleted: false },
          select: {
            id: true,
            title: true,
            categoryId: true,
            categoryName: true,
            images: true,
            basePrice: true,
            stockQuantity: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: PREVIEW_SIZE,
        });
        return [categoryId, products];
      })),
    ]);

    const counts = Object.fromEntries(
      groupedCounts.map(({ categoryId, _count }) => [categoryId, _count._all]),
    );
    const data = Object.fromEntries(previews);

    for (const categoryId of categoryIds) {
      if (!(categoryId in counts)) counts[categoryId] = 0;
      if (!(categoryId in data)) data[categoryId] = [];
    }

    return NextResponse.json(
      { data, counts, source: 'database' },
      { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } },
    );
  } catch (error) {
    console.error('Bulk category preview failed:', error);
    return NextResponse.json({ error: 'Unable to load category previews.' }, { status: 500 });
  }
}
