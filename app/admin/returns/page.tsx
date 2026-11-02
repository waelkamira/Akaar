import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import AdminReturns from './admin-returns';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'طلبات الإرجاع | Akaar', description: 'مراجعة طلبات إرجاع العملاء.' };

export default async function AdminReturnsPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const returns = await prisma.return.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true, orderId: true, reason: true, status: true, refundAmount: true, createdAt: true,
      order: { select: { totalPrice: true, status: true, customerName: true, user: { select: { id: true, email: true, userName: true } } } },
    },
  });
  const initialReturns = returns.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }));
  return <main dir="rtl" className="min-h-screen px-4 py-8 text-slate-100 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <EntitySectionHeading eyebrow="الإدارة والمالية" title="طلبات الإرجاع" description="مراجعة طلبات العملاء وتحديث حالة القرار، مع إرسال إشعار تلقائي للعميل." href="/admin/control-panel" linkLabel="لوحة الإدارة" />
      <AdminReturns initialReturns={initialReturns} />
    </div>
  </main>;
}
