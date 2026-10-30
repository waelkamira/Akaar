'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'CUSTOMER' | 'SELLER'>('CUSTOMER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, accountType }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر إنشاء الحساب.');

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      });
      if (result?.ok && !result.error) {
        router.replace('/');
        router.refresh();
      } else {
        router.replace('/login?registered=1');
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إنشاء الحساب حاليًا.');
      setSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[calc(100vh-5rem)] bg-ak-canvas px-4 py-8 text-white sm:px-6 lg:grid lg:place-items-center lg:py-12">
      <div className="ak-glass mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] shadow-ak-panel lg:min-h-[700px] lg:grid-cols-2">
        <section className="flex items-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-ak-honey"><span className="text-2xl">⌂</span> Akaar</Link>
            <p className="ak-eyebrow mt-9">حسابك يبدأ هنا</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">انضم إلى Akaar</h1>
            <p className="mt-3 text-sm text-white">احفظ العقارات التي تحبها وتواصل مع الوكالات بسهولة.</p>
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold">الاسم
                <input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3.5 outline-none transition focus:border-ak-amber focus:ring-4 focus:ring-ak-amber/10" placeholder="اسمك الكامل" />
              </label>
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold">نوع الحساب</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ak-line bg-ak-ink/40 px-4 py-3 text-sm transition has-[:checked]:border-ak-amber has-[:checked]:bg-ak-brand-soft">
                    <input type="radio" name="accountType" value="CUSTOMER" checked={accountType === 'CUSTOMER'} onChange={() => setAccountType('CUSTOMER')} />
                    مستخدم
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ak-line bg-ak-ink/40 px-4 py-3 text-sm transition has-[:checked]:border-ak-amber has-[:checked]:bg-ak-brand-soft">
                    <input type="radio" name="accountType" value="SELLER" checked={accountType === 'SELLER'} onChange={() => setAccountType('SELLER')} />
                    بائع
                  </label>
                </div>
              </fieldset>
              <label className="block text-sm font-semibold">البريد الإلكتروني
                <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3.5 text-left outline-none transition focus:border-ak-amber focus:ring-4 focus:ring-ak-amber/10" placeholder="name@example.com" dir="ltr" />
              </label>
              <label className="block text-sm font-semibold">كلمة المرور
                <input type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ak-line bg-ak-ink/70 px-4 py-3.5 outline-none transition focus:border-ak-amber focus:ring-4 focus:ring-ak-amber/10" />
                <span className="mt-2 block text-xs text-ak-quiet">8 أحرف على الأقل.</span>
              </label>
              {error && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
              <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ak-amber px-5 py-3.5 font-bold text-ak-ink transition hover:bg-ak-honey disabled:cursor-wait disabled:opacity-60">{submitting && <span className="size-4 animate-spin rounded-full border-2 border-ak-canvas/30 border-t-ak-canvas" />}{submitting ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}</button>
            </form>
            <div className="my-6 flex items-center gap-3 text-xs text-ak-quiet"><span className="h-px flex-1 bg-ak-line" />أو أنشئ حسابًا باستخدام<span className="h-px flex-1 bg-ak-line" /></div>
            <button type="button" onClick={() => void signIn('google', { callbackUrl: '/' })} className="flex w-full items-center justify-center gap-3 rounded-xl border border-ak-line-strong bg-ak-ink/25 px-4 py-3 text-sm font-semibold transition hover:border-ak-amber/35 hover:bg-ak-brand-soft"><Image src="/google.png" alt="" width={22} height={22} />Google</button>
            <p className="mt-7 text-center text-sm text-white">لديك حساب؟ <Link href="/login" className="font-bold text-ak-honey hover:text-white">سجّل الدخول</Link></p>
          </div>
        </section>
        <aside className="relative hidden min-h-[700px] overflow-hidden lg:block">
          <Image src="/images/ph6.jpg" alt="" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-ak-ink/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="ak-eyebrow text-sm">A PLACE TO BELONG</p>
            <h2 className="mt-4 max-w-md text-4xl font-black leading-tight">مساحة جديدة، وبداية أجمل.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/75">أنشئ ملفك الشخصي وابدأ باستكشاف سوق العقارات بطريقة أسهل.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
