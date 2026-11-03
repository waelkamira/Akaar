import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';
import { prisma } from '@/lib/db/prisma';
<<<<<<< HEAD
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
=======
import { getPlatformRole, replacePlatformRole } from '@/lib/auth/roles.mjs';
>>>>>>> wael-work-in-progress

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.users.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });
  if (id === admin.id) return NextResponse.json({ error: 'لا يمكنك حذف حسابك الحالي.' }, { status: 409 });

  try {
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          status: true,
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
        },
      });
      if (!user) throw new Error('ADMIN_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(user.email)) throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');

      if (getPlatformRole(user.roles) === 'ADMIN' && user.status === 'ACTIVE') {
        const remainingAdmins = await transaction.userRoleAssignment.count({
          where: {
            scopeType: 'PLATFORM',
            scopeId: null,
            role: { name: 'ADMIN' },
            user: { status: 'ACTIVE', id: { not: id } },
          },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }

      await transaction.user.update({ where: { id }, data: { status: 'DELETED' } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'المستخدم غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'LAST_ACTIVE_ADMIN') {
      return NextResponse.json({ error: 'لا يمكن حذف آخر مدير نشط.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'PROTECTED_CONTROL_PANEL_ADMIN') {
      return NextResponse.json({ error: 'لا يمكن حذف حساب مدير لوحة التحكم.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2003', 'P2014'].includes(error.code)) {
      return NextResponse.json({
        error: 'لا يمكن حذف المستخدم لوجود سجلات مرتبطة به أو بمحتواه. احفظ السجلات المالية وعطّل الحساب بدلًا من حذفها.',
      }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت بيانات المستخدم أثناء الحذف. أعد المحاولة.' }, { status: 409 });
    }
    console.error('Admin user deletion failed:', error);
    return NextResponse.json({ error: 'تعذر حذف المستخدم.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.users.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });

  const parsedBody = await readJsonBody(request, 16 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  const body = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? payload as Record<string, unknown>
    : {};
  const hasRole = Object.hasOwn(body, 'role');
  const hasStatus = Object.hasOwn(body, 'status');
  if (hasRole === hasStatus) {
    return NextResponse.json({ error: 'يرجى تحديد الدور أو الحالة المطلوب تحديثها.' }, { status: 400 });
  }
  const role = body.role;
  const status = body.status;
  if (hasRole && role !== 'CUSTOMER' && role !== 'SELLER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'دور المستخدم غير صالح.' }, { status: 400 });
  }
  if (hasRole && role === 'ADMIN' && !(await getControlPanelAdmin('control_panel.roles.manage'))) {
    return NextResponse.json({ error: 'صلاحية إدارة الأدوار مطلوبة لتعيين دور المدير.' }, { status: 403 });
  }
  if (hasStatus && status !== 'ACTIVE' && status !== 'SUSPENDED') {
    return NextResponse.json({ error: 'حالة المستخدم غير صالحة.' }, { status: 400 });
  }
  if (id === admin.id) return NextResponse.json({ error: 'لا يمكنك تغيير دور أو حالة حسابك الحالي.' }, { status: 409 });

  try {
    const updatedUser = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          status: true,
          roles: {
            where: { scopeType: 'PLATFORM', scopeId: null },
            select: { role: { select: { name: true } } },
          },
        },
      });
      if (!user) throw new Error('ADMIN_USER_NOT_FOUND');
      const currentRole = getPlatformRole(user.roles);
      if (isControlPanelAdminEmail(user.email)
        && ((hasRole && role !== 'ADMIN') || (hasStatus && status !== 'ACTIVE'))) {
        throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');
      }

      const removingActiveAdmin = currentRole === 'ADMIN'
        && user.status === 'ACTIVE'
        && ((hasRole && role !== 'ADMIN') || (hasStatus && status === 'SUSPENDED'));
      if (removingActiveAdmin) {
        const remainingAdmins = await transaction.userRoleAssignment.count({
          where: {
            scopeType: 'PLATFORM',
            scopeId: null,
            role: { name: 'ADMIN' },
            user: { status: 'ACTIVE', id: { not: id } },
          },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }

      if (hasRole) await replacePlatformRole(transaction, id, role as 'CUSTOMER' | 'SELLER' | 'ADMIN');
      const updated = hasStatus
        ? await transaction.user.update({
            where: { id },
            data: { status: status as 'ACTIVE' | 'SUSPENDED' },
            select: { id: true, status: true },
          })
        : { id: user.id, status: user.status };
      return { ...updated, role: hasRole ? role : currentRole };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_USER_NOT_FOUND') {
      return NextResponse.json({ error: 'المستخدم غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'PROTECTED_CONTROL_PANEL_ADMIN') {
      return NextResponse.json({ error: 'لا يمكن تغيير دور مدير لوحة التحكم.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'LAST_ACTIVE_ADMIN') {
      return NextResponse.json({ error: 'لا يمكن تغيير دور أو إيقاف آخر مدير نشط.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت بيانات المستخدم أثناء التحديث. أعد المحاولة.' }, { status: 409 });
    }
    console.error('Admin user role update failed:', error);
    return NextResponse.json({ error: 'تعذر تحديث دور المستخدم.' }, { status: 500 });
  }
}
