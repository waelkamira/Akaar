import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';

function parseSupplier(body: Record<string, unknown>) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : null;
  const address = typeof body.address === 'string' ? body.address.trim() : null;
  const countryId = typeof body.countryId === 'string' ? body.countryId.trim() : '';
  const cityId = body.cityId === undefined || body.cityId === null || body.cityId === '' ? null : typeof body.cityId === 'string' ? body.cityId.trim() : undefined;
  if (!name || name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
    || (phone !== null && phone.length > 40) || (address !== null && address.length > 500)
    || !countryId || countryId.length > 128 || cityId === undefined || (cityId && cityId.length > 128)) {
    return { error: 'تحقق من الاسم والبريد والهاتف والعنوان والبلد والمدينة.' };
  }
  return { name, email, phone, address, countryId, cityId };
}

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const [suppliers, countries, cities] = await Promise.all([
      prisma.supplier.findMany({
        orderBy: { name: 'asc' },
        take: 500,
        select: { id: true, name: true, email: true, phone: true, address: true, countryId: true, cityId: true, country: { select: { name: true, code: true } }, city: { select: { name: true } } },
      }),
      prisma.country.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true, code: true } }),
      prisma.city.findMany({ orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }], select: { id: true, name: true, countryId: true } }),
    ]);
    return NextResponse.json({ suppliers, countries, cities }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load suppliers:', error);
    return NextResponse.json({ error: 'تعذر تحميل الموردين.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المورد غير صالحة.' }, { status: 400 });
  const data = parseSupplier(parsed.value);
  if ('error' in data) return NextResponse.json({ error: data.error }, { status: 400 });
  try {
    const country = await prisma.country.findUnique({ where: { id: data.countryId }, select: { id: true } });
    if (!country) return NextResponse.json({ error: 'البلد المحدد غير موجود.' }, { status: 404 });
    if (data.cityId) {
      const city = await prisma.city.findFirst({ where: { id: data.cityId, countryId: data.countryId }, select: { id: true } });
      if (!city) return NextResponse.json({ error: 'المدينة لا تتبع البلد المحدد.' }, { status: 400 });
    }
    const supplier = await prisma.supplier.create({
      data,
      select: { id: true, name: true, email: true, phone: true, address: true, countryId: true, cityId: true, country: { select: { name: true, code: true } }, city: { select: { name: true } } },
    });
    return NextResponse.json({ supplier }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'اسم المورد أو بريده مسجل مسبقًا.' }, { status: 409 });
    console.error('Unable to create supplier:', error);
    return NextResponse.json({ error: 'تعذر إضافة المورد.' }, { status: 500 });
  }
}
