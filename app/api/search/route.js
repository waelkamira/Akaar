import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { page, searshedKeyWord } = await req.json();
  const limit = 8; // عدد النتائج لكل صفحة
  const skip = (page - 1) * limit;

  try {
    // جلب العقارات المطابقة
    const properties = await prisma.product.findMany({
      where: {
        title: {
          contains: searshedKeyWord,
          mode: 'insensitive',
        },
      },
    });

    // ترتيب النتائج المدمجة بناءً على تاريخ الإنشاء
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // حساب العدد الإجمالي للنتائج
    const totalCount = properties.length;

    // تطبيق التخطي والتحديد
    const limitedResults = properties.slice(skip, skip + limit);

    // تحديد ما إذا كانت هناك المزيد من النتائج
    const hasMore = skip + limitedResults.length < totalCount;

    // إرسال البيانات المسترجعة
    const result = {
      totalCount,
      hasMore, // إضافة حقل لتحديد ما إذا كانت هناك المزيد من النتائج
      data: limitedResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching properties and cars:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
