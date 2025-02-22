import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';
import { LRUCache } from 'lru-cache';

const prisma = new PrismaClient();

const cache = new LRUCache({
  max: 100, // الحد الأقصى للعناصر المخزنة
  ttl: 60 * 1000, // مدة التخزين 60 ثانية
});

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قيم الصفحة والحد الأقصى
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح فريد للتخزين المؤقت بناءً على الصفحة والحد الأقصى
  const cacheKey = `cars-page-${page}-limit-${limit}`;

  // التحقق مما إذا كانت البيانات مخزنة مسبقًا
  if (cache.has(cacheKey)) {
    console.log('📌 إعادة البيانات من الكاش');
    return new Response(JSON.stringify(cache.get(cacheKey)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('🗄️ جلب البيانات من قاعدة البيانات...');
    // قراءة البيانات من جدول Car
    const properties = await prisma.car.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // تخزين البيانات في الكاش
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
  try {
    const data = await req.json();
    // console.log('data', data);

    // إنشاء سجل جديد باستخدام Prisma
    const newCar = await prisma.car.create({
      data: {
        id: data?.id || undefined, // إذا كان id غير موجود، سيتم إنشاؤه تلقائيًا بواسطة Prisma
        userName: data?.userName || null,
        userImage: data?.userImage || null,
        adType: data?.adType || null,
        title: data?.title || null,
        brand: data?.brand || null,
        model: data?.model || null,
        usedNew: data?.usedNew || null,
        year: toInteger(data?.year),
        price: toInteger(data?.price),
        image1: data?.image || null,
        image2: data?.image1 || null,
        image3: data?.image2 || null,
        image4: data?.image3 || null,
        image5: data?.image4 || null,
        city: data?.city || null,
        town: data?.town || null,
        description: data?.description || null,
        distance: toInteger(data.distance) || null, // تحويل distance إلى Float
        phoneNumber: data?.phoneNumber || null,
        lat: data?.lat || null,
        lng: data?.lng || null,
        link: data?.link || null,
        createdBy: data?.createdBy || null,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined, // تحويل النص إلى كائن Date
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined, // تحويل النص إلى كائن Date
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Car created successfully',
        id: newCar.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating car:', error);
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
      return new Response(JSON.stringify({ error: 'Car ID is required' }), {
        status: 400,
      });
    }

    // تحديث البيانات باستخدام Prisma
    await prisma?.car?.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ message: 'Car updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating car:', error);
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
      return new Response(JSON.stringify({ error: 'Car ID is required' }), {
        status: 400,
      });
    }

    // حذف السجل باستخدام Prisma
    await prisma?.car?.delete({
      where: { id: id },
    });

    return new Response(
      JSON.stringify({ message: 'Car deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting car:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
