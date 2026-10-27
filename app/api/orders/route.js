import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { getPagination, isPaginationOffsetOutOfRange } from '@/lib/api/validation.mjs';

export async function GET(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لعرض الطلبات.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 50,
  });

  try {
    const where = { userId: user.id };
    const totalCount = await prisma.order.count({ where });
    if (isPaginationOffsetOutOfRange(skip, totalCount)) {
      return NextResponse.json({ orders: [], page, limit, totalCount, hasMore: false });
    }

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          productId: true,
          quantity: true,
          totalPrice: true,
          status: true,
          fulfillmentStatus: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: { id: true, title: true, images: true, basePrice: true, categoryName: true },
          },
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true,
              product: {
                select: { id: true, title: true, images: true, basePrice: true, categoryName: true },
              },
            },
          },
          payments: {
            select: { id: true, amount: true, method: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

    return NextResponse.json({
      orders,
      page,
      limit,
      totalCount,
      hasMore: skip + orders.length < totalCount,
    });
  } catch (error) {
    console.error('Unable to load order history:', error);
    return NextResponse.json({ error: 'تعذر تحميل الطلبات حاليًا.' }, { status: 500 });
  }
}
