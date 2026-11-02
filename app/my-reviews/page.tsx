import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';

export const dynamic='force-dynamic';
export const metadata: Metadata={title:'تقييماتي | Akaar',description:'تقييمات المنتجات والمتاجر التي أرسلتها من حسابك.'};

export default async function MyReviewsPage(){
 const user=await getAuthenticatedUser(); if(!user) redirect('/login?callbackUrl=%2Fmy-reviews');
 const [reviews,storeReviews]=await Promise.all([
  prisma.review.findMany({where:{userId:user.id},select:{id:true,rating:true,comment:true,createdAt:true,product:{select:{id:true,title:true,images:true,isDeleted:true}}},orderBy:{createdAt:'desc'},take:100}),
  prisma.storeReview.findMany({where:{userId:user.id},select:{id:true,rating:true,comment:true,createdAt:true,seller:{select:{storeName:true,slug:true,status:true}}},orderBy:{createdAt:'desc'},take:100}),
 ]);
 return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl"><EntitySectionHeading eyebrow="حسابي" title="تقييماتي" description="تقييمات المنتجات والمتاجر المرتبطة بحسابك." href="/profile" linkLabel="العودة إلى حسابي"/><section><h2 className="mb-4 text-xl font-bold">تقييمات المنتجات <span className="text-sm font-normal text-white/45">({reviews.length})</span></h2>{reviews.length?<div className="space-y-3">{reviews.map(review=><article key={review.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/posts/${encodeURIComponent(review.product.id)}`} className="font-semibold hover:text-orange-200">{review.product.title}</Link><p className="mt-2 text-sm text-orange-200">{'★'.repeat(Math.max(0,Math.min(5,review.rating)))}<span className="mr-2 text-white/45">{review.rating}/5</span></p></div><time className="text-xs text-white/40">{new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(review.createdAt)}</time></div><p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/65">{review.comment||'لم يرفق تعليق كتابي.'}</p>{review.product.isDeleted?<p className="mt-3 text-xs text-white/35">المنتج محذوف أو غير متاح حاليًا.</p>:null}</article>)}</div>:<EntityEmptyState title="لم تقيّم أي منتج بعد" description="ستظهر هنا تقييمات المنتجات التي ترسلها عند تفعيل مسار كتابة التقييم."/ >}</section><section className="mt-9"><h2 className="mb-4 text-xl font-bold">تقييمات المتاجر <span className="text-sm font-normal text-white/45">({storeReviews.length})</span></h2>{storeReviews.length?<div className="space-y-3">{storeReviews.map(review=><article key={review.id} className="rounded-2xl border border-white/10 bg-[#202725] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link href={`/stores/${encodeURIComponent(review.seller.slug)}`} className="font-semibold hover:text-orange-200">{review.seller.storeName}</Link><p className="mt-2 text-sm text-orange-200">{'★'.repeat(Math.max(0,Math.min(5,review.rating)))}<span className="mr-2 text-white/45">{review.rating}/5</span></p></div><time className="text-xs text-white/40">{new Intl.DateTimeFormat('ar',{dateStyle:'medium'}).format(review.createdAt)}</time></div><p className="mt-3 text-sm leading-7 text-white/65">{review.comment||'لم يرفق تعليق كتابي.'}</p></article>)}</div>:<p className="rounded-2xl border border-white/10 bg-[#202725] p-5 text-sm text-white/50">لا توجد تقييمات للمتاجر في حسابك.</p>}</section></div></main>;
}
