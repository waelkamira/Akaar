import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { publicProductWhere } from '@/lib/api/public-product-where.mjs';
import { getPagination } from '@/lib/api/validation.mjs';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// إعدادات الذاكرة المؤقتة
const cache = new LRUCache({
  max: 100,
  maxSize: 5000000, // 5MB
  sizeCalculation: (value) => Buffer.byteLength(JSON.stringify(value), 'utf8'),
  ttl: 1000 * 60 * 60, // 30 دقيقة
});

// دالة لإنشاء مفتاح ذاكرة التخزين المؤقت
function generatePostsCacheKey(userId, page, limit) {
  const hash = crypto
    .createHash('md5')
    .update(`${userId}-${page}-${limit}`)
    .digest('hex');
  return `posts_${hash}`;
}

// تنظيف ذاكرة التخزين المؤقت عند التعديلات
async function clearUserPostsCache() {
  // Keys are hashed, so prefix matching by userId cannot invalidate them reliably.
  cache.clear();
}

export async function GET(req) {
  const url = new URL(req.url);
  const { page, limit, skip } = getPagination(url.searchParams, {
    defaultPage: 1,
    defaultLimit: 5,
    maxLimit: 50,
  });
  const userId = (url.searchParams.get('userId') || '').trim();
  try {
    if (!userId || userId.length > 128) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير معرف المستخدم' }),
        { status: 400 }
      );
    }

    const cacheKey = generatePostsCacheKey(userId, page, limit);

    // التحقق من الذاكرة المؤقتة
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), { status: 200 });
    }

    // التحقق من وجود Prisma
    if (!prisma?.product) {
      throw new Error('جدول product غير موجود.');
    }

    // جلب البيانات من قاعدة البيانات
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where: publicProductWhere({ userId }) }),
      prisma.product.findMany({
        where: publicProductWhere({ userId }),
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'لم يتم العثور على إعلانات' }),
        { status: 404 }
      );
    }

    // تنسيق النتيجة
    const result = {
      hasMore: skip + products.length < totalCount,
      count: totalCount,
      data: products,
      meta: { cached: false, source: 'database' },
    };

    // تخزين في الذاكرة المؤقتة
    cache.set(cacheKey, result);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ error: 'تعذر تحميل الإعلانات حاليًا' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) {
    return new Response(JSON.stringify({ error: 'يجب تسجيل الدخول' }), { status: 401 });
  }
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const userId = searchParams.get('userId');

  if (!id || !userId) {
    return new Response(
      JSON.stringify({ error: 'يجب توفير معرف الإعلان ومعرف المستخدم' }),
      { status: 400 }
    );
  }

  if (authenticatedUser.id !== userId) {
    return new Response(JSON.stringify({ error: 'ليس لديك صلاحية حذف هذا الإعلان' }), { status: 403 });
  }

  try {
    const product = await prisma.product.findFirst({ where: { id, userId, isDeleted: false, isActive: true, category: { isActive: true } } });

    if (!product) {
      return new Response(
        JSON.stringify({
          error: 'لم يتم العثور على الإعلان أو لا تملك صلاحية حذف هذه الإعلان',
        }),
        { status: 404 }
      );
    }

    // حذف الإعلان
    await prisma.product.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });

    // تنظيف الذاكرة المؤقتة للمستخدم
    await clearUserPostsCache();

    return new Response(JSON.stringify({ message: 'تم الحذف بنجاح ✔' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
