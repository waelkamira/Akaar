import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'منتجاتي | Akaar',
  description: 'إدارة المنتجات المرتبطة بحساب البائع وحالة نشرها.',
};

function priceLabel(value: number | null) {
  return value === null ? 'السعر غير محدد' : new Intl.NumberFormat('ar', { maximumFractionDigits: 0 }).format(value) + ' ل.س';
}

export default async function SellerProductsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fseller%2Fproducts');
  if (user.role === 'ADMIN') redirect('/admin/control-panel');
  if (user.role !== 'SELLER' && user.role !== 'CUSTOMER') redirect('/');

  const products = await prisma.product.findMany({
    where: { userId: user.id, isDeleted: false },
    select: { id: true, title: true, images: true, basePrice: true, stockQuantity: true, isActive: true, approvalStatus: true, categoryName: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });

  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8">
    <div className="mx-auto max-w-7xl">
      <EntitySectionHeading eyebrow="مساحة البائع" title="منتجاتي" description="تُعرض المنتجات المرتبطة بحسابك، مع حالة الموافقة والتفعيل والمخزون." href="/newPost" linkLabel="إضافة منتج" />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{label:'إجمالي المنتجات',value:products.length},{label:'نشطة',value:products.filter(p=>p.isActive).length},{label:'قيد المراجعة',value:products.filter(p=>p.approvalStatus==='PENDING').length},{label:'مخزون منخفض',value:products.filter(p=>p.stockQuantity!==null&&p.stockQuantity<=3).length}].map(item=><div key={item.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-4"><p className="text-sm text-white/55">{item.label}</p><p className="mt-2 text-2xl font-bold">{item.value}</p></div>)}
      </div>
      {!products.length ? <EntityEmptyState title="لم تضف منتجات بعد" description="ابدأ بإضافة أول منتج، ثم تابع حالة الموافقة والمخزون من هذه الصفحة." actionLabel="إضافة منتج" actionHref="/newPost" /> :
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] gap-4 bg-white/[.05] px-5 py-3 text-xs font-semibold text-white/55 md:grid"><span>المنتج</span><span>السعر والمخزون</span><span>الحالة</span><span>آخر تحديث</span></div>
          {products.map(product=><article key={product.id} className="grid gap-4 border-t border-white/10 bg-[#202725] p-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr] md:items-center md:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">{product.images?.[0] ? <Image src={product.images[0]} alt={product.title} fill sizes="64px" unoptimized className="object-cover"/> : null}</div>
              <div className="min-w-0"><Link href={`/posts/${encodeURIComponent(product.id)}`} className="line-clamp-2 font-semibold hover:text-orange-200">{product.title}</Link><p className="mt-1 text-xs text-white/45">{product.categoryName || 'دون تصنيف'}</p></div>
            </div>
            <div><p className="font-semibold text-orange-200">{priceLabel(product.basePrice)}</p><p className="mt-1 text-xs text-white/50">المخزون: {product.stockQuantity ?? 'غير محدد'}</p></div>
            <div className="flex flex-wrap gap-2"><EntityStatusBadge status={product.approvalStatus}/><EntityStatusBadge status={product.isActive ? 'ACTIVE' : 'SUSPENDED'}/></div>
            <time className="text-sm text-white/50">{new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(product.updatedAt)}</time>
          </article>)}
        </div>}
    </div>
  </main>;
}
