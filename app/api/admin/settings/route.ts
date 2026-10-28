import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { DEFAULT_MARKETPLACE_SETTINGS } from '@/lib/marketplace/settings';
import type { MarketplaceSettingKey } from '@/lib/marketplace/settings';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'صلاحيات المدير مطلوبة.' }, { status: 403 });

  try {
    const records = await prisma.marketplaceSetting.findMany();
    const settings = { ...DEFAULT_MARKETPLACE_SETTINGS };
    for (const record of records) {
      if (record.key in settings) settings[record.key as MarketplaceSettingKey] = record.enabled;
    }
    return NextResponse.json(settings);
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

  try {
    await prisma.$transaction(
      entries.map(([key, enabled]) =>
        prisma.marketplaceSetting.upsert({
          where: { key },
          create: { key, enabled: enabled as boolean },
          update: { enabled: enabled as boolean },
        }),
      ),
    );
    return NextResponse.json(Object.fromEntries(entries));
  } catch (error) {
    console.error('Unable to update marketplace settings:', error);
    return NextResponse.json({ error: 'تعذر حفظ إعدادات المنصة.' }, { status: 500 });
  }
}
