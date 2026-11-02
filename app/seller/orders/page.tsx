import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'طلبات متجري | Akaar', description: 'متابعة الطلبات المسندة إلى متجر البائع.' };

export default async function SellerOrdersPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fseller%2Forders');
  if (user.role === 'ADMIN') redirect('/admin/control-panel');
  if (user.role !== 'SELLER' && user.role !== 'CUSTOMER') redirect('/');
  const seller = await prisma.seller.findUnique({ where: { userId: user.id }, select: { id: true, status: true } });
  if (!seller) return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-white"><div className="mx-auto max-w-5xl"><EntitySectionHeading title="طلبات متجري" description="تحتاج إلى ملف بائع مرتبط بحسابك قبل عرض طلبات البائع." href="/seller/dashboard" linkLabel="لوحة البائع"/><EntityEmptyState title="لم يتم إعداد ملف البائع" description="أكمل تفعيل حساب البائع أولًا حتى يمكن ربط الطلبات بحسابك."/></div></main>;
  const orders = await prisma.vendorOrder.findMany({
    where: { sellerId: seller.id },
    select: { id: true, status: true, trackingNumber: true, shippedAt: true, deliveredAt: true, createdAt: true, items: { select: { id: true, quantity: true, unitPrice: true, product: { select: { id: true, title: true } } } }, order: { select: { id: true, status: true, totalPrice: true, shippingCity: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="مساحة البائع" title="طلبات متجري" description="تعرض هذه الصفحة الطلبات الفرعية المرتبطة بمعرّف البائع، لا جميع طلبات المنصة." href="/seller/dashboard" linkLabel="لوحة البائع"/>
    {!orders.length ? <EntityEmptyState title="لا توجد طلبات مسندة إلى متجرك" description="ستظهر الطلبات هنا عندما تحتوي على سجل VendorOrder مرتبط بملف البائع." actionLabel="إدارة المنتجات" actionHref="/seller/products"/> :
      <div className="space-y-4">{orders.map(entry=><article key={entry.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5">
        <div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs text-white/45">طلب البائع</p><p className="mt-1 break-all font-mono text-sm">{entry.id}</p><p className="mt-2 text-xs text-white/45">{new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(entry.createdAt)}{entry.order.shippingCity ? ` · ${entry.order.shippingCity}` : ''}</p></div><div className="flex flex-wrap gap-2"><EntityStatusBadge status={entry.status}/><EntityStatusBadge status={entry.order.status}/></div></div>
        <div className="my-4 space-y-2 border-y border-white/10 py-4">{entry.items.map(item=><div key={item.id} className="flex flex-wrap justify-between gap-2 text-sm"><Link href={`/posts/${encodeURIComponent(item.product.id)}`} className="hover:text-orange-200">{item.product.title}</Link><span className="text-white/55">الكمية: {item.quantity}</span></div>)}</div>
        <div className="flex flex-wrap justify-between gap-3 text-sm"><span className="text-white/50">إجمالي الطلب الأصلي: {new Intl.NumberFormat('ar').format(entry.order.totalPrice)} ل.س</span><span className="text-white/50">{entry.trackingNumber ? `رقم التتبع: ${entry.trackingNumber}` : 'لم يضف رقم تتبع'}</span></div>
      </article>)}</div>}
  </div></main>;
}
