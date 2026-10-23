import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  let input;
  try {
    input = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'بيانات الطلب غير صالحة.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const email =
    typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  const password = typeof input?.password === 'string' ? input.password : '';

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 5) {
    return new Response(
      JSON.stringify({ error: 'تحقق من الاسم والبريد الإلكتروني وكلمة المرور.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
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
