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
    // // التحقق من صحة البيانات المطلوبة
    // if (
    //   !data?.title ||
    //   !data?.basePrice ||
    //   !data?.description ||
    //   !data?.images ||
    //   data?.images.length === 0
    // ) {
    //   return new Response(
    //     JSON.stringify({ error: 'يرجى ملء جميع الحقول المطلوبة!' }),
    //     { status: 400 }
    //   );
    // }

    // إنشاء سجل جديد باستخدام Prisma
    const newProduct = await prisma.product.create({
      data: {
        id: data?.id || undefined,
        title: data?.title,
        userId: data?.userId || null,
        categoryId: data?.category,
        categoryName: data?.categoryName,
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

export async function PUT(req) {
  try {
    const { id, ...data } = await req.json(); // استخراج `id` والبيانات الأخرى
    console.log('Received ID:', id);
    console.log('Received Data:', data);

    if (!id) {
      return new Response(JSON.stringify({ error: 'رقم المنتج مطلوب' }), {
        status: 400,
      });
    }

    // التحقق مما إذا كان المنتج موجودًا أولًا
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ error: 'المنتج غير موجود' }), {
        status: 404,
      });
    }

    // تحديث البيانات
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(), // تحديث التاريخ التلقائي
      },
    });

    return new Response(
      JSON.stringify({
        message: 'تم تحديث المنتج بنجاح',
        product: updatedProduct,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('خطأ أثناء تحديث المنتج:', error);
    return new Response(
      JSON.stringify({ error: 'خطأ داخلي في السيرفر', details: error.message }),
      {
        status: 500,
      }
    );
  }
}
// DELETE: حذف منتج

export async function DELETE(req) {
  const { id, userId } = await req.json();

  try {
    if (!id || !userId) {
      return new Response(
        JSON.stringify({ error: 'يجب توفير معرف الإعلان ومعرف المستخدم' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // التحقق من وجود الإعلان
    const post = await prisma.product.findUnique({
      where: { id },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'الإعلان غير موجود' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // التحقق من أن المستخدم الحالي هو المنشئ أو المشرف
    const isAdmin = false; // يمكنك تعديل هذا بناءً على دور المستخدم
    if (post.userId !== userId || isAdmin) {
      return new Response(
        JSON.stringify({
          error: 'ليس لديك الصلاحية لحذف هذا الإعلان',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // حذف الإعلان
    await prisma.product.delete({
      where: { id },
    });

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
