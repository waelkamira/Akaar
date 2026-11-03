import { NextResponse } from 'next/server';
import { getAdminUser, getControlPanelAdmin } from '@/lib/auth/require-auth';
import { DEFAULT_MARKETPLACE_SETTINGS, readMarketplaceSettings, writeMarketplaceSettings } from '@/lib/marketplace/settings';
import type { MarketplaceSettingKey } from '@/lib/marketplace/settings';
import { isStripeSandboxConfigured } from '@/lib/payments/stripe.mjs';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  try {
    return NextResponse.json(await readMarketplaceSettings());
  } catch (error) {
    console.error('Unable to load marketplace settings:', error);
    return NextResponse.json({ error: 'تعذر تحميل إعدادات المنصة.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'صيغة الطلب غير صالحة.' }, { status: 400 });
  }
  const body = payload as Record<string, unknown>;

  const entries = Object.entries(body);
  const allowedKeys = Object.keys(DEFAULT_MARKETPLACE_SETTINGS);
  if (
    entries.length === 0 ||
    entries.some(([key, value]) => !allowedKeys.includes(key) || typeof value !== 'boolean')
  ) {
    return NextResponse.json({ error: 'إعدادات المنصة غير صالحة.' }, { status: 400 });
  }
  if (entries.some(([key]) => key === 'stripeSandboxCheckoutEnabled')) {
    if (!(await getControlPanelAdmin('control_panel.finance.manage'))) return NextResponse.json({ error: 'صلاحيات إدارة المدفوعات مطلوبة لتغيير وسائل الدفع.' }, { status: 403 });
    if (body.stripeSandboxCheckoutEnabled === true && !isStripeSandboxConfigured()) {
      return NextResponse.json({ error: 'إعداد Stripe sandbox غير مكتمل.' }, { status: 503 });
    }
  }

  try {
    await writeMarketplaceSettings(entries.map(([key, enabled]) => [key as MarketplaceSettingKey, enabled as boolean]));
    return NextResponse.json(Object.fromEntries(entries));
  } catch (error) {
    console.error('Unable to update marketplace settings:', error);
    return NextResponse.json({ error: 'تعذر حفظ إعدادات المنصة.' }, { status: 500 });
  }
}
