import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import NotificationsInbox from '@/components/Notifications/NotificationsInbox';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الإشعارات | Akaar', description: 'إشعارات حسابك المرتبطة بطلباتك وأنشطتك على أكار.' };

export default async function NotificationsPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fnotifications');
  const notifications=await prisma.notification.findMany({where:{userId:user.id},select:{id:true,type:true,message:true,isRead:true,createdAt:true},orderBy:{createdAt:'desc'},take:100});
  
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-5xl">
    <EntitySectionHeading eyebrow="حسابي" title="الإشعارات" description="الإشعارات المحفوظة لحسابك، مرتبة من الأحدث إلى الأقدم." href="/profile" linkLabel="الملف الشخصي"/>
    <NotificationsInbox initialNotifications={notifications.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }))} />
  </div></main>;
}
