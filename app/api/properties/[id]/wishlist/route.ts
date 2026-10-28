import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { id: propertyId } = await params;
  const property = await prisma.property.findFirst({
    where: { id: propertyId, isPublished: true },
    select: { id: true },
  });
  if (!property) return NextResponse.json({ error: 'Property not found.' }, { status: 404 });

  const favorite = await prisma.propertyWishlist.findUnique({
    where: { userId_propertyId: { userId: user.id, propertyId } },
    select: { id: true },
  });
  return NextResponse.json({ saved: Boolean(favorite) }, {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function POST(_request: Request, { params }: RouteContext) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { id: propertyId } = await params;
  const property = await prisma.property.findFirst({
    where: { id: propertyId, isPublished: true },
    select: { id: true },
  });
  if (!property) return NextResponse.json({ error: 'Property not found.' }, { status: 404 });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const saved = await prisma.$transaction(async (transaction) => {
        const existing = await transaction.propertyWishlist.findUnique({
          where: { userId_propertyId: { userId: user.id, propertyId } },
          select: { id: true },
        });
        if (existing) {
          await transaction.propertyWishlist.delete({ where: { id: existing.id } });
          return false;
        }
        await transaction.propertyWishlist.create({ data: { userId: user.id, propertyId } });
        return true;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

      return NextResponse.json({ saved }, {
        headers: { 'Cache-Control': 'private, no-store' },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && attempt === 0) {
        continue;
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2034' || error.code === 'P2002')
      ) {
        return NextResponse.json({ error: 'Wishlist changed concurrently. Please retry.' }, { status: 409 });
      }
      console.error('Property wishlist toggle failed:', error);
      return NextResponse.json({ error: 'Unable to update the wishlist.' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unable to update the wishlist.' }, { status: 500 });
}
