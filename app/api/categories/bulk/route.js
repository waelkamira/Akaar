import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// إعدادات محسنة للذاكرة المؤقتة مع حل مشكلة sizeCalculation
const cache = new LRUCache({
  max: 100, // الحد الأقصى لعدد العناصر
  maxSize: 5000000, // 5MB كحد أقصى (بالبايت)
  sizeCalculation: (value) => {
    // حساب حجم القيمة بالبايت (تقريبي)
    return Buffer.byteLength(JSON.stringify(value), 'utf8');
  },
  ttl: 1000 * 60 * 60 * 24, // 24 ساعات
});

const prisma = new PrismaClient();

// دالة مساعدة لتوليد مفتاح ذاكرة التخزين المؤقت
function generateCacheKey(categoryIds) {
  const hash = crypto
    .createHash('md5')
    .update(categoryIds.sort().join(','))
    .digest('hex');
  return `cat_${hash}`;
}

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // التحقق من وجود معامل الفئات
  const categoriesParam = searchParams.get('categories');
  if (!categoriesParam) {
    return NextResponse.json(
      { error: 'المعامل "categories" مطلوب' },
      { status: 400 }
    );
  }

  // تحويل الفئات إلى أرقام مع التحقق من الصحة
  const categoryIds = categoriesParam.split(',').map(Number).filter(Boolean);
  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: 'معرفات الفئات غير صالحة' },
      { status: 400 }
    );
  }

  // إنشاء مفتاح الذاكرة المؤقتة
  const cacheKey = generateCacheKey(categoryIds);

  // التحقق من الذاكرة المؤقتة
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('📦 [Cache Hit]', cacheKey);
    return NextResponse.json({
      data: cachedData,
      meta: { source: 'cache', cachedAt: new Date().toISOString() },
    });
  }

  try {
    // جلب البيانات من قاعدة البيانات
    console.log('🔄 [Cache Miss] جلب البيانات من قاعدة البيانات', cacheKey);

    // تحسين الاستعلام باستخدام Promise.all
    const results = await Promise.all(
      categoryIds.map(async (categoryId) => {
        const products = await prisma.product.findMany({
          where: { categoryId },
          take: 8,
          orderBy: { createdAt: 'desc' },
        });

        return { categoryId, products };
      })
    );

    // تنسيق البيانات
    const formattedData = results.reduce((acc, { categoryId, products }) => {
      acc[categoryId] = products;
      return acc;
    }, {});

    // تخزين البيانات في الذاكرة المؤقتة
    cache.set(cacheKey, formattedData);
    console.log('💾 [Cache Set]', cacheKey, 'الحجم:', cache.calculatedSize);

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
