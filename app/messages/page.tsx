import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'الرسائل | Akaar', description: 'محادثات العملاء والبائعين المرتبطة بحسابك.' };

export default async function MessagesPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fmessages');
  const conversations=await prisma.storeConversation.findMany({
    where:{OR:[{customerId:user.id},{seller:{userId:user.id}}]},
    select:{id:true,createdAt:true,updatedAt:true,customer:{select:{id:true,userName:true,userImage:true}},seller:{select:{id:true,userId:true,storeName:true,slug:true}},messages:{select:{id:true,body:true,senderId:true,readAt:true,createdAt:true},orderBy:{createdAt:'desc'},take:1}},
    orderBy:{updatedAt:'desc'},take:100,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-5xl">
    <EntitySectionHeading eyebrow="التواصل" title="رسائلي" description="المحادثات التي يكون حسابك فيها عميلًا أو مرتبطًا بملف بائع." href="/search" linkLabel="تصفّح المنتجات"/>
    {conversations.length ? <div className="space-y-3">{conversations.map(conversation=>{const latest=conversation.messages[0];const counterpart=conversation.customerId===user.id?conversation.seller.storeName:(conversation.customer.userName||'عميل');return <article key={conversation.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{counterpart}</h2><p className="mt-1 text-xs text-white/40">آخر تحديث: {new Intl.DateTimeFormat('ar',{dateStyle:'medium',timeStyle:'short'}).format(conversation.updatedAt)}</p></div><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{conversation.messages.length?'لديك رسالة سابقة':'محادثة جديدة'}</span></div><p className="mt-4 line-clamp-2 text-sm leading-7 text-white/60">{latest?.body || 'لا توجد رسائل في هذه المحادثة بعد.'}</p><p className="mt-2 text-xs text-white/35">معرّف المحادثة: <code dir="ltr">{conversation.id}</code></p><p className="mt-3 text-xs text-white/40">واجهة عرض الرسائل متصلة بجدول StoreMessage؛ إرسال الرسائل وفتح المحادثة يحتاجان إلى ربط واجهة المحادثة ومسار الكتابة المعتمد.</p></article>})}</div> : <EntityEmptyState title="لا توجد محادثات بعد" description="ستظهر محادثات العملاء والبائعين هنا عند إنشاء StoreConversation." actionLabel="العودة إلى المتجر" actionHref="/"/>}
  </div></main>;
}
