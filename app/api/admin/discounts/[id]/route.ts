import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الخصم غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات الخصم غير صالحة.' }, { status: 400 });
  const body = parsed.value;
  const keys = Object.keys(body);
  if (!keys.length || keys.some((key) => !['productId', 'code', 'percentage', 'validFrom', 'validTo'].includes(key))) {
    return NextResponse.json({ error: 'حقول الخصم المرسلة غير مدعومة.' }, { status: 400 });
  }
  try {
    const current = await prisma.discount.findUnique({ where: { id }, select: { id: true, productId: true, code: true, percentage: true, validFrom: true, validTo: true } });
    if (!current) return NextResponse.json({ error: 'الخصم غير موجود.' }, { status: 404 });
    const merged = {
      productId: body.productId === undefined ? current.productId : body.productId,
      code: body.code === undefined ? current.code : body.code,
      percentage: body.percentage === undefined ? current.percentage : body.percentage,
      validFrom: body.validFrom === undefined ? current.validFrom.toISOString() : body.validFrom,
      validTo: body.validTo === undefined ? current.validTo.toISOString() : body.validTo,
    };
    if (typeof merged.productId !== 'string' || typeof merged.code !== 'string' || typeof merged.percentage !== 'number'
      || typeof merged.validFrom !== 'string' || typeof merged.validTo !== 'string') {
      return NextResponse.json({ error: 'بيانات الخصم غير صالحة.' }, { status: 400 });
    }
    const productId = merged.productId.trim();
    const code = merged.code.trim().toUpperCase();
    const validFrom = new Date(merged.validFrom);
    const validTo = new Date(merged.validTo);
    if (!productId || productId.length > 128 || !/^[A-Z0-9_-]{3,40}$/.test(code)
      || !Number.isInteger(merged.percentage) || merged.percentage < 1 || merged.percentage > 100
      || !Number.isFinite(validFrom.getTime()) || !Number.isFinite(validTo.getTime()) || validFrom >= validTo) {
      return NextResponse.json({ error: 'تحقق من المنتج ورمز الخصم والنسبة وفترة الصلاحية.' }, { status: 400 });
    }
    const product = await prisma.product.findFirst({ where: { id: productId, isDeleted: false }, select: { id: true } });
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود أو محذوف.' }, { status: 404 });
    const discount = await prisma.discount.update({
      where: { id },
      data: { productId, code, percentage: merged.percentage, validFrom, validTo },
      select: { id: true, productId: true, code: true, percentage: true, validFrom: true, validTo: true, product: { select: { title: true } }, _count: { select: { orders: true } } },
    });
    return NextResponse.json({ discount: { ...discount, validFrom: discount.validFrom.toISOString(), validTo: discount.validTo.toISOString() } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'رمز الخصم مستخدم بالفعل.' }, { status: 409 });
    console.error('Unable to update discount:', error);
    return NextResponse.json({ error: 'تعذر تحديث الخصم.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف الخصم غير صالح.' }, { status: 400 });
  try {
    await prisma.discount.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'الخصم غير موجود.' }, { status: 404 });
    console.error('Unable to delete discount:', error);
    return NextResponse.json({ error: 'تعذر حذف الخصم.' }, { status: 500 });
  }
}
