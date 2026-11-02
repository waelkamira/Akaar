import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic='force-dynamic';
export const metadata: Metadata={title:'إدارة البائعين | Akaar',description:'مراجعة ملفات البائعين والمنتجات والطلبات المرتبطة بها.'};

export default async function AdminSellersPage(){
 const admin=await getControlPanelAdmin(); if(!admin) redirect('/admin/dashboard');
 const sellers=await prisma.seller.findMany({select:{id:true,storeName:true,slug:true,status:true,isVerified:true,createdAt:true,contactEmail:true,user:{select:{id:true,userName:true,email:true,status:true}},_count:{select:{products:true,vendorOrders:true,reviews:true}}},orderBy:{createdAt:'desc'},take:200});
 return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl"><EntitySectionHeading eyebrow="الإدارة" title="البائعون والمتاجر" description="ملفات Seller مع الحساب المرتبط وعدد المنتجات والطلبات والتقييمات." href="/admin/control-panel" linkLabel="لوحة الإدارة"/>{sellers.length?<div className="grid gap-4 md:grid-cols-2">{sellers.map(seller=><article key={seller.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{seller.storeName}</h2><p className="mt-1 text-sm text-white/50">{seller.user.userName||seller.user.email}</p><p className="mt-1 break-all text-xs text-white/35">{seller.contactEmail||seller.user.email}</p></div><div className="flex flex-wrap gap-2"><EntityStatusBadge status={seller.status}/>{seller.isVerified?<EntityStatusBadge status="VERIFIED"/>:null}<EntityStatusBadge status={seller.user.status}/></div></div><div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center"><div><p className="text-xl font-bold">{seller._count.products}</p><p className="text-xs text-white/45">منتجات</p></div><div><p className="text-xl font-bold">{seller._count.vendorOrders}</p><p className="text-xs text-white/45">طلبات</p></div><div><p className="text-xl font-bold">{seller._count.reviews}</p><p className="text-xs text-white/45">تقييمات</p></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Link href={`/stores/${encodeURIComponent(seller.slug)}`} className="text-sm text-orange-200 hover:underline">فتح المتجر العام ←</Link><span className="text-xs text-white/35">منذ {new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(seller.createdAt)}</span></div></article>)}</div>:<EntityEmptyState title="لا توجد ملفات بائعين" description="ستظهر ملفات البائعين عند إنشائها وربطها بحسابات المستخدمين."/>}</div></main>;
}
