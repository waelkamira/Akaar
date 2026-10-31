import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isControlPanelAdminEmail } from '@/lib/auth/control-panel-access.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });
  if (id === admin.id) return NextResponse.json({ error: 'لا يمكنك حذف حسابك الحالي.' }, { status: 409 });

  try {
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true },
      });
      if (!user) throw new Error('ADMIN_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(user.email)) throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');

      if (user.role === 'ADMIN') {
        const remainingAdmins = await transaction.user.count({
          where: { role: 'ADMIN', status: 'ACTIVE', id: { not: id } },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }

      await transaction.product.deleteMany({ where: { userId: id } });
      await transaction.user.delete({ where: { id } });
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
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const role = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? (payload as Record<string, unknown>).role
    : undefined;
  if (role !== 'GUEST' && role !== 'CUSTOMER' && role !== 'SELLER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'دور المستخدم غير صالح.' }, { status: 400 });
  }
  if (id === admin.id) return NextResponse.json({ error: 'لا يمكنك تغيير دور حسابك الحالي.' }, { status: 409 });

  try {
    const updatedUser = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true, status: true },
      });
      if (!user) throw new Error('ADMIN_USER_NOT_FOUND');
      if (isControlPanelAdminEmail(user.email) && role !== 'ADMIN') {
        throw new Error('PROTECTED_CONTROL_PANEL_ADMIN');
      }

      if (user.role === 'ADMIN' && role !== 'ADMIN' && user.status === 'ACTIVE') {
        const remainingAdmins = await transaction.user.count({
          where: { role: 'ADMIN', status: 'ACTIVE', id: { not: id } },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }

      return transaction.user.update({
        where: { id },
        data: { role },
        select: { id: true, role: true },
      });
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
      return NextResponse.json({ error: 'لا يمكن إزالة دور آخر مدير نشط.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت بيانات المستخدم أثناء التحديث. أعد المحاولة.' }, { status: 409 });
    }
    console.error('Admin user role update failed:', error);
    return NextResponse.json({ error: 'تعذر تحديث دور المستخدم.' }, { status: 500 });
  }
}
