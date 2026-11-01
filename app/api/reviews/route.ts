import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { parseReviewSubmission } from '@/lib/api/review-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { isReviewTableAvailable, isStoreReviewTableAvailable } from '@/lib/admin/review-table-availability';

type ReviewTargetType = 'product' | 'store';

function parseTarget(type: string | null, id: string | null): { type: ReviewTargetType; id: string } | null {
  if ((type !== 'product' && type !== 'store') || !id || id.length > 128) return null;
  return { type, id };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = parseTarget(searchParams.get('type'), searchParams.get('id'));
  if (!target) return NextResponse.json({ error: 'وجهة التقييم غير صالحة.' }, { status: 400 });

  const user = await getAuthenticatedUser();
  try {
    if (target.type === 'product') {
      if (!(await isReviewTableAvailable())) {
        return NextResponse.json({ error: 'تقييمات المنتجات غير متاحة حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
      }
      const product = await prisma.product.findFirst({
        where: { id: target.id, isDeleted: false, isActive: true, approvalStatus: 'APPROVED' },
        select: { id: true, userId: true },
      });
      if (!product) return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });

      const [summary, reviews, ownReview] = await Promise.all([
        prisma.$queryRaw<Array<{ average: number; count: number }>>`
          SELECT COALESCE(AVG(rating), 0)::float8 AS average, COUNT(*)::int AS count
          FROM public.reviews WHERE "productId" = ${target.id}
        `,
        prisma.$queryRaw<Array<{ id: string; rating: number; comment: string | null; createdAt: Date; userName: string | null }>>`
          SELECT r.id, r.rating, r.comment, r."createdAt", u."userName"
          FROM public.reviews r JOIN public.users u ON u.id = r."userId"
          WHERE r."productId" = ${target.id}
          ORDER BY r."createdAt" DESC
          LIMIT 20
        `,
        user ? prisma.$queryRaw<Array<{ rating: number; comment: string | null }>>`
          SELECT rating, comment FROM public.reviews
          WHERE "productId" = ${target.id} AND "userId" = ${user.id}
          LIMIT 1
        ` : Promise.resolve([]),
      ]);
      const rating = summary[0] || { average: 0, count: 0 };
      return NextResponse.json({
        average: rating.average,
        count: rating.count,
        reviews,
        ownReview: ownReview[0] || null,
        isAuthenticated: Boolean(user),
        canReview: Boolean(user && user.id !== product.userId),
      }, { headers: { 'Cache-Control': 'private, no-store' } });
    }

    if (!(await isStoreReviewTableAvailable())) {
      return NextResponse.json({ error: 'تقييمات المتاجر غير متاحة حتى يتم تطبيق ترحيل قاعدة البيانات.' }, { status: 503 });
    }
    const seller = await prisma.seller.findFirst({
      where: { id: target.id, status: 'ACTIVE', isVerified: true },
      select: { id: true, userId: true },
    });
    if (!seller) return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });

    const [summary, reviews, ownReview] = await Promise.all([
      prisma.$queryRaw<Array<{ average: number; count: number }>>`
        SELECT COALESCE(AVG(rating), 0)::float8 AS average, COUNT(*)::int AS count
        FROM public.store_reviews WHERE "sellerId" = ${target.id}
      `,
      prisma.$queryRaw<Array<{ id: string; rating: number; comment: string | null; createdAt: Date; userName: string | null }>>`
        SELECT r.id, r.rating, r.comment, r."createdAt", u."userName"
        FROM public.store_reviews r JOIN public.users u ON u.id = r."userId"
        WHERE r."sellerId" = ${target.id}
        ORDER BY r."createdAt" DESC
        LIMIT 20
      `,
      user ? prisma.$queryRaw<Array<{ rating: number; comment: string | null }>>`
        SELECT rating, comment FROM public.store_reviews
        WHERE "sellerId" = ${target.id} AND "userId" = ${user.id}
        LIMIT 1
      ` : Promise.resolve([]),
    ]);
    const rating = summary[0] || { average: 0, count: 0 };
    return NextResponse.json({
      average: rating.average,
      count: rating.count,
      reviews,
      ownReview: ownReview[0] || null,
      isAuthenticated: Boolean(user),
      canReview: Boolean(user && user.id !== seller.userId),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load reviews:', error);
    return NextResponse.json({ error: 'تعذر تحميل التقييمات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإضافة تقييم.' }, { status: 401 });

  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'review-write',
    limit: 10,
    windowMs: 10 * 60_000,
    identity: user.id,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds
      ? { 'Retry-After': String(rateLimit.retryAfterSeconds) }
      : undefined;
    return NextResponse.json(
      { error: status === 429 ? 'تجاوزت الحد المسموح لإرسال التقييمات. حاول لاحقًا.' : 'خدمة الحماية غير متاحة حاليًا.' },
      { status, headers },
    );
  }

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.error },
      { status: parsedBody.status },
    );
  }
  const submission = parseReviewSubmission(parsedBody.value);
  if (!submission) return NextResponse.json({ error: 'تحقق من نوع التقييم والنجوم والتعليق.' }, { status: 400 });

  try {
    const isProduct = submission.targetType === 'product';
    const reviewTableAvailable = isProduct ? await isReviewTableAvailable() : await isStoreReviewTableAvailable();
    if (!reviewTableAvailable) {
      return NextResponse.json({ error: 'نظام التقييم غير متاح حتى يتم تجهيز قاعدة البيانات.' }, { status: 503 });
    }

    const ownerId = isProduct
      ? (await prisma.product.findFirst({
          where: { id: submission.targetId, isDeleted: false, isActive: true, approvalStatus: 'APPROVED' },
          select: { userId: true },
        }))?.userId
      : (await prisma.seller.findFirst({
          where: { id: submission.targetId, status: 'ACTIVE', isVerified: true },
          select: { userId: true },
        }))?.userId;
    if (!ownerId) return NextResponse.json({ error: 'المنتج أو المتجر غير موجود.' }, { status: 404 });
    if (ownerId === user.id) return NextResponse.json({ error: 'لا يمكنك تقييم منتجك أو متجرك.' }, { status: 403 });

    const id = randomUUID();
    const savedReview = isProduct
      ? await prisma.$queryRaw<Array<{ id: string; rating: number; comment: string | null; createdAt: Date }>>`
          INSERT INTO public.reviews ("id", "userId", "productId", "rating", "comment", "createdAt")
          VALUES (${id}, ${user.id}, ${submission.targetId}, ${submission.rating}, ${submission.comment}, NOW())
          ON CONFLICT ("userId", "productId")
          DO UPDATE SET "rating" = EXCLUDED."rating", "comment" = EXCLUDED."comment", "createdAt" = NOW()
          RETURNING id, rating, comment, "createdAt"
        `
      : await prisma.$queryRaw<Array<{ id: string; rating: number; comment: string | null; createdAt: Date }>>`
          INSERT INTO public.store_reviews ("id", "userId", "sellerId", "rating", "comment", "createdAt")
          VALUES (${id}, ${user.id}, ${submission.targetId}, ${submission.rating}, ${submission.comment}, NOW())
          ON CONFLICT ("userId", "sellerId")
          DO UPDATE SET "rating" = EXCLUDED."rating", "comment" = EXCLUDED."comment", "createdAt" = NOW()
          RETURNING id, rating, comment, "createdAt"
        `;

    return NextResponse.json({ review: savedReview[0] }, { status: 200 });
  } catch (error) {
    console.error('Unable to save review:', error);
    return NextResponse.json({ error: 'تعذر حفظ التقييم.' }, { status: 500 });
  }
}
