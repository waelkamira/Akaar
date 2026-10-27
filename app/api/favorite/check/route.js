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

    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
        isDeleted: false,
        product: { isDeleted: false, isActive: true, category: { isActive: true } },
      },
      select: { productId: true },
    });

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
