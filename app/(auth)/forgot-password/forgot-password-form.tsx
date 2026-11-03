'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال الطلب.');
      setMessage(payload.message);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إكمال الطلب.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[calc(100vh-5rem)] bg-ak-canvas px-4 py-12 text-white">
      <section className="ak-glass mx-auto max-w-lg rounded-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-black">استعادة كلمة المرور</h1>
        <p className="mt-3 text-sm leading-7 text-white/75">أدخل بريدك الإلكتروني، وسنرسل رابطًا إذا كان الحساب مؤهلًا للاستعادة.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold">البريد الإلكتروني
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 text-left outline-none focus:border-ak-amber" dir="ltr" />
          </label>
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
          {!message && <button type="submit" disabled={submitting} className="w-full rounded-xl bg-ak-amber px-5 py-3.5 font-bold text-ak-ink disabled:opacity-60">{submitting ? 'جارٍ الإرسال...' : 'إرسال رابط الاستعادة'}</button>}
        </form>
        <p className="mt-6 text-sm"><Link href="/login" className="font-bold text-ak-honey hover:text-white">العودة إلى تسجيل الدخول</Link></p>
      </section>
    </main>
  );
}
