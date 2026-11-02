import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import ShippingMethodsClient from './shipping-methods-client';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'وسائل الشحن | Akaar', description: 'إدارة وسائل الشحن وتكاليفها.' };

export default async function AdminShippingMethodsPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const methods = await prisma.shippingMethod.findMany({
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
    select: { id: true, name: true, cost: true, _count: { select: { orders: true } } },
  });
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="الإدارة والتشغيل" title="وسائل الشحن" description="إضافة وسائل الشحن وتعديل تكلفتها ومراجعة ارتباطها بالطلبات." href="/admin/control-panel" linkLabel="لوحة الإدارة" />
    <ShippingMethodsClient initialMethods={methods} />
  </div></main>;
}
