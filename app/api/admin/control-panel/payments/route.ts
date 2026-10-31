import { NextResponse } from 'next/server';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isMarketplaceEnabled } from '@/lib/marketplace/settings';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const admin = await getControlPanelAdmin();
  if (!admin) return NextResponse.json({ error: 'صلاحيات مدير لوحة التحكم مطلوبة.' }, { status: 403 });

  try {
    const [cashOnDeliveryEnabled, stripeSandboxCheckoutEnabled] = await Promise.all([
      isMarketplaceEnabled('cashOnDeliveryEnabled'),
      isMarketplaceEnabled('stripeSandboxCheckoutEnabled'),
    ]);
    const stripeConfigured = isStripeSandboxConfigured();
    return NextResponse.json({
      methods: [
        { id: 'CASH_ON_DELIVERY', name: 'الدفع عند الاستلام', enabled: cashOnDeliveryEnabled, checkoutReady: true },
        { id: 'STRIPE', name: 'Stripe (sandbox)', enabled: stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured },
        { id: 'PAYPAL', name: 'PayPal (sandbox)', enabled: false, checkoutReady: false, configured: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET && process.env.PAYPAL_WEBHOOK_ID) },
        { id: 'VISA', name: 'Visa', enabled: stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured, provider: 'Stripe card checkout' },
        { id: 'MASTERCARD', name: 'Mastercard', enabled: stripeSandboxCheckoutEnabled, checkoutReady: stripeConfigured, configured: stripeConfigured, provider: 'Stripe card checkout' },
        { id: 'SHAM_CASH', name: 'Sham Cash', enabled: false, checkoutReady: false, configured: false },
      ],
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
  if (!isPlainObject(parsed.value) || typeof parsed.value.stripeSandboxCheckoutEnabled !== 'boolean') {
    return NextResponse.json({ error: 'إعداد حالة Stripe غير صالح.' }, { status: 400 });
  }
  const enabled = parsed.value.stripeSandboxCheckoutEnabled;
  if (enabled && !isStripeSandboxConfigured()) {
    return NextResponse.json({ error: 'لا يمكن تشغيل Stripe قبل إعداد مفتاح sk_test_ وسر webhook.' }, { status: 503 });
  }

  try {
    await prisma.marketplaceSetting.upsert({
      where: { key: 'stripeSandboxCheckoutEnabled' },
      create: { key: 'stripeSandboxCheckoutEnabled', enabled },
      update: { enabled },
    });
    return NextResponse.json({ stripeSandboxCheckoutEnabled: enabled });
  } catch (error) {
    console.error('Unable to update Stripe sandbox setting:', error);
    return NextResponse.json({ error: 'تعذر تحديث إعداد Stripe.' }, { status: 500 });
  }
}
