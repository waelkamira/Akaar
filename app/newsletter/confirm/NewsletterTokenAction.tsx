'use client';

import { useState } from 'react';

export default function NewsletterTokenAction({ token, action }: { token: string; action: 'confirm' | 'unsubscribe' }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'تعذر تحديث الاشتراك.');
      setMessage(result.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر تحديث الاشتراك.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <section className="ak-panel space-y-4 p-6 text-center">
        <h1 className="text-2xl font-black">{action === 'confirm' ? 'تأكيد الاشتراك' : 'إلغاء الاشتراك'}</h1>
        <p className="text-sm text-stone-400">{action === 'confirm' ? 'اضغط للتأكيد. لن تُفعّل النشرة دون موافقتك.' : 'اضغط لإلغاء اشتراكك في النشرة البريدية.'}</p>
        <button type="button" disabled={pending || !token} onClick={() => void submit()} className="rounded-lg bg-ak-brand px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? 'جارٍ التنفيذ...' : action === 'confirm' ? 'تأكيد الاشتراك' : 'إلغاء الاشتراك'}</button>
        {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        {!token && <p role="alert" className="text-sm text-rose-300">رابط الاشتراك غير مكتمل.</p>}
      </section>
    </main>
  );
}
