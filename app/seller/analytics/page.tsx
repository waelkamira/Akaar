import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'تحليلات المتجر | Akaar', description: 'مؤشرات أساسية للمنتجات والمخزون والطلبات المرتبطة بحساب البائع.' };

export default async function SellerAnalyticsPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fseller%2Fanalytics');
  if(user.role==='ADMIN') redirect('/admin/control-panel');
  if(user.role!=='SELLER'&&user.role!=='CUSTOMER') redirect('/');
  const seller=await prisma.seller.findUnique({where:{userId:user.id},select:{id:true,status:true,storeName:true}});
  if(!seller) return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-white"><div className="mx-auto max-w-6xl"><EntitySectionHeading title="تحليلات المتجر" description="أنشئ ملف بائع واربط المنتجات به قبل احتساب المؤشرات." href="/seller/dashboard" linkLabel="لوحة البائع"/><EntityEmptyState title="لا يوجد ملف بائع مرتبط" description="لا يمكن عرض مؤشرات البائع قبل إنشاء ملف Seller."/></div></main>;
  const [productStats,ordersCount,pendingCount,lowStockCount]=await Promise.all([
    prisma.product.aggregate({where:{sellerId:seller.id,isDeleted:false},_count:{_all:true},_sum:{salesCount:true}}),
    prisma.vendorOrder.count({where:{sellerId:seller.id}}),
    prisma.vendorOrder.count({where:{sellerId:seller.id,status:'PENDING'}}),
    prisma.product.count({where:{sellerId:seller.id,isDeleted:false,stockQuantity:{lte:3}}}),
  ]);
  const metrics=[{label:'المنتجات المسجلة',value:productStats._count._all},{label:'إجمالي المبيعات المسجلة',value:productStats._sum.salesCount||0},{label:'طلبات البائع',value:ordersCount},{label:'طلبات بانتظار المعالجة',value:pendingCount},{label:'منتجات مخزونها منخفض',value:lowStockCount}];
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="تقارير البائع" title={`تحليلات ${seller.storeName}`} description="مؤشرات مستخرجة مباشرة من Product وVendorOrder. المبيعات هنا عددية وليست إيرادًا ماليًا؛ لا تُعرض أرباح غير محسوبة." href="/seller/products" linkLabel="إدارة المنتجات"/>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(metric=><article key={metric.label} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><p className="text-sm text-white/55">{metric.label}</p><p className="mt-3 text-3xl font-bold text-orange-200">{new Intl.NumberFormat('ar').format(metric.value)}</p></article>)}</div>
    <section className="mt-7 rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex flex-wrap items-center gap-3"><EntityStatusBadge status={seller.status}/><p className="text-sm leading-7 text-white/55">هذه نسخة أولية من التحليلات تعتمد على العدّ الفعلي للسجلات. حساب الإيرادات والعمولات يتطلب تجميع المدفوعات المسوّاة لكل VendorOrder.</p></div><div className="mt-4 flex flex-wrap gap-3"><Link href="/seller/orders" className="rounded-xl border border-white/15 px-4 py-2.5 text-sm hover:border-orange-300/50">طلبات المتجر</Link><Link href="/seller/dashboard" className="rounded-xl border border-white/15 px-4 py-2.5 text-sm hover:border-orange-300/50">لوحة البائع</Link></div></section>
  </div></main>;
}
