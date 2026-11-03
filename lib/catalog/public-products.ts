import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';

export type CatalogSort = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export function normalizeCatalogSort(value: string | undefined): CatalogSort {
  switch (value) {
    case 'oldest':
    case 'title-asc':
    case 'title-desc':
      return value;
    default:
      return 'newest';
  }
}

function getCatalogOrderBy(sort: CatalogSort): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'oldest':
      return [{ publishedAt: 'asc' }, { id: 'asc' }];
    case 'title-asc':
      return [{ title: 'asc' }, { id: 'asc' }];
    case 'title-desc':
      return [{ title: 'desc' }, { id: 'desc' }];
    default:
      return [{ publishedAt: 'desc' }, { id: 'desc' }];
  }
}

function publicProductWhere(now: Date): Prisma.ProductWhereInput {
  return {
    status: 'APPROVED',
    isActive: true,
    deletedAt: null,
    publishedAt: { not: null },
    store: {
      isActive: true,
      seller: { status: 'ACTIVE', isVerified: true },
    },
    variants: {
      some: {
        status: 'ACTIVE',
        prices: {
          some: {
            validFrom: { lte: now },
            OR: [{ validUntil: null }, { validUntil: { gt: now } }],
            currencyRef: { is: { isActive: true } },
          },
        },
      },
    },
  };
}

function publicProductSelect(now: Date) {
  return {
    id: true,
    title: true,
    description: true,
    slug: true,
    createdAt: true,
    brand: { select: { name: true, slug: true } },
    categories: {
      where: { category: { isActive: true } },
      select: { category: { select: { id: true, name: true, slug: true } } },
    },
    media: {
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
      select: { storageKey: true, altText: true, mediaType: true, isPrimary: true },
    },
    store: {
      select: {
        id: true,
        name: true,
        slug: true,
        seller: { select: { id: true, displayName: true, slug: true } },
      },
    },
    variants: {
      where: { status: 'ACTIVE' },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        sku: true,
        title: true,
        prices: {
          where: {
            validFrom: { lte: now },
            OR: [{ validUntil: null }, { validUntil: { gt: now } }],
            currencyRef: { is: { isActive: true } },
          },
          orderBy: [{ currency: 'asc' }, { validFrom: 'desc' }],
          select: {
            amount: true,
            compareAt: true,
            currency: true,
            validFrom: true,
            currencyRef: { select: { symbol: true, minorUnits: true } },
          },
        },
        inventory: {
          where: { warehouse: { isActive: true } },
          select: {
            onHand: true,
            reserved: true,
            warehouse: { select: { sellerId: true } },
          },
        },
      },
    },
  } satisfies Prisma.ProductSelect;
}

function getPublicProductWhere(query: string, categorySlug: string, now: Date, storeId?: string) {
  return {
    ...publicProductWhere(now),
    ...(storeId ? { storeId } : {}),
    ...(categorySlug ? {
      categories: {
        some: {
          category: {
            isActive: true,
            slug: categorySlug,
          },
        },
      },
    } : {}),
    ...(query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { brand: { is: { name: { contains: query, mode: 'insensitive' as const } } } },
        { store: { name: { contains: query, mode: 'insensitive' as const } } },
      ],
    } : {}),
  } satisfies Prisma.ProductWhereInput;
}

export async function listPublicCatalogProducts(input: {
  page: number;
  query: string;
  categorySlug: string;
  sort: CatalogSort;
  storeId?: string;
}) {
  const page = Number.isSafeInteger(input.page) && input.page > 0 ? Math.min(input.page, 100_000) : 1;
  const query = input.query.trim().slice(0, 100);
  const categorySlug = input.categorySlug.trim().slice(0, 80);
  const limit = 24;
  const now = new Date();
  const where = getPublicProductWhere(query, categorySlug, now, input.storeId);
  const productsForCategories = getPublicProductWhere('', '', now, input.storeId);

  const [products, totalCount, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getCatalogOrderBy(input.sort),
      skip: (page - 1) * limit,
      take: limit,
      select: publicProductSelect(now),
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: {
        isActive: true,
        products: { some: { product: { is: productsForCategories } } },
      },
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
  ]);

  return { products, totalCount, categories, page, limit, sort: input.sort };
}

export const getPublicProductById = cache(async (id: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return null;
  }

  const now = new Date();
  return prisma.product.findFirst({
    where: { ...publicProductWhere(now), id },
    select: publicProductSelect(now),
  });
});
