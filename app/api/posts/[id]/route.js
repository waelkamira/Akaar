import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { deleteProductAction } from '@/lib/api/delete-product-action.mjs';
import { publicProductWhere } from '@/lib/api/public-product-where.mjs';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';
import { isValidListingIdentifier } from '@/lib/api/listing-identifier-validation.mjs';

export async function GET(req, { params }) {
  const rateLimit = await consumeDurableRateLimit({ request: req, scope: 'seller-listing-detail', limit: 60, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return Response.json({ error: status === 429 ? 'تم تجاوز حد طلبات إعلانات البائعين. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' }, { status, headers });
  }


  const { id } = await params;
  const url = new URL(req.url);
  const { page, limit, skip } = getPagination(url.searchParams, {
    defaultPage: 1,
    defaultLimit: 5,
    maxLimit: 50,
  });

  try {
    if (!isValidListingIdentifier(id)) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير معرف المستخدم' }),
        { status: 400 }
      );
    }

    if (!prisma?.product) {
      throw new Error('جدول product غير موجود.');
    }

    const where = publicProductWhere({ userId: id });
    const totalCount = await prisma.product.count({ where });
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return new Response(
        JSON.stringify({ message: 'لم يتم العثور على إعلانات' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'لم يتم العثور على إعلانات' }),
        { status: 404 }
      );
    }

    const result = {
      hasMore: skip + products.length < totalCount,
      count: totalCount,
      data: products,
      meta: { cached: false, source: 'database' },
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ error: 'تعذر تحميل الإعلانات حاليًا' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: productId } = await params;
    if (!isValidListingIdentifier(productId)) {
      return new Response(JSON.stringify({ error: 'A valid product ID is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const authenticatedUser = await getAuthenticatedUser();
    const result = await deleteProductAction({
      productId,
      authenticatedUser,
      prisma,
    });
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
