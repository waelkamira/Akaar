'use client';

import { useState } from 'react';

export default function PasswordSettingsForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور الجديدتان غير متطابقتين.');
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setError('كلمة المرور الجديدة طويلة جدًا؛ الحد الأقصى 72 بايت.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'تعذر تحديث كلمة المرور.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('تم تحديث كلمة المرور بنجاح.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر تحديث كلمة المرور.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-[#202725] p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-bold">تغيير كلمة المرور</h2>
        <p className="mt-2 text-sm text-white/50">يتطلب التغيير كلمة المرور الحالية للتحقق من هويتك.</p>
      </div>
      <div>
        <label htmlFor="current-password" className="mb-2 block text-sm">كلمة المرور الحالية</label>
        <input id="current-password" type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none focus:border-orange-200/60" />
      </div>
      <div>
        <label htmlFor="new-password" className="mb-2 block text-sm">كلمة المرور الجديدة</label>
        <input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={newPassword} onChange={event => setNewPassword(event.target.value)} className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none focus:border-orange-200/60" />
        <p className="mt-2 text-xs text-white/40">8 أحرف على الأقل، وبحد أقصى 72 بايت.</p>
      </div>
      <div>
        <label htmlFor="confirm-password" className="mb-2 block text-sm">تأكيد كلمة المرور الجديدة</label>
        <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none focus:border-orange-200/60" />
      </div>
      {error ? <p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      {message ? <p role="status" className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p> : null}
      <button type="submit" disabled={busy || !currentPassword || newPassword.length < 8 || !confirmPassword} className="rounded-xl bg-orange-200 px-6 py-3 text-sm font-bold text-[#21180f] transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'جارٍ التحديث…' : 'تحديث كلمة المرور'}</button>
    </form>
  );
}
