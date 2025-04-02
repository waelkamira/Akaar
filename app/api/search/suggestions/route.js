import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search in titles and descriptions
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            details: {
              path: ['$'],
              string_contains: query,
              mode: 'insensitive',
            },
          },
        ],
        isDeleted: false,
      },
      select: {
        title: true,
        description: true,
        details: true,
      },
      take: 5,
    });

    // Extract unique suggestions from titles and descriptions
    const suggestions = new Set();
    products.forEach((product) => {
      if (product.title) suggestions.add(product.title);
      if (product.description) suggestions.add(product.description);
      if (product.details) {
        Object.values(product.details).forEach((value) => {
          if (typeof value === 'string') suggestions.add(value);
        });
      }
    });

    return NextResponse.json({
      suggestions: Array.from(suggestions).slice(0, 5),
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الاقتراحات' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
