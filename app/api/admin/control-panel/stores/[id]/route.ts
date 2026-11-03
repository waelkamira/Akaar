import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { assignPlatformRole, removePlatformRole } from '@/lib/auth/roles.mjs';

type RouteContext = { params: Promise<{ id: string }> };
const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

function optionalText(value: unknown, maximum: number) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > maximum) return undefined;
  return value.trim() || null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const data: Prisma.SellerUpdateInput = {};
  const storeData: Prisma.StoreUpdateInput = {};
  const userData: Prisma.UserUpdateInput = {};

  if ('storeName' in body) {
    if (typeof body.storeName !== 'string' || !body.storeName.trim() || body.storeName.trim().length > 160) {
      return NextResponse.json({ error: 'اسم المتجر غير صالح.' }, { status: 400 });
    }
    data.displayName = body.storeName.trim();
    storeData.name = body.storeName.trim();
  }
  if ('slug' in body) {
    if (typeof body.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug.trim().toLowerCase()) || body.slug.trim().length > 100) {
      return NextResponse.json({ error: 'رابط المتجر غير صالح.' }, { status: 400 });
    }
    data.slug = body.slug.trim().toLowerCase();
    storeData.slug = body.slug.trim().toLowerCase();
  }
  for (const [field, maximum] of [['description', 10000], ['logo', 2048]] as const) {
    if (field in body) {
      const value = optionalText(body[field], maximum);
      if (value === undefined) return NextResponse.json({ error: 'إحدى بيانات المتجر غير صالحة.' }, { status: 400 });
      if (field === 'description') data.description = value;
      else storeData.logoUrl = value;
    }
  }
  if ('contactName' in body) {
    const value = optionalText(body.contactName, 100);
    if (value === undefined) return NextResponse.json({ error: 'اسم جهة التواصل غير صالح.' }, { status: 400 });
    userData.userName = value;
  }
  if ('phoneNumber' in body) {
    const value = optionalText(body.phoneNumber, 40);
    if (value === undefined) return NextResponse.json({ error: 'رقم الهاتف غير صالح.' }, { status: 400 });
    userData.phone = value;
  }
  if ('contactEmail' in body && body.contactEmail !== null && body.contactEmail !== '') {
    if (typeof body.contactEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contactEmail.trim())) {
      return NextResponse.json({ error: 'البريد الإلكتروني للتواصل غير صالح.' }, { status: 400 });
    }
  }
  if ('residence' in body) {
    const value = optionalText(body.residence, 2);
    if (value === undefined || (value && !/^[A-Za-z]{2}$/.test(value))) {
      return NextResponse.json({ error: 'استخدم رمز دولة مكوّنًا من حرفين.' }, { status: 400 });
    }
    data.countryCode = value?.toUpperCase() ?? null;
  }
  if ('businessType' in body) {
    const value = optionalText(body.businessType, 60);
    if (value === undefined) return NextResponse.json({ error: 'نوع النشاط غير صالح.' }, { status: 400 });
    data.sellerType = value || 'INDIVIDUAL';
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
  if (!Object.keys(data).length && !Object.keys(storeData).length && !Object.keys(userData).length) {
    return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });
  }

  try {
    const item = await prisma.$transaction(async (transaction) => {
      const current = await transaction.seller.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          displayName: true,
          slug: true,
          isVerified: true,
          status: true,
          user: { select: { email: true } },
          stores: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
            take: 1,
            select: { id: true },
          },
        },
      });
      if (!current) throw new Error('ADMIN_STORE_NOT_FOUND');
      if (
        typeof body.contactEmail === 'string'
        && body.contactEmail.trim()
        && body.contactEmail.trim().toLowerCase() !== current.user.email.toLowerCase()
      ) {
        throw new Error('ADMIN_STORE_EMAIL_IMMUTABLE');
      }
      if (data.status === 'ACTIVE' && data.isVerified !== true && !current.isVerified) {
        throw new Error('ADMIN_STORE_MUST_BE_VERIFIED');
      }
      if (data.status === 'ACTIVE' && data.isVerified === false) {
        throw new Error('ADMIN_STORE_MUST_BE_VERIFIED');
      }

      const updated = Object.keys(data).length
        ? await transaction.seller.update({
            where: { id },
            data,
            select: { id: true, displayName: true, slug: true, status: true, isVerified: true },
          })
        : {
            id: current.id,
            displayName: current.displayName,
            slug: '',
            status: current.status,
            isVerified: current.isVerified,
          };
      if (current.stores[0] && Object.keys(storeData).length) {
        await transaction.store.update({ where: { id: current.stores[0].id }, data: storeData });
      } else if (Object.keys(storeData).length) {
        await transaction.store.create({
          data: {
            sellerId: id,
            name: typeof storeData.name === 'string' ? storeData.name : current.displayName,
            slug: typeof storeData.slug === 'string' ? storeData.slug : current.slug,
            description: typeof data.description === 'string' ? data.description : null,
            logoUrl: typeof storeData.logoUrl === 'string' ? storeData.logoUrl : null,
            defaultLanguage: 'ar',
          },
        });
      }
      if (Object.keys(userData).length) {
        await transaction.user.update({ where: { id: current.userId }, data: userData });
      }
      if (data.status === 'ACTIVE') {
        await assignPlatformRole(transaction, current.userId, 'SELLER');
      } else if (data.status === 'REJECTED' && current.status !== 'REJECTED') {
        await removePlatformRole(transaction, current.userId, 'SELLER');
      }
      if (data.status === 'ACTIVE' || data.status === 'REJECTED') {
        await transaction.sellerVerification.updateMany({
          where: { sellerId: id, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
          data: {
            status: data.status === 'ACTIVE' ? 'APPROVED' : 'REJECTED',
            reviewerId: admin.id,
            reviewedAt: new Date(),
          },
        });
      }
      if (data.status !== undefined) {
        await transaction.store.updateMany({
          where: { sellerId: id },
          data: { isActive: data.status === 'ACTIVE' },
        });
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
                ? `تمت الموافقة على طلب فتح متجر "${current.displayName}". يمكنك الآن بدء نشر منتجاتك.`
                : `نعتذر، لم تتم الموافقة على طلب فتح متجر "${current.displayName}". يمكنك التواصل مع الدعم لمزيد من المعلومات.`,
            },
            select: { id: true, userId: true, type: true, message: true, createdAt: true },
          })
        : null;

      return {
        notification,
        decision,
        ownerEmail: current.user.email,
        storeName: current.displayName,
        updated: {
          id: updated.id,
          storeName: updated.displayName,
          slug: updated.slug || current.slug,
          status: updated.status,
          isVerified: updated.isVerified,
        },
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
    if (error instanceof Error && error.message === 'ADMIN_STORE_EMAIL_IMMUTABLE') {
      return NextResponse.json({ error: 'لا يمكن تغيير البريد الإلكتروني من إعدادات المتجر.' }, { status: 400 });
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
  const admin = await getControlPanelAdmin('control_panel.stores.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  try {
    await prisma.$transaction(async (transaction) => {
      const seller = await transaction.seller.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });
      if (!seller) throw new Error('ADMIN_STORE_NOT_FOUND');
      await transaction.seller.update({
        where: { id },
        data: { status: 'SUSPENDED' },
      });
      await transaction.store.updateMany({ where: { sellerId: id }, data: { isActive: false } });
      await removePlatformRole(transaction, seller.userId, 'SELLER');
    });
    return NextResponse.json({ archived: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_STORE_NOT_FOUND') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    console.error('Unable to delete control panel store:', error);
    return NextResponse.json({ error: 'تعذر حذف المتجر.' }, { status: 500 });
  }
}
