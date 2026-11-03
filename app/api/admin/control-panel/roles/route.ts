import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { CONTROL_PANEL_PERMISSION_CATALOG, isBuiltInPlatformRoleName } from '@/lib/auth/control-panel-permissions.mjs';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { parseControlPanelRoleName, parseControlPanelRolePermissions } from '@/lib/admin/control-panel-role-validation.mjs';
import { saveControlPanelRolePermissions } from '@/lib/admin/control-panel-role-repository';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

function serializeRole(role: {
  id: string;
  name: string;
  permissions: Array<{ permission: { name: string } }>;
  _count: { assignments: number; sellerStaff: number };
}) {
  return {
    id: role.id,
    name: role.name,
    permissions: role.permissions.map(({ permission }) => permission.name),
    assignmentCount: role._count.assignments,
    editable: !isBuiltInPlatformRoleName(role.name) && role._count.sellerStaff === 0,
  };
}

export async function GET() {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  try {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        permissions: { select: { permission: { select: { name: true } } } },
        _count: { select: { assignments: true, sellerStaff: true } },
      },
    });
    return NextResponse.json({
      roles: roles.map(serializeRole),
      permissions: CONTROL_PANEL_PERMISSION_CATALOG,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel roles:', error);
    return NextResponse.json({ error: 'تعذر تحميل الأدوار والصلاحيات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const name = parseControlPanelRoleName(parsed.value.name);
  const permissions = parseControlPanelRolePermissions(parsed.value.permissions);
  if (!name || !permissions) return NextResponse.json({ error: 'اسم الدور أو قائمة الصلاحيات غير صالحة.' }, { status: 400 });

  try {
    const role = await prisma.$transaction(async (transaction) => {
      const created = await transaction.role.create({ data: { name }, select: { id: true, name: true } });
      await saveControlPanelRolePermissions(transaction, created.id, permissions);
      return created;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({
      role: { ...role, permissions, assignmentCount: 0, editable: true },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'يوجد دور بهذا الاسم بالفعل.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت الأدوار بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to create control panel role:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الدور.' }, { status: 500 });
  }
}
