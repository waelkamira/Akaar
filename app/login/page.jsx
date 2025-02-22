'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import CustomToast from '../../components/CustomToast';
import { useEffect } from 'react';
import { GiExitDoor } from 'react-icons/gi';

export default function LogInPage() {
  const session = useSession();
  const router = useRouter();

  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const {
    register,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (session?.data?.user?.email) {
      router.push('/');
    }
  }, [router, session?.data?.user?.email]);

  async function onSubmit() {
    if (getValues()?.email === '') {
      setError('email', {
        type: 'custom',
        message: 'عنوان البريد الإلكتروني مطلوب',
      });
      return;
    } else if (getValues()?.password?.length < 5) {
      setError('password', {
        type: 'custom',
        message:
          'طول كلمة السر يجب أن يكون 5 أحرف (أو 5 أرقام وأحرف) على الأقل',
      });
      return;
    }

    const response = await signIn('credentials', {
      ...getValues(),
      redirect: false,
      // callbackUrl: '/',
    });
    console.log('تم تسجيل الدخول بنجاح أهلا وسهلا');
    if (response.ok) {
      toast.success('تم تسجيل الدخول بنجاح أهلا وسهلا');
      setTimeout(() => {
        const values = getValues();
        localStorage.setItem('email', values?.email);
        router.push('/');
      }, 2000);
    } else {
      setError(response?.error);
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={
            'عنوان البريد الالكتروني هذا غير موجود يجب عليك التسجيل أولا 😐'
          }
        />
      ));
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen text-lg md:text-xl text-end bg-five p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full lg:w-1/2 p-2 sm:p-8 rounded-[5px] border bg-white"
      >
        <h1 className="flex justify-center items-center w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl  text-center select-none">
          تسجيل الدخول <GiExitDoor className="text-one" />
        </h1>
        <div
          className="flex justify-center w-full bg-white border rounded-[5px] px-4 py-2 items-center my-8 hover:shadow-sm shadow-gray-300 cursor-pointer"
          onClick={() => signIn('google')}
        >
          <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
            تسجيل الدخول عن طريق جوجل
          </h1>
          <div className="relative h-8 w-8 ">
            <Image
              priority
              src={'/google.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
