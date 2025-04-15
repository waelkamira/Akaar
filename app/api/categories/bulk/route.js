import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// إعدادات الذاكرة المؤقتة
const cache = new LRUCache({
  max: 100,
  maxSize: 5000000, // 5MB
  sizeCalculation: (value) => Buffer.byteLength(JSON.stringify(value), 'utf8'),
  ttl: 1000 * 60 * 60 * 4, // 4 ساعات
});

const prisma = new PrismaClient();

// دالة لإنشاء مفتاح ذاكرة التخزين المؤقت
function generateCacheKey(categoryIds) {
  const hash = crypto
    .createHash('md5')
    .update(categoryIds.sort().join(','))
    .digest('hex');
  return `bulk_categories_${hash}`;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const categoriesParam = searchParams.get('categories');

  if (!categoriesParam) {
    return NextResponse.json(
      { error: 'المعامل "categories" مطلوب' },
      { status: 400 }
    );
  }

  const categoryIds = categoriesParam.split(',').map(Number).filter(Boolean);
  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: 'معرفات الفئات غير صالحة' },
      { status: 400 }
    );
  }

  const cacheKey = generateCacheKey(categoryIds);

  // التحقق من الذاكرة المؤقتة
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    // console.log('📦 [Cache Hit]', cacheKey);
    return NextResponse.json({
      data: cachedData,
      meta: { source: 'cache', cachedAt: new Date().toISOString() },
    });
  }

  try {
    // console.log('🔄 [Cache Miss] جلب البيانات من قاعدة البيانات', cacheKey);

    // جلب جميع المنتجات للفئات المطلوبة في استعلام واحد
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
      },
      orderBy: { createdAt: 'desc' },
    });

    // تجميع المنتجات حسب الفئة
    const formattedData = categoryIds.reduce((acc, categoryId) => {
      acc[categoryId] = products
        .filter((product) => product.categoryId === categoryId)
        .slice(0, 8); // الحد الأقصى 8 منتجات لكل فئة
      return acc;
    }, {});

    // تخزين في الذاكرة المؤقتة
    cache.set(cacheKey, formattedData);
    // console.log('💾 [Cache Set]', cacheKey);

    return NextResponse.json({
      data: formattedData,
      meta: { source: 'database', cached: false },
    });
  } catch (error) {
    console.error('❌ خطأ في جلب البيانات:', error);
    return NextResponse.json(
      {
        error: 'خطأ داخلي في الخادم',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
