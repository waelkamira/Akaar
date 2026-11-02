'use client';

import { useEffect, useState } from 'react';

type Profile = { userName: string | null; userImage: string | null; email: string };

export default function ProfileSettingsForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/user', { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'تعذر تحميل بيانات الحساب.');
        setProfile(data);
        setUserName(data.userName || '');
        setUserImage(data.userImage || '');
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'تعذر تحميل بيانات الحساب.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userImage: userImage.trim() || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'تعذر حفظ التغييرات.');
      setProfile(current => current ? { ...current, userName: data.user.userName, userImage: data.user.userImage } : current);
      setMessage('تم حفظ إعدادات الحساب بنجاح.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'تعذر حفظ التغييرات.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="rounded-2xl border border-white/10 bg-[#202725] p-6 text-sm text-white/60">جارٍ تحميل بيانات الحساب…</div>;
  if (!profile) return <div role="alert" className="rounded-2xl border border-red-300/20 bg-red-400/10 p-5 text-sm text-red-100">{error || 'تعذر تحميل الحساب.'}</div>;

  return (
    <form onSubmit={save} className="space-y-6 rounded-3xl border border-white/10 bg-[#202725] p-6 sm:p-8">
      <div>
        <label htmlFor="profile-email" className="mb-2 block text-sm text-white/60">البريد الإلكتروني</label>
        <input id="profile-email" value={profile.email} readOnly className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/45 outline-none" />
        <p className="mt-2 text-xs text-white/35">لا يمكن تغيير البريد الإلكتروني من هذه الصفحة.</p>
      </div>
      <div>
        <label htmlFor="profile-name" className="mb-2 block text-sm font-medium">اسم العرض</label>
        <input id="profile-name" value={userName} onChange={event => setUserName(event.target.value)} minLength={2} maxLength={100} required autoComplete="name" className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 outline-none transition focus:border-orange-200/60" />
      </div>
      <div>
        <label htmlFor="profile-image" className="mb-2 block text-sm font-medium">رابط صورة الحساب</label>
        <input id="profile-image" type="url" value={userImage} onChange={event => setUserImage(event.target.value)} maxLength={2048} placeholder="https://example.com/avatar.jpg" className="w-full rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-left outline-none transition focus:border-orange-200/60" dir="ltr" />
        <p className="mt-2 text-xs text-white/35">اترك الحقل فارغًا لإزالة الصورة. يقبل الخادم روابط HTTP(S) أو مسارات الصور المحلية المسموح بها.</p>
      </div>
      {error ? <p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      {message ? <p role="status" className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-100">{message}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving || userName.trim().length < 2} className="rounded-xl bg-orange-200 px-6 py-3 text-sm font-bold text-[#21180f] transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}</button>
        <a href="/profile" className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/75 hover:bg-white/5">إلغاء</a>
      </div>
    </form>
  );
}
