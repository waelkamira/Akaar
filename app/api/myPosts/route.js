import { authOptions } from '../authOptions/route';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // التحقق من البريد الإلكتروني
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير البريد الإلكتروني' }),
        { status: 400 }
      );
    }

    // استخراج قيم الصفحة والحدود
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 5;
    const skip = (page - 1) * limit;

    // التأكد من أن prisma معرف وأن الجداول موجودة
    if (!prisma?.property) {
      throw new Error('جدول property غير موجود.');
    }

    // جلب عدد الإعلانات من جدول property
    const propertyCount = await prisma.property.count({
      where: { createdBy: email },
    });

    // جلب الإعلانات من جدول property
    const propertyPosts = await prisma.property.findMany({
      where: { createdBy: email },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // التحقق مما إذا كان جدول car موجودًا قبل جلب البيانات
    let carCount = 0;
    let carPosts = [];

    if (prisma?.car) {
      carCount = await prisma.car.count({
        where: { createdBy: email },
      });

      carPosts = await prisma.car.findMany({
        where: { createdBy: email },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    }

    // دمج الإعلانات وترتيبها حسب التاريخ
    const allPosts = [...propertyPosts, ...carPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    console.log('allPosts', allPosts);
    return new Response(
      JSON.stringify({
        count: propertyCount + carCount,
        posts: allPosts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user posts data:', error.message);
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
    const property = await prisma.property.findFirst({
      where: { id, createdBy: email },
    });

    if (!property) {
      return new Response(
        JSON.stringify({
          error: 'لم يتم العثور على الإعلان أو لا تملك صلاحية حذف هذه الإعلان',
        }),
        { status: 404 }
      );
    }

    // حذف الإعلان
    await prisma.property.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'تم الحذف بنجاح ✔' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
