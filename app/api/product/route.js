import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';

const prisma = new PrismaClient();
const cache = new LRUCache({
  max: 100, // الحد الأقصى للعناصر المخزنة
  ttl: 60 * 1000, // مدة التخزين 60 ثانية
});

// GET: جلب السيارات مع دعم التخزين المؤقت
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قيم الصفحة والحد الأقصى
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;

  // إنشاء مفتاح فريد للتخزين المؤقت بناءً على الصفحة والحد الأقصى
  const cacheKey = `products-page-${page}-limit-${limit}`;

  // التحقق مما إذا كانت البيانات مخزنة مسبقًا
  if (cache.has(cacheKey)) {
    console.log('📌 إعادة البيانات من الكاش');
    return new Response(JSON.stringify(cache.get(cacheKey)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('🗄️ جلب البيانات من قاعدة البيانات...');
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // تخزين البيانات في الكاش
    cache.set(cacheKey, products);

    return new Response(JSON.stringify(products), {
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

// POST: إنشاء سيارة جديدة
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
        category: data?.category || null,
        city: data?.city || '',
        town: data?.town || null,
        basePrice: parseInt(data?.basePrice) || 0,
        phoneNumber: data?.phoneNumber || null,
        lng: data?.lng ? parseFloat(data?.lng) : null,
        lat: data?.lat ? parseFloat(data?.lat) : null,
        link: data?.link || '',
        description: data?.description,
        details: data?.details,

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

// PUT: تحديث بيانات منتج
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'رقم منتج مطلوب' }), {
        status: 400,
      });
    }

    // تحديث البيانات باستخدام Prisma
    await prisma.product.update({
      where: { id: id },
      data: {
        title: data?.title || undefined,
        categoryId: data?.categoryId || undefined,
        cityId: data?.cityId || undefined,
        basePrice: parseFloat(data?.basePrice) || undefined,
        town: data?.town || undefined,
        phoneNumber: data?.phoneNumber || undefined,
        description: data?.description || undefined,
        lng: parseFloat(data?.lng) || undefined,
        lat: parseFloat(data?.lat) || undefined,
        details: {
          update: {
            usedNew: data?.details?.usedNew || undefined,
            brand: data?.details?.brand || undefined,
            model: data?.details?.model || undefined,
            year: parseInt(data?.details?.year) || undefined,
            distance: parseFloat(data?.details?.distance) || undefined,
          },
        },
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify({ message: 'تم تحديث منتج بنجاح' }), {
      status: 200,
    });
  } catch (error) {
    console.error('خطأ أثناء تحديث منتج:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// DELETE: حذف منتج

export async function DELETE(req) {
  const { id } = await req.json();

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: 'يجب توفير معرف الإعلان' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let deletedPost = null;

    // محاولة الحذف من جدول `product` أولاً
    try {
      deletedPost = await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      // في حال لم يتم العثور على الإعلان في `product`، نحاول في `property`
      if (error.code !== 'P2025') {
        throw error; // خطأ آخر غير "السجل غير موجود"
      }
    }

    // إذا لم يتم العثور على الإعلان في `product`، نحاول البحث عنه في `property`
    if (!deletedPost) {
      try {
        deletedPost = await prisma.property.delete({
          where: { id },
        });
      } catch (error) {
        if (error.code === 'P2025') {
          return new Response(
            JSON.stringify({
              error: 'لم يتم العثور على الإعلان في أي من الجداول',
            }),
            { status: 404, headers: { 'Content-Type': 'application/json' } }
          );
        }
        throw error;
      }
    }

    return new Response(JSON.stringify({ message: 'تم حذف الإعلان بنجاح' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('خطأ أثناء حذف الإعلان:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ داخلي' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
