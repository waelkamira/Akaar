import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';
const RETURN_WINDOW_DAYS = 30;
const ACTIVE_RETURN_STATUSES = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED'];

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض طلبات الإرجاع.' }, { status: 401 });
  try {
    const returns = await prisma.return.findMany({
      where: { order: { userId: user.id } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, orderId: true, reason: true, status: true, refundAmount: true, createdAt: true,
        order: { select: { totalPrice: true, status: true, createdAt: true, updatedAt: true } },
      },
      take: 100,
    });
    return NextResponse.json({ returns }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load return requests:', error);
    return NextResponse.json({ error: 'تعذر تحميل طلبات الإرجاع.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لطلب الإرجاع.' }, { status: 401 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات طلب الإرجاع غير صالحة.' }, { status: 400 });

  const orderId = typeof parsed.value.orderId === 'string' ? parsed.value.orderId.trim() : '';
  const reason = typeof parsed.value.reason === 'string' ? parsed.value.reason.trim() : '';
  if (!orderId || orderId.length > 128 || reason.length < 10 || reason.length > 2000) {
    return NextResponse.json({ error: 'حدد الطلب واكتب سببًا واضحًا بين 10 و2000 حرف.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId: user.id },
        select: { id: true, status: true, updatedAt: true, totalPrice: true },
      });
      if (!order) return { error: 'الطلب غير موجود في حسابك.', status: 404 as const };
      if (order.status !== 'DELIVERED') return { error: 'يمكن طلب الإرجاع بعد تسليم الطلب فقط.', status: 409 as const };
      const returnDeadline = new Date(order.updatedAt);
      returnDeadline.setDate(returnDeadline.getDate() + RETURN_WINDOW_DAYS);
      if (returnDeadline < new Date()) return { error: 'انتهت مهلة الإرجاع البالغة 30 يومًا من تاريخ التسليم المسجل.', status: 409 as const };

      const existing = await tx.return.findFirst({
        where: { orderId, status: { in: ACTIVE_RETURN_STATUSES } },
        select: { id: true },
      });
      if (existing) return { error: 'يوجد طلب إرجاع قيد المعالجة لهذا الطلب بالفعل.', status: 409 as const };

      const created = await tx.return.create({
        data: { orderId, reason, status: 'REQUESTED' },
        select: { id: true, orderId: true, reason: true, status: true, createdAt: true },
      });
      await tx.notification.create({
        data: { userId: user.id, type: 'RETURN_REQUESTED', message: `تم استلام طلب الإرجاع للطلب ${orderId}، وسيتم مراجعته.` },
      });
      return { returnRequest: created };
    });
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Unable to create return request:', error);
    return NextResponse.json({ error: 'تعذر إنشاء طلب الإرجاع.' }, { status: 500 });
  }
}
