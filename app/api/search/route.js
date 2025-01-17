import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
  const limit = Math.max(1, parseInt(searchParams.get('limit')) || 5);
  const skip = (page - 1) * limit;

  const propertyCategory = searchParams.get('propertyCategory');
  const propertyCity = searchParams.get('propertyCity');
  const propertyTown = searchParams.get('propertyTown');
  const propertyType = searchParams.get('propertyType');
  const minPrice = searchParams.get('minPrice')
    ? parseInt(searchParams.get('minPrice'))
    : null;
  const maxPrice = searchParams.get('maxPrice')
    ? parseInt(searchParams.get('maxPrice'))
    : null;
  console.log(
    'propertyCategory',
    propertyCategory,

    'propertyType',
    propertyType,
    'propertyCity',
    propertyCity,
    'propertyTown',
    propertyTown,
    'minPrice',
    minPrice,
    'maxPrice',
    maxPrice
  );
  try {
    // إعداد شروط الفلترة
    const filters = {};

    // الفئة مطلوبة دائمًا
    if (propertyCategory) {
      filters.propertyCategory = propertyCategory;
    }
    if (propertyType) {
      filters.propertyType = propertyType;
    }
    if (propertyCity && propertyCity !== 'undefined') {
      // تحقق من وجود المدينة
      filters.propertyCity = propertyCity;

      // إذا كانت البلدة موجودة أيضًا
      if (propertyTown && propertyTown !== 'undefined') {
        filters.propertyTown = propertyTown;
      }
    }

    // // تحقق من وجود نطاق السعر
    // if (minPrice !== null && maxPrice !== null) {
    //   filters.propertyPrice = {
    //     gte: minPrice, // أكبر من أو يساوي الحد الأدنى
    //     lte: maxPrice, // أقل من أو يساوي الحد الأقصى
    //   };
    // }

    // استعلام قاعدة البيانات
    const properties = await prisma.property.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // ترتيب حسب تاريخ الإنشاء
    });

    await prisma.$disconnect();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
