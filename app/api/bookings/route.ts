import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

const requestSchema = z.object({
  propertyId: z.string().uuid(),
  idempotencyKey: z.string().uuid(),
});

const referenceFee = new Prisma.Decimal('1.00');

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (user.role !== 'CUSTOMER') return NextResponse.json({ error: 'Buyer accounts are required to request a booking.' }, { status: 403 });

  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'property-booking',
    limit: 5,
    windowMs: 60_000,
    identity: user.id,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    return NextResponse.json({ error: status === 429 ? 'Too many booking requests. Try again shortly.' : 'Booking protection is temporarily unavailable.' }, { status });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Booking request is invalid.', details: parsed.error.flatten() }, { status: 400 });
  }

  const { propertyId, idempotencyKey } = parsed.data;
  try {
    const result = await prisma.$transaction(async (transaction) => {
      const existingKey = await transaction.bookingRequest.findUnique({
        where: { idempotencyKey },
      });
      if (existingKey) {
        if (existingKey.propertyId !== propertyId) throw new Error('IDEMPOTENCY_KEY_REUSED');
        return { booking: existingKey, reused: true };
      }

      const pending = await transaction.bookingRequest.findFirst({
        where: { userId: user.id, propertyId, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      });
      if (pending) return { booking: pending, reused: true };

      const property = await transaction.property.findUnique({
        where: { id: propertyId },
        select: { id: true, price: true, currency: true, status: true, isPublished: true },
      });
      if (!property || !property.isPublished) throw new Error('PROPERTY_NOT_FOUND');
      if (property.status !== 'AVAILABLE') throw new Error('PROPERTY_UNAVAILABLE');

      const reservation = await transaction.property.updateMany({
        where: { id: propertyId, isPublished: true, status: 'AVAILABLE' },
        data: { status: 'RESERVED' },
      });
      if (reservation.count !== 1) throw new Error('PROPERTY_UNAVAILABLE');

      const booking = await transaction.bookingRequest.create({
        data: {
          idempotencyKey,
          userId: user.id,
          propertyId,
          quotedPrice: property.price,
          currency: property.currency,
          feeAmount: referenceFee,
          status: 'PENDING',
        },
      });
      return { booking, reused: false };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({
      booking: result.booking,
      reused: result.reused,
      simulated: true,
      paymentProcessed: false,
    }, { status: result.reused ? 200 : 201, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'IDEMPOTENCY_KEY_REUSED') {
      return NextResponse.json({ error: 'This request key has already been used for a different property.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'PROPERTY_NOT_FOUND') {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'PROPERTY_UNAVAILABLE') {
      return NextResponse.json({ error: 'This property is no longer available for booking.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'Booking state changed concurrently. Please retry.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existing = await prisma.bookingRequest.findUnique({ where: { idempotencyKey } });
      if (existing?.propertyId === propertyId && existing.userId === user.id) {
        return NextResponse.json({
          booking: existing,
          reused: true,
          simulated: true,
          paymentProcessed: false,
        }, { headers: { 'Cache-Control': 'private, no-store' } });
      }
      return NextResponse.json({ error: 'This booking request key has already been used.' }, { status: 409 });
    }
    console.error('Property booking request failed:', error);
    return NextResponse.json({ error: 'Unable to submit the booking request.' }, { status: 500 });
  }
}
