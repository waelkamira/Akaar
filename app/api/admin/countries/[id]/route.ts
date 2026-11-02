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
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف البلد غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات البلد غير صالحة.' }, { status: 400 });
  const keys = Object.keys(parsed.value);
  if (!keys.length || keys.some((key) => !['name', 'code'].includes(key))) return NextResponse.json({ error: 'يسمح بتعديل اسم البلد ورمزه فقط.' }, { status: 400 });
  const data: { name?: string; code?: string } = {};
  if ('name' in parsed.value) {
    if (typeof parsed.value.name !== 'string' || !parsed.value.name.trim() || parsed.value.name.trim().length > 100) return NextResponse.json({ error: 'اسم البلد غير صالح.' }, { status: 400 });
    data.name = parsed.value.name.trim();
  }
  if ('code' in parsed.value) {
    if (typeof parsed.value.code !== 'string' || !/^[A-Z]{2}$/i.test(parsed.value.code.trim())) return NextResponse.json({ error: 'رمز ISO للبلد يجب أن يتكون من حرفين.' }, { status: 400 });
    data.code = parsed.value.code.trim().toUpperCase();
  }
  try {
    const country = await prisma.country.update({ where: { id }, data, select: { id: true, name: true, code: true, _count: { select: { cities: true, suppliers: true } } } });
    return NextResponse.json({ country });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'البلد غير موجود.' }, { status: 404 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'اسم البلد أو رمزه مستخدم لبلد آخر.' }, { status: 409 });
    console.error('Unable to update country:', error);
    return NextResponse.json({ error: 'تعذر تحديث البلد.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف البلد غير صالح.' }, { status: 400 });
  try {
    const country = await prisma.country.findUnique({ where: { id }, select: { id: true, _count: { select: { cities: true, suppliers: true } } } });
    if (!country) return NextResponse.json({ error: 'البلد غير موجود.' }, { status: 404 });
    if (country._count.cities || country._count.suppliers) return NextResponse.json({ error: 'لا يمكن حذف بلد مرتبط بمدن أو موردين. انقل الارتباطات أولًا.' }, { status: 409 });
    await prisma.country.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Unable to delete country:', error);
    return NextResponse.json({ error: 'تعذر حذف البلد.' }, { status: 500 });
  }
}
