import { prisma } from '@/lib/db/prisma';

export const DEFAULT_MARKETPLACE_SETTINGS = {
  marketplaceEnabled: true,
  sellerApplicationsEnabled: true,
  productApprovalEnabled: true,
  cashOnDeliveryEnabled: true,
  stripeSandboxCheckoutEnabled: false,
} as const;

export type MarketplaceSettingKey = keyof typeof DEFAULT_MARKETPLACE_SETTINGS;

export async function readMarketplaceSettings() {
  const settings: Record<MarketplaceSettingKey, boolean> = { ...DEFAULT_MARKETPLACE_SETTINGS };
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.marketplace_settings') IS NOT NULL AS "exists"
  `;
  if (!table?.exists) return settings;

  const records = await prisma.$queryRaw<Array<{ key: string; enabled: boolean }>>`
    SELECT "key", "enabled" FROM public.marketplace_settings
  `;

  for (const record of records) {
    if (Object.hasOwn(settings, record.key)) {
      settings[record.key as MarketplaceSettingKey] = record.enabled;
    }
  }

  return settings;
}

export async function isMarketplaceEnabled(key: MarketplaceSettingKey) {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.marketplace_settings') IS NOT NULL AS "exists"
  `;
  if (!table?.exists) return DEFAULT_MARKETPLACE_SETTINGS[key];
  const [setting] = await prisma.$queryRaw<Array<{ enabled: boolean }>>`
    SELECT "enabled" FROM public.marketplace_settings WHERE "key" = ${key} LIMIT 1
  `;
  return setting?.enabled ?? DEFAULT_MARKETPLACE_SETTINGS[key];
}

export async function writeMarketplaceSettings(entries: Array<[MarketplaceSettingKey, boolean]>) {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.marketplace_settings') IS NOT NULL AS "exists"
  `;
  if (!table?.exists) throw new Error('MARKETPLACE_SETTINGS_TABLE_MISSING');

  await prisma.$transaction(async (transaction) => {
    for (const [key, enabled] of entries) {
      await transaction.$executeRaw`
        INSERT INTO public.marketplace_settings ("key", "enabled", "updatedAt")
        VALUES (${key}, ${enabled}, CURRENT_TIMESTAMP)
        ON CONFLICT ("key") DO UPDATE
        SET "enabled" = EXCLUDED."enabled", "updatedAt" = CURRENT_TIMESTAMP
      `;
    }
  });
}
