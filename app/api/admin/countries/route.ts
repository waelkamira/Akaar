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
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, code: true, _count: { select: { cities: true, suppliers: true } } },
    });
    return NextResponse.json({ countries }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load countries:', error);
    return NextResponse.json({ error: 'تعذر تحميل البلدان.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات البلد غير صالحة.' }, { status: 400 });
  const name = typeof parsed.value.name === 'string' ? parsed.value.name.trim() : '';
  const code = typeof parsed.value.code === 'string' ? parsed.value.code.trim().toUpperCase() : '';
  if (!name || name.length > 100 || !/^[A-Z]{2}$/.test(code)) return NextResponse.json({ error: 'أدخل اسم البلد ورمز ISO من حرفين.' }, { status: 400 });
  try {
    const country = await prisma.country.create({ data: { name, code }, select: { id: true, name: true, code: true, _count: { select: { cities: true, suppliers: true } } } });
    return NextResponse.json({ country }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'اسم البلد أو رمزه مسجل مسبقًا.' }, { status: 409 });
    console.error('Unable to create country:', error);
    return NextResponse.json({ error: 'تعذر إضافة البلد.' }, { status: 500 });
  }
}
