'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import CustomToast from '@/components/ReusableComponents/CustomToast';
import { useEffect, useCallback } from 'react';
import { GiExitDoor } from 'react-icons/gi';
import Loading from '@/components/ReusableComponents/Loading';
import Link from 'next/link';

export default function LogInPage() {
  const session = useSession();
  const router = useRouter();
  const user = session?.data?.user;
  const schema = z.object({
    email: z.string().trim().email('أدخل عنوان بريد إلكتروني صالحًا'),
    password: z.string().min(5, 'يجب أن تتكون كلمة المرور من 5 أحرف على الأقل'),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchAndStoreUserData = useCallback(
    async (email) => {
      try {
        const response = await fetch(`/api/user?email=${email}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const user = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem('CurrentUser', JSON.stringify(user));
        }
        router.push('/'); // Redirect only after successful data fetch
      } catch (error) {
        console.error('Failed to fetch or store user data:', error);
      }
    },
    [router],
  );

  const fetchAndStoreUserFavoriteIds = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/favorite/ids?userId=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const payload = await response.json();
      const favoriteIds = Array.isArray(payload?.productIds) ? payload.productIds : [];
      localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Failed to fetch or store favorites data:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAndStoreUserData(user.email);
      fetchAndStoreUserFavoriteIds(user.id);
    }
  }, [user, fetchAndStoreUserData, fetchAndStoreUserFavoriteIds]);

  async function onSubmit(values) {
    try {
      const signInResult = await signIn('credentials', {
        ...values,
        redirect: false,
        callbackUrl: '/',
      });

      if (signInResult?.ok) {
        toast.success('تم تسجيل الدخول بنجاح أهلا وسهلا');
      } else {
        throw new Error(signInResult?.error || 'Sign-in was unsuccessful.');
      }
    } catch (error) {
      console.error('Sign-in request failed:', error);
      setError('root.server', {
        type: 'server',
        message: 'تعذر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.',
      });
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="تعذر تسجيل الدخول، يرجى التحقق من البيانات والمحاولة مجددًا."
        />
      ));
    }
  }

  return (
    <main className="flex min-h-[60vh] justify-center px-4 py-12 text-lg md:text-xl">
      {user ? (
        <Loading message=" ✔ جاري تحويلك للصفحة الرئيسية " />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-auto w-full max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 text-right shadow-lg sm:p-8"
        >
          <h1 className="flex justify-center items-center w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl  text-center select-none">
            تسجيل الدخول <GiExitDoor className="text-primary-500" />
          </h1>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="mb-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
          />
          {errors.email && (
            <p role="alert" className="mb-3 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
          <label
            htmlFor="password"
            className="mb-2 mt-4 block text-sm font-semibold"
          >
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
          />
          {errors.password && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          {errors.root?.server && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {errors.root.server.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-primary-500 px-4 py-3 font-bold text-white transition hover:bg-primary-600"
          >
            تسجيل الدخول
          </button>
          <div
            className="my-5 flex w-full justify-center"
          >
            <button
              type="button"
              onClick={() => signIn('google')}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 sm:text-base"
            >
              تسجيل الدخول عن طريق جوجل
              <Image
                priority
                src="/google.png"
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
            </button>
          </div>
          <p className="text-center text-sm text-neutral-600">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="font-semibold text-primary-600">
              أنشئ حسابًا
            </Link>
          </p>
        </form>
      )}
    </main>
  );
}
