import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'طلباتي | Akaar', description: 'متابعة الطلبات وعناصرها وحالة الدفع والشحن.' };

export default async function MyOrdersPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Forders');
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    select: { id: true, totalPrice: true, status: true, createdAt: true, items: { select: { id: true, quantity: true, unitPrice: true, totalPrice: true, product: { select: { id: true, title: true, images: true } } } }, payments: { select: { id: true, status: true, method: true, amount: true, currency: true }, orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="حسابي" title="طلباتي" description="كل طلب مرتبط بحسابك، مع المنتجات التابعة له وحالة الطلب وآخر حالة دفع." href="/search" linkLabel="متابعة التسوق"/>
    {!orders.length ? <EntityEmptyState title="لا توجد طلبات حتى الآن" description="بعد إتمام أول عملية شراء، ستظهر تفاصيلها هنا." actionLabel="تصفّح المنتجات" actionHref="/search"/> :
      <div className="space-y-4">{orders.map(order=><article key={order.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-white/45">رقم الطلب</p><p className="mt-1 break-all font-mono text-sm">{order.id}</p><p className="mt-2 text-xs text-white/45">{new Intl.DateTimeFormat('ar',{dateStyle:'medium',timeStyle:'short'}).format(order.createdAt)}</p></div><div className="flex flex-wrap items-center gap-2"><EntityStatusBadge status={order.status}/>{order.payments[0] ? <EntityStatusBadge status={order.payments[0].status}/> : null}</div></div>
        <div className="my-4 border-t border-white/10 pt-4">{order.items.map(item=><div key={item.id} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><Link href={`/post/${encodeURIComponent(item.product.id)}`} className="text-white/80 hover:text-orange-200">{item.product.title}</Link><span className="text-white/55">{item.quantity} × {new Intl.NumberFormat('ar').format(item.unitPrice)}</span></div>)}</div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4"><span className="text-sm text-white/55">الإجمالي</span><strong className="text-lg text-orange-200">{new Intl.NumberFormat('ar').format(order.totalPrice)} ل.س</strong></div>
      </article>)}</div>}
  </div></main>;
}
