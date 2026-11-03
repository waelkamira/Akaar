import { Prisma } from '@prisma/client';
import { isBuiltInPlatformRoleName } from '@/lib/auth/control-panel-permissions.mjs';

export async function getEditableControlPanelRole(
  transaction: Prisma.TransactionClient,
  roleId: string,
) {
  const role = await transaction.role.findUnique({
    where: { id: roleId },
    select: {
      id: true,
      name: true,
      _count: { select: { assignments: true, sellerStaff: true } },
    },
  });
  if (!role) throw new Error('CONTROL_PANEL_ROLE_NOT_FOUND');
  if (isBuiltInPlatformRoleName(role.name) || role._count.sellerStaff > 0) {
    throw new Error('CONTROL_PANEL_ROLE_PROTECTED');
  }
  return role;
}

export async function saveControlPanelRolePermissions(
  transaction: Prisma.TransactionClient,
  roleId: string,
  names: string[],
) {
  await transaction.rolePermission.deleteMany({ where: { roleId } });
  if (!names.length) return;

  const permissions = await Promise.all(names.map((name) => transaction.permission.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { id: true },
  })));
  await transaction.rolePermission.createMany({
    data: permissions.map(({ id: permissionId }) => ({ roleId, permissionId })),
  });
}
