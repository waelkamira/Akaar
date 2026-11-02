import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic='force-dynamic';
export const metadata: Metadata={title:'العقارات المحفوظة | Akaar',description:'العقارات التي حفظتها في قائمة أمنياتك.'};

export default async function PropertyWishlistPage(){
 const user=await getAuthenticatedUser(); if(!user) redirect('/login?callbackUrl=%2Fproperty-wishlist');
 const saved=await prisma.propertyWishlist.findMany({where:{userId:user.id},select:{id:true,createdAt:true,property:{select:{id:true,title:true,description:true,price:true,currency:true,location:true,city:true,country:true,images:true,status:true,isPublished:true,type:true,store:{select:{name:true}}}}},orderBy:{createdAt:'desc'},take:100});
 const visible=saved.filter(item=>item.property.isPublished&&item.property.status==='AVAILABLE');
 return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl"><EntitySectionHeading eyebrow="حسابي" title="العقارات المحفوظة" description="العقارات التي أضفتها إلى قائمة أمنياتك، مع إظهار العقارات المنشورة والمتاحة فقط." href="/properties" linkLabel="استكشاف العقارات"/>{visible.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map(({id,property})=><article key={id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#202725]"><Link href={`/properties/${encodeURIComponent(property.id)}`}><div className="relative aspect-[16/10] bg-white/5">{property.images[0]?<Image src={property.images[0]} alt={property.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" unoptimized/>:null}<span className="absolute right-3 top-3"><EntityStatusBadge status={property.status}/></span></div><div className="p-5"><h2 className="line-clamp-2 font-bold">{property.title}</h2><p className="mt-2 line-clamp-2 text-sm text-white/50">{property.description||property.location}</p><p className="mt-4 text-xl font-bold text-orange-200">{new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(property.price))} <span className="text-sm font-normal">{property.currency}</span></p><p className="mt-2 text-xs text-white/40">{[property.location,property.city,property.country].filter(Boolean).join(' · ')}</p><p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/45">{property.store.name}</p></div></Link></article>)}</div>:<EntityEmptyState title="لا توجد عقارات محفوظة متاحة" description="إما أن القائمة فارغة أو أن العقارات المحفوظة لم تعد منشورة ومتاحة." actionLabel="تصفح العقارات" actionHref="/properties"/>}</div></main>;
}
