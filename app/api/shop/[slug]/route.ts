import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug || slug.length > 80) {
    return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
  }

  try {
    const seller = await prisma.seller.findFirst({
      where: { slug, status: 'ACTIVE', isVerified: true },
      select: {
        id: true,
        storeName: true,
        slug: true,
        description: true,
        logo: true,
        products: {
          where: {
            isDeleted: false,
            isActive: true,
            approvalStatus: 'APPROVED',
            category: { isActive: true },
          },
          orderBy: { createdAt: 'desc' },
          take: 48,
          select: {
            id: true,
            title: true,
            description: true,
            images: true,
            basePrice: true,
            stockQuantity: true,
            categoryName: true,
            city: true,
          },
        },
      },
    });

    if (!seller) return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    return NextResponse.json({ seller });
  } catch (error) {
    console.error('Unable to load public storefront:', error);
    return NextResponse.json({ error: 'تعذر تحميل المتجر.' }, { status: 500 });
  }
}
