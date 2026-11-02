import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import DiscountsClient from './discounts-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الخصومات والعروض | Akaar', description: 'إدارة رموز الخصم المرتبطة بالمنتجات.' };

export default async function AdminDiscountsPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const [discounts, products] = await Promise.all([
    prisma.discount.findMany({
      orderBy: { validFrom: 'desc' },
      take: 300,
      select: { id: true, productId: true, code: true, percentage: true, validFrom: true, validTo: true, product: { select: { title: true } }, _count: { select: { orders: true } } },
    }),
    prisma.product.findMany({ where: { isDeleted: false }, orderBy: { title: 'asc' }, take: 500, select: { id: true, title: true } }),
  ]);
  const initialDiscounts = discounts.map((item) => ({ ...item, validFrom: item.validFrom.toISOString(), validTo: item.validTo.toISOString() }));
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="الإدارة والتسويق" title="الخصومات والعروض" description="إنشاء رموز خصم مرتبطة بمنتج وتحديد نسبة الخصم وفترة الصلاحية." href="/admin/control-panel" linkLabel="لوحة الإدارة" />
    <DiscountsClient initialDiscounts={initialDiscounts} products={products} />
  </div></main>;
}
