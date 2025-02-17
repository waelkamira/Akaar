import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { page, searshedKeyWord } = await req.json();
  const limit = 6; // عدد النتائج لكل صفحة
  const skip = (page - 1) * limit;

  try {
    // جلب العقارات المطابقة
    const properties = await prisma.property.findMany({
      where: {
        propertyName: {
          contains: searshedKeyWord,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        image1: true,
        image2: true,
        image3: true,
        image4: true,
        image5: true,
        propertyCategory: true,
        propertyName: true,
        propertyType: true,
        propertyRoomsNumber: true,
        propertyPrice: true,
        propertyArea: true,
        propertyCity: true,
        propertyTown: true,
        phoneNumber: true,
        description: true,
        lng: true,
        lat: true,
        link: true,
        hearts: true,
        userName: true,
        userImage: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // جلب السيارات المطابقة
    const cars = await prisma.car.findMany({
      where: {
        title: {
          contains: searshedKeyWord,
          mode: 'insensitive',
        },
      },
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

    // دمج النتائج وإضافة حقل type لتمييز المصدر
    const combinedResults = [
      ...properties.map((property) => ({ ...property, type: 'property' })),
      ...cars.map((car) => ({ ...car, type: 'car' })),
    ];

    // ترتيب النتائج المدمجة بناءً على تاريخ الإنشاء
    combinedResults.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // حساب العدد الإجمالي للنتائج
    const totalCount = combinedResults.length;

    // تطبيق التخطي والتحديد
    const limitedResults = combinedResults.slice(skip, skip + limit);

    // تحديد ما إذا كانت هناك المزيد من النتائج
    const hasMore = skip + limitedResults.length < totalCount;

    // إرسال البيانات المسترجعة
    const result = {
      totalCount,
      hasMore, // إضافة حقل لتحديد ما إذا كانت هناك المزيد من النتائج
      data: limitedResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching properties and cars:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
