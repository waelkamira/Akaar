import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';

function parseDiscount(body: Record<string, unknown>) {
  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  const percentage = body.percentage;
  const validFrom = typeof body.validFrom === 'string' ? new Date(body.validFrom) : new Date(NaN);
  const validTo = typeof body.validTo === 'string' ? new Date(body.validTo) : new Date(NaN);
  if (!productId || productId.length > 128 || !/^[A-Z0-9_-]{3,40}$/.test(code)
    || !Number.isInteger(percentage) || (percentage as number) < 1 || (percentage as number) > 100
    || !Number.isFinite(validFrom.getTime()) || !Number.isFinite(validTo.getTime()) || validFrom >= validTo) {
    return { error: 'تحقق من المنتج ورمز الخصم (3–40 حرفًا) والنسبة (1–100) وفترة الصلاحية.' };
  }
  return { productId, code, percentage: percentage as number, validFrom, validTo };
}

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const [discounts, products] = await Promise.all([
      prisma.discount.findMany({
        orderBy: { validFrom: 'desc' },
        take: 300,
        select: { id: true, productId: true, code: true, percentage: true, validFrom: true, validTo: true, product: { select: { title: true } }, _count: { select: { orders: true } } },
      }),
      prisma.product.findMany({
        where: { isDeleted: false },
        orderBy: { title: 'asc' },
        take: 500,
        select: { id: true, title: true },
      }),
    ]);
    return NextResponse.json({
      discounts: discounts.map((item) => ({ ...item, validFrom: item.validFrom.toISOString(), validTo: item.validTo.toISOString() })),
      products,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load discounts:', error);
    return NextResponse.json({ error: 'تعذر تحميل الخصومات.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات الخصم غير صالحة.' }, { status: 400 });
  const data = parseDiscount(parsed.value);
  if ('error' in data) return NextResponse.json({ error: data.error }, { status: 400 });
  try {
    const product = await prisma.product.findFirst({ where: { id: data.productId, isDeleted: false }, select: { id: true } });
    if (!product) return NextResponse.json({ error: 'المنتج غير موجود أو محذوف.' }, { status: 404 });
    const discount = await prisma.discount.create({
      data,
      select: { id: true, productId: true, code: true, percentage: true, validFrom: true, validTo: true, product: { select: { title: true } }, _count: { select: { orders: true } } },
    });
    return NextResponse.json({ discount: { ...discount, validFrom: discount.validFrom.toISOString(), validTo: discount.validTo.toISOString() } }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'رمز الخصم مستخدم بالفعل.' }, { status: 409 });
    console.error('Unable to create discount:', error);
    return NextResponse.json({ error: 'تعذر إنشاء الخصم.' }, { status: 500 });
  }
}
