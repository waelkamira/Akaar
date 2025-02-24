import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // استخراج المعاملات من الرابط
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const skip = (page - 1) * limit;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // جلب المفضلات الخاصة بالمستخدم
    const favorites = await prisma.favorite.findMany({
      where: { email },
      select: { id: true }, // جلب فقط `id` من المفضلات
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // استخراج جميع `id`s من المفضلات
    const favoriteIds = favorites.map((fav) => fav.id);

    if (favoriteIds.length === 0) {
      return NextResponse.json({ message: 'No favorites found', data: [] });
    }

    // البحث عن الإعلانات المطابقة في `car` و `property`
    const cars = await prisma.car.findMany({
      where: { favoriteId: { in: favoriteIds } },
    });

    const properties = await prisma.property.findMany({
      where: { favoriteId: { in: favoriteIds } },
    });

    const results = [...properties, ...cars];
    console.log('results', results);
    // إرجاع البيانات
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    const { postId, email } = await req.json();

    if (!postId || !email) {
      return NextResponse.json(
        { error: 'Post ID and email are required' },
        { status: 400 }
      );
    }

    // التحقق مما إذا كان البوست مضافًا بالفعل في المفضلة
    const existingFavorite = await prisma.favorite.findFirst({
      where: { email, postId },
      select: { id: true }, // جلب الـ ID فقط
    });

    if (existingFavorite?.id) {
      // إزالة من المفضلة
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      return NextResponse.json({
        message: 'Removed from favorites',
        favorited: false,
      });
    } else {
      // إضافة للمفضلة
      await prisma.favorite.create({
        data: { email, postId },
      });

      return NextResponse.json({
        message: 'Added to favorites',
        favorited: true,
      });
    }
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function DELETE(req) {
  const { postId, email } = await req.json();
  try {
    const existingFavorite = await prisma.favorite.findFirst({
      where: { postId, email },
      select: { id: true },
    });
    if (existingFavorite?.id) {
      await prisma.favorite.delete({
        where: { id: existingFavorite?.id },
      });
    }
    return NextResponse.json({
      message: 'removed from favorite',
      favorited: false,
    });
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
