import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { page, searshedKeyWord } = await req.json();

  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const properties = await prisma.property.findMany({
      where: {
        propertyName: {
          contains: searshedKeyWord, // البحث عن الكلمة داخل الاسم
          mode: 'insensitive', // البحث غير حساس لحالة الأحرف
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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

    const cars = await prisma.car.findMany({
      where: {
        title: {
          contains: searshedKeyWord, // البحث عن الكلمة داخل عنوان السيارة
          mode: 'insensitive',
        },
      },
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

    const result = [...properties, ...cars];
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
