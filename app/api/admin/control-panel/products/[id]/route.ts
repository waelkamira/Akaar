import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject, parseOptionalNumber } from '@/lib/api/validation.mjs';
import { areValidProductImageUrls, isValidProductLink } from '@/lib/api/product-media-validation.mjs';
import { getCanonicalCategoryFields } from '@/lib/api/product-category.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });

  const parsed = await readJsonBody(request, 128 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const data: Record<string, unknown> = {};

  if ('title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) {
      return NextResponse.json({ error: 'اسم المنتج غير صالح.' }, { status: 400 });
    }
    data.title = body.title.trim();
  }
  for (const field of ['description', 'city', 'town', 'phoneNumber'] as const) {
    if (field in body) {
      const max = field === 'description' ? 10000 : field === 'phoneNumber' ? 40 : 120;
      if (body[field] !== null && typeof body[field] !== 'string') {
        return NextResponse.json({ error: 'إحدى القيم النصية غير صالحة.' }, { status: 400 });
      }
      data[field] = typeof body[field] === 'string' ? body[field].trim().slice(0, max) || null : null;
    }
  }
  if ('basePrice' in body) {
    const value = parseOptionalNumber(body.basePrice, { integer: true, min: 0 });
    if (value === undefined || value === null) return NextResponse.json({ error: 'السعر غير صالح.' }, { status: 400 });
    data.basePrice = value;
  }
  if ('usdPriceCents' in body) {
    if (body.usdPriceCents === null || body.usdPriceCents === '') {
      data.usdPriceCents = null;
    } else {
      const value = parseOptionalNumber(body.usdPriceCents, { integer: true, min: 50, max: 99_999_999 });
      if (value === undefined || value === null) return NextResponse.json({ error: 'سعر الدولار غير صالح؛ الحد الأدنى 0.50 دولار.' }, { status: 400 });
      data.usdPriceCents = value;
    }
  }
  if ('stockQuantity' in body) {
    const value = parseOptionalNumber(body.stockQuantity, { integer: true, min: 0 });
    if (value === undefined || value === null) return NextResponse.json({ error: 'المخزون غير صالح.' }, { status: 400 });
    data.stockQuantity = value;
  }
  if ('images' in body) {
    if (!areValidProductImageUrls(body.images)) return NextResponse.json({ error: 'روابط الصور غير صالحة.' }, { status: 400 });
    data.images = body.images;
  }
  if ('link' in body) {
    if (!isValidProductLink(body.link)) return NextResponse.json({ error: 'الرابط غير صالح.' }, { status: 400 });
    data.link = body.link;
  }
  if ('isActive' in body) {
    if (typeof body.isActive !== 'boolean') return NextResponse.json({ error: 'حالة النشر غير صالحة.' }, { status: 400 });
    data.isActive = body.isActive;
  }
  if ('approvalStatus' in body) {
    if (body.approvalStatus !== 'PENDING' && body.approvalStatus !== 'APPROVED' && body.approvalStatus !== 'REJECTED') {
      return NextResponse.json({ error: 'حالة المراجعة غير صالحة.' }, { status: 400 });
    }
    data.approvalStatus = body.approvalStatus;
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true, userId: true, sellerId: true, isDeleted: true },
  });
  if (!existing || existing.isDeleted) return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });

  const userId = 'userId' in body
    ? typeof body.userId === 'string' ? body.userId.trim() : ''
    : existing.userId;
  if ('userId' in body && (!userId || userId.length > 128)) {
    return NextResponse.json({ error: 'المستخدم المالك غير صالح.' }, { status: 400 });
  }
  if ('userId' in body) data.userId = userId;

  if ('categoryId' in body) {
    const categoryId = parseOptionalNumber(body.categoryId, { integer: true, min: 1 });
    if (categoryId === undefined || categoryId === null) return NextResponse.json({ error: 'الفئة غير صالحة.' }, { status: 400 });
    const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true, name: true, isActive: true } });
    const categoryFields = category?.isActive ? getCanonicalCategoryFields(category) : null;
    if (!categoryFields) return NextResponse.json({ error: 'الفئة غير موجودة أو غير مفعلة.' }, { status: 400 });
    Object.assign(data, categoryFields);
  }

  if ('sellerId' in body || 'userId' in body) {
    const sellerId = body.sellerId === undefined || body.sellerId === null || body.sellerId === ''
      ? ('sellerId' in body || 'userId' in body && userId !== existing.userId ? null : existing.sellerId)
      : body.sellerId;
    if (sellerId !== null && (typeof sellerId !== 'string' || sellerId.length > 128)) {
      return NextResponse.json({ error: 'المتجر المحدد غير صالح.' }, { status: 400 });
    }
    if (sellerId) {
      const seller = await prisma.seller.findUnique({ where: { id: sellerId }, select: { id: true, userId: true } });
      if (!seller || seller.userId !== userId) return NextResponse.json({ error: 'المتجر لا يتبع المستخدم المحدد.' }, { status: 400 });
    }
    data.sellerId = sellerId;
  }

  if (!Object.keys(data).length) return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });

  try {
    const product = await prisma.product.update({ where: { id }, data, select: { id: true, title: true, isActive: true, approvalStatus: true } });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Unable to update control panel product:', error);
    return NextResponse.json({ error: 'تعذر تحديث المنتج.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });

  try {
    const result = await prisma.product.updateMany({
      where: { id, isDeleted: false },
      data: { isDeleted: true, isActive: false, deletedAt: new Date() },
    });
    if (!result.count) return NextResponse.json({ error: 'المنتج غير موجود.' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to remove control panel product:', error);
    return NextResponse.json({ error: 'تعذر حذف المنتج.' }, { status: 500 });
  }
}
