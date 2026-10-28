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

export async function getActiveSeller() {
  const account = await getSellerAccount();
  if (
    account.user?.role !== 'SELLER' ||
    !account.seller ||
    account.seller.status !== 'ACTIVE' ||
    !account.seller.isVerified
  ) {
    return { user: account.user, seller: null };
  }

  return account;
}
