import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function errorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return NextResponse.json({ error: 'رمز المنتج أو بياناته مسجلة مسبقًا.' }, { status: 409 });
  }
  console.error('Unable to manage seller products:', error);
  return NextResponse.json({ error: 'تعذر إكمال العملية.' }, { status: 500 });
}

function parseImages(value: unknown) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 10 || value.some((image) => typeof image !== 'string')) return null;
  const images: string[] = [];
  for (const image of value) {
    if (typeof image !== 'string' || image.length > 2048) return null;
    try {
      const url = new URL(image);
      if (!['https:', 'http:'].includes(url.protocol)) return null;
      images.push(url.toString());
    } catch {
      return null;
    }
  }
  return images;
}

function makeSlug(title: string) {
  const base = title.normalize('NFKD').toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'product';
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function GET() {
  const { seller } = await getActiveSeller('seller.products.manage');
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  try {
    const store = await prisma.store.findFirst({
      where: { sellerId: seller.id, isActive: true },
      select: { id: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    if (!store) return NextResponse.json({ products: [], categories: [], warehouses: [], currencies: [] });

    const [products, categories, warehouses, currencies] = await Promise.all([
      prisma.product.findMany({
        where: { storeId: store.id, deletedAt: null },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          status: true,
          isActive: true,
          updatedAt: true,
          categories: { select: { category: { select: { id: true, name: true } } } },
          media: {
            where: { mediaType: 'IMAGE' },
            select: { id: true, storageKey: true, sortOrder: true, isPrimary: true },
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
          variants: {
            select: {
              id: true,
              sku: true,
              title: true,
              status: true,
              prices: {
                where: { validFrom: { lte: new Date() }, OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }] },
                select: { amount: true, currency: true, validFrom: true },
                orderBy: { validFrom: 'desc' },
              },
              inventory: {
                where: { warehouse: { sellerId: seller.id, isActive: true } },
                select: { id: true, onHand: true, reserved: true, warehouse: { select: { id: true, name: true } } },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 200,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
        take: 500,
      }),
      prisma.warehouse.findMany({
        where: { sellerId: seller.id, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.currency.findMany({
        where: { isActive: true },
        select: { code: true, name: true },
        orderBy: { code: 'asc' },
      }),
    ]);

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          prices: variant.prices.map((price) => ({ ...price, amount: Number(price.amount) })),
        })),
      })),
      categories,
      warehouses,
      currencies,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const { seller } = await getActiveSeller('seller.products.manage');
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isRecord(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const priceValue = body.price;
  const currencyCode = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
  const categoryId = typeof body.categoryId === 'string' && body.categoryId ? body.categoryId : null;
  const warehouseId = typeof body.warehouseId === 'string' && body.warehouseId ? body.warehouseId : null;
  const skuInput = typeof body.sku === 'string' ? body.sku.trim() : '';
  const images = parseImages(body.images);
  const stock = body.stock === undefined ? 0 : body.stock;

  if (!title || title.length > 300 || description.length > 20000) {
    return NextResponse.json({ error: 'تحقق من عنوان المنتج ووصفه.' }, { status: 400 });
  }
  if (typeof priceValue !== 'string' || !/^\d+(?:\.\d{1,4})?$/.test(priceValue) || !new Prisma.Decimal(priceValue).greaterThan(0)) {
    return NextResponse.json({ error: 'أدخل سعرًا أكبر من صفر.' }, { status: 400 });
  }
  if (!/^[A-Z]{3}$/.test(currencyCode) || !Number.isInteger(stock) || typeof stock !== 'number' || stock < 0 || stock > 1_000_000) {
    return NextResponse.json({ error: 'العملة أو كمية المخزون غير صالحة.' }, { status: 400 });
  }
  if (skuInput.length > 100) return NextResponse.json({ error: 'رمز SKU طويل جدًا.' }, { status: 400 });
  if (body.images !== undefined && images === null) return NextResponse.json({ error: 'تحقق من روابط الصور (حد أقصى 10 صور).'}, { status: 400 });
  if (stock > 0 && !warehouseId) return NextResponse.json({ error: 'اختر مستودعًا لتسجيل المخزون الأولي.' }, { status: 400 });

  try {
    const store = await prisma.store.findFirst({ where: { sellerId: seller.id, isActive: true }, select: { id: true } });
    if (!store) return NextResponse.json({ error: 'لا يوجد متجر نشط مرتبط بحسابك.' }, { status: 409 });
    const currency = await prisma.currency.findFirst({ where: { code: currencyCode, isActive: true }, select: { code: true } });
    if (!currency) return NextResponse.json({ error: 'العملة المحددة غير مفعلة.' }, { status: 400 });
    if (categoryId) {
      const category = await prisma.category.findFirst({ where: { id: categoryId, isActive: true }, select: { id: true } });
      if (!category) return NextResponse.json({ error: 'التصنيف المحدد غير متاح.' }, { status: 400 });
    }
    if (warehouseId) {
      const warehouse = await prisma.warehouse.findFirst({ where: { id: warehouseId, sellerId: seller.id, isActive: true }, select: { id: true } });
      if (!warehouse) return NextResponse.json({ error: 'المستودع المحدد غير موجود في متجرك.' }, { status: 400 });
    }

    const product = await prisma.$transaction(async (transaction) => {
      const created = await transaction.product.create({
        data: {
          storeId: store.id,
          title,
          slug: makeSlug(title),
          description: description || null,
          status: 'PENDING',
          isActive: true,
        },
        select: { id: true, title: true, status: true },
      });
      const variant = await transaction.productVariant.create({
        data: {
          productId: created.id,
          sku: skuInput || `AK-${randomUUID().slice(0, 12).toUpperCase()}`,
          prices: { create: { currency: currency.code, amount: new Prisma.Decimal(priceValue) } },
        },
        select: { id: true },
      });
      if (categoryId) {
        await transaction.productCategory.create({ data: { productId: created.id, categoryId } });
      }
      if (images?.length) {
        await transaction.productMedia.createMany({
          data: images.map((storageKey, index) => ({
            productId: created.id,
            storageKey,
            mediaType: 'IMAGE',
            sortOrder: index,
            isPrimary: index === 0,
          })),
        });
      }
      if (warehouseId && stock > 0) {
        await transaction.inventory.create({ data: { variantId: variant.id, warehouseId, onHand: stock } });
        await transaction.inventoryMovement.create({
          data: { variantId: variant.id, warehouseId, type: 'RECEIPT', quantity: stock, note: 'Initial product stock' },
        });
      }
      return created;
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
