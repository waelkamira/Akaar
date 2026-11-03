import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { isControlPanelAdmin } from './control-panel-access.mjs';
import {
  CONTROL_PANEL_PERMISSION_NAMES,
  hasControlPanelPermission,
} from './control-panel-permissions.mjs';
import { getPlatformRole } from './roles.mjs';

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
    select: {
      id: true,
      email: true,
      userName: true,
      imageUrl: true,
      status: true,
      roles: {
        where: { scopeType: 'PLATFORM', scopeId: null },
        select: { role: { select: { name: true } } },
      },
    },
  });

  if (!user || user.status !== 'ACTIVE') return null;
  const { roles, ...profile } = user;
  return { ...profile, role: getPlatformRole(roles) };
}

export async function getAdminUser() {
  const user = await getAuthenticatedUser();
  return user?.role === 'ADMIN' ? user : null;
}

export async function getControlPanelPermissions(userId) {
  const assignments = await prisma.userRoleAssignment.findMany({
    where: { userId, scopeType: 'PLATFORM', scopeId: null },
    select: {
      role: {
        select: {
          permissions: {
            select: { permission: { select: { name: true } } },
          },
        },
      },
    },
  });
  const allowedPermissions = new Set(CONTROL_PANEL_PERMISSION_NAMES);
  return [...new Set(assignments.flatMap((assignment) =>
    assignment.role.permissions
      .map(({ permission }) => permission.name)
      .filter((name) => allowedPermissions.has(name)),
  ))];
}

export async function getControlPanelAdmin(requiredPermission) {
  const user = await getAuthenticatedUser();
  if (!user) return null;
  if (isControlPanelAdmin(user)) {
    return { ...user, permissions: CONTROL_PANEL_PERMISSION_NAMES };
  }

  const permissions = await getControlPanelPermissions(user.id);
  if (!hasControlPanelPermission(permissions, requiredPermission)) return null;
  return { ...user, permissions };
}
