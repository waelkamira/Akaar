import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { LRUCache } from 'lru-cache';

// إنشاء كائن LRU Cache للتخزين المؤقت
const cache = new LRUCache({
  max: 100, // الحد الأقصى للعناصر
  ttl: 1000 * 30, // short TTL to limit stale catalog results
});

export async function GET(req, { params }) {
  const { id } = await params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId < 1) {
    return NextResponse.json({ error: 'معرف الفئة غير صالح.' }, { status: 400 });
  }
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قيم الصفحة والحد الأقصى مع قيم افتراضية
  const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
  const requestedLimit = Number.parseInt(searchParams.get('limit') || '8', 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 50) : 8;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح للتخزين المؤقت
  const cacheKey = `category_${categoryId}_page_${page}_limit_${limit}`;

  // التحقق من وجود البيانات في التخزين المؤقت
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

  try {
    // جلب العدد الإجمالي للمنتجات
    const totalCount = await prisma.product.count({
      where: { categoryId, isDeleted: false, isActive: true, category: { isActive: true } },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: { categoryId, isDeleted: false, isActive: true, category: { isActive: true } }, // Publicly visible products
      skip, // تخطي عدد معين من العناصر
      take: limit, // الحد الأقصى للعناصر
      orderBy: { createdAt: 'desc' }, // ترتيب العناصر حسب التاريخ
    });

    // إعداد الاستجابة
    const response = {
      data: products,
      // data: fakeData,
      hasMore: skip + products.length < totalCount,
      totalCount, // إضافة totalCount إلى الرد
    };
    // تخزين البيانات في التخزين المؤقت
    cache.set(cacheKey, response);

    // إرجاع البيانات مع العدد الإجمالي
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return NextResponse.json(
      { error: 'Unable to load category products.' },
      { status: 500 }
    );
  }
}
