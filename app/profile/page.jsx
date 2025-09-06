'use client';
import Button from '../../components/Buttons/Button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/authContext/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import LoadingPhoto from '../../components/photos/LoadingPhoto';
import LoginButton from '../../components/Buttons/LoginButton';
import { motion } from 'framer-motion';
import { FaSave, FaSignOutAlt } from 'react-icons/fa';

export default function Profile() {
  const session = useSession();
  const { dispatch } = useContext(inputsContext);
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const getUser = JSON.parse(localStorage.getItem('CurrentUser'));
        console.log(getUser);
        setUser(getUser);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  // Save changes (name)
  async function saveProfileChanges() {
    if (user) {
      console.log(user);
      const formData = {
        id: user?.id,
        username: userName || user?.username,
        userImage: session?.data?.user?.image,
      };

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('تم تحديث الملف الشخصي بنجاح');
        const response = await fetch(
          `/api/user?email=${session?.data?.user?.email}`
        );
        const json = await response.json();

        if (typeof window !== 'undefined') {
          localStorage.setItem('CurrentUser', JSON.stringify(json));
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث خطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }

  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-full px-6 py-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Profile Image Section */}
          <div className="relative size-40 rounded-full overflow-hidden shadow-lg bg-gray-200">
            {!session?.data?.user?.image ? (
              <LoadingPhoto />
            ) : (
              <Image
                priority
                src={session?.data?.user?.image || '/palceholder.jpg'}
                layout="fill"
                objectFit="cover"
                alt={session?.data?.user?.name}
                className="rounded-full"
              />
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-2 w-full">
            {/* Save Button */}
            <div className="w-full sm:w-[20%]">
              <Button
                title="حفظ"
                onClick={saveProfileChanges}
                style=" btn bg-primary-500 text-white hover:bg-primary-600 transition-all py-2 rounded-lg w-1/2 text-lg font-semibold"
                emoji={<FaSave />}
              />
            </div>
            {/* User Name Section */}
            <div className="flex-grow flex flex-col items-center gap-2 w-full">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                placeholder="أدخل اسمك الجديد"
                className="px-4 sm:py-1 text-lg text-gray-700 border rounded-sm w-full bg-gray-50 outline-none focus:border-transparent transition-all focus:outline-primary-400 placeholder:text-sm placeholder:sm:text-lg"
              />
            </div>
          </div>
          <div className="w-full border-t border-gray-300"></div>

          {/* User Email and Name Section */}
          <div className="flex flex-col items-start gap-2 w-full">
            <h2 className="text-sm sm:text-lg text-gray-600">
              الإسم: <span>{user?.username}</span>
            </h2>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <h2 className="text-sm sm:text-lg text-gray-600">
              الإيميل: <span>{session?.data?.user?.email}</span>
            </h2>

            <div className="w-full border-t border-gray-300"></div>
          </div>

          {/* Links to Other Pages */}
          <div className="flex flex-col items-start gap-4 w-full mt-4">
            <Link href="/myPosts">
              <h1 className="text-sm sm:text-lg text-gray-700 hover:text-primary-500 transition-all">
                إعلاناتي
              </h1>
            </Link>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          {/* Logout Button */}
          <div className="w-full lg:w-1/2 mt-6">
            <Button
              title="تسجيل الخروج"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                }
                signOut();
              }}
              emoji={<FaSignOutAlt />}
              style=" btn text-white hover:bg-red-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
