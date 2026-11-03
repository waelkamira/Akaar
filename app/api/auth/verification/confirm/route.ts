import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { consumeVerificationToken } from '@/lib/auth/email-token-repository.mjs';
import { hashAuthToken } from '@/lib/auth/tokens.mjs';

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }
  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'email-verification-confirm',
    limit: 20,
    windowMs: 15 * 60_000,
  });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    return NextResponse.json({ error: 'تعذر إكمال الطلب. حاول لاحقًا.' }, {
      status,
      headers: rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined,
    });
  }

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const token = typeof parsed.value.token === 'string' ? parsed.value.token : '';
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return NextResponse.json({ error: 'رابط التحقق غير صالح أو منتهي.' }, { status: 400 });
  }

  try {
    const verified = await consumeVerificationToken(hashAuthToken(token));
    if (!verified) return NextResponse.json({ error: 'رابط التحقق غير صالح أو سبق استخدامه.' }, { status: 400 });
    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Unable to verify user email:', error);
    return NextResponse.json({ error: 'تعذر تأكيد البريد الإلكتروني.' }, { status: 500 });
  }
}
