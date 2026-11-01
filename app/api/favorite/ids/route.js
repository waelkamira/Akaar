import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { isValidIdentifier } from '@/lib/api/validation.mjs';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  try {
    if (!isValidIdentifier(userId)) {
      return NextResponse.json({ error: 'User ID is invalid' }, { status: 400 });
    }
    const authenticatedUser = await getAuthenticatedUser();
    if (!authenticatedUser || authenticatedUser.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.$queryRaw`
      SELECT favorite."productId"
      FROM public.favorites AS favorite
      INNER JOIN public.products AS product
        ON product.id = favorite."productId"
      INNER JOIN public."Category" AS category
        ON category.id = product."categoryId"
      WHERE favorite."userId" = ${userId}
        AND favorite."isDeleted" = false
        AND product."isDeleted" = false
        AND product."isActive" = true
        AND product."approvalStatus" = 'APPROVED'
        AND category."isActive" = true
    `;
    const productIds = favorites.map(({ productId }) => productId);

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
