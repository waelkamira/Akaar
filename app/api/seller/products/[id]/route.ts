import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getActiveSeller } from '@/lib/auth/require-seller';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';

type RouteContext = { params: Promise<{ id: string }> };
type ProductPatch = {
  action?: unknown;
  title?: unknown;
  description?: unknown;
  categoryId?: unknown;
  images?: unknown;
  variantId?: unknown;
  sku?: unknown;
  variantTitle?: unknown;
  price?: unknown;
  currency?: unknown;
  warehouseId?: unknown;
  stock?: unknown;
  stockQuantity?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseImages(value: unknown) {
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

function handleError(error: unknown, action: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return NextResponse.json({ error: 'رمز المنتج مستخدم بالفعل.' }, { status: 409 });
  }
  console.error(`Unable to ${action} seller product:`, error);
  return NextResponse.json({ error: 'تعذر تحديث المنتج.' }, { status: 500 });
}

async function updateStock(
  productId: string,
  sellerId: string,
  variantId: string,
  warehouseId: string,
  onHand: number,
) {
  return prisma.$transaction(async (transaction) => {
    const [variant, warehouse, current] = await Promise.all([
      transaction.productVariant.findFirst({
        where: { id: variantId, productId, product: { store: { sellerId } } },
        select: { id: true },
      }),
      transaction.warehouse.findFirst({ where: { id: warehouseId, sellerId, isActive: true }, select: { id: true } }),
      transaction.inventory.findUnique({
        where: { variantId_warehouseId: { variantId, warehouseId } },
        select: { id: true, onHand: true, reserved: true },
      }),
    ]);
    if (!variant || !warehouse) throw new Error('PRODUCT_OR_WAREHOUSE_NOT_FOUND');
    if (current && onHand < current.reserved) throw new Error('STOCK_BELOW_RESERVED');
    const oldQuantity = current?.onHand ?? 0;
    if (current) {
      const result = await transaction.inventory.updateMany({
        where: { id: current.id, onHand: current.onHand, reserved: current.reserved },
        data: { onHand },
      });
      if (!result.count) throw new Error('STOCK_CONFLICT');
    } else {
      await transaction.inventory.create({ data: { variantId, warehouseId, onHand } });
    }
    if (oldQuantity !== onHand) {
      await transaction.inventoryMovement.create({
        data: {
          variantId,
          warehouseId,
          type: 'ADJUSTMENT',
          quantity: onHand - oldQuantity,
          note: 'Seller inventory adjustment',
        },
      });
    }
    return { variantId, warehouseId, onHand };
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { seller } = await getActiveSeller('seller.products.manage');
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });

  const { id } = await params;
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isRecord(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = parsed.value as ProductPatch;

  try {
    const product = await prisma.product.findFirst({
      where: { id, store: { sellerId: seller.id }, deletedAt: null },
      select: { id: true },
    });
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود في متجرك.' }, { status: 404 });

    if (body.action === 'discontinueVariant') {
      if (typeof body.variantId !== 'string' || !body.variantId) {
        return NextResponse.json({ error: 'المتغير غير محدد.' }, { status: 400 });
      }
      const updated = await prisma.productVariant.updateMany({
        where: { id: body.variantId, productId: id, status: 'ACTIVE' },
        data: { status: 'DISCONTINUED' },
      });
      if (!updated.count) return NextResponse.json({ error: 'المتغير غير موجود أو متوقف مسبقًا.' }, { status: 404 });
      return NextResponse.json({ variantId: body.variantId, status: 'DISCONTINUED' });
    }

    if (body.action === 'variant') {
      const sku = typeof body.sku === 'string' ? body.sku.trim() : '';
      const variantTitle = typeof body.variantTitle === 'string' ? body.variantTitle.trim() : '';
      const currencyCode = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
      const priceValue = body.price;
      if (!sku || sku.length > 100 || variantTitle.length > 160) {
        return NextResponse.json({ error: 'تحقق من رمز SKU واسم المتغير.' }, { status: 400 });
      }
      if (typeof priceValue !== 'string' || !/^\d+(?:\.\d{1,4})?$/.test(priceValue) || !new Prisma.Decimal(priceValue).greaterThan(0)) {
        return NextResponse.json({ error: 'أدخل سعرًا أكبر من صفر.' }, { status: 400 });
      }
      if (!/^[A-Z]{3}$/.test(currencyCode)) return NextResponse.json({ error: 'رمز العملة غير صالح.' }, { status: 400 });
      const warehouseId = typeof body.warehouseId === 'string' && body.warehouseId ? body.warehouseId : null;
      const stock = body.stock === undefined ? 0 : body.stock;
      if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0 || stock > 1_000_000) {
        return NextResponse.json({ error: 'كمية المخزون غير صالحة.' }, { status: 400 });
      }
      if (stock > 0 && !warehouseId) return NextResponse.json({ error: 'اختر مستودعًا لتسجيل المخزون.' }, { status: 400 });

      const currency = await prisma.currency.findFirst({ where: { code: currencyCode, isActive: true }, select: { code: true } });
      if (!currency) return NextResponse.json({ error: 'العملة المحددة غير مفعلة.' }, { status: 400 });
      if (warehouseId) {
        const warehouse = await prisma.warehouse.findFirst({ where: { id: warehouseId, sellerId: seller.id, isActive: true }, select: { id: true } });
        if (!warehouse) return NextResponse.json({ error: 'المستودع المحدد غير موجود في متجرك.' }, { status: 400 });
      }

      const variant = await prisma.$transaction(async (transaction) => {
        const variantId = typeof body.variantId === 'string' && body.variantId ? body.variantId : null;
        if (variantId) {
          const currentVariant = await transaction.productVariant.findFirst({
            where: { id: variantId, productId: id },
            select: { id: true },
          });
          if (!currentVariant) return null;
          await transaction.productVariant.update({
            where: { id: variantId },
            data: { sku, title: variantTitle || null, status: 'ACTIVE' },
          });
          await transaction.productPrice.updateMany({
            where: { variantId, currency: currency.code, validUntil: null },
            data: { validUntil: new Date() },
          });
          const updatedVariant = currentVariant;
          await transaction.productPrice.create({
            data: { variantId: updatedVariant.id, currency: currency.code, amount: new Prisma.Decimal(priceValue) },
          });
          if (warehouseId && body.stock !== undefined) {
            const existing = await transaction.inventory.findUnique({
              where: { variantId_warehouseId: { variantId, warehouseId } },
              select: { id: true, onHand: true, reserved: true },
            });
            if (existing && stock < existing.reserved) throw new Error('STOCK_BELOW_RESERVED');
            if (existing) {
              const quantityUpdate = await transaction.inventory.updateMany({
                where: { id: existing.id, onHand: existing.onHand, reserved: existing.reserved },
                data: { onHand: stock },
              });
              if (!quantityUpdate.count) throw new Error('STOCK_CONFLICT');
            } else {
              await transaction.inventory.create({ data: { variantId, warehouseId, onHand: stock } });
            }
          }
          return { id: variantId, sku, title: variantTitle || null };
        }

        const createdVariant = await transaction.productVariant.create({
          data: {
            productId: id,
            sku,
            title: variantTitle || null,
            prices: { create: { currency: currency.code, amount: new Prisma.Decimal(priceValue) } },
          },
          select: { id: true, sku: true, title: true },
        });
        if (warehouseId && stock > 0) {
          await transaction.inventory.create({ data: { variantId: createdVariant.id, warehouseId, onHand: stock } });
          await transaction.inventoryMovement.create({
            data: { variantId: createdVariant.id, warehouseId, type: 'RECEIPT', quantity: stock, note: 'Initial variant stock' },
          });
        }
        return createdVariant;
      });
      if (!variant) return NextResponse.json({ error: 'المتغير غير موجود في هذا المنتج.' }, { status: 404 });
      return NextResponse.json({ variant });
    }

    if (typeof body.stockQuantity === 'number') {
      if (!Number.isInteger(body.stockQuantity) || body.stockQuantity < 0 || body.stockQuantity > 1_000_000) {
        return NextResponse.json({ error: 'قيمة المخزون غير صالحة.' }, { status: 400 });
      }
      const [variant, warehouse] = await Promise.all([
        prisma.productVariant.findFirst({ where: { productId: id, status: 'ACTIVE' }, select: { id: true }, orderBy: { createdAt: 'asc' } }),
        prisma.warehouse.findFirst({ where: { sellerId: seller.id, isActive: true }, select: { id: true }, orderBy: { createdAt: 'asc' } }),
      ]);
      if (!variant || !warehouse) return NextResponse.json({ error: 'أنشئ متغيرًا ومستودعًا قبل تحديث المخزون.' }, { status: 409 });
      try {
        const inventory = await updateStock(id, seller.id, variant.id, warehouse.id, body.stockQuantity);
        return NextResponse.json({ id, stockQuantity: inventory.onHand });
      } catch (error) {
        if (error instanceof Error && error.message === 'STOCK_BELOW_RESERVED') {
          return NextResponse.json({ error: 'لا يمكن خفض المخزون عن الكمية المحجوزة.' }, { status: 409 });
        }
        throw error;
      }
    }

    const updateData: Prisma.ProductUpdateInput = {};
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 300) {
        return NextResponse.json({ error: 'عنوان المنتج غير صالح.' }, { status: 400 });
      }
      updateData.title = body.title.trim();
    }
    if (body.description !== undefined) {
      if (body.description !== null && (typeof body.description !== 'string' || body.description.length > 20000)) {
        return NextResponse.json({ error: 'وصف المنتج غير صالح.' }, { status: 400 });
      }
      updateData.description = typeof body.description === 'string' ? body.description.trim() || null : null;
    }
    const images = body.images === undefined ? undefined : parseImages(body.images);
    if (body.images !== undefined && images === null) {
      return NextResponse.json({ error: 'تحقق من روابط الصور (حد أقصى 10 صور).'}, { status: 400 });
    }
    if (body.categoryId !== undefined && body.categoryId !== null && body.categoryId !== '') {
      if (typeof body.categoryId !== 'string') return NextResponse.json({ error: 'التصنيف غير صالح.' }, { status: 400 });
      const category = await prisma.category.findFirst({ where: { id: body.categoryId, isActive: true }, select: { id: true } });
      if (!category) return NextResponse.json({ error: 'التصنيف المحدد غير متاح.' }, { status: 400 });
    }
    if (!Object.keys(updateData).length && images === undefined && body.categoryId === undefined) {
      return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });
    }
    await prisma.$transaction(async (transaction) => {
      if (Object.keys(updateData).length) {
        await transaction.product.update({ where: { id }, data: updateData });
      }
      if (body.categoryId !== undefined) {
        await transaction.productCategory.deleteMany({ where: { productId: id } });
        if (typeof body.categoryId === 'string' && body.categoryId) {
          await transaction.productCategory.create({ data: { productId: id, categoryId: body.categoryId } });
        }
      }
      if (images !== undefined) {
        await transaction.productMedia.deleteMany({ where: { productId: id, mediaType: 'IMAGE' } });
        if (images.length) {
          await transaction.productMedia.createMany({
            data: images.map((storageKey, index) => ({
              productId: id,
              storageKey,
              mediaType: 'IMAGE',
              sortOrder: index,
              isPrimary: index === 0,
            })),
          });
        }
      }
    });
    return NextResponse.json({ id, updated: true });
  } catch (error) {
    return handleError(error, 'update');
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { seller } = await getActiveSeller('seller.products.manage');
  if (!seller) return NextResponse.json({ error: 'صلاحيات البائع المفعّل مطلوبة.' }, { status: 403 });
  const { id } = await params;

  try {
    const result = await prisma.product.updateMany({
      where: { id, store: { sellerId: seller.id }, deletedAt: null },
      data: { deletedAt: new Date(), isActive: false, status: 'ARCHIVED' },
    });
    if (!result.count) return NextResponse.json({ error: 'المنتج غير موجود في متجرك.' }, { status: 404 });
    return NextResponse.json({ id, deleted: true });
  } catch (error) {
    return handleError(error, 'archive');
  }
}
