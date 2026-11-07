import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function getSellerAccount() {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, seller: null };

  const seller = await prisma.seller.findUnique({
    where: { userId: user.id },
  });

  return { user, seller };
}

export async function getActiveSeller(requiredPermission?: string) {
  const account = await getSellerAccount();
  if (
    account.user?.role === 'SELLER' &&
    account.seller?.status === 'ACTIVE' &&
    account.seller.isVerified
  ) {
    return account;
  }

  if (!requiredPermission || !account.user) return { user: account.user, seller: null };

  const membership = await prisma.sellerStaff.findFirst({
    where: {
      userId: account.user.id,
      acceptedAt: { not: null },
      revokedAt: null,
      seller: { is: { status: 'ACTIVE', isVerified: true } },
      role: {
        is: {
          permissions: { some: { permission: { is: { name: requiredPermission } } } },
        },
      },
    },
    include: {
      seller: true,
      role: { include: { permissions: { include: { permission: { select: { name: true } } } } } },
    },
    orderBy: { acceptedAt: 'asc' },
  });
  if (!membership) return { user: account.user, seller: null };

  return { user: account.user, seller: membership.seller };
}
