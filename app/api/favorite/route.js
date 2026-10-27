import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// إعدادات الذاكرة المؤقتة
const cache = new LRUCache({
  max: 100,
  maxSize: 5000000, // 5MB
  sizeCalculation: (value) => Buffer.byteLength(JSON.stringify(value), 'utf8'),
  ttl: 1000 * 60 * 60, // 60 دقيقة
});

// دالة مساعدة لإنشاء مفتاح ذاكرة التخزين المؤقت
function generateFavoriteCacheKey(userId, page, limit) {
  const hash = crypto
    .createHash('md5')
    .update(`${userId}-${page}-${limit}`)
    .digest('hex');
  return `fav_${hash}`;
}

// تنظيف الذاكرة المؤقتة عند التعديلات
async function clearUserFavoritesCache() {
  // Cache keys contain a hash, not the raw user ID; clear the cache to avoid stale favorites.
  cache.clear();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page')) || 0;
  const limit = parseInt(searchParams.get('limit')) || 8;
  const currentPage = Math.max(0, page);
  const skip = Math.max(0, currentPage * limit);

  try {
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // إنشاء مفتاح الذاكرة المؤقتة
    const cacheKey = generateFavoriteCacheKey(userId, page, limit);

    // التحقق من الذاكرة المؤقتة
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('📦 [Cache Hit] Favorites', cacheKey);
      return NextResponse.json(cachedData);
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
      prisma.favorite.count({ where: { userId } }),
      prisma.favorite.findMany({
        where: { userId },
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

    // تخزين في الذاكرة المؤقتة
    cache.set(cacheKey, result);
    console.log('💾 [Cache Set] Favorites', cacheKey);

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
  const { id, userId } = await req.json();

  try {
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Post ID and userId are required' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم والمنتج
    const [userExists, productExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findUnique({ where: { id } }),
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
    await clearUserFavoritesCache();

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
  const { id, userId } = await req.json();

  try {
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
    await clearUserFavoritesCache(userId);

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
