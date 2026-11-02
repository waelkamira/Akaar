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
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المورد غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المورد غير صالحة.' }, { status: 400 });
  const keys = Object.keys(parsed.value);
  if (!keys.length || keys.some((key) => !['name', 'email', 'phone', 'address', 'countryId', 'cityId'].includes(key))) return NextResponse.json({ error: 'حقول المورد المرسلة غير مدعومة.' }, { status: 400 });
  const current = await prisma.supplier.findUnique({ where: { id }, select: { id: true, name: true, email: true, phone: true, address: true, countryId: true, cityId: true } });
  if (!current) return NextResponse.json({ error: 'المورد غير موجود.' }, { status: 404 });
  const body = parsed.value;
  const name = body.name === undefined ? current.name : typeof body.name === 'string' ? body.name.trim() : '';
  const email = body.email === undefined ? current.email : typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = body.phone === undefined ? current.phone : body.phone === null || typeof body.phone === 'string' ? (body.phone as string | null)?.trim() || null : undefined;
  const address = body.address === undefined ? current.address : body.address === null || typeof body.address === 'string' ? (body.address as string | null)?.trim() || null : undefined;
  const countryId = body.countryId === undefined ? current.countryId : typeof body.countryId === 'string' ? body.countryId.trim() : '';
  const cityId = body.cityId === undefined ? current.cityId : body.cityId === null || body.cityId === '' ? null : typeof body.cityId === 'string' ? body.cityId.trim() : undefined;
  if (!name || name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
    || phone === undefined || (phone !== null && phone.length > 40)
    || address === undefined || (address !== null && address.length > 500)
    || !countryId || countryId.length > 128 || cityId === undefined || (cityId && cityId.length > 128)) {
    return NextResponse.json({ error: 'تحقق من بيانات المورد.' }, { status: 400 });
  }
  try {
    const country = await prisma.country.findUnique({ where: { id: countryId }, select: { id: true } });
    if (!country) return NextResponse.json({ error: 'البلد المحدد غير موجود.' }, { status: 404 });
    if (cityId) {
      const city = await prisma.city.findFirst({ where: { id: cityId, countryId }, select: { id: true } });
      if (!city) return NextResponse.json({ error: 'المدينة لا تتبع البلد المحدد.' }, { status: 400 });
    }
    const supplier = await prisma.supplier.update({
      where: { id },
      data: { name, email, phone, address, countryId, cityId },
      select: { id: true, name: true, email: true, phone: true, address: true, countryId: true, cityId: true, country: { select: { name: true, code: true } }, city: { select: { name: true } } },
    });
    return NextResponse.json({ supplier });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'اسم المورد أو بريده مستخدم لمورد آخر.' }, { status: 409 });
    console.error('Unable to update supplier:', error);
    return NextResponse.json({ error: 'تعذر تحديث المورد.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف المورد غير صالح.' }, { status: 400 });
  try {
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'المورد غير موجود.' }, { status: 404 });
    console.error('Unable to delete supplier:', error);
    return NextResponse.json({ error: 'تعذر حذف المورد.' }, { status: 500 });
  }
}
