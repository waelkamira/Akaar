import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { isReviewTableAvailable, isStoreReviewTableAvailable } from '@/lib/admin/review-table-availability';

export type RatingSummary = {
  average: number;
  count: number;
};

export async function getProductRatingSummaries(productIds: string[]) {
  const summaries = new Map<string, RatingSummary>();
  if (!productIds.length || !(await isReviewTableAvailable())) return summaries;

  const rows = await prisma.$queryRaw<Array<{ id: string; average: number; count: number }>>`
    SELECT "productId" AS id, AVG(rating)::float8 AS average, COUNT(*)::int AS count
    FROM public.reviews
    WHERE "productId" IN (${Prisma.join(productIds)})
    GROUP BY "productId"
  `;
  for (const row of rows) summaries.set(row.id, { average: row.average, count: row.count });
  return summaries;
}

export async function getStoreRatingSummaries(sellerIds: string[]) {
  const summaries = new Map<string, RatingSummary>();
  if (!sellerIds.length || !(await isStoreReviewTableAvailable())) return summaries;

  const rows = await prisma.$queryRaw<Array<{ id: string; average: number; count: number }>>`
    SELECT "sellerId" AS id, AVG(rating)::float8 AS average, COUNT(*)::int AS count
    FROM public.store_reviews
    WHERE "sellerId" IN (${Prisma.join(sellerIds)})
    GROUP BY "sellerId"
  `;
  for (const row of rows) summaries.set(row.id, { average: row.average, count: row.count });
  return summaries;
}
