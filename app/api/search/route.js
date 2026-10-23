import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const MAX_QUERY_LENGTH = 120;
const MAX_PAGE_SIZE = 50;
const SORT_ORDERS = {
  cheapest: [{ basePrice: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }],
  best_sellers: [{ orders: { _count: 'desc' } }, { createdAt: 'desc' }],
  newest: [{ createdAt: 'desc' }],
};

function validPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function getQueryTerms(query) {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
}

function textConditions(terms) {
  return terms.map((term) => ({
    OR: [
      { title: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { categoryName: { contains: term, mode: 'insensitive' } },
      { userName: { contains: term, mode: 'insensitive' } },
    ],
  }));
}

function addDetailsFilters(where, details = {}) {
  for (const [key, value] of Object.entries(details)) {
    if (
      typeof key !== 'string' ||
      !/^[\w-]{1,80}$/.test(key) ||
      value === undefined ||
      value === null ||
      value === ''
    ) {
      continue;
    }

    where.AND.push({
      details: {
        path: [key],
        equals: String(value),
      },
    });
  }
}

function buildWhere({ categoryId, filters }) {
  const where = { isDeleted: false, AND: [] };

  const selectedCategoryId = validPositiveInteger(
    categoryId ?? filters.categoryId,
    null,
  );
  if (selectedCategoryId) {
    where.AND.push({ categoryId: selectedCategoryId });
  }

  if (filters.categoryName) {
    where.AND.push({
      categoryName: { equals: String(filters.categoryName), mode: 'insensitive' },
    });
  }

  const price = {};
  const min = filters.priceMin === '' ? null : Number(filters.priceMin);
  const max = filters.priceMax === '' ? null : Number(filters.priceMax);
  if (Number.isFinite(min) && min >= 0) price.gte = Math.floor(min);
  if (Number.isFinite(max) && max >= 0) price.lte = Math.floor(max);
  if (Object.keys(price).length) where.AND.push({ basePrice: price });

  if (filters.city) where.AND.push({ city: String(filters.city) });
  if (filters.town) where.AND.push({ town: String(filters.town) });
  if (filters.adType) where.AND.push({ adCategory: String(filters.adType) });

  if (filters.vendorId) where.AND.push({ userId: String(filters.vendorId) });

  if (filters.brand) {
    const brand = String(filters.brand).trim();
    if (brand) {
      where.AND.push({
        OR: [
          { details: { path: ['brand'], string_contains: brand } },
          { details: { path: ['Brand'], string_contains: brand } },
        ],
      });
    }
  }

  if (filters.subCategory) {
    const subCategory = String(filters.subCategory).trim();
    if (subCategory) {
      where.AND.push({
        OR: [
          { details: { path: ['subCategory'], string_contains: subCategory } },
          { details: { path: ['subcategory'], string_contains: subCategory } },
        ],
      });
    }
  }

  addDetailsFilters(where, filters.details);

  if (!where.AND.length) delete where.AND;
  return where;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid search request.' }, { status: 400 });
  }

  const query =
    typeof body.query === 'string'
      ? body.query.trim().slice(0, MAX_QUERY_LENGTH)
      : '';
  const filters =
    body.filters && typeof body.filters === 'object' && !Array.isArray(body.filters)
      ? body.filters
      : {};
  const page = validPositiveInteger(body.page, 1);
  const limit = Math.min(validPositiveInteger(body.limit, 20), MAX_PAGE_SIZE);
  const where = buildWhere({ categoryId: body.categoryId, filters });
  const sortKey =
    typeof filters.sortBy === 'string' ? filters.sortBy : body.sortBy;
  const orderBy = SORT_ORDERS[sortKey] || [{ createdAt: 'desc' }];

  try {
    const queryTerms = getQueryTerms(query);
    if (queryTerms.length) {
      const exactMatches = textConditions(queryTerms);
      const fuzzyMatches = await prisma.$queryRaw`
        SELECT product.id
        FROM "products" AS product
        WHERE product."isDeleted" = false
          AND NOT EXISTS (
            SELECT 1
            FROM unnest(${queryTerms}::text[]) AS term(value)
            WHERE NOT (
              product."title" % term.value
              OR product."categoryName" % term.value
              OR COALESCE(product."description", '') % term.value
              OR COALESCE(product."userName", '') % term.value
            )
          )
        LIMIT 5000
      `;
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { AND: exactMatches },
            { id: { in: fuzzyMatches.map((product) => product.id) } },
          ],
        },
      ];
    }

    const minimumRating = Number(filters.rating);
    if (
      filters.rating !== undefined &&
      filters.rating !== '' &&
      Number.isFinite(minimumRating) &&
      minimumRating >= 1 &&
      minimumRating <= 5
    ) {
      const ratedProducts = await prisma.review.groupBy({
        by: ['productId'],
        having: { rating: { _avg: { gte: minimumRating } } },
      });
      where.AND = [
        ...(where.AND || []),
        { id: { in: ratedProducts.map((item) => item.productId) } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          user: {
            select: { id: true, userName: true, userImage: true },
          },
          _count: { select: { orders: true, reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const normalizedProducts = products.map((product) => ({
      ...product,
      image1: product.images?.[0] || null,
      userName: product.userName || product.user?.userName || null,
      userImage: product.userImage || product.user?.userImage || null,
    }));

    return NextResponse.json({
      products: normalizedProducts,
      totalCount,
      hasMore: page * limit < totalCount,
      page,
      limit,
      remainingCount: Math.max(0, totalCount - page * limit),
    });
  } catch (error) {
    console.error('Search request failed:', error);
    return NextResponse.json(
      { error: 'Unable to search products right now.' },
      { status: 500 },
    );
  }
}
