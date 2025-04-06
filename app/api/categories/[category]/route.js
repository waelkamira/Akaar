import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';
import { LRUCache } from 'lru-cache';

// إنشاء كائن LRU Cache للتخزين المؤقت
const cache = new LRUCache({
  max: 100, // الحد الأقصى للعناصر
  ttl: 1000 * 60 * 5, // وقت انتهاء الصلاحية: 5 دقائق
});

const prisma = new PrismaClient();

export async function GET(req, props) {
  const params = await props.params;
  const { category } = params;
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  // console.log('category من داخل الدالة', category);

  // الحصول على قيم الصفحة والحد الأقصى مع قيم افتراضية
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 8;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح للتخزين المؤقت
  const cacheKey = `category_${category}_page_${page}_limit_${limit}`;

  // التحقق من وجود البيانات في التخزين المؤقت
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('✅ تم استرجاع البيانات من التخزين المؤقت:', cacheKey);
    return NextResponse.json(cachedData);
  }

  try {
    // جلب العدد الإجمالي للمنتجات
    const totalCount = await prisma.product.count({
      where: { categoryId: toInteger(category) },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: { categoryId: toInteger(category) }, // تصفية البيانات حسب الفئة
      skip, // تخطي عدد معين من العناصر
      take: limit, // الحد الأقصى للعناصر
      orderBy: { createdAt: 'desc' }, // ترتيب العناصر حسب التاريخ
    });

    // إعداد الاستجابة
    const response = {
      data: products,
      hasMore: skip + products.length < totalCount,
      totalCount, // إضافة totalCount إلى الرد
    };

    // تخزين البيانات في التخزين المؤقت
    cache.set(cacheKey, response);
    console.log('✅ تم تخزين البيانات في التخزين المؤقت:', cacheKey);

    // إرجاع البيانات مع العدد الإجمالي
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // إغلاق اتصال Prisma بعد الانتهاء
  }
}
