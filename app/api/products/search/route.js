import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    // تفكيك البيانات مع قيم افتراضية
    const {
      page = 1,
      limit = 5,
      city,
      town,
      adCategory,
      category,
      minPrice,
      maxPrice,
    } = body;
    console.log('adCategory', adCategory, 'category', category);

    // حساب البيانات للصفحة الحالية
    const skip = (page - 1) * limit;

    // إعداد شروط الفلترة
    const filters = {};

    // 1. تطبيق الفلاتر فقط إذا كانت القيم موجودة
    if (category) filters.category = category;
    if (city) filters.city = city;
    if (town) filters.town = town;
    if (adCategory) filters.adCategory = adCategory;

    // 2. فلترة الأسعار إذا كانت محددة
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice ? { gte: toInteger(minPrice) } : {}),
        ...(maxPrice ? { lte: toInteger(maxPrice) } : {}),
      };
    }

    const products = await prisma.product.findMany({
      where: Object.keys(filters).length > 0 ? filters : {}, // تطبيق الفلاتر إذا كانت موجودة
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // تسجيل النتائج للتتبع
    // console.log('Products:', products);

    return NextResponse.json(products);
  } catch (error) {
    // تسجيل الأخطاء في حالة حدوثها
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    // إغلاق اتصال Prisma بعد الانتهاء
    await prisma.$disconnect();
  }
}
