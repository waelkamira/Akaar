import { prisma } from '@/lib/db/prisma';

export async function isReviewTableAvailable() {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.reviews') IS NOT NULL AS "exists"
  `;
  return table.exists;
}

export async function isStoreReviewTableAvailable() {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.store_reviews') IS NOT NULL AS "exists"
  `;
  return table.exists;
}

export async function isVendorOrderTableAvailable() {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public."VendorOrder"') IS NOT NULL AS "exists"
  `;
  return table.exists;
}
