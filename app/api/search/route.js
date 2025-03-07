import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { page = 1, searchedKeyword = '' } = await req.json();
    const limit = 8;
    const skip = (page - 1) * limit;

    // حساب العدد الإجمالي للنتائج
    const totalCount = await prisma.product.count({
      where: {
        title: {
          contains: searchedKeyword,
          mode: 'insensitive',
        },
      },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: searchedKeyword,
          mode: 'insensitive',
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      totalCount,
      hasMore: skip + products.length < totalCount,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
