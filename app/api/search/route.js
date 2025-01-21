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

  console.log('propertyCategory:', propertyCategory);

  try {
    if (
      !propertyCategory ||
      propertyCategory.trim() === '' ||
      propertyCategory === 'undefined'
    ) {
      return NextResponse.json(
        { error: 'propertyCategory is required' },
        { status: 400 }
      );
    }

    const filters = {};

    // تصفية بناءً على الفئة
    if (
      propertyCategory &&
      propertyCategory.trim() !== '' &&
      propertyCategory !== 'undefined'
    ) {
      filters.propertyCategory = propertyCategory;
    }

    // تصفية بناءً على النوع
    if (
      propertyType &&
      propertyType.trim() !== '' &&
      propertyType !== 'undefined'
    ) {
      filters.propertyType = propertyType;
    }

    // تصفية بناءً على المدينة والبلدة
    if (
      propertyCity &&
      propertyCity.trim() !== '' &&
      propertyCity !== 'undefined'
    ) {
      filters.propertyCity = propertyCity;
    }
    if (
      propertyTown &&
      propertyTown.trim() !== '' &&
      propertyTown !== 'undefined'
    ) {
      filters.propertyTown = propertyTown;
    }

    // تصفية بناءً على السعر
    if (minPrice !== null || maxPrice !== null) {
      filters.propertyPrice = {
        ...(minPrice !== null ? { gte: minPrice } : {}),
        ...(maxPrice !== null ? { lte: maxPrice } : {}),
      };
    }

    // طباعة الفلاتر للتأكد
    console.log('Filters:', filters);

    // الحصول على العدد الإجمالي للنتائج
    const totalCount = await prisma.property.count({
      where: filters,
    });

    // جلب النتائج من قاعدة البيانات
    const properties = await prisma.property.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    console.log('Properties found:', properties.length);

    await prisma.$disconnect();
    return NextResponse.json({
      totalCount, // العدد الإجمالي للنتائج
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
