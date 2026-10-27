import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  try {
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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

    // جلب معرفات المنتجات فقط من المفضلة
    const favorites = await prisma.favorite.findMany({
      where: { userId, isDeleted: false, product: { isDeleted: false } },
      select: {
        product: {
          select: {
            id: true, // جلب المعرف فقط
          },
        },
      },
    });

    // استخراج المعرّفات فقط من النتائج
    const productIds = favorites.map((fav) => fav.product.id);

    return NextResponse.json(
      {
        productIds, // قائمة معرفات المنتجات
        message: 'تم جلب معرفات المفضلة بنجاح',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching favorite product IDs:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المفضلة' },
      { status: 500 }
    );
  }
}
