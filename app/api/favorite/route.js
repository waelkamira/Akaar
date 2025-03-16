import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  // استخراج userId من الطلب (يمكن أن يكون عبر query params أو headers)
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const page = parseInt(searchParams.get('page')) || 0;
  const limit = parseInt(searchParams.get('limit')) || 8;
  // التأكد من أن قيمة page لا تكون أقل من 0
  const currentPage = Math.max(0, page);
  // حساب الصفحات مع التأكد من أن skip تكون موجبة
  const skip = Math.max(0, currentPage * limit);

  try {
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // حساب العدد الإجمالي للنتائج
    const totalCount = await prisma.favorite.count({
      where: { userId }, // تطبيق الفلاتر فقط إذا كانت موجودة
    });
    // جلب المفضلات الخاصة بالمستخدم
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }, // الترتيب حسب تاريخ ال��ضافة
      select: {
        product: true, // جلب تفاصيل المنتج المرتبط بكل سجل في المفضلة
      },
    });

    // إرجاع قائمة المنتجات المفضلة
    return NextResponse.json(
      {
        totalCount: totalCount,
        hasMore: skip + favorites.length < totalCount,
        favorites: favorites.map((fav) => fav.product),
        message: 'تم جلب المفضلة بنجاح',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المفضلة' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function POST(req) {
  const { id, userId } = await req.json();
  console.log('id', id, 'userId', userId);

  try {
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Post ID and userId are required' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // التحقق من وجود المنتج
    const productExists = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!productExists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // التحقق مما إذا كان المنتج مضافًا بالفعل في المفضلة
    const existingFavorite = await prisma.favorite.findFirst({
      where: { userId, productId: id },
      select: { id: true }, // جلب الـ ID فقط
    });

    if (existingFavorite?.id) {
      // إزالة من المفضلة
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      return NextResponse.json({
        message: 'تم حذفه من المفضلة بنجاح',
        favorited: false,
      });
    } else {
      // إضافة للمفضلة
      await prisma.favorite.create({
        data: {
          user: { connect: { id: userId } }, // ربط المستخدم الموجود مسبقًا
          product: { connect: { id: id } }, // ربط المنتج الموجود مسبقًا
        },
      });

      return NextResponse.json({
        message: 'تم إضافته إلى المفضلة بنجاح',
        favorited: true,
      });
    }
  } catch (error) {
    console.error('Error handling favorite:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء ما' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
export async function DELETE(req) {
  const { id, userId } = await req.json();
  try {
    const existingFavorite = await prisma.favorite.findFirst({
      where: { id, userId },
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
