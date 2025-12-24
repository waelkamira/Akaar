import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

const prisma = new PrismaClient();

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
async function clearUserPostsCache(userId) {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.startsWith(`posts_${userId}`)) {
      cache.delete(key);
    }
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const userId = url.searchParams.get('userId') || '';
  console.log('userId', userId);
  try {
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير معرف المستخدم' }),
        { status: 400 }
      );
    }

    if (isNaN(page) || isNaN(limit)) {
      return new Response(
        JSON.stringify({ error: 'قيم الصفحة أو الحدود غير صالحة' }),
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const cacheKey = generatePostsCacheKey(userId, page, limit);

    // التحقق من الذاكرة المؤقتة
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('📦 [Cache Hit] User Posts', cacheKey);
      return new Response(JSON.stringify(cachedData), { status: 200 });
    }

    // التحقق من وجود Prisma
    if (!prisma?.product) {
      throw new Error('جدول product غير موجود.');
    }

    // جلب البيانات من قاعدة البيانات
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where: { userId } }),
      prisma.product.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    console.log('products', products);
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
    console.log('💾 [Cache Set] User Posts', cacheKey);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req) {
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

  try {
    // تحقق إذا كانت الإعلان موجودة
    const product = await prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      return new Response(
        JSON.stringify({
          error: 'لم يتم العثور على الإعلان أو لا تملك صلاحية حذف هذه الإعلان',
        }),
        { status: 404 }
      );
    }

    // حذف الإعلان
    await prisma.product.delete({ where: { id } });

    // تنظيف الذاكرة المؤقتة للمستخدم
    await clearUserPostsCache(userId);

    return new Response(JSON.stringify({ message: 'تم الحذف بنجاح ✔' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
