import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { readMarketplaceSettings, writeMarketplaceSettings } from '@/lib/marketplace/settings';
import type { MarketplaceSettingKey } from '@/lib/marketplace/settings';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

const PAYMENT_SETTING_KEYS = ['cashOnDeliveryEnabled', 'stripeSandboxCheckoutEnabled'] as const;
const PAYMENT_PROVIDERS = ['PAYPAL', 'VISA', 'MASTERCARD', 'STRIPE', 'SHAM_CASH', 'OTHER'] as const;
type PaymentProvider = (typeof PAYMENT_PROVIDERS)[number];

function isPaymentProvider(value: unknown): value is PaymentProvider {
  return typeof value === 'string' && (PAYMENT_PROVIDERS as readonly string[]).includes(value);
}

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  try {
    const [settings, customMethods] = await Promise.all([
      readMarketplaceSettings(),
      prisma.paymentMethodDraft.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        select: { id: true, name: true, provider: true, description: true, enabled: true },
      }),
    ]);
    const stripeConfigured = isStripeSandboxConfigured();
    return NextResponse.json({
      methods: [
        { id: 'CASH_ON_DELIVERY', name: 'الدفع عند الاستلام', enabled: settings.cashOnDeliveryEnabled, checkoutReady: true },
        { id: 'STRIPE', name: 'Stripe (sandbox)', enabled: settings.stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured },
        { id: 'PAYPAL', name: 'PayPal (sandbox)', enabled: false, checkoutReady: false, configured: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET && process.env.PAYPAL_WEBHOOK_ID) },
        { id: 'VISA', name: 'Visa', enabled: settings.stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured, provider: 'Stripe card checkout' },
        { id: 'MASTERCARD', name: 'Mastercard', enabled: settings.stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured, provider: 'Stripe card checkout' },
        { id: 'SHAM_CASH', name: 'Sham Cash', enabled: false, checkoutReady: false, configured: false },
      ],
      customMethods,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load payment configuration status:', error);
    return NextResponse.json({ error: 'تعذر تحميل حالة وسائل الدفع.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) {
    return NextResponse.json({ error: 'إعداد وسيلة الدفع غير صالح.' }, { status: 400 });
  }
  const entries = Object.entries(parsed.value);
  if (
    entries.length !== 1 ||
    !PAYMENT_SETTING_KEYS.includes(entries[0][0] as (typeof PAYMENT_SETTING_KEYS)[number]) ||
    typeof entries[0][1] !== 'boolean'
  ) {
    return NextResponse.json({ error: 'إعداد وسيلة الدفع غير صالح.' }, { status: 400 });
  }
  const key = entries[0][0] as MarketplaceSettingKey;
  const enabled = entries[0][1] as boolean;
  if (key === 'stripeSandboxCheckoutEnabled' && enabled && !isStripeSandboxConfigured()) {
    return NextResponse.json({ error: 'لا يمكن تشغيل Stripe قبل إعداد مفتاح sk_test_ وسر webhook.' }, { status: 503 });
  }

  try {
    await writeMarketplaceSettings([[key, enabled]]);
    return NextResponse.json({ [key]: enabled });
  } catch (error) {
    console.error('Unable to update Stripe sandbox setting:', error);
    return NextResponse.json({ error: 'تعذر تحديث إعداد Stripe.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  const parsed = await readJsonBody(request, 4 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات وسيلة الدفع غير صالحة.' }, { status: 400 });

  const name = typeof parsed.value.name === 'string' ? parsed.value.name.trim() : '';
  const provider = parsed.value.provider;
  const description = typeof parsed.value.description === 'string' ? parsed.value.description.trim() : '';
  if (!name || name.length > 80 || !isPaymentProvider(provider) || description.length > 500) {
    return NextResponse.json({ error: 'أدخل اسمًا ومزودًا صالحين، واجعل الوصف أقل من 500 حرف.' }, { status: 400 });
  }

  try {
    const method = await prisma.paymentMethodDraft.create({
      data: { name, provider, description: description || null },
      select: { id: true, name: true, provider: true, description: true, enabled: true },
    });
    return NextResponse.json({ method }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'توجد وسيلة دفع بالاسم نفسه.' }, { status: 409 });
    }
    console.error('Unable to create payment method draft:', error);
    return NextResponse.json({ error: 'تعذر إضافة وسيلة الدفع.' }, { status: 500 });
  }
}
