import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url.mjs';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const url = (path: string) => new URL(path, siteUrl).toString();
  return [
    { url: url('/'), changeFrequency: 'daily', priority: 1 },
    { url: url('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/contactUs'), changeFrequency: 'monthly', priority: 0.4 },
    { url: url('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    { url: url('/terms'), changeFrequency: 'yearly', priority: 0.2 },
    { url: url('/search'), changeFrequency: 'daily', priority: 0.8 },
  ];
}
