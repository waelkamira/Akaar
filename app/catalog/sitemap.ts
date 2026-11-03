import type { MetadataRoute } from 'next';
import {
  getSitemapCounts,
  listSitemapCategories,
  listSitemapPages,
  listSitemapProducts,
  listSitemapProperties,
  listSitemapStores,
} from '@/lib/catalog/sitemap-repository';
import { getSiteUrl } from '@/lib/site-url.mjs';

export const dynamic = 'force-dynamic';

const SITEMAP_PAGE_SIZE = 45_000;

type SitemapGroup = 'products' | 'properties' | 'stores' | 'categories' | 'pages';

function getSitemapUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export async function generateSitemaps() {
  const [products, properties, stores, categories, pages] = await getSitemapCounts();
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
      const records = await listSitemapProducts(skip, SITEMAP_PAGE_SIZE);
      return records.map(({ id, updatedAt }) => ({
        url: getSitemapUrl(`/products/${encodeURIComponent(id)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
    case 'properties': {
      const records = await listSitemapProperties(skip, SITEMAP_PAGE_SIZE);
      return records.map(({ id, updatedAt }) => ({
        url: getSitemapUrl(`/properties/${encodeURIComponent(id)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
    case 'stores': {
      const records = await listSitemapStores(skip, SITEMAP_PAGE_SIZE);
      return records.map(({ slug, updatedAt }) => ({
        url: getSitemapUrl(`/shop/${encodeURIComponent(slug)}`),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    }
    case 'categories': {
      const records = await listSitemapCategories(skip, SITEMAP_PAGE_SIZE);
      return records.map(({ slug, updatedAt }) => ({
        url: getSitemapUrl(`/products?category=${encodeURIComponent(slug)}`),
        lastModified: updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
    case 'pages': {
      const records = await listSitemapPages(skip, SITEMAP_PAGE_SIZE);
      return records.map(({ slug, updatedAt }) => ({
        url: getSitemapUrl(`/pages/${encodeURIComponent(slug)}`),
        lastModified: updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      }));
    }
  }
}
