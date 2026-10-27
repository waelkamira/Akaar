import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcrypt';
import { validateRegistrationInput } from '@/lib/auth/registration-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

const MAX_REGISTRATION_BODY_BYTES = 16 * 1024;

export async function POST(req) {
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
