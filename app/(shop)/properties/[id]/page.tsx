import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, isPublished: true },
    select: { title: true, description: true },
  });
  if (!property) return { title: 'العقار غير متاح | Akaar' };
  return {
    title: `${property.title} | Akaar`,
    description: property.description?.slice(0, 160) || `تفاصيل العقار ${property.title}.`,
  };
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  const property = await prisma.property.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      location: true,
      city: true,
      country: true,
      images: true,
      type: true,
      status: true,
      attributes: true,
      store: { select: { name: true, slug: true, description: true } },
    },
  });
  if (!property) notFound();

  const typeNames: Record<string, string> = { APARTMENT: 'شقة', VILLA: 'فيلا', LAND: 'أرض' };
  const statusNames: Record<string, string> = { AVAILABLE: 'متاح', SOLD: 'مباع', RENTED: 'مؤجر' };
  const attributes = property.attributes && typeof property.attributes === 'object' && !Array.isArray(property.attributes)
    ? Object.entries(property.attributes as Record<string, unknown>)
    : [];

  return (
    <main dir="rtl" className="min-h-screen bg-ak-canvas px-4 py-8 text-white sm:py-12">
      <article className="mx-auto max-w-6xl">
        <Link href="/search" className="text-sm text-ak-honey transition hover:text-white">← العودة إلى التصفح</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            {property.images[0]
              ? <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ak-line-strong shadow-ak-panel"><Image src={property.images[0]} alt={property.title} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" /></div>
              : <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-ak-line bg-ak-surface text-6xl text-ak-amber/50" aria-label="لا توجد صورة مرفوعة">⌂</div>}
            {!!property.images.length && property.images.length > 1 && <div className="grid grid-cols-4 gap-3">{property.images.slice(1, 5).map((image, index) => <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-xl"><Image src={image} alt={`${property.title} ${index + 2}`} fill sizes="20vw" className="object-cover" /></div>)}</div>}
          </div>
          <section className="ak-panel-raised p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-ak-amber/25 bg-ak-brand-soft px-3 py-1 text-xs text-ak-honey">{typeNames[property.type] || property.type}</span><span className="text-xs text-white">{statusNames[property.status] || property.status}</span></div>
            <h1 className="mt-5 text-3xl font-black leading-tight">{property.title}</h1>
            <p className="mt-3 text-sm text-white">{[property.location, property.city, property.country].filter(Boolean).join('، ')}</p>
            <p className="mt-7 text-3xl font-black text-ak-honey">{new Intl.NumberFormat('ar', { style: 'currency', currency: property.currency }).format(Number(property.price))}</p>
            <div className="my-7 border-t border-ak-line" />
            <h2 className="font-bold">عن العقار</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white">{property.description || 'لم يضف البائع وصفًا لهذا العقار بعد.'}</p>
            {!!attributes.length && <dl className="mt-6 grid grid-cols-2 gap-3">{attributes.map(([key, value]) => <div key={key} className="rounded-xl border border-ak-line bg-ak-ink/60 p-3"><dt className="text-xs text-ak-quiet">{key}</dt><dd className="mt-1 text-sm">{String(value)}</dd></div>)}</dl>}
            <div className="mt-7 rounded-2xl border border-ak-line p-4"><p className="font-semibold">{property.store.name}</p>{property.store.description && <p className="mt-1 text-sm text-white">{property.store.description}</p>}</div>
            {property.status === 'AVAILABLE' ? <Link href={`/properties/${encodeURIComponent(property.id)}/book`} className="ak-button-primary mt-6 w-full">طلب حجز تجريبي · رسوم 1 USD</Link> : <p className="mt-6 rounded-xl bg-stone-500/10 p-4 text-center text-sm text-white">هذا العقار غير متاح للحجز حاليًا.</p>}
            <p className="mt-3 text-center text-xs leading-5 text-ak-quiet">طلب الحجز تجريبي فقط. لن تتم معالجة أي دفعة أو حفظ أموال في حساب ضمان.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
