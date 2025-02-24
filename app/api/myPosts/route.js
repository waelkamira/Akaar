import { authOptions } from '../authOptions/route';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  // التحقق من الجلسة

  // استخراج قيم الصفحة والحدود
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 5;
  const userId = url.searchParams.get('userId') || '';
  console.log('userId', userId);
  try {
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير البريد الإلكتروني' }),
        { status: 400 }
      );
    }

    if (isNaN(page) || isNaN(limit)) {
      return new Response(
        JSON.stringify({ error: 'قيم الصفحة أو الحدود غير صالحة' }),
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // التحقق من وجود Prisma
    if (!prisma?.product) {
      throw new Error('جدول product غير موجود.');
    }

    // جلب عدد الإعلانات
    const productCount = await prisma.product.count({
      where: { userId: userId },
    });

    // جلب الإعلانات
    const productPosts = await prisma.product.findMany({
      where: { userId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    if (productPosts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'لم يتم العثور على إعلانات' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        count: productCount,
        posts: productPosts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  if (!id || !email) {
    return new Response(
      JSON.stringify({ error: 'يجب توفير معرف الإعلان والبريد الإلكتروني' }),
      { status: 400 }
    );
  }

  try {
    // تحقق إذا كانت الإعلان موجودة
    const product = await prisma.product.findFirst({
      where: { id, userId: email },
    });

    if (!product) {
      return new Response(
        JSON.stringify({
          error: 'لم يتم العثور على الإعلان أو لا تملك صلاحية حذف هذه الإعلان',
        }),
        { status: 404 }
      );
    }

    // حذف الإعلان
    await prisma.product.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'تم الحذف بنجاح ✔' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
