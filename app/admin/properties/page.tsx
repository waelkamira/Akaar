import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import AnalyticsPanel from '../analytics-panel';
import PropertiesClient, { type AdminListing } from './properties-client';

export const dynamic = 'force-dynamic';

export default async function AdminPropertiesPage() {
  const admin = await getAdminUser();
  if (!admin) redirect('/admin/dashboard');

  const [total, byStatus, published, listings] = await Promise.all([
    prisma.property.count(),
    prisma.property.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.property.count({ where: { isPublished: true } }),
    prisma.property.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 100,
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        location: true,
        city: true,
        status: true,
        isPublished: true,
        createdAt: true,
        owner: { select: { email: true, userName: true } },
        store: { select: { name: true } },
      },
    }),
  ]);
  const statusValue = (status: string) => byStatus.find((item) => item.status === status)?._count._all || 0;
  const items: AdminListing[] = listings.map((item) => ({ ...item, price: item.price.toString(), createdAt: item.createdAt.toISOString() }));

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:py-12">
      <header><p className="ak-eyebrow">MARKETPLACE LISTINGS</p><h1 className="mt-2 text-3xl font-black">إعلانات العقارات</h1><p className="mt-2 text-sm text-stone-400">قسم مستقل لإحصاءات الإعلانات العقارية ومراجعتها؛ لا يحد هذا القسم من بقية فئات المنصة التجارية.</p></header>
      <AnalyticsPanel
        title="تحليلات الإعلانات العقارية"
        description="أعداد الإعلانات الكلية والمنشورة وتوزيع حالتها حسب بيانات قاعدة المنصة."
        metrics={[
          { label: 'إجمالي الإعلانات', value: total, detail: 'كل الحالات', color: 'border-sky-400/25 bg-sky-400/10 text-sky-200' },
          { label: 'إعلانات منشورة', value: published, detail: 'ظاهرة للزوار', color: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' },
          { label: 'متاحة', value: statusValue('AVAILABLE'), detail: 'متاحة للبيع أو الإيجار', color: 'border-violet-400/25 bg-violet-400/10 text-violet-200' },
          { label: 'مباعة أو مؤجرة', value: statusValue('SOLD') + statusValue('RENTED'), detail: 'حالة الإعلان', color: 'border-amber-400/25 bg-amber-400/10 text-amber-200' },
        ]}
        chartTitle="الإعلانات حسب الحالة"
        chart={[
          { label: 'متاح', value: statusValue('AVAILABLE') },
          { label: 'مباع', value: statusValue('SOLD') },
          { label: 'مؤجر', value: statusValue('RENTED') },
        ]}
        chartColor="bg-violet-300"
      />
      <PropertiesClient initialItems={items} />
    </main>
  );
}
