import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { publicProductWhere } from '@/lib/api/public-product-where.mjs';
import { getPagination } from '@/lib/api/validation.mjs';

export async function GET(req, { params }) {
  const { id } = await params;
  const url = new URL(req.url);
  const { page, limit, skip } = getPagination(url.searchParams, {
    defaultPage: 1,
    defaultLimit: 5,
    maxLimit: 50,
  });

  try {
    if (typeof id !== 'string' || !id.trim() || id.length > 128) {
      return new Response(
        JSON.stringify({ message: 'يجب توفير معرف المستخدم' }),
        { status: 400 }
      );
    }

    // التحقق من وجود Prisma
    if (!prisma?.product) {
      throw new Error('جدول product غير موجود.');
    }

    // جلب البيانات من قاعدة البيانات
    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where: publicProductWhere({ userId: id }) }),
      prisma.product.findMany({
        where: publicProductWhere({ userId: id }),
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    if (products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'لم يتم العثور على إعلانات' }),
        { status: 404 }
      );
    }

    // تنسيق النتيجة
    const result = {
      hasMore: skip + products.length < totalCount,
      count: totalCount,
      data: products,
      meta: { cached: false, source: 'database' },
    };

    // تخزين في الذاكرة المؤقتة
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(JSON.stringify({ error: 'تعذر تحميل الإعلانات حاليًا' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req, { params }) {
  const { id: productId } = await params;
  const authenticatedUser = await getAuthenticatedUser();
  if (!authenticatedUser) {
    return new Response(JSON.stringify({ error: 'يجب تسجيل الدخول' }), { status: 401 });
  }
  if (!productId) {
    return new Response(JSON.stringify({ error: 'معرف المنتج مطلوب' }), { status: 400 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id: productId, userId: authenticatedUser.id, isDeleted: false },
      select: { id: true },
    });
    if (!product) {
      return new Response(JSON.stringify({ error: 'المنتج غير موجود أو لا تملك صلاحية حذفه' }), { status: 404 });
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return new Response(JSON.stringify({ message: 'تم حذف الإعلان بنجاح' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
