import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { productId, userId } = await req.json();

  try {
    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Product ID and userId are required' },
        { status: 400 }
      );
    }

    // التحقق مما إذا كان المنتج مضافًا إلى المفضلة
    const existingFavorite = await prisma.favorite.findFirst({
      where: { userId, productId },
      select: { id: true },
    });

    return NextResponse.json({
      favorited: !!existingFavorite?.id,
    });
  } catch (error) {
    console.error('Error checking favorite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
