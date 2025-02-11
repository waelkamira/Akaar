import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
  const limit = Math.max(1, parseInt(searchParams.get('limit')) || 5);
  const skip = (page - 1) * limit;

  const filters = {};

  // تطبيق الفلاتر بناءً على المعلمات المقدمة
  const propertyCategory = searchParams.get('propertyCategory')?.trim();
  const propertyCity = searchParams.get('propertyCity')?.trim();
  const propertyTown = searchParams.get('propertyTown')?.trim();
  const propertyType = searchParams.get('propertyType')?.trim();
  let propertyRoomsNumber = searchParams.get('propertyRoomsNumber')?.trim();
  const propertyArea = searchParams.get('propertyArea')?.trim();
  const phoneNumber = searchParams.get('phoneNumber')?.trim();
  const userName = searchParams.get('userName')?.trim();

  const minPrice = searchParams.get('minPrice')
    ? parseInt(searchParams.get('minPrice'))
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? parseInt(searchParams.get('maxPrice'))
    : null;

  // تطبيق الفلاتر
  if (propertyCategory && propertyCategory !== 'undefined') {
    filters.propertyCategory = propertyCategory;
  }

  if (propertyCity && propertyCity !== 'undefined') {
    filters.propertyCity = propertyCity;
  }

  if (propertyTown && propertyTown !== 'undefined') {
    filters.propertyTown = propertyTown;
  }

  if (propertyType && propertyType !== 'undefined') {
    filters.propertyType = propertyType;
  }

  if (propertyRoomsNumber && propertyRoomsNumber !== 'undefined') {
    // تنظيف القيمة: تحويل "4   1" إلى "4 + 1"
    propertyRoomsNumber = propertyRoomsNumber
      .replace(/\s+/g, ' ') // استبدال المسافات المتعددة بمسافة واحدة
      .trim() // إزالة المسافات الزائدة من البداية والنهاية
      .replace(/\s/g, ' + '); // استبدال المسافة الواحدة بعلامة "+" مع مسافات حولها

    filters.propertyRoomsNumber = {
      equals: propertyRoomsNumber, // مطابقة تامة لعدد الغرف
    };
  }

  if (propertyArea && propertyArea !== 'undefined') {
    filters.propertyArea = propertyArea;
  }

  if (phoneNumber && phoneNumber !== 'undefined') {
    filters.phoneNumber = phoneNumber;
  }

  if (userName && userName !== 'undefined') {
    filters.userName = userName;
  }

  // تصفية بناءً على نطاق السعر
  if (minPrice !== null || maxPrice !== null) {
    filters.propertyPrice = {
      ...(minPrice !== null ? { gte: minPrice } : {}),
      ...(maxPrice !== null ? { lte: maxPrice } : {}),
    };
  }

  try {
    // الحصول على العدد الإجمالي للنتائج
    const totalCount = await prisma.car.count({
      where: filters,
    });

    // جلب النتائج من قاعدة البيانات
    const properties = await prisma.car.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, // إذا كان id غير موجود، سيتم إنشاؤه تلقائيًا بواسطة Prisma
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
        updatedAt: true,
      },
    });

    console.log('Applied Filters:', filters);
    console.log('Properties found:', properties);

    return NextResponse.json({
      totalCount, // العدد الإجمالي للنتائج
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
