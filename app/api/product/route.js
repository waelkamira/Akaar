// import { PrismaClient } from '@prisma/client';
// import { LRUCache } from 'lru-cache';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth/options';

// const prisma = new PrismaClient();
// const cache = new LRUCache({
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
//       where: { isDeleted: false }, // فقط المنتجات غير المحذوفة
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
//   const session = await getServerSession(authOptions);
//   const user = session?.user;
//   const userId = user?.id;

//   if (!userId) {
//     return new Response(
//       JSON.stringify({ error: 'يجب تسجيل الدخول لإنشاء منتج' }),
//       { status: 401 }
//     );
//   }

//   try {
//     const data = await req.json();
//     console.log('Data received from client:', data);

//     // التحقق من وجود المستخدم في قاعدة البيانات
//     const existingUser = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!existingUser) {
//       console.error(`User with ID ${userId} not found in database.`);
//       return new Response(
//         JSON.stringify({ error: 'المستخدم غير موجود في قاعدة البيانات.' }),
//         { status: 400 }
//       );
//     }

//     // إنشاء المنتج مع الحقول الجديدة
//     const newProduct = await prisma.product.create({
//       data: {
//         title: data?.title,
//         userId: userId,
//         userName: existingUser.userName, // استخدام اسم المستخدم من قاعدة البيانات
//         userImage: existingUser.userImage, // استخدام صورة المستخدم من قاعدة البيانات
//         categoryId: parseInt(data?.categoryId) || 1,
//         categoryName: data?.categoryName,
//         images: data?.images || [], // استخدام مصفوفة الصور الجديدة
//         basePrice: parseInt(data?.basePrice) || 0,
//         adCategory: data?.adCategory,
//         city: data?.city,
//         town: data?.town,
//         phoneNumber: data?.phoneNumber,
//         lng: data?.lng ? parseFloat(data.lng) : null,
//         lat: data?.lat ? parseFloat(data.lat) : null,
//         link: data?.link || '',
//         description: data?.description,
//         details: data?.details,
//         stockQuantity: parseInt(data?.stockQuantity) || 1,
//       },
//     });

//     // مسح الكاش لأن البيانات تغيرت
//     cache.clear();

//     return new Response(
//       JSON.stringify({
//         message: 'تم إنشاء المنتج بنجاح',
//         product: newProduct,
//       }),
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('خطأ أثناء إنشاء المنتج:', error);
//     return new Response(
//       JSON.stringify({
//         error: 'Internal Server Error',
//         details: error.message,
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

// // PUT: تحديث منتج موجود
// export async function PUT(req) {
//   const session = await getServerSession(authOptions);
//   const userId = session?.user?.id;

//   if (!userId) {
//     return new Response(
//       JSON.stringify({ error: 'يجب تسجيل الدخول لتحديث المنتج' }),
//       { status: 401 }
//     );
//   }

//   try {
//     const { id, ...data } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: 'رقم المنتج مطلوب' }), {
//         status: 400,
//       });
//     }

//     // التحقق من وجود المنتج وملكيته
//     const existingProduct = await prisma.product.findFirst({
//       where: {
//         id: id,
//         userId: userId, // التأكد من أن المستخدم هو المالك
//         isDeleted: false,
//       },
//     });

//     if (!existingProduct) {
//       return new Response(
//         JSON.stringify({
//           error: 'المنتج غير موجود أو ليس لديك صلاحية التعديل',
//         }),
//         { status: 404 }
//       );
//     }

//     // تحديث البيانات
//     const updatedProduct = await prisma.product.update({
//       where: { id: id },
//       data: {
//         title: data.title,
//         categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
//         categoryName: data.categoryName,
//         images: data.images,
//         basePrice: data.basePrice ? parseInt(data.basePrice) : undefined,
//         adCategory: data.adCategory,
//         city: data.city,
//         town: data.town,
//         phoneNumber: data.phoneNumber,
//         lng: data.lng ? parseFloat(data.lng) : undefined,
//         lat: data.lat ? parseFloat(data.lat) : undefined,
//         link: data.link,
//         description: data.description,
//         details: data.details,
//         stockQuantity: data.stockQuantity
//           ? parseInt(data.stockQuantity)
//           : undefined,
//         updatedAt: new Date(),
//       },
//     });

//     // مسح الكاش
//     cache.clear();

//     return new Response(
//       JSON.stringify({
//         message: 'تم تحديث المنتج بنجاح',
//         product: updatedProduct,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('خطأ أثناء تحديث المنتج:', error);
//     return new Response(
//       JSON.stringify({
//         error: 'خطأ داخلي في السيرفر',
//         details: error.message,
//       }),
//       { status: 500 }
//     );
//   }
// }

// // DELETE: حذف منتج (Soft Delete)
// export async function DELETE(req) {
//   const session = await getServerSession(authOptions);
//   const userId = session?.user?.id;

//   if (!userId) {
//     return new Response(
//       JSON.stringify({ error: 'يجب تسجيل الدخول لحذف المنتج' }),
//       { status: 401 }
//     );
//   }

//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: 'يجب توفير معرف المنتج' }), {
//         status: 400,
//       });
//     }

//     // التحقق من وجود المنتج وملكيته
//     const product = await prisma.product.findFirst({
//       where: {
//         id: id,
//         userId: userId,
//       },
//     });

//     if (!product) {
//       return new Response(
//         JSON.stringify({ error: 'المنتج غير موجود أو ليس لديك صلاحية الحذف' }),
//         { status: 404 }
//       );
//     }

//     // soft delete بدلاً من الحذف الفعلي
//     await prisma.product.update({
//       where: { id: id },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(),
//       },
//     });

//     // مسح الكاش
//     cache.clear();

//     return new Response(JSON.stringify({ message: 'تم حذف المنتج بنجاح' }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error('خطأ أثناء حذف المنتج:', error);
//     return new Response(JSON.stringify({ error: 'حدث خطأ داخلي' }), {
//       status: 500,
//     });
//   }
// }
import { PrismaClient } from '@prisma/client';
import { LRUCache } from 'lru-cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();
const cache = new LRUCache({
  max: 100,
  ttl: 60 * 1000,
});

// GET: جلب المنتجات مع دعم التخزين المؤقت
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const page = parseInt(searchParams.get('page')) || 0;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;

  const cacheKey = `products-page-${page}-limit-${limit}`;

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
      where: { isDeleted: false }, // فقط المنتجات غير المحذوفة
      include: {
        user: {
          select: {
            userName: true,
            userImage: true,
            email: true,
          },
        },
      },
    });

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

// POST: إنشاء منتج جديد
export async function POST(req) {
  // const session = await getServerSession(authOptions);
  // const user = session?.user;
  // const userId = user?.id;
  // console.log('userId', userId);
  // console.log('user', user);
  // console.log('userId', userId);
  // if (!userId) {
  //   return new Response(
  //     JSON.stringify({ error: 'يجب تسجيل الدخول لإنشاء منتج' }),
  //     { status: 401 }
  //   );
  // }

  const data = await req.json();
  console.log('Data received from client:', data);
  try {
    // التحقق من وجود المستخدم في قاعدة البيانات
    // const existingUser = await prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // if (!existingUser) {
    //   console.error(`User with ID ${userId} not found in database.`);
    //   return new Response(
    //     JSON.stringify({ error: 'المستخدم غير موجود في قاعدة البيانات.' }),
    //     { status: 400 }
    //   );
    // }

    // إنشاء المنتج مع الحقول الجديدة
    const newProduct = await prisma.product.create({
      data: {
        title: data?.title,
        userId: data.userId,
        userName: data.userName, // استخدام اسم المستخدم من قاعدة البيانات
        userImage: data.userImage, // استخدام صورة المستخدم من قاعدة البيانات
        categoryId: parseInt(data?.categoryId) || 1,
        categoryName: data?.categoryName,
        images: data?.images || [], // استخدام مصفوفة الصور الجديدة
        basePrice: parseInt(data?.basePrice) || 0,
        adCategory: data?.adCategory,
        city: data?.city,
        town: data?.town,
        phoneNumber: data?.phoneNumber,
        lng: data?.lng ? parseFloat(data.lng) : null,
        lat: data?.lat ? parseFloat(data.lat) : null,
        link: data?.link || '',
        description: data?.description,
        details: data?.details,
        stockQuantity: parseInt(data?.stockQuantity) || 1,
      },
    });

    // مسح الكاش لأن البيانات تغيرت
    cache.clear();

    return new Response(
      JSON.stringify({
        message: 'تم إنشاء المنتج بنجاح',
        product: newProduct,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('خطأ أثناء إنشاء المنتج:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error.message,
      }),
      {
        status: 500,
      }
    );
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
