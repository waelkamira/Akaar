import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as { status?: unknown };

  if (body.status !== 'ACTIVE' && body.status !== 'REJECTED') {
    return NextResponse.json({ error: 'حالة البائع غير صالحة.' }, { status: 400 });
  }

  try {
    const seller = await prisma.seller.findFirst({
      where: { id, status: 'PENDING' },
      select: { id: true, userId: true },
    });
    if (!seller) {
      return NextResponse.json({ error: 'طلب البائع غير موجود أو تمت مراجعته.' }, { status: 404 });
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.seller.update({
        where: { id },
        data: { status: body.status, isVerified: body.status === 'ACTIVE' },
      });
      if (body.status === 'ACTIVE') {
        await transaction.user.update({ where: { id: seller.userId }, data: { role: 'SELLER' } });
      }
    });

    return NextResponse.json({ id, status: body.status });
  } catch (error) {
    console.error('Unable to review seller application:', error);
    return NextResponse.json({ error: 'تعذرت مراجعة طلب البائع.' }, { status: 500 });
  }
}
