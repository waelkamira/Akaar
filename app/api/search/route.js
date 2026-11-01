import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';
import { sanitizeSearchText } from '@/lib/api/search-filters.mjs';
import { buildWhere, getQueryTerms, textConditions, SORT_ORDERS, validPositiveInteger } from '@/lib/api/search-query.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { isReviewTableAvailable } from '@/lib/admin/review-table-availability';
import { getProductRatingSummaries } from '@/lib/reviews/ratings';

const MAX_QUERY_LENGTH = 120;
const MAX_PAGE_SIZE = 50;
export async function POST(request) {
  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'catalog-search',
    limit: 60,
    windowMs: 60_000,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json(
      { error: status === 429 ? 'تم تجاوز حد البحث. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' },
      { status, headers },
    );
  }

  const parsedBody = await readJsonBody(request, 64 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.error },
      { status: parsedBody.status },
    );
  }
  const body = parsedBody.value;

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
  const limit = Math.min(validPositiveInteger(body.limit, 20), MAX_PAGE_SIZE);
  // Keep offset arithmetic within JavaScript's safe-integer range.
  const maxPage = Math.floor(Number.MAX_SAFE_INTEGER / limit) + 1;
  const page = Math.min(validPositiveInteger(body.page, 1), maxPage);
  const where = buildWhere({ categoryId: body.categoryId, filters });
  const sortKey = sanitizeSearchText(
    typeof filters.sortBy === 'string' ? filters.sortBy : body.sortBy,
    32,
  );
  const orderBy = SORT_ORDERS[sortKey] || [{ createdAt: 'desc' }];

  try {
    const queryTerms = getQueryTerms(query);
    if (queryTerms.length) {
      where.AND = [
        ...(where.AND || []),
        { AND: textConditions(queryTerms) },
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
      if (!(await isReviewTableAvailable())) {
        return NextResponse.json(
          { error: 'Product ratings are temporarily unavailable.' },
          { status: 503 },
        );
      }

      const ratedProducts = await prisma.$queryRaw`
        SELECT "productId"
        FROM public.reviews
        GROUP BY "productId"
        HAVING AVG(rating)::float8 >= ${minimumRating}
      `;
      where.AND = [
        ...(where.AND || []),
        { id: { in: ratedProducts.map((item) => item.productId) } },
      ];
    }

    const titleCondition = query
      ? { title: { contains: query, mode: 'insensitive' } }
      : null;
    const titleMatchWhere = titleCondition
      ? { ...where, AND: [...(where.AND || []), titleCondition] }
      : null;
    const pageOffset = (page - 1) * limit;
    if (pageOffset > 1000) {
      const offsetGuardCount = await prisma.product.count({ where });
      if (isPaginationOffsetOutOfRange(pageOffset, offsetGuardCount)) {
        return NextResponse.json({
          products: [],
          totalCount: offsetGuardCount,
          hasMore: false,
        });
      }
    }
    const remainingWhere = titleCondition
      ? { ...where, AND: [...(where.AND || []), { NOT: titleCondition }] }
      : where;
    const productSelect = {
      id: true,
      title: true,
      userId: true,
      sellerId: true,
      userImage: true,
      userName: true,
      categoryId: true,
      categoryName: true,
      images: true,
      basePrice: true,
      adCategory: true,
      city: true,
      town: true,
      phoneNumber: true,
      lng: true,
      lat: true,
      link: true,
      details: true,
      description: true,
      stockQuantity: true,
      salesCount: true,
      isActive: true,
      approvalStatus: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, userName: true, userImage: true },
      },
    };

    let products;
    let totalCount;

    if (titleCondition && page === 1) {
      const [titleProducts, remainingCandidates, matchingCount] =
        await Promise.all([
          prisma.product.findMany({
            where: titleMatchWhere,
            take: limit,
            orderBy,
            select: productSelect,
          }),
          prisma.product.findMany({
            where: remainingWhere,
            take: limit,
            orderBy,
            select: productSelect,
          }),
          prisma.product.count({ where }),
        ]);
      products = [
        ...titleProducts,
        ...remainingCandidates.slice(0, limit - titleProducts.length),
      ];
      totalCount = matchingCount;
    } else if (titleCondition) {
      const [titleMatchCount, matchingCount] = await Promise.all([
        prisma.product.count({ where: titleMatchWhere }),
        prisma.product.count({ where }),
      ]);
      const titleOffset = Math.min(pageOffset, titleMatchCount);
      const titleLimit = Math.max(
        0,
        Math.min(limit, titleMatchCount - pageOffset),
      );
      const remainingLimit = limit - titleLimit;
      const remainingOffset = Math.max(0, pageOffset - titleMatchCount);
      const [titleProducts, remainingProducts] = await Promise.all([
        titleLimit
          ? prisma.product.findMany({
              where: titleMatchWhere,
              skip: titleOffset,
              take: titleLimit,
              orderBy,
              select: productSelect,
            })
          : [],
        remainingLimit
          ? prisma.product.findMany({
              where: remainingWhere,
              skip: remainingOffset,
              take: remainingLimit,
              orderBy,
              select: productSelect,
            })
          : [],
      ]);
      products = [...titleProducts, ...remainingProducts];
      totalCount = matchingCount;
    } else {
      [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          skip: pageOffset,
          take: limit,
          orderBy,
          select: productSelect,
        }),
        prisma.product.count({ where }),
      ]);
    }

    const ratings = await getProductRatingSummaries(products.map((product) => product.id));
    const normalizedProducts = products.map((product) => {
      return {
        ...product,
        image1: product.images?.[0] || null,
        userName: product.userName || product.user?.userName || null,
        userImage: product.userImage || product.user?.userImage || null,
        averageRating: ratings.get(product.id)?.average ?? null,
        reviewCount: ratings.get(product.id)?.count ?? 0,
      };
    });

    return NextResponse.json({
      products: normalizedProducts,
      totalCount,
      hasMore: pageOffset + normalizedProducts.length < totalCount,
      page,
      limit,
      remainingCount: Math.max(0, totalCount - (pageOffset + normalizedProducts.length)),
    });
  } catch (error) {
    console.error('Search request failed:', error);
    return NextResponse.json(
      { error: 'Unable to search products right now.' },
      { status: 500 },
    );
  }
}
