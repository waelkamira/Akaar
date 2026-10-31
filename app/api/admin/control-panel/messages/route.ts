import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

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
  const admin = await getControlPanelAdmin();
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
        where: { status: 'ACTIVE' },
        orderBy: { email: 'asc' },
        select: { id: true, email: true, seller: { select: { phoneNumber: true } } },
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
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : 'ADMIN';
  const sendEmail = body.sendEmail === true;
  const sendSms = body.sendSms === true;
  if (!userId || userId.length > 128 || !message || message.length > 4000 || !type || type.length > 60) {
    return NextResponse.json({ error: 'حدد مستخدمًا ورسالة صالحة لا تتجاوز 4000 حرف.' }, { status: 400 });
  }
  if (sendEmail && !isEmailConfigured()) {
    return NextResponse.json({ error: 'إرسال البريد غير مهيأ. أضف RESEND_API_KEY وRESEND_FROM_EMAIL إلى بيئة الخادم.' }, { status: 503 });
  }
  if (sendSms && !isSmsConfigured()) {
    return NextResponse.json({ error: 'إرسال SMS غير مهيأ. أضف بيانات Twilio إلى بيئة الخادم.' }, { status: 503 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, status: true, seller: { select: { phoneNumber: true } } },
    });
    if (!user || user.status !== 'ACTIVE') return NextResponse.json({ error: 'المستخدم غير موجود أو غير نشط.' }, { status: 404 });
    const phoneNumber = user.seller?.phoneNumber?.trim();
    if (sendSms && !phoneNumber) {
      return NextResponse.json({ error: 'لا يوجد رقم هاتف موثّق لمتجر المستخدم لإرسال الرسالة.' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: { userId: user.id, type, message },
      select: { id: true, userId: true, type: true, message: true, isRead: true, createdAt: true },
    });
    const deliveryErrors: string[] = [];
    if (sendEmail) {
      try {
        await deliverEmail(user.email, message);
      } catch (error) {
        console.error('Admin message email delivery failed:', error);
        deliveryErrors.push('email');
      }
    }
    if (sendSms && phoneNumber) {
      try {
        await deliverSms(phoneNumber, message);
      } catch (error) {
        console.error('Admin message SMS delivery failed:', error);
        deliveryErrors.push('sms');
      }
    }
    if (deliveryErrors.length) {
      return NextResponse.json({
        error: `حُفظت الرسالة داخل التطبيق، لكن تعذر إرسالها عبر: ${deliveryErrors.join(', ')}.`,
        notification,
        deliveredInApp: true,
        deliveryErrors,
      }, { status: 502 });
    }
    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'المستخدم المحدد غير موجود.' }, { status: 404 });
    }
    console.error('Unable to send control panel message:', error);
    return NextResponse.json({ error: 'تعذر إرسال الرسالة.' }, { status: 500 });
  }
}
