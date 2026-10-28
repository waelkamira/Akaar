import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { LRUCache } from 'lru-cache';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { getPagination, isPaginationOffsetOutOfRange, isPlainObject, parseOptionalNumber } from '@/lib/api/validation.mjs';
import { isValidProductMutationIdentifier } from '@/lib/api/product-mutation-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { areValidProductImageUrls, isValidProductLink } from '@/lib/api/product-media-validation.mjs';
import { getCanonicalCategoryFields } from '@/lib/api/product-category.mjs';

const cache = new LRUCache({ max: 100, ttl: 60_000 });
const MAX_PAGE_SIZE = 50;
const productOwnerSelect = { id: true, userName: true, userImage: true };

function readPageParams(searchParams) {
  return getPagination(searchParams, { defaultPage: 1, defaultLimit: 5, maxLimit: MAX_PAGE_SIZE });
}

async function readJson(request) {
  const parsedBody = await readJsonBody(request, 128 * 1024);
  if (!parsedBody.ok || !isPlainObject(parsedBody.value)) return parsedBody;
  return parsedBody;
}



export async function GET(request) {
  const rateLimit = await consumeDurableRateLimit({ request, scope: 'product-catalog', limit: 120, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    const status = rateLimit.reason || !rateLimit.configured ? 503 : 429;
    const headers = rateLimit.retryAfterSeconds ? { 'Retry-After': String(rateLimit.retryAfterSeconds) } : undefined;
    return NextResponse.json({ error: status === 429 ? 'تم تجاوز حد طلبات المنتجات. حاول بعد قليل.' : 'خدمة الحماية غير متاحة حاليًا.' }, { status, headers });
  }


  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = readPageParams(searchParams);
  const cacheKey = `products-page-${page}-limit-${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const where = { isDeleted: false, isActive: true, category: { isActive: true } };
    // Avoid an extra COUNT query for normal catalog pages; verify unusually deep
    // offsets before asking PostgreSQL to skip through a large result set.
    if (skip > 1000) {
      const totalCount = await prisma.product.count({ where });
      if (isPaginationOffsetOutOfRange(skip, totalCount)) {
        return NextResponse.json([]);
      }
    }
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: productOwnerSelect } },
    });
    cache.set(cacheKey, products);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Unable to load products:', error);
    return NextResponse.json({ error: 'Unable to load products.' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لإنشاء منتج' }, { status: 401 });

  const parsedBody = await readJson(request);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  if (!isPlainObject(parsedBody.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة' }, { status: 400 });
  const body = parsedBody.value;

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const categoryId = parseOptionalNumber(body.categoryId, { integer: true, min: 1 });
  const basePrice = parseOptionalNumber(body.basePrice, { min: 0 });
  const stockQuantity = body.stockQuantity === undefined
    ? 1
    : parseOptionalNumber(body.stockQuantity, { integer: true, min: 0 });
  const images = body.images === undefined ? [] : body.images;

  if (!title || title.length > 200 || categoryId === undefined || categoryId === null ||
      basePrice === undefined || basePrice === null || stockQuantity === undefined || stockQuantity === null ||
      !areValidProductImageUrls(images) ||
      (body.link !== undefined && !isValidProductLink(body.link))) {
    return NextResponse.json({ error: 'يرجى التحقق من العنوان والفئة والسعر والمخزون والصور' }, { status: 400 });
  }

  try {
    const [owner, category] = await Promise.all([
      prisma.user.findUnique({ where: { id: user.id }, select: productOwnerSelect }),
      prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, name: true, isActive: true } }),
    ]);
    if (!owner) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 401 });
    if (!category || !category.isActive) return NextResponse.json({ error: 'الفئة غير موجودة أو غير مفعلة' }, { status: 400 });
    const categoryFields = getCanonicalCategoryFields(category);
    if (!categoryFields) return NextResponse.json({ error: 'بيانات الفئة غير صالحة' }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        title,
        userId: user.id,
        userName: owner.userName,
        userImage: owner.userImage,
        ...categoryFields,
        images,
        basePrice: Math.floor(basePrice),
        adCategory: typeof body.adCategory === 'string' ? body.adCategory.slice(0, 80) : null,
        city: typeof body.city === 'string' ? body.city.slice(0, 120) : null,
        town: typeof body.town === 'string' ? body.town.slice(0, 120) : null,
        phoneNumber: typeof body.phoneNumber === 'string' ? body.phoneNumber.slice(0, 40) : null,
        lng: parseOptionalNumber(body.lng) ?? null,
        lat: parseOptionalNumber(body.lat) ?? null,
        link: typeof body.link === 'string' ? body.link.trim() : '',
        description: typeof body.description === 'string' ? body.description.slice(0, 10000) : null,
        details: body.details && typeof body.details === 'object' && !Array.isArray(body.details) ? body.details : undefined,
        stockQuantity,
      },
    });
    cache.clear();
    return NextResponse.json({ message: 'تم إنشاء المنتج بنجاح', product }, { status: 201 });
  } catch (error) {
    console.error('Product creation failed:', error);
    return NextResponse.json({ error: 'تعذر إنشاء المنتج. تحقق من الفئة والبيانات المدخلة.' }, { status: 400 });
  }
}

export async function PUT(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لتحديث المنتج' }, { status: 401 });

  const parsedBody = await readJson(request);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  if (!isPlainObject(parsedBody.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة' }, { status: 400 });
  const body = parsedBody.value;
  const id = body.id;
  if (!isValidProductMutationIdentifier(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح' }, { status: 400 });

  try {
    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: 'المنتج غير موجود أو لا تملك صلاحية تعديله' }, { status: 404 });

    const data = {};
    if (typeof body.title === 'string') {
      const title = body.title.trim();
      if (!title || title.length > 200) return NextResponse.json({ error: 'عنوان المنتج غير صالح' }, { status: 400 });
      data.title = title;
    }
    if (body.categoryId !== undefined) {
      const categoryId = parseOptionalNumber(body.categoryId, { integer: true, min: 1 });
      if (categoryId === null || categoryId === undefined) return NextResponse.json({ error: 'الفئة غير صالحة' }, { status: 400 });
      const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, name: true, isActive: true } });
      if (!category || !category.isActive) return NextResponse.json({ error: 'الفئة غير موجودة أو غير مفعلة' }, { status: 400 });
      const categoryFields = getCanonicalCategoryFields(category);
      if (!categoryFields) return NextResponse.json({ error: 'بيانات الفئة غير صالحة' }, { status: 400 });
      Object.assign(data, categoryFields);
    }
    if (body.basePrice !== undefined) {
      const price = parseOptionalNumber(body.basePrice, { min: 0 });
      if (price === null || price === undefined) return NextResponse.json({ error: 'السعر غير صالح' }, { status: 400 });
      data.basePrice = Math.floor(price);
    }
    if (body.stockQuantity !== undefined) {
      const stock = parseOptionalNumber(body.stockQuantity, { integer: true, min: 0 });
      if (stock === null || stock === undefined) return NextResponse.json({ error: 'المخزون غير صالح' }, { status: 400 });
      data.stockQuantity = stock;
    }
    if (body.images !== undefined) {
      if (!areValidProductImageUrls(body.images)) {
        return NextResponse.json({ error: 'قائمة الصور غير صالحة' }, { status: 400 });
      }
      data.images = body.images;
    }
    for (const field of ['adCategory', 'city', 'town', 'phoneNumber', 'description']) {
      if (body[field] === null || typeof body[field] === 'string') data[field] = body[field];
    }
    if (body.link !== undefined) {
      if (!isValidProductLink(body.link)) {
        return NextResponse.json({ error: 'رابط المنتج غير صالح؛ استخدم رابط HTTP أو HTTPS صحيحًا.' }, { status: 400 });
      }
      data.link = typeof body.link === 'string' ? body.link.trim() : body.link;
    }
    if (body.details && typeof body.details === 'object' && !Array.isArray(body.details)) data.details = body.details;
    if (!Object.keys(data).length) return NextResponse.json({ error: 'لا توجد حقول صالحة للتحديث' }, { status: 400 });

    const product = await prisma.product.update({ where: { id }, data, include: { user: { select: productOwnerSelect } } });
    cache.clear();
    return NextResponse.json({ message: 'تم تحديث المنتج بنجاح', product });
  } catch (error) {
    console.error('Product update failed:', error);
    return NextResponse.json({ error: 'تعذر تحديث المنتج.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لحذف المنتج' }, { status: 401 });

  const parsedBody = await readJson(request);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  if (!isPlainObject(parsedBody.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة' }, { status: 400 });
  const body = parsedBody.value;
  const id = body.id;
  if (!isValidProductMutationIdentifier(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح' }, { status: 400 });

  try {
    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: 'المنتج غير موجود أو لا تملك صلاحية حذفه' }, { status: 404 });

    await prisma.product.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
    cache.clear();
    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (error) {
    console.error('Product deletion failed:', error);
    return NextResponse.json({ error: 'تعذر حذف المنتج.' }, { status: 500 });
  }
}
