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

  console.log('Filters:', { propertyCategory, propertyCity, propertyTown });

  try {
    // إعداد شروط الفلترة
    const filters = {};

    // الفئة مطلوبة دائمًا
    if (propertyCategory) {
      filters.propertyCategory = propertyCategory;
    }

    // تحقق من وجود المدينة
    if (propertyCity && propertyCity !== 'undefined') {
      filters.propertyCity = propertyCity;

      // إذا كانت البلدة موجودة أيضًا
      if (propertyTown && propertyTown !== 'undefined') {
        filters.propertyTown = propertyTown;
      }
    }

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
