import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

type RouteContext = { params: Promise<{ id: string }> };
const sellerStatuses = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;

function optionalText(value: unknown, maximum: number) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.trim().length > maximum) return undefined;
  return value.trim() || null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!isPlainObject(payload)) return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const data: Prisma.SellerUpdateInput = {};

  if ('storeName' in body) {
    if (typeof body.storeName !== 'string' || !body.storeName.trim() || body.storeName.trim().length > 160) {
      return NextResponse.json({ error: 'اسم المتجر غير صالح.' }, { status: 400 });
    }
    data.storeName = body.storeName.trim();
  }
  if ('slug' in body) {
    if (typeof body.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug.trim().toLowerCase()) || body.slug.trim().length > 100) {
      return NextResponse.json({ error: 'رابط المتجر غير صالح.' }, { status: 400 });
    }
    data.slug = body.slug.trim().toLowerCase();
  }
  for (const [field, maximum] of [
    ['description', 10000],
    ['logo', 2048],
    ['contactName', 160],
    ['contactEmail', 254],
    ['phoneNumber', 40],
    ['residence', 240],
  ] as const) {
    if (field in body) {
      const value = optionalText(body[field], maximum);
      if (value === undefined) return NextResponse.json({ error: 'إحدى بيانات المتجر غير صالحة.' }, { status: 400 });
      data[field] = value;
    }
  }
  if (typeof data.contactEmail === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    return NextResponse.json({ error: 'البريد الإلكتروني للتواصل غير صالح.' }, { status: 400 });
  }
  if ('status' in body) {
    if (typeof body.status !== 'string' || !sellerStatuses.includes(body.status as typeof sellerStatuses[number])) {
      return NextResponse.json({ error: 'حالة المتجر غير صالحة.' }, { status: 400 });
    }
    data.status = body.status as typeof sellerStatuses[number];
    if (data.status === 'ACTIVE') data.isVerified = true;
  }
  if ('isVerified' in body) {
    if (typeof body.isVerified !== 'boolean') return NextResponse.json({ error: 'حالة التحقق غير صالحة.' }, { status: 400 });
    data.isVerified = body.isVerified;
  }
  if (!Object.keys(data).length) return NextResponse.json({ error: 'لا توجد تغييرات للحفظ.' }, { status: 400 });

  try {
    const item = await prisma.seller.update({
      where: { id },
      data,
      select: { id: true, storeName: true, slug: true, status: true, isVerified: true },
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'رابط المتجر مستخدم بالفعل.' }, { status: 409 });
    }
    console.error('Unable to update control panel store:', error);
    return NextResponse.json({ error: 'تعذر تحديث المتجر.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المتجر غير صالح.' }, { status: 400 });

  try {
    await prisma.$transaction(async (transaction) => {
      const seller = await transaction.seller.findUnique({
        where: { id },
        select: { id: true, userId: true, user: { select: { role: true } } },
      });
      if (!seller) throw new Error('ADMIN_STORE_NOT_FOUND');
      if (await transaction.vendorOrder.count({ where: { sellerId: id } })) throw new Error('ADMIN_STORE_HAS_ORDERS');

      await transaction.seller.delete({ where: { id } });
      if (seller.user.role === 'SELLER') {
        await transaction.user.update({ where: { id: seller.userId }, data: { role: 'CUSTOMER' } });
      }
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_STORE_NOT_FOUND') {
      return NextResponse.json({ error: 'المتجر غير موجود.' }, { status: 404 });
    }
    if (error instanceof Error && error.message === 'ADMIN_STORE_HAS_ORDERS') {
      return NextResponse.json({ error: 'لا يمكن حذف متجر له طلبات سابقة؛ يمكنك إيقافه بدلًا من ذلك.' }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json({ error: 'لا يمكن حذف المتجر لوجود سجلات مرتبطة به.' }, { status: 409 });
    }
    console.error('Unable to delete control panel store:', error);
    return NextResponse.json({ error: 'تعذر حذف المتجر.' }, { status: 500 });
  }
}
