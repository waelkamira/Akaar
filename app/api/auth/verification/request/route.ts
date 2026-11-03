import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';
import { isAuthEmailConfigured } from '@/lib/auth/email.mjs';
import { issueVerificationEmail } from '@/lib/auth/email-token-service.mjs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESPONSE_MESSAGE = 'إذا كان الحساب يحتاج إلى التحقق، فستصلك رسالة بالبريد الإلكتروني.';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }
  const ipLimit = await consumeDurableRateLimit({
    request,
    scope: 'email-verification-ip',
    limit: 10,
    windowMs: 60 * 60_000,
  });
  if (!ipLimit.allowed) {
    const status = ipLimit.reason || !ipLimit.configured ? 503 : 429;
    return NextResponse.json({ error: 'تعذر إكمال الطلب. حاول لاحقًا.' }, {
      status,
      headers: ipLimit.retryAfterSeconds ? { 'Retry-After': String(ipLimit.retryAfterSeconds) } : undefined,
    });
  }

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const email = typeof parsed.value.email === 'string' ? parsed.value.email.trim().toLowerCase() : '';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'أدخل بريدًا إلكترونيًا صالحًا.' }, { status: 400 });
  }

  const accountLimit = await consumeDurableRateLimit({
    request,
    scope: 'email-verification-account',
    limit: 3,
    windowMs: 60 * 60_000,
    identity: email,
  });
  if (!accountLimit.allowed) {
    const status = accountLimit.reason || !accountLimit.configured ? 503 : 429;
    return NextResponse.json({ error: 'تعذر إكمال الطلب. حاول لاحقًا.' }, {
      status,
      headers: accountLimit.retryAfterSeconds ? { 'Retry-After': String(accountLimit.retryAfterSeconds) } : undefined,
    });
  }
  if (!isAuthEmailConfigured()) {
    return NextResponse.json({ error: 'خدمة إرسال البريد غير مهيأة.' }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true, status: true, emailVerifiedAt: true },
  });
  if (!user || user.status !== 'ACTIVE' || user.emailVerifiedAt) {
    return NextResponse.json({ message: RESPONSE_MESSAGE }, { status: 202 });
  }

  try {
    await issueVerificationEmail(user.email);
    return NextResponse.json({ message: RESPONSE_MESSAGE }, { status: 202 });
  } catch (error) {
    console.error('Unable to send email verification:', error);
    return NextResponse.json({ error: 'تعذر إرسال رسالة التحقق. حاول مجددًا.' }, { status: 502 });
  }
}
