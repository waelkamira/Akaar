import { readPublicSitePage } from '@/lib/site/repository';

export async function readManagedSitePage(slug: string) {
  return readPublicSitePage(slug);
}
