'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

function callbackPath() {
  const requested = new URLSearchParams(window.location.search).get('callbackUrl') || '/';
  return requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const callbackUrl = callbackPath();
    try {
      const result = await signIn('credentials', { email, password, redirect: false, callbackUrl });
      if (!result?.ok || result.error) throw new Error('تعذر تسجيل الدخول. تحقق من البريد وكلمة المرور.');
      router.replace(callbackUrl);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر تسجيل الدخول حاليًا.');
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[calc(100vh-5rem)] bg-ak-canvas px-4 py-8 text-ak-cream sm:px-6 lg:grid lg:place-items-center lg:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-ak-line-strong bg-gradient-to-br from-ak-raised to-ak-surface shadow-ak-panel lg:min-h-[650px] lg:grid-cols-2">
        <aside className="relative hidden min-h-[650px] overflow-hidden lg:block">
          <Image src="/images/ph8.jpg" alt="" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-ak-ink/35 to-ak-ink/10" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="ak-eyebrow text-sm">AKaar · مساحتك القادمة</p>
            <h2 className="mt-4 max-w-md text-4xl font-black leading-tight">ابدأ من المكان الذي يشبهك.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-ak-cream/75">اكتشف عقارات مميزة، احفظ ما يعجبك، وتواصل مع الوكالات بثقة.</p>
          </div>
        </aside>

        <section className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-ak-honey"><span className="text-2xl">⌂</span> Akaar</Link>
            <p className="ak-eyebrow mt-9">مرحبًا بعودتك</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">سجّل الدخول</h1>
            <p className="mt-3 text-sm text-ak-muted">أدخل بيانات حسابك للمتابعة.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold">البريد الإلكتروني
                <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3.5 text-left outline-none transition duration-200 placeholder:text-ak-quiet focus:border-ak-amber focus:ring-4 focus:ring-ak-amber/10" placeholder="name@example.com" dir="ltr" />
              </label>
              <label className="block text-sm font-semibold">كلمة المرور
                <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3.5 outline-none transition duration-200 focus:border-ak-amber focus:ring-4 focus:ring-ak-amber/10" />
              </label>
              {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ak-amber px-5 py-3.5 font-bold text-ak-canvas transition hover:bg-ak-honey disabled:cursor-wait disabled:opacity-60">{submitting && <span className="size-4 animate-spin rounded-full border-2 border-ak-canvas/30 border-t-ak-canvas" />}{submitting ? 'جارٍ التحقق...' : 'دخول إلى حسابي'}</button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-ak-quiet"><span className="h-px flex-1 bg-ak-line" />أو تابع باستخدام<span className="h-px flex-1 bg-ak-line" /></div>
            <button type="button" onClick={() => void signIn('google', { callbackUrl: callbackPath() })} className="flex w-full items-center justify-center gap-3 rounded-xl border border-ak-line-strong bg-ak-ink/25 px-4 py-3 text-sm font-semibold transition hover:border-ak-amber/35 hover:bg-ak-brand-soft"><Image src="/google.png" alt="" width={22} height={22} />Google</button>
            <p className="mt-7 text-center text-sm text-ak-muted">ليس لديك حساب؟ <Link href="/register" className="font-bold text-ak-honey hover:text-ak-cream">أنشئ حسابًا جديدًا</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
