import { prisma } from '@/lib/db/prisma';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import bcrypt from 'bcrypt';
import { validateRegistrationInput } from '@/lib/auth/registration-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isSameOriginRequest } from '@/lib/api/same-origin.mjs';
import { assignPlatformRole } from '@/lib/auth/roles.mjs';
import { isAuthEmailConfigured } from '@/lib/auth/email.mjs';
import { issueVerificationEmail } from '@/lib/auth/email-token-service.mjs';

const MAX_REGISTRATION_BODY_BYTES = 16 * 1024;

export async function POST(req) {
  if (!isSameOriginRequest(req)) {
    return new Response(JSON.stringify({ error: 'الطلب غير مسموح.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await consumeDurableRateLimit({
    request: req,
    scope: 'register',
    limit: 5,
    windowMs: 900000,
  });
  if (!rateLimit.allowed) {
    const status = Boolean(rateLimit.reason) || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return new Response(JSON.stringify({ error: status === 429 ? 'تم تجاوز عدد محاولات إنشاء الحساب. حاول لاحقًا.' : 'خدمة الحماية غير متاحة حاليًا.' }), { status, headers: { 'Content-Type': 'application/json', ...(headers || {}) } });
  }

  const parsedBody = await readJsonBody(req, MAX_REGISTRATION_BODY_BYTES);
  if (!parsedBody.ok) {
    return new Response(JSON.stringify({ error: parsedBody.error }), {
      status: parsedBody.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validation = validateRegistrationInput(parsedBody.value);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const { name, email, password, accountType } = validation;
  if (!isAuthEmailConfigured()) {
    return new Response(JSON.stringify({ error: 'خدمة التحقق من البريد غير مهيأة.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error:
            'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: {
          userName: name,
          email,
          passwordHash: hashedPassword,
          imageUrl: '/placeholder.jpg',
        },
        select: { id: true, userName: true, email: true, imageUrl: true },
      });
      await assignPlatformRole(transaction, created.id, accountType);
      return created;
    });

    try {
      await issueVerificationEmail(user.email);
    } catch (error) {
      console.error('Unable to deliver registration verification email:', error);
      return new Response(JSON.stringify({
        error: 'تم إنشاء الحساب، لكن تعذر إرسال رابط التحقق. حاول طلب رابط جديد بعد قليل.',
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      created: true,
      message: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتفعيله.',
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error?.code === 'P2002') {
      return new Response(
        JSON.stringify({ error: 'هذا البريد الإلكتروني مسجل بالفعل.' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: 'تعذر إنشاء الحساب حاليًا.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
