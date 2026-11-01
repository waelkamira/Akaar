import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url.mjs';
import { generateSitemaps } from './catalog/sitemap';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = getSiteUrl();
  const sitemapShards = await generateSitemaps();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/cart',
        '/favorite',
        '/messages',
        '/notifications',
        '/orders',
        '/profile',
        '/seller/',
        '/users',
      ],
    },
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      ...sitemapShards.map(({ id }) => `${siteUrl}/catalog/sitemap/${encodeURIComponent(id)}.xml`),
    ],
  };
}
