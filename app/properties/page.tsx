import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import EntityEmptyState from '@/components/DatabaseUI/EntityEmptyState';
import EntitySectionHeading from '@/components/DatabaseUI/EntitySectionHeading';
import EntityStatusBadge from '@/components/DatabaseUI/EntityStatusBadge';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'العقارات | Akaar',
  description: 'استكشف العقارات المنشورة وحالة توفرها ومواقعها.',
};

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    where: { isPublished: true, status: 'AVAILABLE' },
    select: { id: true, title: true, description: true, price: true, currency: true, location: true, city: true, country: true, images: true, type: true, status: true, store: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
    take: 48,
  });

  return <main dir="rtl" className="min-h-screen bg-[#171c1a] px-4 py-10 text-[#f5f3ed] sm:px-8"><div className="mx-auto max-w-7xl">
    <EntitySectionHeading eyebrow="عقارات أكار" title="اكتشف العقارات" description="إعلانات منشورة مرتبطة بمالك العقار ومتجره، مع عرض الحالة والسعر والموقع." href="/seller/dashboard" linkLabel="إدارة إعلاناتي"/>
    {properties.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.map(property=><article key={property.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#202725]">
      <Link href={`/properties/${encodeURIComponent(property.id)}`} className="block">
        <div className="relative aspect-[16/10] bg-white/5">{property.images?.[0] ? <Image src={property.images[0]} alt={property.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" unoptimized/> : <div className="flex h-full items-center justify-center text-sm text-white/35">لا توجد صورة</div>}<span className="absolute right-3 top-3"><EntityStatusBadge status={property.status}/></span></div>
        <div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="line-clamp-2 text-lg font-bold">{property.title}</h2><span className="shrink-0 rounded-lg bg-orange-300/10 px-2 py-1 text-xs text-orange-200">{property.type === 'VILLA' ? 'فيلا' : property.type === 'LAND' ? 'أرض' : 'شقة'}</span></div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{property.description || property.location}</p><p className="mt-4 text-xl font-bold text-orange-200">{new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(property.price))} <span className="text-sm font-normal">{property.currency}</span></p><p className="mt-2 text-sm text-white/50">{[property.city,property.country,property.location].filter(Boolean).join(' · ')}</p><p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/40">المتجر: {property.store.name}</p></div>
      </Link>
    </article>)}</div> : <EntityEmptyState title="لا توجد عقارات متاحة حاليًا" description="ستظهر هنا العقارات المنشورة والمتاحة فقط." actionLabel="العودة للمتجر" actionHref="/"/>}
  </div></main>;
}
