import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'طلبات حجز العقارات | Akaar', description: 'متابعة طلبات حجز العقارات المرتبطة بحسابك.' };

export default async function MyBookingsPage() {
  const user=await getAuthenticatedUser();
  if(!user) redirect('/login?callbackUrl=%2Fmy-bookings');
  const bookings=await prisma.bookingRequest.findMany({
    where:{userId:user.id},
    select:{id:true,status:true,quotedPrice:true,feeAmount:true,feeCurrency:true,createdAt:true,updatedAt:true,property:{select:{id:true,title:true,images:true,price:true,currency:true,location:true,city:true,country:true,status:true,isPublished:true}}},
    orderBy:{createdAt:'desc'},take:100,
  });
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl">
    <EntitySectionHeading eyebrow="حسابي" title="طلبات حجز العقارات" description="طلبات الحجز المسجلة باسم حسابك، مع السعر المقتبس ورسوم الطلب وحالة العقار." href="/properties" linkLabel="استكشاف العقارات"/>
    {bookings.length ? <div className="space-y-4">{bookings.map(booking=><article key={booking.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><Link href={`/properties/${encodeURIComponent(booking.property.id)}`} className="text-lg font-bold hover:text-orange-200">{booking.property.title}</Link><p className="mt-2 text-sm text-white/50">{[booking.property.location,booking.property.city,booking.property.country].filter(Boolean).join(' · ')}</p><p className="mt-2 text-xs text-white/40">تاريخ الطلب: {new Intl.DateTimeFormat('ar',{dateStyle:'medium',timeStyle:'short'}).format(booking.createdAt)}</p></div><EntityStatusBadge status={booking.status}/></div><div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3"><div><p className="text-xs text-white/45">السعر وقت الطلب</p><p className="mt-1 font-semibold">{new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(booking.quotedPrice))} {booking.property.currency}</p></div><div><p className="text-xs text-white/45">رسوم الطلب المسجلة</p><p className="mt-1 font-semibold">{new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(booking.feeAmount))} {booking.feeCurrency}</p></div><div><p className="text-xs text-white/45">حالة العقار الحالية</p><p className="mt-1 font-semibold">{booking.property.isPublished?booking.property.status:'غير منشور'}</p></div></div></article>)}</div>:<EntityEmptyState title="لا توجد طلبات حجز" description="عندما تطلب حجز عقار منشور ومتاح، ستظهر تفاصيل الطلب وحالته هنا." actionLabel="تصفح العقارات" actionHref="/properties"/>}
  </div></main>;
}
