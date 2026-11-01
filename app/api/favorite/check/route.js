import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidIdentifier } from '@/lib/api/validation.mjs';

export async function POST(request) {
  try {
    const parsedBody = await readJsonBody(request, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json(
        { error: parsedBody.error },
        { status: parsedBody.status },
      );
    }

    const userId = parsedBody.value?.userId;
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

    return NextResponse.json({
      favoriteProductIds: favorites.map(({ productId }) => productId),
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
