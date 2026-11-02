import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isValidListingIdentifier } from '@/lib/api/listing-identifier-validation.mjs';
import { getProductRatingSummaries } from '@/lib/reviews/ratings';

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
  const language = typeof body?.language === 'string' && /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/i.test(body.language.trim())
    ? body.language.trim().slice(0, 16)
    : '';
  if (!isValidListingIdentifier(id, 100)) {
    return NextResponse.json({ error: 'A valid product ID is required.' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        id,
        isDeleted: false,
        isActive: true,
        approvalStatus: 'APPROVED',
        category: { isActive: true },
        OR: [
          { sellerId: null },
          { seller: { is: { status: 'ACTIVE', isVerified: true } } },
        ],
      },
      select: {
        id: true,
        title: true,
        userId: true,
        sellerId: true,
        userImage: true,
        userName: true,
        categoryId: true,
        categoryName: true,
        images: true,
        basePrice: true,
        adCategory: true,
        city: true,
        town: true,
        phoneNumber: true,
        lng: true,
        lat: true,
        link: true,
        details: true,
        description: true,
        stockQuantity: true,
        salesCount: true,
        createdAt: true,
        user: { select: { id: true, userName: true, userImage: true } },
        seller: { select: { id: true, storeName: true, slug: true } },
        ...(language ? { translations: { where: { language }, take: 1, select: { title: true, description: true } } } : {}),
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const ratings = await getProductRatingSummaries([product.id]);
    return NextResponse.json({
      ...product,
      ...(product.translations?.[0] ? {
        title: product.translations[0].title,
        description: product.translations[0].description ?? product.description,
      } : {}),
      image1: product.images[0] || null,
      image2: product.images[1] || null,
      image3: product.images[2] || null,
      image4: product.images[3] || null,
      image5: product.images[4] || null,
      averageRating: ratings.get(product.id)?.average ?? null,
      reviewCount: ratings.get(product.id)?.count ?? 0,
    });
  } catch (error) {
    console.error('Product detail lookup failed:', error);
    return NextResponse.json({ error: 'Unable to load product details.' }, { status: 500 });
  }
}
