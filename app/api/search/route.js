import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();
console.log('تم الاطلاق');

export async function POST(req) {
  const body = await req.json();
  // تفكيك البيانات مع تعيين قيم افتراضية
  console.log('body', body);
  const {
    page = 0, // القيمة الافتراضية لـ page هي 0
    limit = 8,
    searchedKeyword,
    city,
    town,
    details,
    categoryId,
    minPrice,
    maxPrice,
  } = body;

  console.log(
    'searchedKeyword',
    searchedKeyword,
    city,
    town,
    details,
    categoryId,
    minPrice,
    maxPrice
  );

  try {
    // تحويل details من سلسلة نصية إلى كائن JSON إذا لزم الأمر
    let parsedDetails = details;
    if (typeof details === 'string') {
      parsedDetails = JSON.parse(details);
    }

    // تسجيل الفلاتر المستلمة بشكل مفصل
    console.log('Received Filters:', {
      searchedKeyword,
      categoryId,
      city,
      town,
      minPrice,
      maxPrice,
      details: parsedDetails,
    });

    // التأكد من أن قيمة page لا تكون أقل من 0
    const currentPage = Math.max(0, page);

    // حساب الصفحات مع التأكد من أن skip تكون موجبة
    const skip = Math.max(0, currentPage * limit);

    // إنشاء كائن الفلاتر
    const filters = {};

    // 1️⃣ تطبيق البحث بالكلمات المفتاحية
    if (searchedKeyword) {
      filters.OR = [
        { title: { contains: searchedKeyword, mode: 'insensitive' } },
        { description: { contains: searchedKeyword, mode: 'insensitive' } },
      ];
    }

    // 2️⃣ تطبيق الفلاتر الأساسية
    if (categoryId) filters.categoryId = toInteger(categoryId);
    if (city) filters.city = city;
    if (town) filters.town = town;

    // 3️⃣ فلترة الأسعار إذا كانت محددة
    if (minPrice || maxPrice) {
      filters.basePrice = {
        ...(minPrice ? { gte: toInteger(minPrice) } : {}),
        ...(maxPrice ? { lte: toInteger(maxPrice) } : {}),
      };
    }

    // 4️⃣ البحث داخل `details` المخزن كـ JSONB في PostgreSQL
    if (
      parsedDetails &&
      typeof parsedDetails === 'object' &&
      Object.keys(parsedDetails).length > 0
    ) {
      // إنشاء مصفوفة لشروط البحث داخل details
      const detailsFilters = Object.entries(parsedDetails).map(
        ([key, value]) => ({
          details: {
            path: [key], // الوصول إلى الحقل داخل JSONB
            equals: value, // البحث عن القيمة المطابقة
          },
        })
      );

      // دمج شروط details مع الفلاتر الأخرى
      filters.AND = detailsFilters;
    }

    // تسجيل الفلاتر المطبقة بشكل مفصل
    console.log('Applied Filters:', JSON.stringify(filters, null, 2));

    // حساب العدد الإجمالي للنتائج
    const totalCount = await prisma.product.count({
      where: Object.keys(filters).length > 0 ? filters : {}, // تطبيق الفلاتر فقط إذا كانت موجودة
    });

    // تنفيذ الاستعلام
    const products = await prisma.product.findMany({
      where: Object.keys(filters).length > 0 ? filters : {}, // تطبيق الفلاتر فقط إذا كانت موجودة
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // تسجيل المنتجات التي تم جلبها
    console.log('hasMore:', skip + products.length < totalCount);
    console.log('totalCount:', totalCount);
    console.log('products.length:', products.length);
    console.log('skip:', skip);

    // إرجاع النتائج
    return NextResponse.json({
      totalCount: totalCount,
      hasMore: skip + products.length < totalCount,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
