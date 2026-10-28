import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidListingIdentifier } from '@/lib/api/listing-identifier-validation.mjs';

export async function POST(request) {
  const rateLimit = await consumeDurableRateLimit({ request, scope: 'product-detail', limit: 120, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json({ error: status === 429 ? 'تم تجاوز حد طلبات تفاصيل المنتج. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' }, { status, headers });
  }


  const parsedBody = await readJsonBody(request, 8 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  }
  const body = parsedBody.value;

  const id = body?.id;
  if (!isValidListingIdentifier(id, 100)) {
    return NextResponse.json({ error: 'A valid product ID is required.' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false, isActive: true, approvalStatus: 'APPROVED', category: { isActive: true } },
      include: {
        user: { select: { id: true, userName: true, userImage: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product detail lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load product details.' }, { status: 500 });
  }
}
