import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { isBuiltInPlatformRoleName } from '@/lib/auth/control-panel-permissions.mjs';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { parseControlPanelRoleName, parseControlPanelRolePermissions } from '@/lib/admin/control-panel-role-validation.mjs';
import { getEditableControlPanelRole, saveControlPanelRolePermissions } from '@/lib/admin/control-panel-role-repository';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف الدور غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const name = parseControlPanelRoleName(parsed.value.name);
  const permissions = parseControlPanelRolePermissions(parsed.value.permissions);
  if (!name || !permissions) return NextResponse.json({ error: 'اسم الدور أو قائمة الصلاحيات غير صالحة.' }, { status: 400 });

  try {
    const role = await prisma.$transaction(async (transaction) => {
      const current = await getEditableControlPanelRole(transaction, id);

      const updated = await transaction.role.update({
        where: { id },
        data: { name },
        select: { id: true, name: true },
      });
      await saveControlPanelRolePermissions(transaction, id, permissions);
      return { ...updated, assignmentCount: current._count.assignments };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ role: { ...role, permissions, editable: true } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_NOT_FOUND') {
      return NextResponse.json({ error: 'الدور غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_PROTECTED') {
      return NextResponse.json({ error: 'لا يمكن تعديل دور أساسي أو دور مرتبط بموظفي المتاجر.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'يوجد دور بهذا الاسم بالفعل.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت الأدوار بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to update control panel role:', error);
    return NextResponse.json({ error: 'تعذر تحديث الدور.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف الدور غير صالح.' }, { status: 400 });
  try {
    await prisma.$transaction(async (transaction) => {
      const role = await transaction.role.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: { select: { assignments: true, sellerStaff: true } },
        },
      });
      if (!role) throw new Error('CONTROL_PANEL_ROLE_NOT_FOUND');
      if (isBuiltInPlatformRoleName(role.name) || role._count.assignments > 0 || role._count.sellerStaff > 0) {
        throw new Error('CONTROL_PANEL_ROLE_IN_USE');
      }
      await transaction.role.delete({ where: { id } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_NOT_FOUND') {
      return NextResponse.json({ error: 'الدور غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_IN_USE') {
      return NextResponse.json({ error: 'لا يمكن حذف دور أساسي أو دور مرتبط بمستخدمين أو موظفي متاجر.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت الأدوار بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to delete control panel role:', error);
    return NextResponse.json({ error: 'تعذر حذف الدور.' }, { status: 500 });
  }
}
