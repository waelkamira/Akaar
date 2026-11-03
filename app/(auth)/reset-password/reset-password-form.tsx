'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحديث كلمة المرور.');
      window.history.replaceState(null, '', '/reset-password');
      setMessage('تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر تحديث كلمة المرور.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[calc(100vh-5rem)] bg-ak-canvas px-4 py-12 text-white">
      <section className="ak-glass mx-auto max-w-lg rounded-3xl p-6 sm:p-10">
        <h1 className="text-3xl font-black">تعيين كلمة مرور جديدة</h1>
        {!token && <p role="alert" className="mt-4 text-sm text-rose-200">رابط الاستعادة غير صالح أو مفقود. <Link href="/forgot-password" className="font-bold underline">اطلب رابطًا جديدًا</Link>.</p>}
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold">كلمة المرور الجديدة
            <input type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none focus:border-ak-amber" />
          </label>
          <p className="text-xs text-ak-quiet">8 أحرف على الأقل، وبحد أقصى 72 بايتًا.</p>
          {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p>}
          {!message && <button type="submit" disabled={!token || submitting} className="w-full rounded-xl bg-ak-amber px-5 py-3.5 font-bold text-ak-ink disabled:opacity-60">{submitting ? 'جارٍ التحديث...' : 'تحديث كلمة المرور'}</button>}
        </form>
        <p className="mt-6 text-sm"><Link href="/login" className="font-bold text-ak-honey hover:text-white">العودة إلى تسجيل الدخول</Link></p>
      </section>
    </main>
  );
}
