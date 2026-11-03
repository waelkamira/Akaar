import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminUser } from '@/lib/auth/require-auth';
import { assignPlatformRole } from '@/lib/auth/roles.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'معرف البائع غير صالح.' }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const status = (payload as { status?: unknown }).status;
  if (status !== 'ACTIVE' && status !== 'REJECTED') {
    return NextResponse.json({ error: 'حالة البائع غير صالحة.' }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const seller = await transaction.seller.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          displayName: true,
          status: true,
          user: { select: { status: true } },
        },
      });
      if (!seller || seller.status !== 'PENDING') throw new Error('SELLER_APPLICATION_NOT_PENDING');
      if (seller.user.status !== 'ACTIVE') throw new Error('SELLER_USER_NOT_ACTIVE');

      const now = new Date();
      const verification = await transaction.sellerVerification.findFirst({
        where: { sellerId: id, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
        orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
        select: { id: true },
      });
      if (status === 'ACTIVE' && !verification) throw new Error('SELLER_VERIFICATION_NOT_FOUND');

      await transaction.seller.update({
        where: { id },
        data: { status, isVerified: status === 'ACTIVE' },
      });
      await transaction.store.updateMany({
        where: { sellerId: id },
        data: { isActive: status === 'ACTIVE' },
      });

      if (verification) {
        await transaction.sellerVerification.update({
          where: { id: verification.id },
          data: {
            status: status === 'ACTIVE' ? 'APPROVED' : 'REJECTED',
            reviewerId: admin.id,
            reviewedAt: now,
          },
        });
        await transaction.sellerDocument.updateMany({
          where: { verificationId: verification.id, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
          data: { status: status === 'ACTIVE' ? 'APPROVED' : 'REJECTED' },
        });
      }

      if (status === 'ACTIVE') await assignPlatformRole(transaction, seller.userId, 'SELLER');
      await transaction.notification.create({
        data: {
          userId: seller.userId,
          type: status === 'ACTIVE' ? 'STORE_APPROVED' : 'STORE_REJECTED',
          message: status === 'ACTIVE'
            ? `تمت الموافقة على طلب فتح متجر "${seller.displayName}". يمكنك الآن بدء نشر منتجاتك.`
            : `نعتذر، لم تتم الموافقة على طلب فتح متجر "${seller.displayName}". يمكنك التواصل مع الدعم لمزيد من المعلومات.`,
        },
      });

      return { id, status };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'SELLER_APPLICATION_NOT_PENDING') {
      return NextResponse.json({ error: 'طلب البائع غير موجود أو تمت مراجعته.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'SELLER_USER_NOT_ACTIVE') {
      return NextResponse.json({ error: 'لا يمكن اعتماد طلب مرتبط بحساب غير نشط.' }, { status: 409 });
    }
    if (error instanceof Error && error.message === 'SELLER_VERIFICATION_NOT_FOUND') {
      return NextResponse.json({ error: 'ملف التحقق غير موجود ولا يمكن اعتماد الطلب.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
      return NextResponse.json({ error: 'تغيرت حالة طلب البائع أثناء المراجعة. أعد المحاولة.' }, { status: 409 });
    }
    console.error('Unable to review seller application:', error);
    return NextResponse.json({ error: 'تعذرت مراجعة طلب البائع.' }, { status: 500 });
  }
}
