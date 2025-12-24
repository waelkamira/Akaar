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

export async function GET(req, { params }) {
  const { id } = params;
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  console.log('id من داخل الدالة', id);

  // الحصول على قيم الصفحة والحد الأقصى مع قيم افتراضية
  const page = parseInt(searchParams.get('page')) || 0;
  const limit = parseInt(searchParams.get('limit')) || 8;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح للتخزين المؤقت
  const cacheKey = `category_${id}_page_${page}_limit_${limit}`;

  // التحقق من وجود البيانات في التخزين المؤقت
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('✅ تم استرجاع البيانات من التخزين المؤقت:', cacheKey);
    return NextResponse.json(cachedData);
  }

  try {
    // جلب العدد الإجمالي للمنتجات
    const totalCount = await prisma.product.count({
      where: { categoryId: toInteger(id) },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: { categoryId: toInteger(id) }, // تصفية البيانات حسب الفئة
      skip, // تخطي عدد معين من العناصر
      take: limit, // الحد الأقصى للعناصر
      orderBy: { createdAt: 'desc' }, // ترتيب العناصر حسب التاريخ
    });
    console.log('products', products);

    // إعداد الاستجابة
    const response = {
      data: products,
      // data: fakeData,
      hasMore: skip + products.length < totalCount,
      totalCount, // إضافة totalCount إلى الرد
    };
    console.log('response تم عمل طلب وجب بيانات', response);
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
