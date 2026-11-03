import { prisma } from '@/lib/db/prisma';

export function findPublicProductMetadata(id: string) {
  return prisma.product.findFirst({
    where: {
      id,
      isActive: true,
      isDeleted: false,
      approvalStatus: 'APPROVED',
      category: { isActive: true },
      OR: [
        { sellerId: null },
        { seller: { is: { status: 'ACTIVE', isVerified: true } } },
      ],
    },
    select: {
      title: true,
      description: true,
      categoryName: true,
      images: true,
    },
  });
}
