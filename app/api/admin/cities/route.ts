import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const cities = await prisma.city.findMany({
      orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }],
      select: { id: true, name: true, countryId: true, country: { select: { name: true, code: true } }, _count: { select: { suppliers: true } } },
    });
    return NextResponse.json({ cities }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load cities:', error);
    return NextResponse.json({ error: 'تعذر تحميل المدن.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المدينة غير صالحة.' }, { status: 400 });
  const name = typeof parsed.value.name === 'string' ? parsed.value.name.trim() : '';
  const countryId = typeof parsed.value.countryId === 'string' ? parsed.value.countryId.trim() : '';
  if (!name || name.length > 100 || !countryId || countryId.length > 128) return NextResponse.json({ error: 'أدخل اسم المدينة واختر بلدًا صالحًا.' }, { status: 400 });
  try {
    const city = await prisma.city.create({
      data: { name, countryId },
      select: { id: true, name: true, countryId: true, country: { select: { name: true, code: true } }, _count: { select: { suppliers: true } } },
    });
    return NextResponse.json({ city }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'هذه المدينة مسجلة مسبقًا في البلد المحدد.' }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') return NextResponse.json({ error: 'البلد المحدد غير موجود.' }, { status: 404 });
    console.error('Unable to create city:', error);
    return NextResponse.json({ error: 'تعذر إضافة المدينة.' }, { status: 500 });
  }
}
