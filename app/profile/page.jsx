'use client';
import CurrentUser from '../../components/ReusableComponents/CurrentUser';
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
  const user = CurrentUser();
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        const newName = storedUser ? JSON.parse(storedUser) : null;
        setNewUserName(newName?.name || '');
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  // Handle image file change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      dispatch({ type: 'PROFILE_IMAGE', payload: file });
    }
  };

  // Save changes (name and image)
  async function saveProfileChanges() {
    if (profile_image?.image || newUserName) {
      const formData = {
        id: user?.id,
        userImage: imagePreview || user?.userImage,
        username: newUserName || user?.username,
      };

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('تم تحديث الملف الشخصي بنجاح');
        dispatch({ type: 'PROFILE_IMAGE', payload: profile_image?.image });
        if (typeof window !== 'undefined') {
          const newName = JSON.parse(localStorage.getItem('CurrentUser'));
          setNewUserName(newName?.name || '');
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث خطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 sm:p-12">
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
            <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 group">
              {!imagePreview ? (
                !session?.data?.user?.image ? (
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
                )
              ) : (
                <Image
                  priority
                  src={imagePreview}
                  layout="fill"
                  objectFit="cover"
                  alt="New Profile"
                  className="rounded-full"
                />
              )}

              {/* Change Image Button */}
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <label
                  htmlFor="file-input"
                  className="cursor-pointer text-white font-semibold text-lg"
                >
                  تغيير الصورة
                </label>
              </div>
            </div>

            {/* Image Upload Input */}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* User Name Section */}

            <div className="flex flex-col items-center gap-2 w-full">
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="أدخل اسمك الجديد"
                className="px-4 py-3 text-lg text-gray-700 border rounded-lg w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <div className="w-full border-t border-gray-300"></div>
            </div>
            {/* Save Button */}
            <div className="w-full mt-6">
              <Button
                title="حفظ التغييرات"
                onClick={saveProfileChanges}
                style="bg-primary-500 text-white hover:bg-primary-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
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
                <h1 className="text-lg text-gray-700 hover:text-primary-500 transition-all">
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
                style="bg-red-500 text-white hover:bg-red-600 transition-all py-3 rounded-lg w-full text-lg font-semibold"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
