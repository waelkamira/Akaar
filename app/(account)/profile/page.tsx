'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type UserProfile = {
  id: string;
  email: string;
  userName: string | null;
  userImage: string | null;
  role: string;
  hasPassword: boolean;
};

type SavedProperty = {
  id: string;
  title: string;
  price: string;
  currency: string;
  location: string;
  city: string | null;
  images: string[];
  status: string;
  type: string;
  store: { name: string; slug: string };
};

async function responseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'تعذر إكمال العملية.');
  return payload;
}

export default function ProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [removingProperty, setRemovingProperty] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [profileResponse, favoritesResponse] = await Promise.all([
        fetch('/api/user', { cache: 'no-store' }),
        fetch('/api/properties/wishlist', { cache: 'no-store' }),
      ]);
      if (profileResponse.status === 401 || favoritesResponse.status === 401) {
        router.replace('/login?callbackUrl=%2Fprofile');
        return;
      }
      const [user, favorites] = await Promise.all([
        responseJson<UserProfile>(profileResponse),
        responseJson<{ properties: SavedProperty[] }>(favoritesResponse),
      ]);
      setError('');
      setProfile(user);
      setName(user.userName || '');
      setImage(user.userImage || '');
      setProperties(favorites.properties);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الملف الشخصي.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // useEffect(() => {
  //   document.title = 'ملفي الشخصي | Akaar';
  //   if (status === 'unauthenticated') {
  //     router.replace('/login?callbackUrl=%2Fprofile');
  //     return undefined;
  //   }

  //   if (status !== 'authenticated') return undefined;

  //   const timer = window.setTimeout(() => void load(), 0);
  //   return () => window.clearTimeout(timer);
  // }, [load, router, status]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setError('');
    setMessage('');
    try {
      const user = await responseJson<UserProfile & { user?: UserProfile }>(await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name, userImage: image.trim() || null }),
      }));
      const updatedProfile = user.user || user;
      setProfile((current) => current ? { ...current, ...updatedProfile } : updatedProfile);
      setMessage('تم تحديث معلوماتك بنجاح.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ المعلومات.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    setError('');
    setMessage('');
    try {
      await responseJson(await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      }));
      setCurrentPassword('');
      setNewPassword('');
      setMessage('تم تحديث كلمة المرور.');
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : 'تعذر تحديث كلمة المرور.');
    } finally {
      setSavingPassword(false);
    }
  }

  async function removeFavorite(property: SavedProperty) {
    setRemovingProperty(property.id);
    setError('');
    try {
      await responseJson(await fetch(`/api/properties/${encodeURIComponent(property.id)}/wishlist`, { method: 'POST' }));
      setProperties((current) => current.filter((item) => item.id !== property.id));
    } catch (favoriteError) {
      setError(favoriteError instanceof Error ? favoriteError.message : 'تعذر إزالة العقار من المحفوظات.');
    } finally {
      setRemovingProperty('');
    }
  }

  if (loading) {
    return <main className="min-h-[70vh] bg-ak-canvas px-4 py-16 text-center text-white" aria-busy="true"><span className="inline-block size-8 animate-spin rounded-full border-2 border-ak-amber/30 border-t-ak-honey" /><p className="mt-4">جارٍ تحميل ملفك الشخصي...</p></main>;
  }
  if (!profile) {
    return <main className="min-h-[70vh] bg-ak-canvas px-4 py-16 text-center text-rose-200"><p role="alert">{error || 'تعذر تحميل الملف الشخصي.'}</p><button onClick={() => void load()} className="mt-4 rounded-xl border border-ak-line px-4 py-2 text-white transition hover:border-ak-amber/40 hover:bg-ak-brand-soft">إعادة المحاولة</button></main>;
  }

  return (
    <main dir="rtl" className="min-h-screen w-full bg-ak-canvas px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center gap-4 rounded-3xl border border-ak-line-strong bg-gradient-to-br from-ak-raised to-ak-surface p-5 shadow-ak-panel sm:p-7">
          <div className="relative size-16 overflow-hidden rounded-2xl border border-ak-line bg-ak-ink">
            <Image src={profile.userImage || '/placeholder.jpg'} alt="" fill sizes="64px" unoptimized className="object-cover" />
          </div>
          <div className="flex-1"><p className="ak-eyebrow">ACCOUNT CENTER</p><h1 className="mt-1 text-2xl font-black">{profile.userName || 'مرحبًا بك'}</h1><p className="mt-1 text-sm text-white">{profile.email}</p></div>
          <Link href="/seller/dashboard" className="rounded-xl border border-ak-line px-4 py-3 text-sm text-white transition hover:border-ak-amber/40 hover:bg-ak-brand-soft">لوحة متجري / وكالتي</Link>
        </header>

        {(error || message) && <p role={error ? 'alert' : 'status'} className={`mt-5 rounded-xl border p-4 text-sm ${error ? 'border-rose-400/20 bg-rose-400/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`}>{error || message}</p>}

        <div className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-6">
            <section className="ak-panel p-5 sm:p-6">
              <h2 className="text-lg font-bold">المعلومات الشخصية</h2>
              <form onSubmit={saveProfile} className="mt-5 space-y-4">
                <label className="block text-sm">الاسم الظاهر<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={100} required className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none focus:border-ak-amber" /></label>
                <label className="block text-sm">البريد الإلكتروني<input value={profile.email} readOnly className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/50 px-4 py-3 text-white" /></label>
                <label className="block text-sm">رابط صورة الملف (اختياري)<input type="url" value={image} onChange={(event) => setImage(event.target.value)} maxLength={2048} placeholder="https://" dir="ltr" className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3 outline-none focus:border-ak-amber" /></label>
                <button disabled={savingProfile} className="ak-button-primary">{savingProfile ? 'جارٍ الحفظ...' : 'حفظ المعلومات'}</button>
              </form>
            </section>

            <section className="ak-panel p-5 sm:p-6">
              <h2 className="text-lg font-bold">الأمان وكلمة المرور</h2>
              {profile.hasPassword ? (
                <form onSubmit={updatePassword} className="mt-5 space-y-4">
                  <label className="block text-sm">كلمة المرور الحالية<input type="password" autoComplete="current-password" minLength={8} required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-3 outline-none focus:border-ak-amber" /></label>
                  <label className="block text-sm">كلمة المرور الجديدة<input type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-3 outline-none focus:border-ak-amber" /></label>
                  <p className="text-xs leading-5 text-ak-quiet">استخدم 8 أحرف على الأقل. لا تشارك كلمة المرور مع أي شخص.</p>
                  <button disabled={savingPassword} className="rounded-xl border border-ak-amber/40 px-5 py-3 text-sm text-ak-honey disabled:opacity-50">{savingPassword ? 'جارٍ تحديث كلمة المرور...' : 'تحديث كلمة المرور'}</button>
                </form>
              ) : <p className="mt-3 text-sm leading-7 text-stone-400">هذا الحساب يستخدم تسجيل الدخول عبر مزود خارجي ولا يحتوي على كلمة مرور محلية.</p>}
            </section>
          </div>

          <section className="rounded-3xl border border-ak-line bg-ak-surface p-5 sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-xs tracking-widest text-ak-amber">SAVED HOMES</p><h2 className="mt-1 text-xl font-bold">العقارات المفضلة</h2></div><span className="text-xs text-stone-500">{properties.length} عقار</span></div>
            {!properties.length ? <div className="rounded-2xl border border-dashed border-ak-line px-5 py-14 text-center"><p className="text-stone-400">لم تحفظ أي عقار بعد.</p><Link href="/search" className="mt-4 inline-flex rounded-xl bg-ak-amber px-4 py-3 text-sm font-bold text-ak-ink">استكشف العقارات</Link></div> : (
              <div className="grid gap-4 sm:grid-cols-2">
                {properties.map((property) => (
                  <article key={property.id} className="overflow-hidden rounded-2xl border border-ak-line bg-ak-canvas">
                    <Link href={`/properties/${encodeURIComponent(property.id)}`} className="block">
                      <div className="relative aspect-[4/3] bg-ak-raised">{property.images[0] && <Image src={property.images[0]} alt={property.title} fill sizes="(max-width: 640px) 100vw, 40vw" unoptimized className="object-cover" />}</div>
                      <div className="p-4"><h3 className="line-clamp-1 font-bold">{property.title}</h3><p className="mt-1 text-xs text-stone-400">{property.city ? `${property.city} · ` : ''}{property.location}</p><p className="mt-3 font-bold text-ak-honey">{new Intl.NumberFormat('ar').format(Number(property.price))} {property.currency}</p></div>
                    </Link>
                    <div className="flex items-center justify-between border-t border-ak-line px-4 py-3"><Link href={`/properties/${encodeURIComponent(property.id)}/book`} className="text-xs text-ak-honey hover:text-white">طلب حجز تجريبي</Link><button type="button" disabled={removingProperty === property.id} onClick={() => void removeFavorite(property)} className="text-xs text-rose-200 disabled:opacity-50">{removingProperty === property.id ? 'جارٍ الإزالة...' : 'إزالة من المفضلة'}</button></div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
