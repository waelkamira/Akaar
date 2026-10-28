'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type PropertySummary = {
  id: string;
  title: string;
  price: string;
  currency: string;
  city: string | null;
  location: string;
  images: string[];
  status: 'AVAILABLE' | 'SOLD' | 'RENTED';
};

type Booking = {
  id: string;
  quotedPrice: string;
  feeAmount: string;
  feeCurrency: string;
  status: string;
  createdAt: string;
};

export default function BookingCheckout({ property }: { property: PropertySummary }) {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  async function submitRequest() {
    if (!accepted) {
      setError('يرجى تأكيد فهمك أن هذا طلب تجريبي بلا تحصيل مالي.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id, idempotencyKey: crypto.randomUUID() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'تعذر إرسال طلب الحجز.');
      setBooking(result.booking);
      setStep(2);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'تعذر إرسال طلب الحجز.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-ak-ink px-4 py-10 text-ak-cream sm:py-14">
      <div className="mx-auto max-w-4xl">
        <Link href={`/properties/${encodeURIComponent(property.id)}`} className="text-sm text-ak-honey hover:text-ak-cream">← العودة إلى العقار</Link>
        <header className="mt-7"><p className="text-xs font-semibold tracking-[.22em] text-ak-amber">BOOKING REQUEST</p><h1 className="mt-2 text-3xl font-black">طلب حجز العقار</h1><p className="mt-2 text-sm text-stone-400">خطوة آمنة لمراجعة بياناتك قبل إرسال الطلب.</p></header>

        <ol className="mt-7 grid grid-cols-3 gap-2 text-xs">
          {['مراجعة العقار', 'تأكيد الشروط', 'تم إرسال الطلب'].map((label, index) => <li key={label} className={`border-b-2 pb-3 ${step >= index ? 'border-ak-amber text-ak-honey' : 'border-ak-line text-stone-500'}`}>{index + 1}. {label}</li>)}
        </ol>

        {booking ? (
          <section className="mt-7 rounded-3xl border border-emerald-400/20 bg-ak-surface p-6 sm:p-9">
            <div className="text-4xl text-emerald-300" aria-hidden="true">✓</div>
            <h2 className="mt-4 text-2xl font-black">تم تسجيل طلب الحجز</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">هذا طلب تجريبي بانتظار المراجعة. لم يتم تحصيل الرسوم ولم تُحجز أموال في حساب ضمان.</p>
            <dl className="mt-6 grid gap-4 rounded-2xl bg-ak-canvas p-4 sm:grid-cols-2">
              <div><dt className="text-xs text-stone-500">رقم الطلب</dt><dd className="mt-1 break-all font-mono text-sm">{booking.id}</dd></div>
              <div><dt className="text-xs text-stone-500">رسوم الحجز التجريبية</dt><dd className="mt-1 font-bold text-ak-honey">{Number(booking.feeAmount).toFixed(2)} {booking.feeCurrency} · غير مدفوعة</dd></div>
              <div><dt className="text-xs text-stone-500">سعر العقار وقت الطلب</dt><dd className="mt-1">{Number(booking.quotedPrice).toLocaleString()} {property.currency}</dd></div>
              <div><dt className="text-xs text-stone-500">الحالة</dt><dd className="mt-1">{booking.status === 'PENDING' ? 'قيد المراجعة' : booking.status}</dd></div>
            </dl>
            <Link href="/profile" className="mt-6 inline-flex rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-canvas">العودة إلى الملف الشخصي</Link>
          </section>
        ) : (
          <section className="mt-7 grid gap-6 rounded-3xl border border-ak-line bg-ak-surface p-5 sm:p-8 lg:grid-cols-[1fr_.8fr]">
            <div>
              {property.images[0] ? <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={property.images[0]} alt={property.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div> : <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-ak-canvas text-5xl text-ak-amber/40">⌂</div>}
              <h2 className="mt-4 text-xl font-bold">{property.title}</h2>
              <p className="mt-2 text-sm text-stone-400">{property.city ? `${property.city} · ` : ''}{property.location}</p>
              <p className="mt-4 text-xl font-black text-ak-honey">{Number(property.price).toLocaleString()} {property.currency}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">{step === 0 ? 'مراجعة ملخص الطلب' : 'تأكيد الشروط'}</h2>
              {step === 0 ? (
                <>
                  <dl className="mt-5 space-y-4 rounded-2xl bg-ak-canvas p-4 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-stone-400">السعر المعروض</dt><dd>{Number(property.price).toLocaleString()} {property.currency}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-stone-400">رسوم طلب الحجز التجريبية</dt><dd className="font-bold">1.00 USD</dd></div>
                    <div className="border-t border-ak-line pt-3 text-xs leading-6 text-stone-500">سيعيد الخادم قراءة سعر العقار الحالي ويخزّن نسخة السعر عند إنشاء الطلب. لا نقبل السعر أو الرسوم من المتصفح.</div>
                  </dl>
                  <button type="button" onClick={() => { setStep(1); setError(''); }} className="mt-auto rounded-xl bg-ak-amber px-5 py-3 font-bold text-ak-canvas">متابعة</button>
                </>
              ) : (
                <>
                  <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-7 text-amber-100">
                    <p className="font-bold">محاكاة فقط — ليست عملية دفع أو ضمان</p>
                    <p className="mt-2 text-amber-100/70">رسوم 1 USD مرجعية لطلب الحجز فقط. لا يوجد مزود دفع متصل، ولن يتم خصم أو حجز أي مبلغ. سيتم إرسال الطلب للبائع للمراجعة.</p>
                  </div>
                  <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-stone-300"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 accent-ak-amber" />أفهم أنني أرسل طلب اهتمام تجريبيًا فقط، ولا أدفع رسومًا ولا أودع أموالًا.</label>
                  {error && <p role="alert" className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
                  <div className="mt-auto flex gap-3 pt-6">
                    <button type="button" disabled={loading} onClick={() => { setStep(0); setError(''); }} className="rounded-xl border border-ak-line px-4 py-3 text-sm disabled:opacity-50">السابق</button>
                    <button type="button" disabled={loading || !accepted} onClick={() => void submitRequest()} className="flex-1 rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-canvas disabled:opacity-50">{loading ? 'جارٍ إرسال الطلب...' : 'إرسال طلب الحجز'}</button>
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
