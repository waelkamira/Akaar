import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الإشعارات | Akaar', description: 'إشعارات حسابك المرتبطة بطلباتك وأنشطتك على أكار.' };

export default async function NotificationsPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fnotifications');
  const notifications=await prisma.notification.findMany({where:{userId:user.id},select:{id:true,type:true,message:true,isRead:true,createdAt:true},orderBy:{createdAt:'desc'},take:100});
  const unread=notifications.filter(item=>!item.isRead).length;
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-5xl">
    <EntitySectionHeading eyebrow="حسابي" title="الإشعارات" description="الإشعارات المحفوظة لحسابك، مرتبة من الأحدث إلى الأقدم." href="/profile" linkLabel="الملف الشخصي"/>
    <div className="mb-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-sm text-white/55">غير المقروء في النتائج الحالية: <strong className="text-orange-200">{unread}</strong></div>
    {notifications.length ? <div className="space-y-3">{notifications.map(item=><article key={item.id} className={`rounded-2xl border p-5 ${item.isRead?'border-white/10 bg-[#202725]':'border-orange-300/25 bg-orange-300/[.05]'}`}><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex-1"><p className="leading-7">{item.message}</p><p className="mt-2 text-xs text-white/40">{new Intl.DateTimeFormat('ar',{dateStyle:'medium',timeStyle:'short'}).format(item.createdAt)}</p></div><EntityStatusBadge status={item.isRead?'COMPLETED':'PENDING'}/></div><p className="mt-3 text-xs text-white/40">النوع: {item.type}</p></article>)}</div> : <EntityEmptyState title="لا توجد إشعارات" description="ستظهر هنا الإشعارات المرتبطة بحسابك عندما تُنشأ من النظام." actionLabel="متابعة التسوق" actionHref="/"/>}
  </div></main>;
}
