import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller, getSellerAccount } from '@/lib/auth/require-seller';
import { parseSellerApplicationDetails } from '@/lib/seller/application.mjs';
import { prisma } from '@/lib/db/prisma';

const availableVendorStatuses = ['PENDING', 'ACCEPTED', 'PROCESSING', 'READY_TO_SHIP'] as const;

export async function GET() {
  const { user, seller: accountSeller } = await getSellerAccount();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لفتح لوحة البائع.' }, { status: 401 });
  const sellerAccount = user.role === 'SELLER'
    ? accountSeller
    : (await getActiveSeller('seller.dashboard.read')).seller;
  if (!sellerAccount) return NextResponse.json({ seller: null });

  try {
    const [seller, account] = await Promise.all([
      prisma.seller.findUnique({
        where: { id: sellerAccount.id },
        select: {
          id: true,
          displayName: true,
          slug: true,
          description: true,
          sellerType: true,
          status: true,
          isVerified: true,
          countryCode: true,
          stores: {
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
            select: { id: true, name: true, slug: true, description: true, logoUrl: true, isActive: true },
          },
          verifications: {
            orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
            take: 1,
            select: { notes: true },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { email: true, userName: true, phone: true },
      }),
    ]);
    if (!seller || !account) return NextResponse.json({ seller: null });

    const application = parseSellerApplicationDetails(seller.verifications[0]?.notes);
    const store = seller.stores[0];
    const sellerProfile = {
      id: seller.id,
      storeName: store?.name ?? seller.displayName,
      slug: store?.slug ?? seller.slug,
      description: store?.description ?? seller.description,
      logo: store?.logoUrl ?? null,
      status: seller.status,
      isVerified: seller.isVerified,
      contactName: application?.contactName ?? account.userName,
      contactEmail: application?.contactEmail ?? account.email,
      phoneNumber: application?.phoneNumber ?? account.phone,
      residence: application?.residence ?? seller.countryCode,
      businessType: seller.sellerType,
      sellingCategories: application?.sellingCategories ?? null,
      intendedProducts: application?.intendedProducts ?? null,
      latitude: application?.latitude ?? null,
      longitude: application?.longitude ?? null,
      facebookUrl: application?.facebookUrl ?? null,
      youtubeUrl: application?.youtubeUrl ?? null,
      twitterUrl: application?.twitterUrl ?? null,
    };

    if (seller.status !== 'ACTIVE' || !seller.isVerified) {
      return NextResponse.json({ seller: sellerProfile }, { headers: { 'Cache-Control': 'private, no-store' } });
    }

    const storeIds = seller.stores.filter((item) => item.isActive).map((item) => item.id);
    const productWhere = { storeId: { in: storeIds }, deletedAt: null };
    const propertyWhere: Prisma.PropertyWhereInput = storeIds.length
      ? { OR: [{ ownerId: user.id }, { storeId: { in: storeIds } }] }
      : { ownerId: user.id };
    const now = new Date();
    const [
      productCount,
      products,
      inventory,
      deliveredOrderRows,
      pendingFulfillment,
      vendorOrders,
      propertyCount,
      activePropertyCount,
      properties,
    ] = await Promise.all([
      prisma.product.count({ where: productWhere }),
      prisma.product.findMany({
        where: productWhere,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 30,
        select: {
          id: true,
          title: true,
          status: true,
          isActive: true,
          deletedAt: true,
          media: {
            where: { mediaType: 'IMAGE' },
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
            select: { storageKey: true },
          },
          variants: {
            where: { status: 'ACTIVE' },
            select: {
              prices: {
                where: {
                  validFrom: { lte: now },
                  OR: [{ validUntil: null }, { validUntil: { gt: now } }],
                  currencyRef: { is: { isActive: true } },
                },
                orderBy: [{ currency: 'asc' }, { validFrom: 'desc' }],
                select: { amount: true, currency: true },
              },
              inventory: {
                where: { warehouse: { isActive: true } },
                select: { onHand: true, reserved: true },
              },
            },
          },
        },
      }),
      prisma.inventory.findMany({
        where: {
          warehouse: { isActive: true },
          variant: { product: { storeId: { in: storeIds }, deletedAt: null } },
        },
        select: { onHand: true, reserved: true },
      }),
      prisma.vendorOrder.findMany({
        where: { sellerId: seller.id, status: 'DELIVERED' },
        select: { grandTotal: true, order: { select: { currency: true } } },
      }),
      prisma.vendorOrder.count({
        where: { sellerId: seller.id, status: { in: [...availableVendorStatuses] } },
      }),
      prisma.vendorOrder.findMany({
        where: { sellerId: seller.id },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 30,
        select: {
          id: true,
          status: true,
          createdAt: true,
          order: {
            select: {
              id: true,
              createdAt: true,
              currency: true,
              addresses: {
                where: { type: 'SHIPPING' },
                take: 1,
                select: { fullName: true, phone: true, city: true, address1: true },
              },
            },
          },
          items: {
            select: { id: true, quantity: true, totalPrice: true, currency: true, productName: true },
          },
          shipments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              trackingNumber: true,
              carrier: { select: { name: true } },
            },
          },
        },
      }),
      prisma.property.count({ where: propertyWhere }),
      prisma.property.count({
        where: { AND: [propertyWhere, { isPublished: true, status: 'AVAILABLE' }] },
      }),
      prisma.property.findMany({
        where: propertyWhere,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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

    const stockCount = inventory.reduce(
      (sum, item) => sum + Math.max(0, item.onHand - item.reserved),
      0,
    );
    const revenueByCurrency = new Map<string, number>();
    for (const order of deliveredOrderRows) {
      const currency = order.order.currency;
      revenueByCurrency.set(currency, (revenueByCurrency.get(currency) ?? 0) + Number(order.grandTotal));
    }

    return NextResponse.json({
      seller: sellerProfile,
      metrics: {
        productCount,
        stockCount,
        revenue: [...revenueByCurrency].map(([currency, amount]) => ({ currency, amount })),
        pendingFulfillment,
        propertyCount,
        activePropertyCount,
      },
      products: products.map((product) => {
        const price = product.variants.flatMap((variant) => variant.prices)[0];
        const stockQuantity = product.variants.reduce((sum, variant) => sum + variant.inventory.reduce(
          (inventoryTotal, item) => inventoryTotal + Math.max(0, item.onHand - item.reserved),
          0,
        ), 0);
        return {
          id: product.id,
          title: product.title,
          images: product.media.map((media) => media.storageKey),
          basePrice: price ? Number(price.amount) : null,
          currency: price?.currency ?? null,
          stockQuantity,
          isActive: product.isActive && product.deletedAt === null,
          approvalStatus: product.status,
        };
      }),
      vendorOrders: vendorOrders.map((vendorOrder) => {
        const address = vendorOrder.order.addresses[0];
        const status = vendorOrder.status === 'ACCEPTED' || vendorOrder.status === 'READY_TO_SHIP'
          ? 'PROCESSING'
          : vendorOrder.status;
        const shipment = vendorOrder.shipments[0];
        return {
          id: vendorOrder.id,
          status,
          trackingNumber: shipment?.trackingNumber ?? null,
          totalPrice: Number(vendorOrder.grandTotal),
          currency: vendorOrder.order.currency,
          carrierName: shipment?.carrier?.name ?? null,
          order: {
            id: vendorOrder.order.id,
            createdAt: vendorOrder.order.createdAt,
            customerName: address?.fullName ?? null,
            phoneNumber: address?.phone ?? null,
            shippingCity: address?.city ?? null,
            shippingAddress: address?.address1 ?? null,
          },
          items: vendorOrder.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            totalPrice: Number(item.totalPrice),
            currency: item.currency,
            product: { title: item.productName },
          })),
        };
      }),
      properties: properties.map((property) => ({
        ...property,
        price: property.price.toString(),
      })),
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load seller dashboard:', error);
    return NextResponse.json({ error: 'تعذر تحميل لوحة البائع.' }, { status: 500 });
  }
}
