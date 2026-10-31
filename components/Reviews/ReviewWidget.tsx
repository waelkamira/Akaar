'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState, type FormEvent } from 'react';

type ReviewTargetType = 'product' | 'store';
type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  userName: string | null;
};
type ReviewData = {
  average: number;
  count: number;
  reviews: ReviewItem[];
  ownReview: { rating: number; comment: string | null } | null;
  isAuthenticated: boolean;
  canReview: boolean;
};

export default function ReviewWidget({
  targetType,
  targetId,
  title,
}: {
  targetType: ReviewTargetType;
  targetId: string;
  title: string;
}) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const fetchReviews = useCallback(async () => {
    const params = new URLSearchParams({ type: targetType, id: targetId });
    const response = await fetch(`/api/reviews?${params}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'تعذر تحميل التقييمات.');
    return payload as ReviewData;
  }, [targetId, targetType]);

  const applyReviewData = useCallback((next: ReviewData) => {
    setData(next);
    setError('');
    setRating(next.ownReview?.rating || 0);
    setComment(next.ownReview?.comment || '');
  }, []);

  useEffect(() => {
    let active = true;
    fetchReviews()
      .then((next) => {
        if (active) applyReviewData(next);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل التقييمات.');
      });
    return () => { active = false; };
  }, [applyReviewData, fetchReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('اختر تقييمًا من نجمة إلى خمس نجوم.');
      return;
    }

    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, rating, comment }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر حفظ تقييمك.');
      applyReviewData(await fetchReviews());
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر حفظ تقييمك.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-ak-line bg-ak-surface p-5 text-white sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {data
            ? <p className="mt-1 text-sm text-stone-400">{data.count ? `${data.average.toFixed(1)} من 5 · ${data.count} تقييم` : 'لا توجد تقييمات بعد'}</p>
            : <p className="mt-1 text-sm text-stone-400">جارٍ تحميل التقييمات...</p>}
        </div>
        {data && data.count > 0 && (
          <div className="flex gap-0.5 text-lg text-amber-300" aria-label={`متوسط التقييم ${data.average.toFixed(1)} من 5`}>
            {Array.from({ length: 5 }, (_, index) => <span key={index}>{index < Math.round(data.average) ? '★' : '☆'}</span>)}
          </div>
        )}
      </header>

      {error && <p role="alert" className="mt-4 rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

      {data?.canReview && (
        <form onSubmit={(event) => void submitReview(event)} className="mt-5 space-y-3 border-t border-ak-line pt-5">
          <fieldset>
            <legend className="text-sm font-semibold">{data.ownReview ? 'حدّث تقييمك' : 'أضف تقييمك'}</legend>
            <div className="mt-2 flex gap-1" dir="ltr">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} من 5 نجوم`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className={`text-2xl transition ${value <= rating ? 'text-amber-300' : 'text-stone-600 hover:text-amber-200'}`}
                  >★</button>
                );
              })}
            </div>
          </fieldset>
          <label className="block text-sm">
            تعليق (اختياري)
            <textarea value={comment} maxLength={1000} rows={3} onChange={(event) => setComment(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink px-3 py-2 text-sm text-white outline-none focus:border-ak-amber" />
          </label>
          <button type="submit" disabled={pending || rating < 1} className="rounded-xl bg-ak-amber px-4 py-2.5 text-sm font-bold text-ak-ink disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? 'جارٍ الحفظ...' : data.ownReview ? 'تحديث التقييم' : 'إرسال التقييم'}
          </button>
        </form>
      )}

      {data && !data.isAuthenticated && (
        <p className="mt-4 border-t border-ak-line pt-4 text-sm text-stone-400">
          <Link href="/login" className="text-ak-honey underline">سجّل الدخول</Link> لإضافة تقييم.
        </p>
      )}
      {data?.isAuthenticated && !data.canReview && !data.ownReview && (
        <p className="mt-4 border-t border-ak-line pt-4 text-sm text-stone-400">لا يمكنك تقييم منتجك أو متجرك.</p>
      )}

      {data?.reviews.length ? (
        <div className="mt-5 space-y-3 border-t border-ak-line pt-5">
          {data.reviews.map((review) => (
            <article key={review.id} className="rounded-xl border border-ak-line-strong/[.08] bg-ak-ink/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{review.userName || 'مستخدم'}</p>
                <span className="text-sm text-amber-300" aria-label={`${review.rating} من 5 نجوم`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              {review.comment && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-300">{review.comment}</p>}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
