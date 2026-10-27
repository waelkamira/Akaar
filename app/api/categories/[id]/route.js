import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
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

  const { page, limit, skip } = getPagination(searchParams, {
    defaultPage: 1,
    defaultLimit: 8,
    maxLimit: 50,
  });

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

    const where = { categoryId, isDeleted: false, isActive: true, category: { isActive: true } };
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      const response = { data: [], hasMore: false, totalCount };
      cache.set(cacheKey, response);
      return NextResponse.json(response);
    }

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where, // Publicly visible products
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
