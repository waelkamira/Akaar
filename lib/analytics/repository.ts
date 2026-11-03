import { prisma } from '@/lib/db/prisma';

type DailyVisit = { day: Date; path: string };

export async function incrementDailyVisit({ day, path }: DailyVisit) {
  const [table] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.daily_site_visits') IS NOT NULL AS "exists"
  `;
  if (!table?.exists) return false;

  await prisma.dailySiteVisit.upsert({
    where: { day_path: { day, path } },
    create: { day, path, views: 1 },
    update: { views: { increment: 1 } },
  });
  return true;
}
