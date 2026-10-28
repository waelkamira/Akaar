import { NextResponse } from 'next/server';
import { Prisma, PropertyStatus, PropertyType } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { propertyInputSchema, propertySearchSchema } from '@/lib/properties/validation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = propertySearchSchema.safeParse(Object.fromEntries(searchParams));
  if (!filters.success) {
    return NextResponse.json({ error: 'Search filters are invalid.', details: filters.error.flatten() }, { status: 400 });
  }

  const { q, minPrice, maxPrice, type, status, country, city, location, cursor, limit } = filters.data;
  const where: Prisma.PropertyWhereInput = {
    isPublished: true,
    status: status as PropertyStatus,
    ...(type ? { type: type as PropertyType } : {}),
    ...(country ? { country: { equals: country, mode: 'insensitive' } } : {}),
    ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
    ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
    ...((minPrice !== undefined || maxPrice !== undefined) ? {
      price: {
        ...(minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : {}),
        ...(maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : {}),
      },
    } : {}),
    ...(q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ],
    } : {}),
  };

  try {
    const items = await prisma.property.findMany({
      where,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit + 1,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        location: true,
        country: true,
        city: true,
        images: true,
        status: true,
        type: true,
        attributes: true,
        createdAt: true,
        store: { select: { id: true, name: true, slug: true } },
      },
    });

    const hasMore = items.length > limit;
    const properties = hasMore ? items.slice(0, limit) : items;
    return NextResponse.json({
      properties,
      hasMore,
      nextCursor: hasMore ? properties[properties.length - 1]?.id ?? null : null,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45' },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'The search cursor is no longer valid.' }, { status: 400 });
    }
    console.error('Property search failed:', error);
    return NextResponse.json({ error: 'Unable to search properties right now.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Request body must be an object.' }, { status: 400 });
  }
  const input = propertyInputSchema.safeParse(payload);
  if (!input.success) {
    return NextResponse.json({ error: 'Property details are invalid.', details: input.error.flatten() }, { status: 400 });
  }

  let ownerId: string;
  let seller: {
    id: string;
    userId: string;
    storeName: string;
    slug: string;
    description: string | null;
    logo: string | null;
    status: string;
    isVerified: boolean;
  } | null = null;
  if (actor.role === 'ADMIN') {
    const vendorId = 'vendorId' in payload && typeof payload.vendorId === 'string' ? payload.vendorId : '';
    if (!vendorId) return NextResponse.json({ error: 'vendorId is required for admin-created listings.' }, { status: 400 });
    seller = await prisma.seller.findUnique({ where: { userId: vendorId } });
    if (!seller || seller.status !== 'ACTIVE' || !seller.isVerified) {
      return NextResponse.json({ error: 'An active, verified vendor is required.' }, { status: 422 });
    }
    ownerId = seller.userId;
  } else {
    const activeSeller = await getActiveSeller();
    if (!activeSeller.user || !activeSeller.seller) {
      return NextResponse.json({ error: 'An active, verified vendor account is required.' }, { status: 403 });
    }
    ownerId = activeSeller.user.id;
    seller = activeSeller.seller;
  }

  try {
    const property = await prisma.$transaction(async (transaction) => {
      const store = await transaction.store.upsert({
        where: { vendorId: ownerId },
        update: {
          name: seller!.storeName,
          description: seller!.description,
          logoUrl: seller!.logo,
        },
        create: {
          vendorId: ownerId,
          name: seller!.storeName,
          slug: seller!.slug,
          description: seller!.description,
          logoUrl: seller!.logo,
        },
        select: { id: true },
      });

      return transaction.property.create({
        data: {
          title: input.data.title,
          description: input.data.description,
          price: new Prisma.Decimal(input.data.price),
          currency: input.data.currency,
          location: input.data.location,
          country: input.data.country,
          city: input.data.city,
          images: input.data.images,
          status: input.data.status,
          type: input.data.type,
          attributes: input.data.attributes,
          isPublished: input.data.isPublished,
          userId: ownerId,
          storeId: store.id,
        },
      });
    });

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'The vendor store slug is already in use.' }, { status: 409 });
    }
    console.error('Property creation failed:', error);
    return NextResponse.json({ error: 'Unable to create the property.' }, { status: 500 });
  }
}
