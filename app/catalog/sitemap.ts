import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db/prisma';
import { getSiteUrl } from '@/lib/site-url.mjs';

export const dynamic = 'force-dynamic';

const SITEMAP_PAGE_SIZE = 45_000;

const productWhere = {
  isActive: true,
  isDeleted: false,
  approvalStatus: 'APPROVED' as const,
  category: { isActive: true },
  OR: [
    { sellerId: null },
    { seller: { is: { status: 'ACTIVE' as const, isVerified: true } } },
  ],
};

const propertyWhere = { isPublished: true, status: 'AVAILABLE' as const };
const sellerWhere = { status: 'ACTIVE' as const, isVerified: true };

type SitemapGroup = 'products' | 'properties' | 'stores' | 'categories' | 'pages';

function getSitemapUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export async function generateSitemaps() {
  const [products, properties, stores, categories, pages] = await Promise.all([
    prisma.product.count({ where: productWhere }),
    prisma.property.count({ where: propertyWhere }),
    prisma.seller.count({ where: sellerWhere }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.sitePage.count(),
  ]);
  const groups: Array<[SitemapGroup, number]> = [
    ['products', products],
    ['properties', properties],
    ['stores', stores],
    ['categories', categories],
    ['pages', pages],
  ];

  return groups.flatMap(([group, count]) => (
    Array.from({ length: Math.ceil(count / SITEMAP_PAGE_SIZE) }, (_, index) => ({
      id: `${group}-${index}`,
    }))
  ));
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const sitemapId = await id;
  const match = /^(products|properties|stores|categories|pages)-(\d+)$/.exec(sitemapId);
  if (!match) throw new Error(`Unknown sitemap shard: ${sitemapId}`);

  const group = match[1] as SitemapGroup;
  const pageIndex = Number(match[2]);
  if (
    !Number.isSafeInteger(pageIndex) ||
    pageIndex > Math.floor(Number.MAX_SAFE_INTEGER / SITEMAP_PAGE_SIZE)
  ) {
    throw new Error(`Invalid sitemap shard index: ${sitemapId}`);
  }
  const skip = pageIndex * SITEMAP_PAGE_SIZE;

  switch (group) {
    case 'products': {
      const records = await prisma.product.findMany({
        where: productWhere,
        select: { id: true, updatedAt: true },
        orderBy: { id: 'asc' },
        skip,
        take: SITEMAP_PAGE_SIZE,
      });
      return records.map(({ id, updatedAt }) => ({
        url: getSitemapUrl(`/post/${encodeURIComponent(id)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
    case 'properties': {
      const records = await prisma.property.findMany({
        where: propertyWhere,
        select: { id: true, updatedAt: true },
        orderBy: { id: 'asc' },
        skip,
        take: SITEMAP_PAGE_SIZE,
      });
      return records.map(({ id, updatedAt }) => ({
        url: getSitemapUrl(`/properties/${encodeURIComponent(id)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
    case 'stores': {
      const records = await prisma.seller.findMany({
        where: sellerWhere,
        select: { slug: true, updatedAt: true },
        orderBy: { id: 'asc' },
        skip,
        take: SITEMAP_PAGE_SIZE,
      });
      return records.map(({ slug, updatedAt }) => ({
        url: getSitemapUrl(`/shop/${encodeURIComponent(slug)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
    case 'categories': {
      const records = await prisma.category.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
        orderBy: { id: 'asc' },
        skip,
        take: SITEMAP_PAGE_SIZE,
      });
      return records.map(({ id, updatedAt }) => ({
        url: getSitemapUrl(`/search?categoryId=${id}`),
        lastModified: updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
    case 'pages': {
      const records = await prisma.sitePage.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { slug: 'asc' },
        skip,
        take: SITEMAP_PAGE_SIZE,
      });
      return records.map(({ slug, updatedAt }) => ({
        url: getSitemapUrl(`/pages/${encodeURIComponent(slug)}`),
        lastModified: updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      }));
    }
  }
}
