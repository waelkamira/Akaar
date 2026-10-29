import { NextResponse } from 'next/server';
import { getSellerAccount } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const { user, seller } = await getSellerAccount();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لفتح لوحة البائع.' }, { status: 401 });
  if (!seller || (user.role !== 'SELLER' && seller.status === 'ACTIVE')) {
    return NextResponse.json({ seller: null });
  }

  const sellerProfile = {
    id: seller.id,
    storeName: seller.storeName,
    slug: seller.slug,
    description: seller.description,
    logo: seller.logo,
    status: seller.status,
    isVerified: seller.isVerified,
    contactName: seller.contactName,
    contactEmail: seller.contactEmail,
    phoneNumber: seller.phoneNumber,
    residence: seller.residence,
    latitude: seller.latitude,
    longitude: seller.longitude,
    businessType: seller.businessType,
    sellingCategories: seller.sellingCategories,
    intendedProducts: seller.intendedProducts,
    facebookUrl: seller.facebookUrl,
    youtubeUrl: seller.youtubeUrl,
    twitterUrl: seller.twitterUrl,
  };

  if (seller.status !== 'ACTIVE' || !seller.isVerified) {
    return NextResponse.json({ seller: sellerProfile });
  }

  try {
    const productWhere = { OR: [{ sellerId: seller.id }, { userId: user.id }] };
    const [
      productCount,
      stock,
      revenue,
      pendingFulfillment,
      propertyCount,
      activePropertyCount,
      products,
      vendorOrders,
      properties,
    ] = await Promise.all([
      prisma.product.count({ where: { ...productWhere, isDeleted: false } }),
      prisma.product.aggregate({
        where: { ...productWhere, isDeleted: false },
        _sum: { stockQuantity: true },
      }),
      prisma.orderItem.aggregate({
        where: {
          vendorOrder: {
            is: { sellerId: seller.id, status: 'DELIVERED' },
          },
        },
        _sum: { totalPrice: true },
      }),
      prisma.vendorOrder.count({
        where: { sellerId: seller.id, status: { in: ['PENDING', 'PROCESSING'] } },
      }),
      prisma.property.count({ where: { userId: user.id } }),
      prisma.property.count({ where: { userId: user.id, isPublished: true, status: 'AVAILABLE' } }),
      prisma.product.findMany({
        where: { ...productWhere, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: {
          id: true,
          title: true,
          images: true,
          basePrice: true,
          stockQuantity: true,
          isActive: true,
          approvalStatus: true,
        },
      }),
      prisma.vendorOrder.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          order: {
            select: {
              id: true,
              createdAt: true,
              customerName: true,
              phoneNumber: true,
              shippingCity: true,
              shippingAddress: true,
            },
          },
          items: {
            select: {
              id: true,
              quantity: true,
              totalPrice: true,
              product: { select: { title: true } },
            },
          },
        },
      }),
      prisma.property.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: {
          id: true,
          title: true,
          price: true,
          currency: true,
          location: true,
          city: true,
          status: true,
          isPublished: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      seller: sellerProfile,
      metrics: {
        productCount,
        stockCount: stock._sum.stockQuantity || 0,
        revenue: revenue._sum.totalPrice || 0,
        pendingFulfillment,
        propertyCount,
        activePropertyCount,
      },
      products,
      vendorOrders,
      properties,
    });
  } catch (error) {
    console.error('Unable to load seller dashboard:', error);
    return NextResponse.json({ error: 'تعذر تحميل لوحة البائع.' }, { status: 500 });
  }
}
