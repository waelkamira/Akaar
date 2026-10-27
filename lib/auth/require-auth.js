import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';

/**
 * Resolve the signed-in identity from the server session and re-check the
 * account status/role in the database. Never trust a userId or role sent by a client.
 */
export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, status: true },
  });

  if (!user || user.status !== 'ACTIVE') return null;
  return user;
}

export async function getAdminUser() {
  const user = await getAuthenticatedUser();
  return user?.role === 'ADMIN' ? user : null;
}
