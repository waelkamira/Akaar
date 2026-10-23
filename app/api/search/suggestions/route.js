import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim().slice(0, 120) || '';

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { categoryName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { title: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      distinct: ['title'],
    });

    return NextResponse.json({
      suggestions: products.map((product) => product.title).filter(Boolean),
    });
  } catch (error) {
    console.error('Search suggestions request failed:', error);
    return NextResponse.json(
      { error: 'Unable to load search suggestions.' },
      { status: 500 },
    );
  }
}
