import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

function isSmsConfigured() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

async function deliverEmail(to: string, message: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: 'رسالة من إدارة عقار',
      text: message,
    }),
  });
  if (!response.ok) throw new Error(`RESEND_DELIVERY_FAILED_${response.status}`);
}

async function deliverSms(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const credentials = Buffer.from(`${accountSid}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
  const body = new URLSearchParams({
    To: to,
    From: process.env.TWILIO_FROM_NUMBER as string,
    Body: message,
  });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!response.ok) throw new Error(`TWILIO_DELIVERY_FAILED_${response.status}`);
}

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.messages.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  try {
    const [items, totalCount, users] = await Promise.all([
      prisma.notification.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { id: true, userId: true, type: true, message: true, isRead: true, createdAt: true, user: { select: { email: true } } },
      }),
      prisma.notification.count(),
      prisma.user.findMany({
        where: { status: 'ACTIVE', seller: { isNot: null } },
        orderBy: { email: 'asc' },
        select: {
          id: true,
          email: true,
          seller: { select: { storeName: true, phoneNumber: true, status: true, isVerified: true } },
        },
      }),
    ]);
    return NextResponse.json({
      items,
      users,
      providers: { emailConfigured: isEmailConfigured(), smsConfigured: isSmsConfigured() },
      page,
      hasMore: skip + items.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel messages:', error);
    return NextResponse.json({ error: 'تعذر تحميل الرسائل.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.messages.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsedBody = await readJsonBody(request, 64 * 1024);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  const payload: unknown = parsedBody.value;
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  if (Array.isArray(body.userIds) && body.userIds.some((value) => typeof value !== 'string')) {
    return NextResponse.json({ error: 'قائمة المتاجر المحددة غير صالحة.' }, { status: 400 });
  }
  const requestedUserIds = Array.isArray(body.userIds)
    ? [...new Set(body.userIds.filter((value): value is string => typeof value === 'string').map((value) => value.trim()).filter(Boolean))]
    : typeof body.userId === 'string' && body.userId.trim()
      ? [body.userId.trim()]
      : [];
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : 'ADMIN';
  const sendEmail = body.sendEmail === true;
  const sendSms = body.sendSms === true;
  if (
    !requestedUserIds.length ||
    requestedUserIds.length > 1000 ||
    requestedUserIds.some((id) => id.length > 128) ||
    !message ||
    message.length > 4000 ||
    !type ||
    type.length > 60
  ) {
    return NextResponse.json({ error: 'حدد متجرًا واحدًا على الأقل (وبحد أقصى 1000) واكتب رسالة صالحة لا تتجاوز 4000 حرف.' }, { status: 400 });
  }
  if (sendEmail && !isEmailConfigured()) {
    return NextResponse.json({ error: 'إرسال البريد غير مهيأ. أضف RESEND_API_KEY وRESEND_FROM_EMAIL إلى بيئة الخادم.' }, { status: 503 });
  }
  if (sendSms && !isSmsConfigured()) {
    return NextResponse.json({ error: 'إرسال SMS غير مهيأ. أضف بيانات Twilio إلى بيئة الخادم.' }, { status: 503 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { id: { in: requestedUserIds }, status: 'ACTIVE', seller: { isNot: null } },
      select: { id: true, email: true, seller: { select: { phoneNumber: true } } },
    });
    if (users.length !== requestedUserIds.length) {
      return NextResponse.json({ error: 'بعض المتاجر المحددة غير موجودة أو لم تعد نشطة.' }, { status: 404 });
    }
    if (sendSms && users.some((recipient) => !recipient.seller?.phoneNumber?.trim())) {
      return NextResponse.json({ error: 'يجب توفر رقم هاتف لكل متجر محدد لإرسال SMS.' }, { status: 400 });
    }

    await prisma.notification.createMany({
      data: users.map((recipient) => ({ userId: recipient.id, type, message })),
    });

    const deliveryErrors: string[] = [];
    for (const [channel, isEnabled, deliver] of [
      ['email', sendEmail, (recipient: typeof users[number]) => deliverEmail(recipient.email, message)],
      ['sms', sendSms, (recipient: typeof users[number]) => deliverSms(recipient.seller?.phoneNumber?.trim() || '', message)],
    ] as const) {
      if (!isEnabled) continue;
      let failedCount = 0;
      for (let index = 0; index < users.length; index += 10) {
        const batch = users.slice(index, index + 10);
        const results = await Promise.allSettled(batch.map(deliver));
        const failures = results.filter((result) => result.status === 'rejected');
        failedCount += failures.length;
        failures.forEach((result) => {
          if (result.status === 'rejected') console.error(`Admin bulk message ${channel} delivery failed:`, result.reason);
        });
      }
      if (failedCount) deliveryErrors.push(`${channel} (${failedCount})`);
    }
    if (deliveryErrors.length) {
      return NextResponse.json({
        error: `حُفظت الرسالة داخل التطبيق، لكن تعذر إرسالها عبر: ${deliveryErrors.join(', ')}.`,
        recipientCount: users.length,
        deliveredInApp: true,
        deliveryErrors,
      }, { status: 502 });
    }
    return NextResponse.json({ recipientCount: users.length }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'المستخدم المحدد غير موجود.' }, { status: 404 });
    }
    console.error('Unable to send control panel message:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}
