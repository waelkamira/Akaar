import { getAuthenticatedUser } from '@/lib/auth/require-auth';

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

        const favorites = await prisma.favorite.findMany({
      where: { userId, isDeleted: false, product: { isDeleted: false, isActive: true, category: { isActive: true } } },
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
