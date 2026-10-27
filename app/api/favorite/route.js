import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { parsePositiveInteger } from '@/lib/api/validation.mjs';
import { publicProductWhere } from '@/lib/api/public-product-where.mjs';

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

    // التحقق من وجود المستخدم
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // جلب البيانات من قاعدة البيانات
    const [totalCount, favorites] = await Promise.all([
      prisma.favorite.count({ where: { userId, isDeleted: false, product: { isDeleted: false, isActive: true, category: { isActive: true } } } }),
      prisma.favorite.findMany({
        where: { userId, isDeleted: false, product: { isDeleted: false, isActive: true, category: { isActive: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { product: true },
      }),
    ]);

    // تنسيق النتيجة
    const result = {
      totalCount,
      hasMore: skip + favorites.length < totalCount,
      favorites: favorites.map((fav) => fav.product),
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
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const { id, userId } = body || {};
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Post ID and userId are required' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم والمنتج
    const [userExists, productExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findFirst({ where: publicProductWhere({ id }) }),
    ]);

    if (!userExists || !productExists) {
      return NextResponse.json(
        { error: 'User or product not found' },
        { status: 404 }
      );
    }

    // التحقق من وجود المفضلة
    const existingFavorite = await prisma.favorite.findFirst({
      where: { userId, productId: id },
      select: { id: true },
    });

    let result;
    if (existingFavorite?.id) {
      // إزالة من المفضلة
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
      result = { message: 'تم حذفه من المفضلة بنجاح', favorited: false };
    } else {
      // إضافة للمفضلة
      await prisma.favorite.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id } },
        },
      });
      result = { message: 'تم إضافته إلى المفضلة بنجاح', favorited: true };
    }

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
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const { id, userId } = body || {};
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id || !userId) {
      return NextResponse.json({ error: 'Favorite ID and user ID are required.' }, { status: 400 });
    }
    const existingFavorite = await prisma.favorite.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (existingFavorite?.id) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
    }

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
