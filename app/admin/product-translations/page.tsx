import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import ProductTranslationsClient from './product-translations-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'ترجمات المنتجات | Akaar', description: 'إدارة ترجمات عناوين وأوصاف المنتجات.' };

export default async function ProductTranslationsPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const [translations, products] = await Promise.all([
    prisma.productTranslation.findMany({
      orderBy: [{ language: 'asc' }, { title: 'asc' }],
      take: 500,
      select: { id: true, productId: true, language: true, title: true, description: true, product: { select: { title: true } } },
    }),
    prisma.product.findMany({ where: { isDeleted: false }, orderBy: { title: 'asc' }, take: 500, select: { id: true, title: true } }),
  ]);
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="الكتالوج العالمي" title="ترجمات المنتجات" description="إدارة عناوين وأوصاف المنتجات بلغات متعددة." href="/admin/control-panel" linkLabel="لوحة الإدارة" />
    <ProductTranslationsClient initialTranslations={translations} products={products} />
  </div></main>;
}
