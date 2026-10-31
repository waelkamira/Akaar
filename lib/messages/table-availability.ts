import { prisma } from '@/lib/db/prisma';

export async function isStoreMessagingAvailable() {
  const [tables] = await prisma.$queryRaw<Array<{ available: boolean }>>`
    SELECT to_regclass('public.store_conversations') IS NOT NULL
      AND to_regclass('public.store_messages') IS NOT NULL AS available
  `;
  return tables?.available === true;
}
