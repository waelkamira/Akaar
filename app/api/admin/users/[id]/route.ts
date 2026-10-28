import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المستخدم غير صالح.' }, { status: 400 });
  if (id === admin.id) return NextResponse.json({ error: 'لا يمكنك حذف حسابك الحالي.' }, { status: 409 });

  try {
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });
      if (!user) throw new Error('ADMIN_USER_NOT_FOUND');

      if (user.role === 'ADMIN') {
        const remainingAdmins = await transaction.user.count({
          where: { role: 'ADMIN', status: 'ACTIVE', id: { not: id } },
        });
        if (remainingAdmins === 0) throw new Error('LAST_ACTIVE_ADMIN');
      }

      const [orders, payments, vendorOrders, productOrderItems] = await Promise.all([
        transaction.order.count({ where: { userId: id } }),
        transaction.payment.count({ where: { userId: id } }),
        transaction.vendorOrder.count({ where: { seller: { userId: id } } }),
        transaction.orderItem.count({ where: { product: { userId: id } } }),
      ]);
      if (orders || payments || vendorOrders || productOrderItems) {
        throw new Error('USER_HAS_FINANCIAL_HISTORY');
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
    if (error instanceof Error && error.message === 'USER_HAS_FINANCIAL_HISTORY') {
      return NextResponse.json({
        error: 'لا يمكن حذف مستخدم لديه طلبات أو مدفوعات أو شحنات محفوظة. عطّل الحساب بدلًا من حذف سجلاته المالية.',
      }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت بيانات المستخدم أثناء الحذف. أعد المحاولة.' }, { status: 409 });
    }
    console.error('Admin user deletion failed:', error);
    return NextResponse.json({ error: 'تعذر حذف المستخدم.' }, { status: 500 });
  }
}
