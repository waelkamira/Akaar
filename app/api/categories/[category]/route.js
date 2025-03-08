import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { toInteger } from 'lodash';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { category } = params;
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  // console.log('category من داخل الدالة', category);

  // الحصول على قيم الصفحة والحد الأقصى مع قيم افتراضية
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 8;
  const skip = (page - 1) * limit;

  try {
    // جلب العدد الإجمالي للمنتجات
    const totalCount = await prisma.product.count({
      where: { category: toInteger(category) },
    });

    // جلب المنتجات
    const products = await prisma.product.findMany({
      where: { category: toInteger(category) }, // تصفية البيانات حسب الفئة
      skip, // تخطي عدد معين من العناصر
      take: limit, // الحد الأقصى للعناصر
      orderBy: { createdAt: 'desc' }, // ترتيب العناصر حسب التاريخ
    });

    // إرجاع البيانات مع العدد الإجمالي
    return NextResponse.json({
      data: products,
      hasMore: skip + products.length < totalCount,
      totalCount, // إضافة totalCount إلى الرد
    });
  } catch (error) {
    console.error('❌ خطأ أثناء جلب البيانات:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // إغلاق اتصال Prisma بعد الانتهاء
  }
}
