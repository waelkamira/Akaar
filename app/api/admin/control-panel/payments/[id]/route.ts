import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

const PAYMENT_PROVIDERS = ['PAYPAL', 'VISA', 'MASTERCARD', 'STRIPE', 'SHAM_CASH', 'OTHER'] as const;
type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

function isPaymentProvider(value: unknown): value is PaymentProvider {
  return typeof value === 'string' && (PAYMENT_PROVIDERS as readonly string[]).includes(value);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin('control_panel.finance.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف وسيلة الدفع غير صالح.' }, { status: 400 });
  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات وسيلة الدفع غير صالحة.' }, { status: 400 });

  const body = parsed.value;
  const allowedKeys = ['name', 'provider', 'description', 'enabled'];
  const entries = Object.entries(body);
  if (!entries.length || entries.some(([key]) => !allowedKeys.includes(key))) {
    return NextResponse.json({ error: 'بيانات وسيلة الدفع غير صالحة.' }, { status: 400 });
  }

  const data: { name?: string; provider?: PaymentProvider; description?: string | null; enabled?: boolean } = {};
  if ('name' in body) {
    if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > 80) {
      return NextResponse.json({ error: 'اسم وسيلة الدفع غير صالح.' }, { status: 400 });
    }
    data.name = body.name.trim();
  }
  if ('provider' in body) {
    if (!isPaymentProvider(body.provider)) return NextResponse.json({ error: 'مزود الدفع غير صالح.' }, { status: 400 });
    data.provider = body.provider;
  }
  if ('description' in body) {
    if (body.description !== null && (typeof body.description !== 'string' || body.description.trim().length > 500)) {
      return NextResponse.json({ error: 'وصف وسيلة الدفع غير صالح.' }, { status: 400 });
    }
    data.description = typeof body.description === 'string' ? body.description.trim() || null : null;
  }
  if ('enabled' in body) {
    if (typeof body.enabled !== 'boolean') return NextResponse.json({ error: 'حالة وسيلة الدفع غير صالحة.' }, { status: 400 });
    data.enabled = body.enabled;
  }

  try {
    const method = await prisma.paymentMethodDraft.update({
      where: { id },
      data,
      select: { id: true, name: true, provider: true, description: true, enabled: true },
    });
    return NextResponse.json({ method });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'وسيلة الدفع غير موجودة.' }, { status: 404 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'توجد وسيلة دفع بالاسم نفسه.' }, { status: 409 });
    }
    console.error('Unable to update payment method draft:', error);
    return NextResponse.json({ error: 'تعذر تحديث وسيلة الدفع.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getControlPanelAdmin('control_panel.finance.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const { id } = await params;
  if (!id || id.length > 128) return NextResponse.json({ error: 'معرف وسيلة الدفع غير صالح.' }, { status: 400 });

  try {
    await prisma.paymentMethodDraft.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'وسيلة الدفع غير موجودة.' }, { status: 404 });
    }
    console.error('Unable to delete payment method draft:', error);
    return NextResponse.json({ error: 'تعذر حذف وسيلة الدفع.' }, { status: 500 });
  }
}
