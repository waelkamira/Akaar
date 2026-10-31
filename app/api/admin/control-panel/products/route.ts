import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { getPagination, isPlainObject, parseOptionalNumber } from '@/lib/api/validation.mjs';
import { areValidProductImageUrls, isValidProductLink } from '@/lib/api/product-media-validation.mjs';
import { getCanonicalCategoryFields } from '@/lib/api/product-category.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

const productSelect = {
  id: true,
  title: true,
  description: true,
  categoryId: true,
  categoryName: true,
  images: true,
  basePrice: true,
  usdPriceCents: true,
  stockQuantity: true,
  city: true,
  town: true,
  phoneNumber: true,
  link: true,
  isActive: true,
  isDeleted: true,
  approvalStatus: true,
  createdAt: true,
  user: { select: { id: true, email: true } },
  seller: { select: { id: true, storeName: true } },
} satisfies Prisma.ProductSelect;

export async function GET(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = getPagination(searchParams, { defaultPage: 1, defaultLimit: 20, maxLimit: 50 });
  try {
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
      prisma.seller.findMany({ orderBy: { storeName: 'asc' }, select: { id: true, storeName: true, userId: true } }),
    ]);

    return NextResponse.json({
      items,
      categories,
      users,
      stores,
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
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 128 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const categoryId = parseOptionalNumber(body.categoryId, { integer: true, min: 1 });
  const basePrice = parseOptionalNumber(body.basePrice, { integer: true, min: 0 });
  const usdPriceCents = body.usdPriceCents === undefined || body.usdPriceCents === null || body.usdPriceCents === ''
    ? null
    : parseOptionalNumber(body.usdPriceCents, { integer: true, min: 50, max: 99_999_999 });
  const stockQuantity = body.stockQuantity === undefined ? 0 : parseOptionalNumber(body.stockQuantity, { integer: true, min: 0 });
  const images = body.images === undefined ? [] : body.images;
  const link = body.link === undefined ? '' : body.link;

  if (!title || title.length > 200 || !userId || userId.length > 128 ||
    categoryId === undefined || categoryId === null ||
    basePrice === undefined || basePrice === null ||
    (body.usdPriceCents !== undefined && body.usdPriceCents !== null && body.usdPriceCents !== '' &&
      (usdPriceCents === undefined || usdPriceCents === null)) ||
    stockQuantity === undefined || stockQuantity === null ||
    !areValidProductImageUrls(images) || !isValidProductLink(link)) {
    return NextResponse.json({ error: 'تحقق من الاسم والمالك والفئة والسعر والمخزون والصور والرابط.' }, { status: 400 });
  }

  const sellerId = body.sellerId === undefined || body.sellerId === '' ? null : body.sellerId;
  if (sellerId !== null && (typeof sellerId !== 'string' || sellerId.length > 128)) {
    return NextResponse.json({ error: 'المتجر المحدد غير صالح.' }, { status: 400 });
  }

  try {
    const [owner, category, seller] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, userName: true, userImage: true } }),
      prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, name: true, isActive: true } }),
      sellerId ? prisma.seller.findUnique({ where: { id: sellerId }, select: { id: true, userId: true } }) : null,
    ]);
    if (!owner) return NextResponse.json({ error: 'المستخدم المالك غير موجود.' }, { status: 404 });
    if (!category || !category.isActive) return NextResponse.json({ error: 'الفئة غير موجودة أو غير مفعلة.' }, { status: 400 });
    if (sellerId && (!seller || seller.userId !== owner.id)) return NextResponse.json({ error: 'المتجر لا يتبع المستخدم المحدد.' }, { status: 400 });
    const categoryFields = getCanonicalCategoryFields(category);
    if (!categoryFields) return NextResponse.json({ error: 'بيانات الفئة غير صالحة.' }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        title,
        userId: owner.id,
        sellerId,
        userName: owner.userName,
        userImage: owner.userImage,
        ...categoryFields,
        images,
        basePrice,
        usdPriceCents,
        stockQuantity,
        description: typeof body.description === 'string' ? body.description.trim().slice(0, 10000) || null : null,
        city: typeof body.city === 'string' ? body.city.trim().slice(0, 120) || null : null,
        town: typeof body.town === 'string' ? body.town.trim().slice(0, 120) || null : null,
        phoneNumber: typeof body.phoneNumber === 'string' ? body.phoneNumber.trim().slice(0, 40) || null : null,
        link,
        approvalStatus: 'APPROVED',
        isActive: true,
      },
      select: productSelect,
    });
    return NextResponse.json({ item: product }, { status: 201 });
  } catch (error) {
    console.error('Unable to create control panel product:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المنتج.' }, { status: 500 });
  }
}
