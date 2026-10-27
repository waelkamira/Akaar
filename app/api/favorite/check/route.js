import { getAuthenticatedUser } from '@/lib/auth/require-auth';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
export async function POST(req) {
  try {
    const parsedBody = await readJsonBody(req, 16 * 1024);
    if (!parsedBody.ok) {
      return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
    }
    const body = parsedBody.value;
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

        const favorites = await prisma.favorite.findMany({
      where: { userId, isDeleted: false, product: { isDeleted: false } },
      select: { productId: true },
    });

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
