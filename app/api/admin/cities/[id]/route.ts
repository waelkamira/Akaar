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
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المدينة غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المدينة غير صالحة.' }, { status: 400 });
  const keys = Object.keys(parsed.value);
  if (!keys.length || keys.some((key) => !['name', 'countryId'].includes(key))) return NextResponse.json({ error: 'يسمح بتعديل اسم المدينة والبلد فقط.' }, { status: 400 });
  const data: { name?: string; countryId?: string } = {};
  if ('name' in parsed.value) {
    if (typeof parsed.value.name !== 'string' || !parsed.value.name.trim() || parsed.value.name.trim().length > 100) return NextResponse.json({ error: 'اسم المدينة غير صالح.' }, { status: 400 });
    data.name = parsed.value.name.trim();
  }
  if ('countryId' in parsed.value) {
    if (typeof parsed.value.countryId !== 'string' || !parsed.value.countryId.trim() || parsed.value.countryId.length > 128) return NextResponse.json({ error: 'البلد المحدد غير صالح.' }, { status: 400 });
    data.countryId = parsed.value.countryId.trim();
  }
  try {
    const city = await prisma.city.update({
      where: { id },
      data,
      select: { id: true, name: true, countryId: true, country: { select: { name: true, code: true } }, _count: { select: { suppliers: true } } },
    });
    return NextResponse.json({ city });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'المدينة أو البلد المحدد غير موجود.' }, { status: 404 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'هذه المدينة مسجلة مسبقًا في البلد المحدد.' }, { status: 409 });
    console.error('Unable to update city:', error);
    return NextResponse.json({ error: 'تعذر تحديث المدينة.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المدينة غير صالح.' }, { status: 400 });
  try {
    const city = await prisma.city.findUnique({ where: { id }, select: { id: true, _count: { select: { suppliers: true } } } });
    if (!city) return NextResponse.json({ error: 'المدينة غير موجودة.' }, { status: 404 });
    if (city._count.suppliers) return NextResponse.json({ error: 'لا يمكن حذف مدينة مرتبطة بموردين. انقل الموردين أولًا.' }, { status: 409 });
    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete city:', error);
    return NextResponse.json({ error: 'تعذر حذف المدينة.' }, { status: 500 });
  }
}
