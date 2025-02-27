import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
