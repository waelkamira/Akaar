'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { useEffect } from 'react';

export default function RegisterPage() {
  const session = useSession();
  const router = useRouter();
  const schema = z.object({
    name: z.string().trim().min(1, 'اسم المستخدم مطلوب'),
    email: z.string().trim().email('أدخل بريدًا إلكترونيًا صالحًا'),
    password: z.string().min(5, 'يجب أن تتكون كلمة المرور من 5 أحرف على الأقل'),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  //! اذا تم التسجيل بنجاح عن طريق أحد البروفايدرز سوف يتم توجيه المستخدم الى صفحة تسجيل الدخول
  //! التطبيق build حتى لاتسبب مشكلة عند  useEffect يجب وضع الجملة الشرطية هذه ضمن

  useEffect(() => {
    if (session?.data?.user?.email) {
      router.push('/login');
    }
  }, [router, session?.data?.user?.email]);

  async function onSubmit(values) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const result = await response.json();
        setError('email', {
          type: 'server',
          message:
            result?.error ||
            'تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.',
        });
        return;
      }

      localStorage.setItem('username', values.name.trim());
      localStorage.setItem('email', values.email.trim().toLowerCase());
      router.push('/login');
      toast.custom((t) => (
        <CustomToast t={t} message="🌿 تم التسجيل بنجاح 🌿" />
      ));
    } catch (error) {
      console.error('Registration request failed:', error);
      toast.error('تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      setError('email', {
        type: 'server',
        message: 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
      });
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen  text-lg md:text-xl text-end">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2  p-8  border border-primary-500"
      >
        <h1 className="w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl  text-center select-none">
          التسجيل 🧀
        </h1>
        <div className="flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            اسم المستخدم
          </h1>
          <input
            type="text"
            required
            name={'name'}
            placeholder="الإسم"
            {...register('name')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border border-gray-300 border-solid focus:border focus:outline-primary-500 outline-none rounded-lg px-2 w-full caret-primary-500  text-start"
          />
        </div>
        {errors?.name && (
          <h1 className="text-primary-500 text-md my-2 text-start">
            {errors?.name?.message}
          </h1>
        )}
        <div className="relative flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            البريد الإلكتروني
          </h1>
          <input
            type="email"
            required
            name={'email'}
            placeholder="الإيميل"
            {...register('email')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border border-gray-300 border-solid focus:border focus:outline-primary-500 outline-none rounded-lg px-2 w-full caret-primary-500  text-start"
          />
        </div>
        {errors?.email && (
          <h1 className="text-primary-500 text-md my-2 text-start">
            {errors?.email?.message}
          </h1>
        )}
        <div className="relative flex flex-col items-start justify-center w-full">
          <h1 className="w-full my-4 select-none text-start text-sm sm:text-lg">
            كلمة السر
          </h1>
          <input
            type="password"
            required
            minLength={5}
            name={'password'}
            placeholder="كلمة السر"
            {...register('password')}
            className=" placeholder-gray-400 transition-all duration-300 placeholder:text-sm placeholder:sm:text-lg grow py-2 border border-gray-300 border-solid focus:border focus:outline-primary-500 outline-none rounded-lg px-2 w-full caret-primary-500  text-start"
          />
        </div>
        {errors?.password && (
          <h1 className="text-primary-500 text-md my-2 text-start">
            {errors?.password?.message}
          </h1>
        )}
        <button
          type="button"
          onClick={() => signIn('google')}
          className="my-8 flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 shadow-gray-300 transition-shadow hover:shadow-sm"
        >
          <Image
            priority
            src="/google.png"
            alt=""
            width={32}
            height={36}
            className="object-contain"
          />
          <span className="grow text-center text-sm font-semibold text-gray-500 sm:text-lg">
            التسجيل عن طريق جوجل
          </span>
        </button>
        <div className="flex flex-col sm:flex-row justify-between gap-8 items-center mt-4 w-full">
          <button
            type="submit"
            className=" text-lg p-2  my-3  text-nowrap bg-five hover:bg-primary-500  hover:scale-[101%] w-full "
          >
            تسجيل
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="my-3 w-full text-nowrap bg-five p-2 text-lg hover:bg-primary-500 hover:scale-[101%]"
          >
            إغلاق
          </button>
        </div>
        <Link href={'/login'}>
          <h1 className="mt-4 text-start text-sm sm:text-lg">
            هل لديك حساب بالفعل ؟ قم بتسجيل الدخول
            <span className="text-primary-500 text-lg sm:text-xl hover:scale-105">
              🧀 هنا
            </span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
