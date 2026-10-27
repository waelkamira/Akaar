// import { prisma } from '@/lib/db/prisma';
// import { LRUCache } from 'lru-cache';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth/options';

// // const cache = new LRUCache({
//   max: 100,
//   ttl: 60 * 1000,
// });

// // GET: جلب المنتجات مع دعم التخزين المؤقت
// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;

//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 5;
//   const skip = (page - 1) * limit;

//   const cacheKey = `products-page-${page}-limit-${limit}`;

//   if (cache.has(cacheKey)) {
//     console.log('📌 إعادة البيانات من الكاش');
//     return new Response(JSON.stringify(cache.get(cacheKey)), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   try {
//     console.log('🗄️ جلب البيانات من قاعدة البيانات...');
//     const products = await prisma.product.findMany({
//       skip,
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//       where: { isDeleted: false, isActive: true }, // Publicly visible products
//       include: {
//         user: {
//           select: {
//             userName: true,
//             userImage: true,
//             email: true,
//           },
//         },
//       },
//     });

//     cache.set(cacheKey, products);

//     return new Response(JSON.stringify(products), {
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('❌ خطأ أثناء جلب البيانات:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 500,
//     });
//   }
// }

// // POST: إنشاء منتج جديد
// export async function POST(req) {
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) {
    return new Response(JSON.stringify({ error: 'يجب تسجيل الدخول لإنشاء منتج' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'صيغة الطلب غير صالحة' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return new Response(JSON.stringify({ error: 'بيانات المنتج غير صالحة' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const categoryId = Number.parseInt(data.categoryId, 10);
  const basePrice = Number(data.basePrice);
  const stockQuantity = data.stockQuantity === undefined ? 1 : Number(data.stockQuantity);
  if (!title || title.length > 200 || !Number.isInteger(categoryId) || categoryId < 1 ||
      !Number.isFinite(basePrice) || basePrice < 0 || !Number.isInteger(stockQuantity) || stockQuantity < 0 ||
      !Array.isArray(data.images || []) || (data.images || []).some((image) => typeof image !== 'string')) {
    return new Response(JSON.stringify({ error: 'يرجى التحقق من العنوان والفئة والسعر والمخزون والصور' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const owner = await prisma.user.findUnique({
      where: { id: authenticatedUser.id },
      select: { userName: true, userImage: true },
    });
    if (!owner) {
      return new Response(JSON.stringify({ error: 'المستخدم غير موجود' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        userId: authenticatedUser.id,
        userName: owner.userName,
        userImage: owner.userImage,
        categoryId,
        categoryName: typeof data.categoryName === 'string' ? data.categoryName.trim().slice(0, 120) : '',
        images: (data.images || []).slice(0, 20),
        basePrice: Math.floor(basePrice),
        adCategory: typeof data.adCategory === 'string' ? data.adCategory.slice(0, 80) : null,
        city: typeof data.city === 'string' ? data.city.slice(0, 120) : null,
        town: typeof data.town === 'string' ? data.town.slice(0, 120) : null,
        phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber.slice(0, 40) : null,
        lng: Number.isFinite(Number(data.lng)) && data.lng !== '' ? Number(data.lng) : null,
        lat: Number.isFinite(Number(data.lat)) && data.lat !== '' ? Number(data.lat) : null,
        link: typeof data.link === 'string' ? data.link.slice(0, 2000) : '',
        description: typeof data.description === 'string' ? data.description.slice(0, 10000) : null,
        details: data.details && typeof data.details === 'object' && !Array.isArray(data.details) ? data.details : undefined,
        stockQuantity,
      },
    });

    cache.clear();
    return new Response(JSON.stringify({ message: 'تم إنشاء المنتج بنجاح', product: newProduct }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Product creation failed:', error);
    return new Response(JSON.stringify({ error: 'تعذر إنشاء المنتج. تحقق من الفئة والبيانات المدخلة.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT: تحديث منتج موجود
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'يجب تسجيل الدخول لتحديث المنتج' }),
      { status: 401 }
    );
  }

  try {
    const { id, ...data } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'رقم المنتج مطلوب' }), {
        status: 400,
      });
    }

    // التحقق من وجود المنتج وملكيته
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: id,
        userId: userId, // التأكد من أن المستخدم هو المالك
        isDeleted: false,
      },
    });

    if (!existingProduct) {
      return new Response(
        JSON.stringify({
          error: 'المنتج غير موجود أو ليس لديك صلاحية التعديل',
        }),
        { status: 404 }
      );
    }

    // تحديث البيانات
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        title: data.title,
        categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
        categoryName: data.categoryName,
        images: data.images,
        basePrice: data.basePrice ? parseInt(data.basePrice) : undefined,
        adCategory: data.adCategory,
        city: data.city,
        town: data.town,
        phoneNumber: data.phoneNumber,
        lng: data.lng ? parseFloat(data.lng) : undefined,
        lat: data.lat ? parseFloat(data.lat) : undefined,
        link: data.link,
        description: data.description,
        details: data.details,
        stockQuantity: data.stockQuantity
          ? parseInt(data.stockQuantity)
          : undefined,
        updatedAt: new Date(),
      },
    });

    // مسح الكاش
    cache.clear();

    return new Response(
      JSON.stringify({
        message: 'تم تحديث المنتج بنجاح',
        product: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('خطأ أثناء تحديث المنتج:', error);
    return new Response(
      JSON.stringify({
        error: 'خطأ داخلي في السيرفر',
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

// DELETE: حذف منتج (Soft Delete)
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'يجب تسجيل الدخول لحذف المنتج' }),
      { status: 401 }
    );
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'يجب توفير معرف المنتج' }), {
        status: 400,
      });
    }

    // التحقق من وجود المنتج وملكيته
    const product = await prisma.product.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'المنتج غير موجود أو ليس لديك صلاحية الحذف' }),
        { status: 404 }
      );
    }

    // soft delete بدلاً من الحذف الفعلي
    await prisma.product.update({
      where: { id: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // مسح الكاش
    cache.clear();

    return new Response(JSON.stringify({ message: 'تم حذف المنتج بنجاح' }), {
      status: 200,
    });
  } catch (error) {
    console.error('خطأ أثناء حذف المنتج:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ داخلي' }), {
      status: 500,
    });
  }
}
