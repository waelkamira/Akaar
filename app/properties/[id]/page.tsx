import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';
import PropertyBookingAction from '@/components/Properties/PropertyBookingAction';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findFirst({ where: { id, isPublished: true }, select: { title: true, description: true } });
  return { title: property ? `${property.title} | Akaar` : 'العقار غير موجود | Akaar', description: property?.description || 'تفاصيل العقار على أكار.' };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, isPublished: true },
    select: { id: true, title: true, description: true, price: true, currency: true, location: true, country: true, city: true, images: true, type: true, status: true, attributes: true, createdAt: true, store: { select: { name: true, slug: true, description: true } }, owner: { select: { id: true, userName: true, userImage: true } } },
  });
  if (!property) notFound();

  const attributes = property.attributes && typeof property.attributes === 'object' && !Array.isArray(property.attributes) ? Object.entries(property.attributes as Record<string, unknown>) : [];
  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-8 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/properties" className="text-sm text-orange-200 hover:text-orange-100">← العودة إلى العقارات</Link>
    <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <section><div className="grid gap-3 sm:grid-cols-2">{(property.images.length ? property.images : ['']).slice(0,4).map((image,index)=><div key={image || index} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">{image ? <Image src={image} alt={property.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized/> : <div className="flex h-full items-center justify-center text-white/35">لا توجد صورة متاحة</div>}</div>)}</div>
        <div className="mt-7 rounded-2xl border border-white/10 bg-white/[.03] p-5"><h2 className="text-lg font-bold">وصف العقار</h2><p className="mt-3 whitespace-pre-line text-sm leading-8 text-white/65">{property.description || 'لم يضف المالك وصفًا لهذا العقار.'}</p></div>
        {attributes.length ? <div className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-5"><h2 className="font-bold">المواصفات</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2">{attributes.map(([key,value])=><div key={key} className="rounded-xl bg-white/[.04] p-3"><dt className="text-xs text-white/45">{key}</dt><dd className="mt-1 break-words text-sm">{typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : JSON.stringify(value)}</dd></div>)}</dl></div> : null}
      </section>
      <aside className="h-fit rounded-3xl border border-white/10 bg-[#202725] p-6"><div className="flex items-center justify-between gap-3"><span className="text-sm text-white/55">{property.type === 'VILLA' ? 'فيلا' : property.type === 'LAND' ? 'أرض' : 'شقة'}</span><EntityStatusBadge status={property.status}/></div><h1 className="mt-4 text-2xl font-bold leading-relaxed">{property.title}</h1><p className="mt-3 text-3xl font-bold text-orange-200">{new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(property.price))} <span className="text-base font-normal">{property.currency}</span></p><p className="mt-4 text-sm leading-7 text-white/55">{[property.location,property.city,property.country].filter(Boolean).join(' · ')}</p>
        <div className="my-6 border-t border-white/10 pt-5"><p className="text-xs text-white/45">المالك</p><p className="mt-2 font-semibold">{property.owner.userName || 'مالك العقار'}</p><p className="mt-1 text-sm text-white/55">المتجر: {property.store.name}</p></div>
        <PropertyBookingAction propertyId={property.id} status={property.status} />
      </aside>
    </div>
  </div></main>;
}
