import { prisma } from '@/lib/db/prisma';

type SitePageWrite = { slug: string; title: string; content: string };
type SitePageUpdate = { title: string; content: string };

export async function listSitePages() {
  return prisma.sitePage.findMany({
    orderBy: { slug: 'asc' },
    select: { slug: true, title: true, content: true, updatedAt: true },
  });
}

export async function createSitePage(input: SitePageWrite) {
  return prisma.sitePage.create({
    data: input,
    select: { slug: true, title: true, content: true, updatedAt: true },
  });
}

export async function updateSitePage(slug: string, input: SitePageUpdate) {
  return prisma.sitePage.update({
    where: { slug },
    data: input,
    select: { slug: true, title: true, content: true, updatedAt: true },
  });
}

export async function deleteSitePage(slug: string) {
  const result = await prisma.sitePage.deleteMany({ where: { slug } });
  return result.count > 0;
}

export async function readPublicSitePage(slug: string) {
  const [table] = await prisma.$queryRaw<Array<{ tableExists: boolean }>>`
    SELECT to_regclass('public.site_pages') IS NOT NULL AS "tableExists"
  `;
  if (!table?.tableExists) return null;

  return prisma.sitePage.findUnique({
    where: { slug },
    select: { slug: true, title: true, content: true },
  });
}
