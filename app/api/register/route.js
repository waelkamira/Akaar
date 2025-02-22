import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // التحقق مما إذا كان المستخدم موجودًا بالفعل
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(
        'هذا الايميل موجود بالفعل، قم بتسجيل الدخول أو استخدم بريد إلكتروني آخر.'
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image:
          'https://res.cloudinary.com/dh2xlutfu/image/upload/v1722957470/cooking/q9s2dvz8slw43lnyl0gf.png',
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
