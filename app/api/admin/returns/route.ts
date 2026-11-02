import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const returns = await prisma.return.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true, orderId: true, reason: true, status: true, refundAmount: true, createdAt: true,
        order: { select: { totalPrice: true, status: true, customerName: true, user: { select: { id: true, email: true, userName: true } } } },
      },
    });
    return NextResponse.json({ returns }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load admin return requests:', error);
    return NextResponse.json({ error: 'تعذر تحميل طلبات الإرجاع.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات التحديث غير صالحة.' }, { status: 400 });

  const id = typeof parsed.value.id === 'string' ? parsed.value.id.trim() : '';
  const status = parsed.value.status;
  if (!id || id.length > 128 || !['UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(String(status))) {
    return NextResponse.json({ error: 'حدد طلب إرجاع وحالة مراجعة صالحة.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.return.findUnique({
        where: { id },
        select: { id: true, orderId: true, status: true, order: { select: { userId: true } } },
      });
      if (!current) return { error: 'طلب الإرجاع غير موجود.', status: 404 as const };
      const allowed: Record<string, string[]> = {
        REQUESTED: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'],
        UNDER_REVIEW: ['APPROVED', 'REJECTED'],
        APPROVED: [],
        REJECTED: [],
      };
      const nextStatus = status as 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
      if (!allowed[current.status]?.includes(nextStatus)) {
        return { error: 'لا يسمح بالانتقال من الحالة الحالية إلى الحالة المطلوبة.', status: 409 as const };
      }
      const updated = await tx.return.updateMany({
        where: { id, status: current.status },
        data: { status: nextStatus },
      });
      if (!updated.count) return { error: 'تغيرت حالة الطلب. أعد تحميل القائمة.', status: 409 as const };
      const messages = {
        UNDER_REVIEW: `بدأت مراجعة طلب الإرجاع للطلب ${current.orderId}.`,
        APPROVED: `تمت الموافقة على طلب الإرجاع للطلب ${current.orderId}. سيتم التعامل مع الاسترداد وفق وسيلة الدفع.`,
        REJECTED: `تم رفض طلب الإرجاع للطلب ${current.orderId}.`,
      };
      await tx.notification.create({
        data: { userId: current.order.userId, type: `RETURN_${nextStatus}`, message: messages[nextStatus] },
      });
      return { id, status: nextStatus };
    });
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Unable to update return request:', error);
    return NextResponse.json({ error: 'تعذر تحديث طلب الإرجاع.' }, { status: 500 });
  }
}
