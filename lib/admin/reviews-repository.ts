import { prisma } from '@/lib/db/prisma';
import {
  isReviewTableAvailable,
  isStoreReviewTableAvailable,
  isVendorOrderTableAvailable,
} from '@/lib/admin/review-table-availability';

export async function getProductReviewsOverview() {
  const [reviewsAvailable, products] = await Promise.all([
    isReviewTableAvailable(),
    prisma.product.count({ where: { isDeleted: false } }),
  ]);
  if (!reviewsAvailable) return { reviewsAvailable, products, ratings: [], reviews: [] };

  const [ratings, reviews] = await Promise.all([
    prisma.$queryRaw<Array<{ rating: number; count: number }>>`
      SELECT rating, COUNT(*)::int AS count
      FROM public.reviews
      GROUP BY rating
      ORDER BY rating ASC
    `,
    prisma.$queryRaw<Array<{
      id: string;
      rating: number;
      comment: string | null;
      createdAt: Date;
      userName: string | null;
      email: string;
      productId: string;
      productTitle: string;
    }>>`
      SELECT r.id, r.rating, r.comment, r."createdAt",
        u."userName", u.email, p.id AS "productId", p.title AS "productTitle"
      FROM public.reviews r
      JOIN public.users u ON u.id = r."userId"
      JOIN public.products p ON p.id = r."productId"
      ORDER BY r."createdAt" DESC
      LIMIT 30
    `,
  ]);
  return { reviewsAvailable, products, ratings, reviews };
}

export async function getStoreReviewsOverview() {
  const [sellers, storeReviewsAvailable, vendorOrdersAvailable] = await Promise.all([
    prisma.seller.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 100,
      select: {
        id: true,
        storeName: true,
        status: true,
        isVerified: true,
        _count: { select: { products: true } },
      },
    }),
    isStoreReviewTableAvailable(),
    isVendorOrderTableAvailable(),
  ]);

  const [sellerOrderCounts, sellerScores, distribution, reviews] = await Promise.all([
    vendorOrdersAvailable
      ? prisma.$queryRaw<Array<{ sellerId: string; count: bigint }>>`
          SELECT "sellerId", COUNT(*)::bigint AS "count"
          FROM public."VendorOrder"
          GROUP BY "sellerId"
        `
      : Promise.resolve([]),
    storeReviewsAvailable
      ? prisma.$queryRaw<Array<{ sellerId: string; count: number; average: number }>>`
          SELECT "sellerId", COUNT(*)::int AS count, AVG(rating)::float8 AS average
          FROM public.store_reviews
          GROUP BY "sellerId"
        `
      : Promise.resolve([]),
    storeReviewsAvailable
      ? prisma.$queryRaw<Array<{ rating: number; count: number }>>`
          SELECT rating, COUNT(*)::int AS count
          FROM public.store_reviews
          GROUP BY rating
        `
      : Promise.resolve([]),
    storeReviewsAvailable
      ? prisma.$queryRaw<Array<{
          id: string;
          rating: number;
          comment: string | null;
          createdAt: Date;
          storeName: string;
          userName: string | null;
          email: string;
        }>>`
          SELECT r.id, r.rating, r.comment, r."createdAt", s."storeName", u."userName", u.email
          FROM public.store_reviews r
          JOIN public.sellers s ON s.id = r."sellerId"
          JOIN public.users u ON u.id = r."userId"
          ORDER BY r."createdAt" DESC
          LIMIT 30
        `
      : Promise.resolve([]),
  ]);
  return {
    sellers,
    storeReviewsAvailable,
    vendorOrdersAvailable,
    sellerOrderCounts,
    sellerScores,
    distribution,
    reviews,
  };
}
