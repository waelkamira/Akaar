import { prisma } from '@/lib/db/prisma';

export const DEFAULT_MARKETPLACE_SETTINGS = {
  marketplaceEnabled: true,
  sellerApplicationsEnabled: true,
  productApprovalEnabled: true,
} as const;

export type MarketplaceSettingKey = keyof typeof DEFAULT_MARKETPLACE_SETTINGS;

export async function readMarketplaceSettings() {
  const records = await prisma.marketplaceSetting.findMany();
  const settings = { ...DEFAULT_MARKETPLACE_SETTINGS };

  for (const record of records) {
    if (record.key in settings) {
      settings[record.key as MarketplaceSettingKey] = record.enabled;
    }
  }

  return settings;
}

export async function isMarketplaceEnabled(key: MarketplaceSettingKey) {
  const setting = await prisma.marketplaceSetting.findUnique({ where: { key } });
  return setting?.enabled ?? DEFAULT_MARKETPLACE_SETTINGS[key];
}
