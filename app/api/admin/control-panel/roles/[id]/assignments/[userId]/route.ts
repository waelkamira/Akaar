import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';
import { getEditableControlPanelRole } from '@/lib/admin/control-panel-role-repository';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string; userId: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const { id, userId } = await params;
  if (!uuidPattern.test(id) || !uuidPattern.test(userId)) {
    return NextResponse.json({ error: 'معرف الدور أو المستخدم غير صالح.' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await getEditableControlPanelRole(transaction, id);
      const user = await transaction.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      if (!user) throw new Error('CONTROL_PANEL_ROLE_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(user.email)) throw new Error('CONTROL_PANEL_SUPERADMIN_ASSIGNMENT_PROTECTED');

      const result = await transaction.userRoleAssignment.deleteMany({
        where: { userId, roleId: id, scopeType: 'PLATFORM', scopeId: null },
      });
      if (!result.count) throw new Error('CONTROL_PANEL_ROLE_ASSIGNMENT_NOT_FOUND');
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ removed: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_NOT_FOUND') {
      return NextResponse.json({ error: 'الدور غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_PROTECTED') {
      return NextResponse.json({ error: 'لا يمكن إسناد دور أساسي أو دور مرتبط بموظفي المتاجر.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'المستخدم غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_ASSIGNMENT_NOT_FOUND') {
      return NextResponse.json({ error: 'إسناد الدور غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_SUPERADMIN_ASSIGNMENT_PROTECTED') {
      return NextResponse.json({ error: 'لا يمكن تعديل إسنادات حساب المشرف الأعلى.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت إسنادات الدور بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to remove control panel role assignment:', error);
    return NextResponse.json({ error: 'تعذر إزالة الدور من المستخدم.' }, { status: 500 });
  }
}
