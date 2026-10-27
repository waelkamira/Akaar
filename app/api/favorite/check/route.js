// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
// // export async function POST(req) {
//   const { productId, userId } = await req.json();

//   try {
//     if (!productId || !userId) {
//       return NextResponse.json(
//         { error: 'Product ID and userId are required' },
//         { status: 400 }
//       );
//     }

//     // التحقق مما إذا كان المنتج مضافًا إلى المفضلة
//     const existingFavorite = await prisma.favorite.findFirst({
//       where: { userId, productId },
//       select: { id: true },
//     });

//     return NextResponse.json({
//       favorited: !!existingFavorite?.id,
//     });
//   } catch (error) {
//     console.error('Error checking favorite:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
export async function POST(req) {
  try {
    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const userId = body?.userId;
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

    // جلب جميع المفضلات للمستخدم
    const favorites = await prisma.favorite.findMany({
      where: { userId, isDeleted: false, product: { isDeleted: false, isActive: true } },
      select: { productId: true },
    });

    // استخراج معرفات المنتجات المفضلة
    const favoriteProductIds = favorites.map((fav) => fav.productId);

    return NextResponse.json({ favoriteProductIds });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
