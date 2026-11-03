import { prisma } from '@/lib/db/prisma';

export function findPublicStoreHeader(slug: string) {
  return prisma.store.findFirst({
    where: {
      slug,
      isActive: true,
      seller: { is: { status: 'ACTIVE', isVerified: true } },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      seller: { select: { id: true, displayName: true } },
    },
  });
}
