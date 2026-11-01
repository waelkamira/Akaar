import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isVendorOrderTableAvailable } from '@/lib/admin/review-table-availability';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type RouteContext = { params: Promise<{ id: string }> };
const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

function optionalText(value: unknown, maximum: number) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > maximum) return undefined;
  return value.trim() || null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  const parsedBody = await readJsonBody(request, 32 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const data: Prisma.SellerUpdateInput = {};

  if ('storeName' in body) {
    if (typeof body.storeName !== 'string' || !body.storeName.trim() || body.storeName.trim().length > 160) {
      return NextResponse.json({ error: 'اسم المتجر غير صالح.' }, { status: 400 });
    }
    data.storeName = body.storeName.trim();
  }
  if ('slug' in body) {
    if (typeof body.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug.trim().toLowerCase()) || body.slug.trim().length > 100) {
      return NextResponse.json({ error: 'رابط المتجر غير صالح.' }, { status: 400 });
    }
    data.slug = body.slug.trim().toLowerCase();
  }
  for (const [field, maximum] of [
    ['description', 10000],
    ['logo', 2048],
    ['contactName', 160],
    ['contactEmail', 254],
    ['phoneNumber', 40],
    ['residence', 240],
  ] as const) {
    if (field in body) {
      const value = optionalText(body[field], maximum);
      if (value === undefined) return NextResponse.json({ error: 'إحدى بيانات المتجر غير صالحة.' }, { status: 400 });
      data[field] = value;
    }
  }
  if (typeof data.contactEmail === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    return NextResponse.json({ error: 'البريد الإلكتروني للتواصل غير صالح.' }, { status: 400 });
  }
  if ('status' in body) {
    if (typeof body.status !== 'string' || !sellerStatuses.includes(body.status as typeof sellerStatuses[number])) {
      return NextResponse.json({ error: 'حالة المتجر غير صالحة.' }, { status: 400 });
    }
    data.status = body.status as typeof sellerStatuses[number];
  }
  if ('isVerified' in body) {
    if (typeof body.isVerified !== 'boolean') return NextResponse.json({ error: 'حالة التحقق غير صالحة.' }, { status: 400 });
    data.isVerified = body.isVerified;
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });

  try {
    const item = await prisma.$transaction(async (transaction) => {
      const current = await transaction.seller.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          storeName: true,
          isVerified: true,
          status: true,
          user: { select: { email: true } },
        },
      });
      if (!current) throw new Error('ADMIN_STORE_NOT_FOUND');
      if (data.status === 'ACTIVE' && data.isVerified !== true && !current.isVerified) {
        throw new Error('ADMIN_STORE_MUST_BE_VERIFIED');
      }

      const updated = await transaction.seller.update({
        where: { id },
        data,
        select: { id: true, storeName: true, slug: true, status: true, isVerified: true },
      });
      if (data.status === 'ACTIVE') {
        await transaction.user.update({ where: { id: current.userId }, data: { role: 'SELLER' } });
      } else if (data.status === 'REJECTED' && current.status !== 'REJECTED') {
        await transaction.user.update({ where: { id: current.userId }, data: { role: 'CUSTOMER' } });
      }

      const decision = data.status === 'ACTIVE' && current.status !== 'ACTIVE'
        && current.status !== 'SUSPENDED'
        ? 'approved'
        : data.status === 'REJECTED' && current.status !== 'REJECTED'
          ? 'rejected'
          : null;
      const notification = decision
        ? await transaction.notification.create({
            data: {
              userId: current.userId,
              type: decision === 'approved' ? 'STORE_APPROVED' : 'STORE_REJECTED',
              message: decision === 'approved'
                ? `تمت الموافقة على طلب فتح متجر "${current.storeName}". يمكنك الآن بدء نشر منتجاتك.`
                : `نعتذر، لم تتم الموافقة على طلب فتح متجر "${current.storeName}". يمكنك التواصل مع الدعم لمزيد من المعلومات.`,
            },
            select: { id: true, userId: true, type: true, message: true, createdAt: true },
          })
        : null;

      return {
        updated,
        notification,
        decision,
        ownerEmail: current.user.email,
        storeName: current.storeName,
      };
    });
    let emailSent: boolean | null = null;
    let emailError: string | null = null;
    if (item.decision && item.notification) {
      if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
        emailSent = false;
        emailError = 'إعداد البريد غير مكتمل؛ أُرسلت رسالة داخل التطبيق فقط.';
      } else {
        const approved = item.decision === 'approved';
        const emailMessage = approved
          ? `مرحبًا، تمت الموافقة على طلب فتح متجر "${item.storeName}" في Akaar. يمكنك الآن بدء نشر منتجاتك.`
          : `مرحبًا، نعتذر لعدم الموافقة على طلب فتح متجر "${item.storeName}" في Akaar. يمكنك التواصل مع الدعم لمزيد من المعلومات.`;
        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            signal: AbortSignal.timeout(10_000),
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL,
              to: [item.ownerEmail],
              subject: approved ? 'تمت الموافقة على متجرك في Akaar' : 'تحديث طلب فتح متجرك في Akaar',
              text: emailMessage,
            }),
          });
          if (!response.ok) throw new Error(`RESEND_DELIVERY_FAILED_${response.status}`);
          emailSent = true;
        } catch (error) {
          console.error('Store decision email delivery failed:', error);
          emailSent = false;
          emailError = 'أُرسلت رسالة داخل التطبيق، لكن تعذر إرسال البريد الإلكتروني.';
        }
      }
    }
    return NextResponse.json({
      ...item.updated,
      notification: item.notification,
      emailSent,
      emailError,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_STORE_NOT_FOUND') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'ADMIN_STORE_MUST_BE_VERIFIED') {
      return NextResponse.json({ error: 'يجب توثيق المتجر قبل اعتماده.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'رابط المتجر مستخدم بالفعل.' }, { status: 409 });
    }
    console.error('Unable to update control panel store:', error);
    return NextResponse.json({ error: 'تعذر تحديث المتجر.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  try {
    const vendorOrdersAvailable = await isVendorOrderTableAvailable();
    await prisma.$transaction(async (transaction) => {
      const seller = await transaction.seller.findUnique({
        where: { id },
        select: { id: true, userId: true, user: { select: { role: true } } },
      });
      if (!seller) throw new Error('ADMIN_STORE_NOT_FOUND');
      if (vendorOrdersAvailable) {
        const [orderCount] = await transaction.$queryRaw<Array<{ count: number }>>`
          SELECT COUNT(*)::int AS count
          FROM public."VendorOrder"
          WHERE "sellerId" = ${id}
        `;
        if (orderCount.count > 0) throw new Error('ADMIN_STORE_HAS_ORDERS');
      }

      await transaction.seller.delete({ where: { id } });
      if (seller.user.role === 'SELLER') {
        await transaction.user.update({ where: { id: seller.userId }, data: { role: 'CUSTOMER' } });
      }
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_STORE_NOT_FOUND') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'ADMIN_STORE_HAS_ORDERS') {
      return NextResponse.json({ error: 'لا يمكن حذف متجر له طلبات سابقة؛ يمكنك إيقافه بدلًا من ذلك.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'لا يمكن حذف المتجر لوجود سجلات مرتبطة به.' }, { status: 409 });
    }
    console.error('Unable to delete control panel store:', error);
    return NextResponse.json({ error: 'تعذر حذف المتجر.' }, { status: 500 });
  }
}
