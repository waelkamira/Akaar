import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// أفضل ممارسة: مشاركة نسخة واحدة من PrismaClient عبر التطبيق
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { keyword, page = 1, limit = 8 } = body;

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Valid keyword is required' },
        { status: 400 }
      );
    }

    // التحقق من صحة قيم الصفحة والحد
    const parsedPage = Math.max(1, parseInt(page.toString()) || 1);
    const parsedLimit = Math.max(
      1,
      Math.min(100, parseInt(limit.toString()) || 8)
    );

    // البحث مع تضمين العلاقات إذا لزم الأمر
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [{ title: { contains: keyword, mode: 'insensitive' } }],
        },
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
      }),
      prisma.product.count({
        where: {
          OR: [{ title: { contains: keyword, mode: 'insensitive' } }],
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      totalCount,
      hasMore: totalCount > parsedPage * parsedLimit,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        // في بيئة الإنتاج، لا ترسل تفاصيل الخطأ للعميل
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    // تأكد من إغلاق اتصال Prisma
    await prisma.$disconnect();
  }
}
