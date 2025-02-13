import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

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

  // تطبيق الفلاتر على جدول "property"
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
    propertyRoomsNumber = propertyRoomsNumber
      .replace(/\s+/g, ' ') // استبدال المسافات المتعددة بمسافة واحدة
      .trim() // إزالة المسافات الزائدة من البداية والنهاية
      .replace(/\s/g, ' + '); // استبدال المسافة الواحدة بعلامة "+" مع مسافات حولها

    filters.propertyRoomsNumber = {
      equals: propertyRoomsNumber,
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

  if (minPrice || maxPrice) {
    filters.propertyPrice = {
      ...(minPrice ? { gte: minPrice } : {}),
      ...(maxPrice ? { lte: maxPrice } : {}),
    };
  }

  // تطبيق الفلاتر على جدول "car"
  const carFilters = {};

  const carCity = searchParams.get('carCity')?.trim();
  const carTown = searchParams.get('carTown')?.trim();
  const usedNew = searchParams.get('usedNew')?.trim();
  const brand = searchParams.get('brand')?.trim();

  if (carCity && carCity !== 'undefined') {
    carFilters.city = carCity;
  }

  if (carTown && carTown !== 'undefined') {
    carFilters.town = carTown;
  }

  if (usedNew && usedNew !== 'undefined') {
    carFilters.usedNew = usedNew;
  }

  if (brand && brand !== 'undefined') {
    carFilters.brand = brand;
  }

  if (minPrice || maxPrice) {
    carFilters.price = {
      ...(minPrice ? { gte: toInteger(minPrice) } : {}),
      ...(maxPrice ? { lte: toInteger(maxPrice) } : {}),
    };
  }

  try {
    // جلب البيانات من جدول "property"
    const totalPropertyCount = await prisma.property.count({
      where: filters,
    });

    const properties = await prisma.property.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
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
        createdAt: true,
      },
    });

    // جلب البيانات من جدول "car"
    const totalCarCount = await prisma.car.count({
      where: carFilters,
    });

    const cars = await prisma.car.findMany({
      where: carFilters,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userName: true,
        brand: true,
        price: true,
        city: true,
        town: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalCount: totalPropertyCount + totalCarCount, // العدد الإجمالي
      currentPage: page,
      totalPages: Math.ceil((totalPropertyCount + totalCarCount) / limit),
      properties,
      cars,
    });
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
