import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { consumePasswordResetToken } from '@/lib/auth/email-token-repository.mjs';
import { hashAuthToken } from '@/lib/auth/tokens.mjs';

const MAX_BCRYPT_BYTES = 72;

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: 'الطلب غير مسموح.' }, { status: 403 });
  }
  const rateLimit = await consumeDurableRateLimit({
    request,
    scope: 'password-reset-confirm',
    limit: 10,
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
  const password = typeof parsed.value.password === 'string' ? parsed.value.password : '';
  const passwordBytes = new TextEncoder().encode(password).length;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return NextResponse.json({ error: 'رابط الاستعادة غير صالح أو منتهي.' }, { status: 400 });
  }
  if (passwordBytes < 8 || passwordBytes > MAX_BCRYPT_BYTES) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وألا تتجاوز 72 بايتًا.' }, { status: 400 });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const updated = await consumePasswordResetToken(hashAuthToken(token), passwordHash);
    if (!updated) return NextResponse.json({ error: 'رابط الاستعادة غير صالح أو سبق استخدامه.' }, { status: 400 });
    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error('Unable to reset account password:', error);
    return NextResponse.json({ error: 'تعذر تحديث كلمة المرور.' }, { status: 500 });
  }
}
