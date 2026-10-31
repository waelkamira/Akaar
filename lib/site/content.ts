import { prisma } from '@/lib/db/prisma';

export async function readManagedSitePage(slug: string) {
  const [table] = await prisma.$queryRaw<Array<{ tableExists: boolean }>>`
    SELECT to_regclass('public.site_pages') IS NOT NULL AS "tableExists"
  `;
  if (!table?.tableExists) return null;

  const [page] = await prisma.$queryRaw<Array<{ slug: string; title: string; content: string }>>`
    SELECT "slug", "title", "content"
    FROM public.site_pages
    WHERE "slug" = ${slug}
    LIMIT 1
  `;
  return page ?? null;
}
