import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { parsePositiveInteger, isPaginationOffsetOutOfRange, isValidIdentifier } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const requestedPage = parsePositiveInteger(searchParams.get('page'), 1);
  const limit = parsePositiveInteger(searchParams.get('limit'), 8, 50);
  const requestedSkip = (requestedPage - 1) * limit;
  const currentPage = Number.isSafeInteger(requestedSkip) ? requestedPage : 1;
  const skip = (currentPage - 1) * limit;

  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const [countRows] = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS "totalCount"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${userId}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
    `;
    const totalCount = countRows.totalCount;
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return NextResponse.json({
        totalCount,
        hasMore: false,
        favorites: [],
        message: 'تم جلب المفضلة بنجاح',
        meta: { cached: false, source: 'database' },
      }, { status: 200 });
    }
    const favorites = await prisma.$queryRaw`
      SELECT product.*
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${userId}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
      ORDER BY favorite."createdAt" DESC, favorite.id DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    // تنسيق النتيجة
    const result = {
      totalCount,
      hasMore: skip + favorites.length < totalCount,
      favorites,
      message: 'تم جلب المفضلة بنجاح',
      meta: { cached: false, source: 'database' },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المفضلة' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const parsedBody = await readJsonBody(req, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;
    const { id, userId } = body || {};
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isValidIdentifier(id) || !userId) {
      return NextResponse.json(
        { error: 'معرف المنتج غير صالح أو مفقود' },
        { status: 400 }
      );
    }
    const productId = id.trim();

    const [favorite] = await prisma.$queryRaw`
      INSERT INTO public.favorites ("id", "userId", "productId", "createdAt", "isDeleted")
      SELECT ${randomUUID()}, ${userId}, product.id, CURRENT_TIMESTAMP, false
      FROM public.products AS product
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE product.id = ${productId}
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
        AND EXISTS (SELECT 1 FROM public.users WHERE id = ${userId})
        AND (
          product."sellerId" IS NULL
          OR EXISTS (
            SELECT 1
            FROM public.sellers AS seller
            WHERE seller.id = product."sellerId"
              AND seller.status = 'ACTIVE'
              AND seller."isVerified" = true
          )
        )
      ON CONFLICT ("userId", "productId")
      DO UPDATE SET
        "isDeleted" = NOT public.favorites."isDeleted",
        "createdAt" = CASE
          WHEN public.favorites."isDeleted" THEN CURRENT_TIMESTAMP
          ELSE public.favorites."createdAt"
        END
      RETURNING "isDeleted"
    `;
    if (!favorite) {
      return NextResponse.json(
        { error: 'User or product not found' },
        { status: 404 }
      );
    }

    const favorited = !favorite.isDeleted;
    const result = favorited
      ? { message: 'تم إضافته إلى المفضلة بنجاح', favorited: true }
      : { message: 'تم حذفه من المفضلة بنجاح', favorited: false };

    // تنظيف الذاكرة المؤقتة للمستخدم

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء العملية' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const parsedBody = await readJsonBody(req, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;
    const { id, userId } = body || {};
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isValidIdentifier(id) || !userId) {
      return NextResponse.json({ error: 'معرف المفضلة غير صالح أو مفقود.' }, { status: 400 });
    }
    const favoriteId = id.trim();
    await prisma.$executeRaw`
      DELETE FROM public.favorites
      WHERE id = ${favoriteId}
        AND "userId" = ${userId}
    `;

    // تنظيف الذاكرة المؤقتة للمستخدم

    return NextResponse.json({
      message: 'removed from favorite',
      favorited: false,
    });
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
