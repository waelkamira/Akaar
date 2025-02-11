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
      adType,
      brand,
      minPrice,
      maxPrice,
    } = body;

    // حساب البيانات للصفحة الحالية
    const skip = (page - 1) * limit;

    // إعداد شروط الفلترة
    const filters = {};

    // تطبيق الفلاتر فقط إذا كانت القيم موجودة
    if (brand) filters.brand = brand;
    if (city) filters.city = city;
    if (town) filters.town = town;
    if (adType) filters.adType = adType;

    // فلترة الأسعار إذا كانت محددة
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice ? { gte: toInteger(minPrice) } : {}),
        ...(maxPrice ? { lte: toInteger(maxPrice) } : {}),
      };
    }

    console.log('Where Condition:', JSON.stringify(filters, null, 2));
    console.log(city, town, 'adType', adType, brand, minPrice, maxPrice);

    // جلب البيانات من قاعدة البيانات
    const cars = await prisma.car.findMany({
      where: Object.keys(filters).length > 0 ? filters : {}, // تطبيق الفلاتر إذا كانت موجودة
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    // console.log('Cars:', cars);

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
