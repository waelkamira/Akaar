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
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف وسيلة الشحن غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات التحديث غير صالحة.' }, { status: 400 });
  const keys = Object.keys(parsed.value);
  if (!keys.length || keys.some((key) => !['name', 'cost'].includes(key))) {
    return NextResponse.json({ error: 'يسمح بتعديل الاسم والتكلفة فقط.' }, { status: 400 });
  }
  const data: { name?: string; cost?: number } = {};
  if ('name' in parsed.value) {
    if (typeof parsed.value.name !== 'string' || !parsed.value.name.trim() || parsed.value.name.trim().length > 100) {
      return NextResponse.json({ error: 'اسم وسيلة الشحن غير صالح.' }, { status: 400 });
    }
    data.name = parsed.value.name.trim();
  }
  if ('cost' in parsed.value) {
    if (typeof parsed.value.cost !== 'number' || !Number.isFinite(parsed.value.cost) || parsed.value.cost < 0 || parsed.value.cost > 1_000_000_000) {
      return NextResponse.json({ error: 'تكلفة الشحن غير صالحة.' }, { status: 400 });
    }
    data.cost = parsed.value.cost;
  }
  try {
    const method = await prisma.shippingMethod.update({
      where: { id },
      data,
      select: { id: true, name: true, cost: true, _count: { select: { orders: true } } },
    });
    return NextResponse.json({ method });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'وسيلة الشحن غير موجودة.' }, { status: 404 });
    }
    console.error('Unable to update shipping method:', error);
    return NextResponse.json({ error: 'تعذر تحديث وسيلة الشحن.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف وسيلة الشحن غير صالح.' }, { status: 400 });
  try {
    await prisma.shippingMethod.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'وسيلة الشحن غير موجودة.' }, { status: 404 });
    }
    console.error('Unable to delete shipping method:', error);
    return NextResponse.json({ error: 'تعذر حذف وسيلة الشحن.' }, { status: 500 });
  }
}
