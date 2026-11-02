'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { propertyId: string; status: 'AVAILABLE' | 'SOLD' | 'RENTED' };

export default function PropertyBookingAction({ propertyId, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const available = status === 'AVAILABLE';

  async function requestBooking() {
    if (!available || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result.error || 'تعذر إرسال طلب الحجز. حاول مرة أخرى.');
        return;
      }
      setMessage(result.reused ? 'لديك طلب حجز قائم لهذا العقار أو تم استرجاع طلب سابق.' : 'تم تسجيل طلب الحجز بنجاح. لم يتم تحصيل أي مبلغ.');
      router.refresh();
      if (result.booking?.id) router.push('/my-bookings');
    } catch {
      setMessage('تعذر الاتصال بالخادم. تحقق من اتصالك ثم أعد المحاولة.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5">
      <button type="button" onClick={requestBooking} disabled={!available || busy}
        className="block w-full rounded-xl bg-orange-400 px-4 py-3 text-center font-semibold text-[#21180f] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? 'جارٍ إرسال الطلب…' : available ? 'طلب حجز العقار' : 'العقار غير متاح للحجز'}
      </button>
      {message ? <p role="status" aria-live="polite" className="mt-3 text-sm leading-6 text-orange-100">{message}</p> : null}
      <p className="mt-3 text-xs leading-6 text-white/40">طلب تجريبي لتسجيل الاهتمام فقط؛ لا يتم تحصيل رسوم أو تنفيذ دفعة إلكترونية.</p>
    </div>
  );
}
