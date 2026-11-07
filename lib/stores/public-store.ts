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
      contactEmail: true,
      contactPhone: true,
      pages: {
        where: { isPublished: true },
        select: { slug: true, title: true, content: true },
        orderBy: { updatedAt: 'desc' },
      },
      seller: { select: { id: true, displayName: true } },
    },
  });
}
