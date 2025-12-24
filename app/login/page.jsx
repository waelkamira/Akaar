'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import { useEffect, useCallback, useContext, useState } from 'react';
import { GiExitDoor } from 'react-icons/gi';
import { inputsContext } from '../../components/authContext/Context';
import Loading from '../../components/ReusableComponents/Loading';

export default function LogInPage() {
  const session = useSession();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const { profileImage, favorite } = useContext(inputsContext);
  console.log('favorite', favorite);
  const userId = session?.data?.user?.id;
  // Schema for form validation
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
  });

  const { getValues, handleSubmit, setError } = useForm({
    resolver: zodResolver(schema),
  });

  // Check if user is logged in and redirect to home page
  useEffect(() => {
    if (session?.data?.user) {
      fetchAndStoreUserData(session?.data?.user?.email);
      fetchAndStoreUserFavoriteIds(session?.data?.user?.id);
      toast.success('تم تسجيل الدخول بنجاح أهلا وسهلا');
      // router.push('/');
      setLoggedIn(true);
    }
  }, [router, session?.data?.user]);

  // Function to fetch and store user data in localStorage
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
    [router, profileImage]
  );

  // Function to fetch and favorite user data in localStorage
  const fetchAndStoreUserFavoriteIds = async (userId) => {
    console.log('userId', userId);
    try {
      const response = await fetch(`/api/favorite/ids?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const favoriteIds = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
      }
    } catch (error) {
      console.error('Failed to fetch or store favorites data:', error);
    }
  };

  // Handle form submission for email/password login
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

    const signInResult = await signIn('credentials', {
      ...getValues(),
      redirect: false,
      callbackUrl: '/',
    });

    if (signInResult?.ok) {
      toast.success('تم تسجيل الدخول بنجاح أهلا وسهلا');
      fetchAndStoreUserData(getValues().email); // Call the function to fetch and store user data
    } else {
      setError(signInResult?.error);
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
    <div className="flex justify-center items-start w-full h-screen text-lg md:text-xl text-end bg-five p-2 mt-32 sm:mt-2">
      {loggedIn && <Loading message=" ✔ جاري تحويلك للصفحة الرئيسية " />}
      {!loggedIn && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 p-2 sm:p-8 rounded-lg border bg-white"
        >
          <h1 className="flex justify-center items-center w-full my-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl  text-center select-none">
            تسجيل الدخول <GiExitDoor className="text-primary-500" />
          </h1>
          <div
            className="flex justify-center w-full bg-white border rounded-lg px-4 py-2 items-center my-8 hover:shadow-sm shadow-gray-300 cursor-pointer"
            onClick={() => signIn('google')}
          >
            <h1 className="text-sm sm:text-lg grow text-center text-gray-500 select-none font-semibold">
              تسجيل الدخول عن طريق جوجل
            </h1>
            <div className="relative h-9 w-8 ">
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
      )}
    </div>
  );
}
