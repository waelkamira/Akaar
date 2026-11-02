import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'مراجعة كتالوج المنتجات | Akaar', description: 'مراجعة حالة المنتجات المنشورة والمعلقة في المنصة.' };

export default async function AdminCatalogPage() {
  const admin = await getControlPanelAdmin();
  if (!admin) redirect('/admin/dashboard');
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { id: true, title: true, images: true, basePrice: true, categoryName: true, isActive: true, approvalStatus: true, createdAt: true, user: { select: { id: true, userName: true, email: true } }, seller: { select: { id: true, storeName: true, status: true } } },
    orderBy: [{ approvalStatus: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl">
    <EntitySectionHeading eyebrow="الإدارة" title="مراجعة كتالوج المنتجات" description="عرض المنتجات مع مالكها والبائع المرتبط بها وحالة الموافقة والتفعيل. لا تتضمن هذه الصفحة أزرار تغيير الحالة قبل توصيلها إلى مسار API مصرح به." href="/admin/control-panel" linkLabel="لوحة الإدارة"/>
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><p className="text-sm text-white/50">إجمالي النتائج</p><p className="mt-2 text-2xl font-bold">{products.length}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><p className="text-sm text-white/50">قيد المراجعة</p><p className="mt-2 text-2xl font-bold">{products.filter(p=>p.approvalStatus==='PENDING').length}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><p className="text-sm text-white/50">مرفوضة</p><p className="mt-2 text-2xl font-bold">{products.filter(p=>p.approvalStatus==='REJECTED').length}</p></div></div>
    {!products.length ? <EntityEmptyState title="لا توجد منتجات في الكتالوج" description="ستظهر المنتجات غير المحذوفة هنا عند توفرها في قاعدة البيانات."/> :
      <div className="overflow-hidden rounded-2xl border border-white/10">{products.map(product=><article key={product.id} className="grid gap-4 border-b border-white/10 bg-[#202725] p-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr] md:items-center md:px-5">
        <div className="flex items-center gap-3"><div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">{product.images?.[0] ? <Image src={product.images[0]} alt={product.title} fill sizes="56px" unoptimized className="object-cover"/> : null}</div><div className="min-w-0"><Link href={`/posts/${encodeURIComponent(product.id)}`} className="line-clamp-2 font-semibold hover:text-orange-200">{product.title}</Link><p className="mt-1 text-xs text-white/45">{product.categoryName} · {product.user.userName || product.user.email}</p><p className="mt-1 text-xs text-white/35">{product.seller?.storeName || 'لا يوجد ملف بائع مرتبط'}</p></div></div>
        <div className="flex flex-wrap gap-2"><EntityStatusBadge status={product.approvalStatus}/><EntityStatusBadge status={product.isActive ? 'ACTIVE' : 'SUSPENDED'}/></div><div className="text-sm text-white/55"><p>{product.basePrice === null ? 'السعر غير محدد' : new Intl.NumberFormat('ar').format(product.basePrice)+' ل.س'}</p><p className="mt-1 text-xs">{new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(product.createdAt)}</p></div>
      </article>)}</div>}
  </div></main>;
}
