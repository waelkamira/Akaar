'use client';

import { useState, type FormEvent } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'تعذر إرسال طلب الاشتراك.');
      setMessage(result.message || 'تحقق من بريدك لتأكيد الاشتراك.');
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إرسال طلب الاشتراك.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-6 max-w-sm">
      <h2 className="text-sm font-bold text-white">النشرة البريدية</h2>
      <p className="mt-2 text-xs leading-6 text-ak-muted">اشتراك اختياري، لا يُفعّل إلا بعد تأكيد البريد ويمكن إلغاؤه في أي وقت.</p>
      <form onSubmit={(event) => void submit(event)} className="mt-3 flex gap-2">
        <input aria-label="البريد الإلكتروني للاشتراك" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-ak-line bg-ak-surface px-3 py-2 text-sm text-white" />
        <button type="submit" disabled={pending} className="rounded-lg bg-ak-brand px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{pending ? '...' : 'اشتراك'}</button>
      </form>
      {message && <p role="status" className="mt-2 text-xs text-emerald-300">{message}</p>}
      {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
    </section>
  );
}
