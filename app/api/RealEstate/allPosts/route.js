import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions/route';

const prisma = new PrismaClient();

// إعداد التخزين المؤقت باستخدام LRU Cache
const cache = new LRUCache({
  max: 100, // عدد العناصر القصوى في الكاش
  ttl: 60 * 1000, // مدة التخزين المؤقت (60 ثانية)
});

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح فريد للكاش بناءً على الصفحة والحد
  const cacheKey = `properties-page-${page}-limit-${limit}`;

  // التحقق مما إذا كانت البيانات موجودة في الكاش
  if (cache.has(cacheKey)) {
    console.log('📌 إعادة البيانات من الكاش');
    return new Response(JSON.stringify(cache.get(cacheKey)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('🗄️ جلب البيانات من قاعدة البيانات...');
    const properties = await prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // حفظ البيانات في الكاش
    cache.set(cacheKey, properties);

    return new Response(JSON.stringify(properties), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // التحقق من وجود جلسة مستخدم
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'يجب تسجيل الدخول لإنشاء منتج' }),
      { status: 401 }
    );
  }

  try {
    const data = await req.json();
    console.log('data', data);

    // التحقق من صحة البيانات المطلوبة
    if (
      !data?.title ||
      !data?.basePrice ||
      !data?.description ||
      !data?.images ||
      data?.images.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: 'يرجى ملء جميع الحقول المطلوبة!' }),
        { status: 400 }
      );
    }

    // إنشاء سجل جديد باستخدام Prisma
    const newProduct = await prisma.product.create({
      data: {
        id: data?.id || undefined,
        title: data?.title,
        userId: data?.userId || null,
        adCategory: data?.adCategory || '',
        city: data?.city || '',
        town: data?.town || null,
        basePrice: parseInt(data?.basePrice) || 0,
        phoneNumber: data?.phoneNumber || null,
        lng: data?.lng ? parseFloat(data?.lng) : null,
        lat: data?.lat ? parseFloat(data?.lat) : null,
        link: data?.link || '',
        description: data?.description,
        details: data?.details
          ? {
              roomsNumber: data?.details?.roomsNumber || 'غير محدد',
              propertyType: data?.details?.propertyType || 'غير معروف',
              area: data?.details?.area || 'غير معروف',
            }
          : {},
        stockQuantity: data?.stockQuantity || 0,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        image1: data?.images[0],
        image2: data?.images[1],
        image3: data?.images[2],
        image4: data?.images[3],
        image5: data?.images[4],
      },
    });

    return new Response(
      JSON.stringify({
        message: 'تم إنشاء المنتج بنجاح',
        id: newProduct.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('خطأ أثناء إنشاء المنتج:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Property ID is required' }),
        { status: 400 }
      );
    }

    // تحديث البيانات باستخدام Prisma
    await prisma.property.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ message: 'Property updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Property ID is required' }),
        { status: 400 }
      );
    }

    // حذف السجل باستخدام Prisma
    await prisma.property.delete({
      where: { id: id },
    });

    return new Response(
      JSON.stringify({ message: 'Property deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
