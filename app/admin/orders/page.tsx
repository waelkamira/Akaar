import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic='force-dynamic';
export const metadata: Metadata={title:'إدارة الطلبات | Akaar',description:'متابعة طلبات العملاء وعناصرها والمدفوعات المرتبطة بها.'};

export default async function AdminOrdersPage(){
 const admin=await getControlPanelAdmin(); if(!admin) redirect('/admin/dashboard');
 const orders=await prisma.order.findMany({select:{id:true,totalPrice:true,status:true,createdAt:true,shippingCity:true,customerName:true,user:{select:{id:true,userName:true,email:true}},items:{select:{id:true,quantity:true,product:{select:{id:true,title:true}}}},payments:{select:{id:true,status:true,method:true,amount:true,currency:true},orderBy:{createdAt:'desc'},take:1}},orderBy:{createdAt:'desc'},take:150});
 return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl"><EntitySectionHeading eyebrow="الإدارة" title="طلبات العملاء" description="عرض الطلبات المرتبطة بالعميل وعناصر الطلب وآخر سجل دفع." href="/admin/control-panel" linkLabel="لوحة الإدارة"/>{orders.length?<div className="space-y-4">{orders.map(order=><article key={order.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-white/40">معرّف الطلب</p><p className="mt-1 break-all font-mono text-xs">{order.id}</p><p className="mt-2 font-semibold">{order.customerName||order.user.userName||order.user.email}</p><p className="mt-1 text-xs text-white/45">{order.user.email} · {order.shippingCity||'دون مدينة شحن'}</p><p className="mt-1 text-xs text-white/40">{new Intl.DateTimeFormat('ar',{dateStyle:'medium',timeStyle:'short'}).format(order.createdAt)}</p></div><div className="flex flex-wrap gap-2"><EntityStatusBadge status={order.status}/>{order.payments[0]?<EntityStatusBadge status={order.payments[0].status}/>:null}</div></div><div className="my-4 space-y-2 border-y border-white/10 py-4">{order.items.map(item=><div key={item.id} className="flex flex-wrap justify-between gap-3 text-sm"><Link href={`/posts/${encodeURIComponent(item.product.id)}`} className="text-white/75 hover:text-orange-200">{item.product.title}</Link><span className="text-white/45">الكمية: {item.quantity}</span></div>)}</div><div className="flex flex-wrap justify-between gap-3"><strong className="text-orange-200">{new Intl.NumberFormat('ar').format(order.totalPrice)} ل.س</strong><span className="text-xs text-white/45">{order.payments[0]? `الدفع: ${order.payments[0].method} · ${order.payments[0].currency} ${order.payments[0].amount}`:'لا يوجد سجل دفع'}</span></div></article>)}</div>:<EntityEmptyState title="لا توجد طلبات" description="ستظهر الطلبات عند إنشائها عبر مسار إتمام الشراء."/ >}</div></main>;
}
