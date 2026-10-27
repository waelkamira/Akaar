import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { parseCategoryIds } from '@/lib/api/category-ids.mjs';

export const revalidate = 60;
const MAX_CATEGORIES = 24;
const PREVIEW_SIZE = 2;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedCategories = searchParams.get('categories');
    let categoryIds = parseCategoryIds(requestedCategories);

    // Default to the active catalog only when no category list was supplied.
    // A malformed supplied list must not silently broaden the response to every category.
    if (!requestedCategories?.trim()) {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true },
        orderBy: { id: 'asc' },
        take: MAX_CATEGORIES,
      });
      categoryIds = categories.map(({ id }) => id);
    }

    if (requestedCategories?.trim() && categoryIds.length) {
      const activeCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds }, isActive: true },
        select: { id: true },
      });
      categoryIds = activeCategories.map(({ id }) => id);
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
        where: { categoryId: { in: categoryIds }, isDeleted: false, isActive: true },
        _count: { _all: true },
      }),
      Promise.all(categoryIds.map(async (categoryId) => {
        const products = await prisma.product.findMany({
          where: { categoryId, isDeleted: false, isActive: true },
          select: {
            id: true,
            title: true,
            categoryId: true,
            categoryName: true,
            images: true,
            basePrice: true,
            stockQuantity: true,
            salesCount: true,
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
