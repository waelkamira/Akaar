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

export default function Profile() {
  const session = useSession();
  const { dispatch } = useContext(inputsContext);
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const getUser = JSON.parse(localStorage.getItem('CurrentUser'));
        setUser(getUser);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  // Save changes (name)
  async function saveProfileChanges() {
    if (user) {
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

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 sm:p-12">
      <LoginButton />

      {session?.status === 'authenticated' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-full px-6 py-8 bg-white shadow-2xl rounded-2xl border border-gray-200"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Profile Image Section */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200">
              {!session?.data?.user?.image ? (
                <LoadingPhoto />
              ) : (
                <Image
                  priority
                  src={session?.data?.user?.image}
                  layout="fill"
                  objectFit="cover"
                  alt={session?.data?.user?.name}
                  className="rounded-full"
                />
              )}
            </div>

            {/* User Name Section */}
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="أدخل اسمك الجديد"
                className="px-4 py-3 text-lg text-gray-700 border rounded-lg w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500-500 focus:border-transparent transition-all"
              />
              <div className="w-full border-t border-gray-300"></div>
            </div>
            {/* Save Button */}
            <div className="w-full mt-6">
              <Button
                title="حفظ التغييرات"
                onClick={saveProfileChanges}
                style="bg-primary-500-500 text-white hover:bg-primary-500-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
              />
            </div>
            {/* User Email and Name Section */}
            <div className="flex flex-col items-center gap-2 w-full">
              <h2 className="text-lg text-gray-600">
                الإسم: <span>{user?.username}</span>
              </h2>
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <h2 className="text-lg text-gray-600">
                الإيميل: <span>{session?.data?.user?.email}</span>
              </h2>

              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Links to Other Pages */}
            <div className="flex flex-col items-center gap-4 w-full mt-4">
              <Link href="/myPosts">
                <h1 className="text-lg text-gray-700 hover:text-primary-500-500 transition-all">
                  إعلاناتي
                </h1>
              </Link>
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {/* Logout Button */}
            <div className="w-full mt-6">
              <Button
                title="تسجيل الخروج"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.clear();
                  }
                  signOut();
                }}
                style="text-white hover:bg-red-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
