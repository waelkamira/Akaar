'use client';

import { useState } from 'react';

export default function StoreReviewForm({ sellerId, canReview }: { sellerId: string; canReview: boolean }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  if (!canReview) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'store', targetId: sellerId, rating, comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'تعذر حفظ التقييم.');
      setStatus('تم حفظ تقييمك بنجاح.');
      setComment('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'تعذر حفظ التقييم.');
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="mt-6 rounded-2xl border border-white/10 bg-[#202725] p-5">
    <h2 className="font-semibold">قيّم هذا المتجر</h2>
    <label className="mt-4 block text-sm text-white/65">التقييم بالنجوم</label>
    <select value={rating} onChange={event => setRating(Number(event.target.value))} className="mt-2 rounded-lg border border-white/10 bg-[#171c1a] px-3 py-2 text-white">
      {[5,4,3,2,1].map(value => <option key={value} value={value}>{value} من 5 نجوم</option>)}
    </select>
    <label className="mt-4 block text-sm text-white/65">تعليقك (اختياري)</label>
    <textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={1000} rows={3} className="mt-2 w-full rounded-lg border border-white/10 bg-[#171c1a] p-3 text-sm text-white" placeholder="شارك تجربتك مع المتجر"/>
    <button disabled={busy} className="mt-3 rounded-lg bg-orange-400 px-5 py-2 font-semibold text-[#21180f] disabled:opacity-50">{busy ? 'جارٍ الحفظ…' : 'إرسال التقييم'}</button>
    {status ? <p role="status" className="mt-3 text-sm text-orange-200">{status}</p> : null}
  </form>;
}
