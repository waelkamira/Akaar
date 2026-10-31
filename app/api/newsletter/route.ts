import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendConfirmation(to: string, confirmationToken: string, unsubscribeToken: string) {
  const baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (!baseUrl || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error('NEWSLETTER_EMAIL_NOT_CONFIGURED');
  }
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    throw new Error('NEWSLETTER_APP_URL_MUST_USE_HTTPS');
  }
  const confirmUrl = new URL(`/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`, base).toString();
  const unsubscribeUrl = new URL(`/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`, base).toString();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: 'تأكيد الاشتراك في أخبار عقار',
      text: `لتأكيد اشتراكك، افتح الرابط:\n${confirmUrl}\n\nلإلغاء الاشتراك في أي وقت:\n${unsubscribeUrl}`,
    }),
  });
  if (!response.ok) throw new Error(`RESEND_DELIVERY_FAILED_${response.status}`);
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }
  const rateLimit = await consumeDurableRateLimit({ request, scope: 'newsletter-subscribe', limit: 5, windowMs: 60 * 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'تعذر إكمال الطلب. حاول لاحقًا.' }, {
      status: rateLimit.configured ? 429 : 503,
      headers: rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined,
    });
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !(process.env.APP_URL || process.env.NEXTAUTH_URL)) {
    return NextResponse.json({ error: 'الاشتراك بالبريد غير مهيأ بعد.' }, { status: 503 });
  }

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const email = typeof parsed.value.email === 'string' ? parsed.value.email.trim().toLowerCase() : '';
  if (!isEmail(email)) return NextResponse.json({ error: 'أدخل بريدًا إلكترونيًا صالحًا.' }, { status: 400 });

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing?.confirmedAt && !existing.unsubscribedAt) {
    return NextResponse.json({ message: 'إذا كان الاشتراك متاحًا لهذا البريد فستصلك رسالة تأكيد.' }, { status: 202 });
  }

  const confirmationToken = randomBytes(32).toString('base64url');
  const unsubscribeToken = randomBytes(32).toString('base64url');
  const data = {
    confirmationTokenHash: hashToken(confirmationToken),
    unsubscribeTokenHash: hashToken(unsubscribeToken),
    confirmedAt: null,
    unsubscribedAt: null,
    updatedAt: new Date(),
  };

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, ...data },
      update: data,
    });
    await sendConfirmation(email, confirmationToken, unsubscribeToken);
    return NextResponse.json({ message: 'إذا كان الاشتراك متاحًا لهذا البريد فستصلك رسالة تأكيد.' }, { status: 202 });
  } catch (error) {
    console.error('Unable to create or deliver newsletter confirmation:', error);
    if (error instanceof Error && error.message === 'NEWSLETTER_EMAIL_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'خدمة إرسال البريد غير مهيأة.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'تعذر إرسال رسالة التأكيد. حاول مجددًا.' }, { status: 502 });
  }
}
