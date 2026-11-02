import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic='force-dynamic';
export const metadata: Metadata={title:'إدارة المستخدمين | Akaar',description:'عرض حسابات المستخدمين وأدوارهم وحالاتهم.'};

export default async function AdminUsersPage(){
 const admin=await getControlPanelAdmin(); if(!admin) redirect('/admin/dashboard');
 const users=await prisma.user.findMany({select:{id:true,userName:true,email:true,role:true,status:true,emailVerified:true,lastLoginAt:true,createdAt:true,_count:{select:{orders:true,products:true,reviews:true}}},orderBy:{createdAt:'desc'},take:200});
 const suspended=users.filter(u=>u.status!=='ACTIVE').length;
 return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl"><EntitySectionHeading eyebrow="الإدارة" title="المستخدمون" description="قائمة حسابات المستخدمين من قاعدة البيانات، مع الدور والحالة ومؤشرات النشاط المرتبطة." href="/admin/control-panel" linkLabel="لوحة الإدارة"/><div className="mb-5 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-sm text-white/50">الحسابات المعروضة</p><p className="mt-2 text-2xl font-bold">{users.length}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-sm text-white/50">غير النشطة ضمن النتائج</p><p className="mt-2 text-2xl font-bold">{suspended}</p></div></div>{users.length?<div className="space-y-3">{users.map(user=><article key={user.id} className="grid gap-3 rounded-2xl border border-white/10 bg-[#202725] p-4 md:grid-cols-[minmax(0,2fr)_1fr_1fr] md:items-center"><div className="min-w-0"><h2 className="font-semibold">{user.userName||'دون اسم'}</h2><p className="mt-1 break-all text-sm text-white/50">{user.email}</p><p className="mt-1 break-all font-mono text-[10px] text-white/30">{user.id}</p></div><div className="flex flex-wrap gap-2"><EntityStatusBadge status={user.role}/><EntityStatusBadge status={user.status}/>{user.emailVerified?<EntityStatusBadge status="VERIFIED"/>:<EntityStatusBadge status="UNVERIFIED"/>}</div><div className="text-xs leading-6 text-white/50"><p>طلبات: {user._count.orders} · منتجات: {user._count.products} · تقييمات: {user._count.reviews}</p><p>تسجيل: {new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(user.createdAt)}</p><p>آخر دخول: {user.lastLoginAt?new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(user.lastLoginAt):'غير مسجل'}</p></div></article>)}</div>:<EntityEmptyState title="لا توجد حسابات" description="لا توجد سجلات مستخدمين لعرضها."/>}</div></main>;
}
