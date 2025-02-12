import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();

    // تفكيك البيانات مع قيم افتراضية
    const {
      page = 1, // الصفحة الحالية (افتراضيًا 1)
      limit = 5, // عدد العناصر في كل صفحة (افتراضيًا 5)
      city, // المدينة (اختياري)
      town, // المنطقة (اختياري)
      usedNew, // نوع الإعلان (اختياري)
      brand, // الماركة (اختياري)
      minPrice, // الحد الأدنى للسعر (اختياري)
      maxPrice, // الحد الأقصى للسعر (اختياري)
    } = body;
    console.log(
      city, // المدينة (اختياري)
      town, // المنطقة (اختياري)
      usedNew, // نوع الإعلان (اختياري)
      brand, // الماركة (اختياري)
      minPrice, // الحد الأدنى للسعر (اختياري)
      maxPrice
    );

    // حساب البيانات للصفحة الحالية
    const skip = (page - 1) * limit;

    // إعداد شروط الفلترة
    const filters = {};

    // 1. تطبيق الفلاتر فقط إذا كانت القيم موجودة
    if (brand) filters.brand = brand; // فلتر الماركة
    if (city) filters.city = city; // فلتر المدينة
    if (town) filters.town = town; // فلتر المنطقة
    if (usedNew) filters.usedNew = usedNew; // فلتر نوع الإعلان

    // 2. فلترة الأسعار إذا كانت محددة
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice ? { gte: toInteger(minPrice) } : {}), // الحد الأدنى للسعر
        ...(maxPrice ? { lte: toInteger(maxPrice) } : {}), // الحد الأقصى للسعر
      };
    }

    // تسجيل شروط الفلترة للتتبع
    // console.log('Where Condition:', JSON.stringify(filters, null, 2));
    // console.log('Filters:', { city, town, usedNew, brand, minPrice, maxPrice });

    // جلب البيانات من قاعدة البيانات
    const cars = await prisma.car.findMany({
      where: Object.keys(filters).length > 0 ? filters : {}, // تطبيق الفلاتر إذا كانت موجودة
      skip, // تخطي العناصر للصفحة الحالية
      take: limit, // عدد العناصر المطلوبة
      orderBy: { createdAt: 'desc' }, // ترتيب النتائج من الأحدث إلى الأقدم
      select: {
        id: true,
        userName: true,
        userImage: true,
        adType: true,
        title: true,
        brand: true,
        model: true,
        usedNew: true,
        year: true,
        price: true,
        image1: true,
        image2: true,
        image3: true,
        image4: true,
        image5: true,
        city: true,
        town: true,
        description: true,
        distance: true,
        phoneNumber: true,
        lat: true,
        lng: true,
        link: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // تسجيل النتائج للتتبع
    // console.log('Cars:', cars);

    // إرجاع النتائج كـ JSON
    return NextResponse.json(cars);
  } catch (error) {
    // تسجيل الأخطاء في حالة حدوثها
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    // إغلاق اتصال Prisma بعد الانتهاء
    await prisma.$disconnect();
  }
}
