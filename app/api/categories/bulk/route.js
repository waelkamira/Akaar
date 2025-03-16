import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قائمة الفئات من query string (مثل ?categories=1,2,3)
  const categoriesParam = searchParams.get('categories');
  if (!categoriesParam) {
    return NextResponse.json(
      { error: 'Missing categories parameter' },
      { status: 400 }
    );
  }

  // تحويل قائمة الفئات إلى مصفوفة من الأرقام
  const categoryIds = categoriesParam.split(',').map(Number);

  try {
    // جلب المنتجات لجميع الفئات باستخدام Promise.all
    const results = await Promise.all(
      categoryIds.map(async (categoryId) => {
        const products = await prisma.product.findMany({
          where: { categoryId }, // تصفية حسب الفئة
          take: 8, // الحد الأقصى للمنتجات لكل فئة
          orderBy: { createdAt: 'desc' }, // ترتيب حسب التاريخ
        });

        // إرجاع البيانات لكل فئة
        return {
          categoryId,
          products,
        };
      })
    );

    // تنسيق البيانات لإرجاعها
    const formattedData = results.reduce((acc, { categoryId, products }) => {
      acc[categoryId] = products;
      return acc;
    }, {});

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // إغلاق اتصال Prisma
  }
}
