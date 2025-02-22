import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';

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
  try {
    const data = await req.json();
    // console.log('data', data);

    // تحويل propertyPrice إلى Int
    const propertyPriceValue = parseInt(data.propertyPrice, 10);

    // التحقق من أن التحويل تم بنجاح وأن القيمة صالحة
    if (isNaN(propertyPriceValue)) {
      return new Response(
        JSON.stringify({ error: 'Invalid propertyPrice value' }),
        { status: 400 }
      );
    }

    // إنشاء سجل جديد باستخدام Prisma
    const newProperty = await prisma.property.create({
      data: {
        id: data?.id,

        image1: data?.image1,
        image2: data?.image2,
        image3: data?.image3,
        image4: data?.image4,
        image5: data?.image,

        propertyCategory: data?.propertyCategory,
        propertyName: data?.propertyName,
        propertyType: data?.propertyType,
        propertyRoomsNumber: data?.propertyRoomsNumber,
        propertyPrice: propertyPriceValue, // استخدام القيمة المحولة
        propertyArea: data?.propertyArea,
        propertyCity: data?.propertyCity,
        propertyTown: data?.propertyTown,
        phoneNumber: data?.phoneNumber,
        description: data?.description,
        lng: data?.lng,
        lat: data?.lat,
        link: data?.link || null, // التعامل مع الحقل `link` بشكل صحيح
        hearts: data?.hearts,
        userName: data?.userName,
        userImage: data?.userImage,
        createdBy: data?.createdBy,
        createdAt: data?.createdAt ? new Date(data.createdAt) : undefined, // تحويل النص إلى كائن Date
        updatedAt: data?.updatedAt ? new Date(data.updatedAt) : undefined, // تحويل النص إلى كائن Date
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Property created successfully',
        id: newProperty.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating property:', error);
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
