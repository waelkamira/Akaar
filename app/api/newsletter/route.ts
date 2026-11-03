import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { subscribeToNewsletter } from '@/lib/newsletter/service.mjs';

function isEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

  try {
    await subscribeToNewsletter(email);
    return NextResponse.json({ message: 'إذا كان الاشتراك متاحًا لهذا البريد فستصلك رسالة تأكيد.' }, { status: 202 });
  } catch (error) {
    console.error('Unable to create or deliver newsletter confirmation:', error);
    if (error instanceof Error && error.message === 'NEWSLETTER_EMAIL_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'خدمة إرسال البريد غير مهيأة.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'تعذر إرسال رسالة التأكيد. حاول مجددًا.' }, { status: 502 });
  }
}
