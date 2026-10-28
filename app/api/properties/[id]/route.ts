import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { propertyPatchSchema } from '@/lib/properties/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { store: { select: { id: true, name: true, slug: true, description: true, logoUrl: true } } },
  });
  if (!property) return NextResponse.json({ error: 'Property not found.' }, { status: 404 });

  if (!property.isPublished) {
    const actor = await getAuthenticatedUser();
    if (!actor || (actor.role !== 'ADMIN' && actor.id !== property.userId)) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
  }
  return NextResponse.json({ property });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  let ownerId: string | undefined;
  if (actor.role === 'SELLER') {
    const account = await getActiveSeller();
    if (!account.seller) return NextResponse.json({ error: 'An active, verified vendor account is required.' }, { status: 403 });
    ownerId = account.user?.id;
  } else if (actor.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Vendor or admin access is required.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Request body must be an object.' }, { status: 400 });
  }
  const input = propertyPatchSchema.safeParse(payload);
  if (!input.success) {
    return NextResponse.json({ error: 'Property details are invalid.', details: input.error.flatten() }, { status: 400 });
  }
  if (Object.keys(input.data).length === 0) {
    return NextResponse.json({ error: 'At least one property field must be provided.' }, { status: 400 });
  }

  const { id } = await params;
  const data: Prisma.PropertyUpdateManyMutationInput = {};
  const patch = input.data;
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.price !== undefined) data.price = new Prisma.Decimal(patch.price);
  if (patch.currency !== undefined) data.currency = patch.currency;
  if (patch.location !== undefined) data.location = patch.location;
  if (patch.country !== undefined) data.country = patch.country;
  if (patch.city !== undefined) data.city = patch.city;
  if (patch.images !== undefined) data.images = patch.images;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.type !== undefined) data.type = patch.type;
  if (patch.attributes !== undefined) data.attributes = patch.attributes;
  if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;

  try {
    const result = await prisma.property.updateMany({
      where: { id, ...(ownerId ? { userId: ownerId } : {}) },
      data,
    });
    if (!result.count) return NextResponse.json({ error: 'Property not found or access denied.' }, { status: 404 });
    const property = await prisma.property.findUnique({ where: { id }, include: { store: true } });
    return NextResponse.json({ property });
  } catch (error) {
    console.error('Property update failed:', error);
    return NextResponse.json({ error: 'Unable to update the property.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const actor = await getAuthenticatedUser();
  if (!actor) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  let ownerId: string | undefined;
  if (actor.role === 'SELLER') {
    const account = await getActiveSeller();
    if (!account.seller) return NextResponse.json({ error: 'An active, verified vendor account is required.' }, { status: 403 });
    ownerId = account.user?.id;
  } else if (actor.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Vendor or admin access is required.' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const result = await prisma.property.deleteMany({
      where: { id, ...(ownerId ? { userId: ownerId } : {}) },
    });
    if (!result.count) return NextResponse.json({ error: 'Property not found or access denied.' }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Property deletion failed:', error);
    return NextResponse.json({ error: 'Unable to delete the property.' }, { status: 500 });
  }
}
