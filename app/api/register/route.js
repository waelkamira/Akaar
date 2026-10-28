import { prisma } from '@/lib/db/prisma';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import bcrypt from 'bcrypt';
import { validateRegistrationInput } from '@/lib/auth/registration-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

const MAX_REGISTRATION_BODY_BYTES = 16 * 1024;

export async function POST(req) {
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
  const { name, email, password } = validation;

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
    const user = await prisma.user.create({
      data: {
        userName: name,
        email,
        password: hashedPassword,
        userImage: '/placeholder.jpg',
      },
      select: { id: true, userName: true, email: true, userImage: true },
    });

    return new Response(JSON.stringify(user), {
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
