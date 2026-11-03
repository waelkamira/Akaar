import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject, parseOptionalNumber } from '@/lib/api/validation.mjs';
import { areValidProductImageUrls, isValidProductLink } from '@/lib/api/product-media-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';
import { getProductRatingSummaries } from '@/lib/reviews/ratings';

function makeProductSelect() {
  const now = new Date();
  return {
  id: true,
  title: true,
  description: true,
  status: true,
  isActive: true,
  deletedAt: true,
  createdAt: true,
  categories: { take: 1, select: { category: { select: { id: true, name: true } } } },
  media: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }], select: { storageKey: true } },
  store: {
    select: {
      name: true,
      seller: {
        select: {
          id: true,
          user: { select: { id: true, email: true, userName: true, imageUrl: true, phone: true } },
        },
      },
    },
  },
  variants: {
    where: { status: 'ACTIVE' },
    select: {
      prices: {
        where: {
          currency: 'USD',
          validFrom: { lte: now },
          OR: [{ validUntil: null }, { validUntil: { gt: now } }],
        },
        orderBy: { validFrom: 'desc' },
        take: 1,
        select: { amount: true },
      },
      inventory: { select: { onHand: true, reserved: true } },
    },
  },
  } satisfies Prisma.ProductSelect;
}

function toProductItem(product: Prisma.ProductGetPayload<{ select: ReturnType<typeof makeProductSelect> }>) {
  const variant = product.variants[0];
  const amount = variant?.prices[0]?.amount ?? null;
  const category = product.categories[0]?.category;
  const user = product.store.seller.user;
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    categoryId: category?.id ?? '',
    categoryName: category?.name ?? '',
    images: product.media.map((item) => item.storageKey),
    basePrice: amount === null ? null : Number(amount),
    usdPriceCents: amount === null ? null : Math.round(Number(amount) * 100),
    stockQuantity: product.variants.reduce(
      (total, item) => total + item.inventory.reduce((quantity, stock) => quantity + stock.onHand - stock.reserved, 0),
      0,
    ),
    city: null,
    town: null,
    phoneNumber: user.phone,
    link: null,
    isActive: product.isActive,
    isDeleted: Boolean(product.deletedAt),
    approvalStatus: product.status === 'REJECTED' ? 'REJECTED' : product.status === 'APPROVED' ? 'APPROVED' : 'PENDING',
    createdAt: product.createdAt,
    user: { id: user.id, email: user.email },
    seller: { id: product.store.seller.id, storeName: product.store.name },
  };
}

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  try {
    const productSelect = makeProductSelect();
    const [items, totalCount, categories, users, stores] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: productSelect,
      }),
      prisma.product.count(),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { id: true, name: true } }),
      prisma.user.findMany({ where: { status: 'ACTIVE' }, orderBy: { email: 'asc' }, select: { id: true, email: true } }),
      prisma.seller.findMany({
        where: { status: 'ACTIVE', isVerified: true },
        orderBy: { displayName: 'asc' },
        select: {
          id: true,
          userId: true,
          displayName: true,
          user: { select: { id: true } },
          stores: { where: { isActive: true }, orderBy: { createdAt: 'asc' }, take: 1, select: { name: true } },
        },
      }),
    ]);
    const ratings = await getProductRatingSummaries(items.map((item) => item.id));

    return NextResponse.json({
      items: items.map((item) => ({
        ...toProductItem(item),
        averageRating: ratings.get(item.id)?.average ?? null,
        reviewCount: ratings.get(item.id)?.count ?? 0,
      })),
      categories,
      users,
      stores: stores.map((seller) => ({
        id: seller.id,
        userId: seller.userId,
        storeName: seller.stores[0]?.name || seller.displayName,
      })),
      page,
      limit,
      totalCount,
      hasMore: skip + items.length < totalCount,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load control panel products:', error);
    return NextResponse.json({ error: 'تعذر تحميل المنتجات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.catalog.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 128 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const categoryId = typeof body.categoryId === 'string' && /^[0-9a-f-]{36}$/i.test(body.categoryId)
    ? body.categoryId
    : null;
  const basePrice = parseOptionalNumber(body.basePrice, { integer: true, min: 0 });
  const usdPriceCents = body.usdPriceCents === undefined || body.usdPriceCents === null || body.usdPriceCents === ''
    ? null
    : parseOptionalNumber(body.usdPriceCents, { integer: true, min: 50, max: 99_999_999 });
  const stockQuantity = body.stockQuantity === undefined ? 0 : parseOptionalNumber(body.stockQuantity, { integer: true, min: 0 });
  const images = body.images === undefined ? [] : body.images;
  const link = body.link === undefined ? '' : body.link;

  if (!title || title.length > 200 || !userId || userId.length > 128 ||
    !categoryId ||
    basePrice === undefined || basePrice === null ||
    (body.usdPriceCents !== undefined && body.usdPriceCents !== null && body.usdPriceCents !== '' &&
      (usdPriceCents === undefined || usdPriceCents === null)) ||
    stockQuantity === undefined || stockQuantity === null ||
    !areValidProductImageUrls(images) || !isValidProductLink(link) || (typeof link === 'string' && link.trim())) {
    return NextResponse.json({ error: 'تحقق من الاسم والمالك والفئة والسعر والمخزون والصور والرابط.' }, { status: 400 });
  }

  const sellerId = typeof body.sellerId === 'string' ? body.sellerId.trim() : '';
  if (!sellerId || !/^[0-9a-f-]{36}$/i.test(sellerId) || !/^[0-9a-f-]{36}$/i.test(userId)) {
    return NextResponse.json({ error: 'المتجر المحدد غير صالح.' }, { status: 400 });
  }

  try {
    const [owner, category, seller, store] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, isActive: true } }),
      prisma.seller.findUnique({
        where: { id: sellerId },
        select: { id: true, userId: true, status: true, isVerified: true },
      }),
      prisma.store.findFirst({
        where: { sellerId, isActive: true },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      }),
    ]);
    if (!owner) return NextResponse.json({ error: 'المستخدم المالك غير موجود.' }, { status: 404 });
    if (!category || !category.isActive) return NextResponse.json({ error: 'الفئة غير موجودة أو غير مفعلة.' }, { status: 400 });
    if (!seller || seller.userId !== owner.id || seller.status !== 'ACTIVE' || !seller.isVerified || !store) {
      return NextResponse.json({ error: 'المتجر المحدد غير نشط أو لا يتبع المستخدم.' }, { status: 400 });
    }

    const productSelect = makeProductSelect();
    const product = await prisma.$transaction(async (transaction) => {
      const warehouse = stockQuantity > 0
        ? await transaction.warehouse.findFirst({
            where: { sellerId, isActive: true },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
          })
        : null;
      if (stockQuantity > 0 && !warehouse) throw new Error('SELLER_WAREHOUSE_REQUIRED');
      const amount = new Prisma.Decimal(usdPriceCents === null ? basePrice : usdPriceCents / 100);
      const slugBase = title.normalize('NFKD').toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 80) || 'product';
      return transaction.product.create({
        data: {
          storeId: store.id,
          title,
          slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
          description: typeof body.description === 'string' ? body.description.trim().slice(0, 10000) || null : null,
          status: body.approvalStatus === 'PENDING' ? 'PENDING' : body.approvalStatus === 'REJECTED' ? 'REJECTED' : 'APPROVED',
          isActive: true,
          publishedAt: new Date(),
          categories: { create: { category: { connect: { id: categoryId } } } },
          media: { create: images.map((storageKey, sortOrder) => ({ storageKey, sortOrder, isPrimary: sortOrder === 0 })) },
          variants: {
            create: {
              sku: `AK-${randomUUID()}`,
              title: 'Standard',
              prices: { create: { currency: 'USD', amount } },
              ...(warehouse ? { inventory: { create: { warehouseId: warehouse.id, onHand: stockQuantity } } } : {}),
            },
          },
        },
        select: productSelect,
      });
    });
    return NextResponse.json({ item: toProductItem(product) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'SELLER_WAREHOUSE_REQUIRED') {
      return NextResponse.json({ error: 'يجب إعداد مستودع نشط للبائع قبل إضافة كمية للمخزون.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'تعذر إنشاء المنتج بسبب تعارض في رمز المخزون.' }, { status: 409 });
    }
    console.error('Unable to create control panel product:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المنتج.' }, { status: 500 });
  }
}
