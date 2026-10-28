import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض عقاراتك المحفوظة.' }, { status: 401 });

  try {
    const items = await prisma.propertyWishlist.findMany({
      where: { userId: user.id, property: { isPublished: true } },
      orderBy: { createdAt: 'desc' },
      take: 48,
      select: {
        createdAt: true,
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            location: true,
            city: true,
            images: true,
            status: true,
            type: true,
            store: { select: { name: true, slug: true } },
          },
        },
      },
    });
    return NextResponse.json({ properties: items.map((item) => ({ ...item.property, savedAt: item.createdAt })) }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    console.error('Unable to load saved properties:', error);
    return NextResponse.json({ error: 'تعذر تحميل العقارات المحفوظة.' }, { status: 500 });
  }
}
