import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

export const dynamic = 'force-dynamic';

function validateMethod(body: Record<string, unknown>) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const cost = body.cost;
  if (!name || name.length > 100 || typeof cost !== 'number' || !Number.isFinite(cost) || cost < 0 || cost > 1_000_000_000) {
    return { error: 'أدخل اسمًا لا يتجاوز 100 حرف وتكلفة رقمية بين صفر ومليار.' };
  }
  return { name, cost };
}

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  try {
    const methods = await prisma.shippingMethod.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: {
        id: true, name: true, cost: true,
        _count: { select: { orders: true } },
      },
    });
    return NextResponse.json({ methods }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load shipping methods:', error);
    return NextResponse.json({ error: 'تعذر تحميل وسائل الشحن.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات وسيلة الشحن غير صالحة.' }, { status: 400 });
  const validated = validateMethod(parsed.value);
  if ('error' in validated) return NextResponse.json({ error: validated.error }, { status: 400 });
  try {
    const method = await prisma.shippingMethod.create({
      data: validated,
      select: { id: true, name: true, cost: true, _count: { select: { orders: true } } },
    });
    return NextResponse.json({ method }, { status: 201 });
  } catch (error) {
    console.error('Unable to create shipping method:', error);
    return NextResponse.json({ error: 'تعذر إنشاء وسيلة الشحن.' }, { status: 500 });
  }
}
