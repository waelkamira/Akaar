import { NextResponse } from 'next/server';
import { consumeDurableRateLimit } from '@/lib/api/durable-rate-limit.mjs';
import { LRUCache } from 'lru-cache';
import { prisma } from '@/lib/db/prisma';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { getPagination, isPaginationOffsetOutOfRange, isPlainObject, parseOptionalNumber } from '@/lib/api/validation.mjs';
import { isValidProductMutationIdentifier } from '@/lib/api/product-mutation-validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { areValidProductImageUrls, isValidProductLink } from '@/lib/api/product-media-validation.mjs';
import { getCanonicalCategoryFields } from '@/lib/api/product-category.mjs';
import { getProductRatingSummaries } from '@/lib/reviews/ratings';

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
  const requestedCurrency = searchParams.get('currency') || 'USD';
  if (!/^[A-Za-z]{3}$/.test(requestedCurrency)) {
    return NextResponse.json({ error: 'العملة المحددة غير صالحة.' }, { status: 400 });
  }
  const currency = requestedCurrency.toUpperCase();
  const cacheKey = `products-page-v3-${page}-limit-${limit}-${currency}`;
  const cached = cache.get(cacheKey);
  try {
    if (cached) {
      const ratings = await getProductRatingSummaries(cached.map((product) => product.id));
      return NextResponse.json(cached.map((product) => ({
        ...product,
        averageRating: ratings.get(product.id)?.average ?? null,
        reviewCount: ratings.get(product.id)?.count ?? 0,
      })));
    }

    const now = new Date();
    const where = {
      isActive: true,
      status: 'APPROVED',
      store: { isActive: true, seller: { status: 'ACTIVE', isVerified: true } },
      categories: { some: { category: { isActive: true } } },
      variants: {
        some: {
          status: 'ACTIVE',
          prices: {
            some: {
              currency,
              validFrom: { lte: now },
              OR: [{ validUntil: null }, { validUntil: { gt: now } }],
              currencyRef: { isActive: true },
            },
          },
        },
      },
    };
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
      include: {
        categories: {
          where: { category: { isActive: true } },
          take: 1,
          include: { category: { select: { name: true } } },
        },
        media: {
          where: { mediaType: 'IMAGE' },
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          select: { storageKey: true },
        },
        store: {
          select: {
            name: true,
            slug: true,
            defaultLanguage: true,
            seller: {
              select: {
                warehouses: {
                  where: { isActive: true },
                  select: { city: true },
                  take: 1,
                },
              },
            },
          },
        },
        translations: { where: { language: 'ar' }, take: 1, select: { title: true, description: true } },
        variants: {
          where: {
            status: 'ACTIVE',
            prices: {
              some: {
                currency,
                validFrom: { lte: now },
                OR: [{ validUntil: null }, { validUntil: { gt: now } }],
                currencyRef: { isActive: true },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
          take: 10,
          include: {
            prices: {
              where: {
                currency,
                validFrom: { lte: now },
                OR: [{ validUntil: null }, { validUntil: { gt: now } }],
                currencyRef: { isActive: true },
              },
              orderBy: { validFrom: 'desc' },
              take: 1,
              include: { currencyRef: { select: { code: true, symbol: true, minorUnits: true } } },
            },
            inventory: {
              where: { warehouse: { isActive: true } },
              select: { onHand: true, reserved: true },
            },
          },
        },
      },
    });
    const productsForResponse = products.flatMap((product) => {
      const variant = product.variants.find((candidate) => candidate.prices.length > 0);
      const price = variant?.prices[0];
      if (!variant || !price) return [];
      const stockQuantity = variant.inventory.reduce(
        (total, inventory) => total + Math.max(0, inventory.onHand - inventory.reserved),
        0,
      );
      const images = product.media.map((media) => media.storageKey);
      const basePrice = Number(price.amount);
      const usdPriceCents = price.currencyRef.code === 'USD' ? Math.round(basePrice * 100) : null;
      const translation = product.translations[0];
      return [{
        id: product.id,
        variantId: variant.id,
        title: translation?.title || product.title,
        description: translation?.description || product.description,
        categoryName: product.categories[0]?.category.name || '',
        images,
        image1: images[0] || '/placeholder.jpg',
        basePrice,
        compareAt: price.compareAt === null ? null : Number(price.compareAt),
        currency: price.currencyRef.code,
        currencySymbol: price.currencyRef.symbol || price.currencyRef.code,
        usdPriceCents,
        stockQuantity,
        city: product.store.seller.warehouses[0]?.city || '',
        storeName: product.store.name,
        storeSlug: product.store.slug,
      }];
    });
    cache.set(cacheKey, productsForResponse);
    const ratings = await getProductRatingSummaries(productsForResponse.map((product) => product.id));
    return NextResponse.json(productsForResponse.map((product) => ({
      ...product,
      averageRating: ratings.get(product.id)?.average ?? null,
      reviewCount: ratings.get(product.id)?.count ?? 0,
    })));
  } catch (error) {
    console.error('Unable to load products:', error);
    return NextResponse.json({ error: 'Unable to load products.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { user, seller } = await getActiveSeller();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لإنشاء منتج' }, { status: 401 });
  if (!seller) return NextResponse.json({ error: 'يتطلب نشر المنتجات متجرًا معتمدًا.' }, { status: 403 });
  if (!(await isMarketplaceEnabled('marketplaceEnabled'))) {
    return NextResponse.json({ error: 'النشر متوقف مؤقتًا.' }, { status: 503 });
  }

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
    const approvalRequired = await isMarketplaceEnabled('productApprovalEnabled');
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
        sellerId: seller.id,
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
        approvalStatus: approvalRequired ? 'PENDING' : 'APPROVED',
        isActive: !approvalRequired,
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
  const { user, seller } = await getActiveSeller();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لتحديث المنتج' }, { status: 401 });
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const parsedBody = await readJson(request);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  if (!isPlainObject(parsedBody.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة' }, { status: 400 });
  const body = parsedBody.value;
  const id = body.id;
  if (!isValidProductMutationIdentifier(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح' }, { status: 400 });

  try {
    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id, sellerId: seller.id, isDeleted: false },
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
  const { user, seller } = await getActiveSeller();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول لحذف المنتج' }, { status: 401 });
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const parsedBody = await readJson(request);
  if (!parsedBody.ok) return NextResponse.json({ error: parsedBody.error }, { status: parsedBody.status });
  if (!isPlainObject(parsedBody.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة' }, { status: 400 });
  const body = parsedBody.value;
  const id = body.id;
  if (!isValidProductMutationIdentifier(id)) return NextResponse.json({ error: 'معرف المنتج غير صالح' }, { status: 400 });

  try {
    const existing = await prisma.product.findFirst({
      where: { id, userId: user.id, sellerId: seller.id, isDeleted: false },
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
