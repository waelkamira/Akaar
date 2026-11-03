import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';
import { getEditableControlPanelRole } from '@/lib/admin/control-panel-role-repository';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isManagedRoleError(error: unknown): error is Error {
  return error instanceof Error && [
    'CONTROL_PANEL_ROLE_NOT_FOUND',
    'CONTROL_PANEL_ROLE_PROTECTED',
  ].includes(error.message);
}

function roleErrorResponse(error: Error) {
  if (error.message === 'CONTROL_PANEL_ROLE_NOT_FOUND') {
    return NextResponse.json({ error: 'الدور غير موجود.' }, { status: 404 });
  }
  return NextResponse.json({ error: 'لا يمكن إسناد دور أساسي أو دور مرتبط بموظفي المتاجر.' }, { status: 409 });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف الدور غير صالح.' }, { status: 400 });
  try {
    await getEditableControlPanelRole(prisma, id);
    const assignments = await prisma.userRoleAssignment.findMany({
      where: { roleId: id, scopeType: 'PLATFORM', scopeId: null },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        user: { select: { id: true, email: true, userName: true, status: true } },
      },
    });
    return NextResponse.json({
      assignments: assignments.map(({ id: assignmentId, user }) => ({ assignmentId, ...user })),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (isManagedRoleError(error)) return roleErrorResponse(error);
    console.error('Unable to load role assignments:', error);
    return NextResponse.json({ error: 'تعذر تحميل المستخدمين المسند إليهم الدور.' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.roles.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!uuidPattern.test(id)) return NextResponse.json({ error: 'معرف الدور غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const email = typeof parsed.value.email === 'string' ? parsed.value.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'البريد الإلكتروني غير صالح.' }, { status: 400 });
  }

  try {
    const assignment = await prisma.$transaction(async (transaction) => {
      await getEditableControlPanelRole(transaction, id);
      const user = await transaction.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' }, status: 'ACTIVE', deletedAt: null },
        select: { id: true, email: true, userName: true, status: true },
      });
      if (!user) throw new Error('CONTROL_PANEL_ROLE_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(user.email)) throw new Error('CONTROL_PANEL_SUPERADMIN_ASSIGNMENT_PROTECTED');

      const existing = await transaction.userRoleAssignment.findFirst({
        where: { userId: user.id, roleId: id, scopeType: 'PLATFORM', scopeId: null },
        select: { id: true },
      });
      if (existing) return { assignmentId: existing.id, ...user, created: false };

      const created = await transaction.userRoleAssignment.create({
        data: { userId: user.id, roleId: id, scopeType: 'PLATFORM' },
        select: { id: true },
      });
      return { assignmentId: created.id, ...user, created: true };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return NextResponse.json({ assignment }, { status: assignment.created ? 201 : 200 });
  } catch (error) {
    if (isManagedRoleError(error)) return roleErrorResponse(error);
    if (error instanceof Error && error.message === 'CONTROL_PANEL_ROLE_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'لم يُعثر على حساب نشط بهذا البريد.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'CONTROL_PANEL_SUPERADMIN_ASSIGNMENT_PROTECTED') {
      return NextResponse.json({ error: 'لا يمكن تعديل إسنادات حساب المشرف الأعلى.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) {
      return NextResponse.json({ error: 'تغيرت إسنادات الدور بالتزامن؛ أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to assign control panel role:', error);
    return NextResponse.json({ error: 'تعذر إسناد الدور للمستخدم.' }, { status: 500 });
  }
}
