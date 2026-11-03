const platformRoles = ['ADMIN', 'SELLER', 'CUSTOMER'];

export function getPlatformRole(assignments = []) {
  const names = new Set(assignments.map((assignment) => assignment.role?.name));
  return platformRoles.find((role) => names.has(role)) || 'CUSTOMER';
}

export async function assignPlatformRole(transaction, userId, roleName) {
  const role = await transaction.role.upsert({
    where: { name: roleName },
    update: {},
    create: { name: roleName },
    select: { id: true },
  });
  const existing = await transaction.userRoleAssignment.findFirst({
    where: { userId, roleId: role.id, scopeType: 'PLATFORM', scopeId: null },
    select: { id: true },
  });
  if (!existing) {
    await transaction.userRoleAssignment.create({
      data: { userId, roleId: role.id, scopeType: 'PLATFORM' },
    });
  }
}

export async function removePlatformRole(transaction, userId, roleName) {
  const role = await transaction.role.findUnique({
    where: { name: roleName },
    select: { id: true },
  });
  if (!role) return;
  await transaction.userRoleAssignment.deleteMany({
    where: { userId, roleId: role.id, scopeType: 'PLATFORM', scopeId: null },
  });
}

export async function replacePlatformRole(transaction, userId, roleName) {
  for (const role of platformRoles) {
    if (role !== roleName) await removePlatformRole(transaction, userId, role);
  }
  await assignPlatformRole(transaction, userId, roleName);
}
