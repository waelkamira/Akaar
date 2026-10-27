import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const categoryCounts = await prisma.product.groupBy({
      by: ['categoryId'],
      where: { isDeleted: false, isActive: true },
      _count: { _all: true },
    });

    const counts = Object.fromEntries(
      categoryCounts.map(({ categoryId, _count }) => [
        categoryId,
        _count._all,
      ]),
    );

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Unable to load category product counts:', error);
    return NextResponse.json(
      { error: 'Unable to load category product counts.' },
      { status: 500 },
    );
  }
}
