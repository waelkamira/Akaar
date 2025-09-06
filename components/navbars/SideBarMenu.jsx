'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Button from '../Buttons/Button';
import UserNameAndPhoto from '../ReusableComponents/userNameAndPhoto';
import categories from '../Categories/categories';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import LogInPage from '../../app/login/page';
import Image from 'next/image';
import LoadingPhoto from '../photos/LoadingPhoto';

export default function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [user, setUser] = useState('');

  // مجموعة ألوان أنيقة
  const primaryColor = '#ffff';
  const secondaryColor = '#374151'; // رمادي داكن
  const backgroundColor = 'rgba(255, 255, 255, 0.2)'; // أبيض شفاف

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        setUser(user);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  // if (session?.status === 'unauthenticated') {
  //   return;
  // }

  return (
    <>
      <div className="xl:hidden relative flex flex-col justify-start items-start gap-3 w-fit ">
        {/* زر فتح القائمة */}
        <TfiMenuAlt
          className=" w-fit p-1 sm:m-2 text-4xl lg:text-5xl text-gray-400 sm:text-white cursor-pointer z-40 transition-transform duration-300 hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* قائمة جانبية مع تأثيرات */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-primary-300 to-primary-500 backdrop-blur-md shadow-xl z-[1006] p-6 overflow-y-auto flex flex-col items-center"
              style={{ color: secondaryColor }}
            >
              {/* زر الإغلاق */}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl text-gray-600 hover:text-red-500 transition duration-200"
                >
                  <IoCloseOutline />
                </button>
              </div>
              <div className="flex flex-col items-center gap-4 w-full ">
                {/* معلومات المستخدم */}
                {session?.status === 'authenticated' && (
                  <div onClick={() => setIsOpen(false)}>
                    <UserNameAndPhoto size={'size-24'} />
                  </div>
                )}

                {session?.status === 'authenticated' && user?.isAdmin === 1 && (
                  <Button path={'/users'} title={'المستخدمين'} />
                )}
                {/* User Profile Section */}

                <Link href={'/profile'}>
                  <motion.div
                    className="flex flex-col items-center justify-center gap-2 rounded-full transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative size-24 overflow-hidden rounded-full border-2 border-white/20">
                      {!session?.data?.user?.image ? (
                        <LoadingPhoto />
                      ) : (
                        <Image
                          priority
                          src={session?.data?.user?.image || '/placeholder.jpg'}
                          fill
                          alt={session?.data?.user?.name}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <h1 className="text-white">
                      {session?.data?.user?.name || 'مستخدم'}
                    </h1>
                  </motion.div>
                </Link>
                {/* عرض الأزرار الرئيسية */}

                {/* {session.status === 'authenticatec'} */}
                <div className="mt-6 w-full flex flex-col items-center gap-2">
                  {mainButtons?.map((button, index) => (
                    <motion.div
                      key={button?.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="w-full"
                    >
                      <Button
                        title={button?.title}
                        path={button?.path}
                        emoji={button?.icon}
                        onClick={() => setIsOpen(false)}
                        style={' '}
                        className="w-full h-14" // هنا نحدد عرض الأزرار
                      />
                    </motion.div>
                  ))}
                  <Button
                    title={
                      session.status === 'authenticated'
                        ? 'تسجيل الخروج'
                        : 'تسجيل الدخول'
                    }
                    path={session.status === 'authenticated' ? '/' : '/login'}
                    onClick={() => setIsOpen(false)}
                    style={' '}
                    emoji={
                      session.status === 'authenticated' ? (
                        <FaSignOutAlt />
                      ) : (
                        <FaSignInAlt />
                      )
                    }
                  />
                </div>
              </div>
              {/* اختيار الفئات */}
              <h1
                className="mt-8 text-lg border-b pb-2 w-full text-center"
                style={{ color: primaryColor }}
              >
                اختر فئة:
              </h1>
              <div className="mt-4 w-full flex flex-col gap-3">
                {categories?.map((category, index) => (
                  <motion.div
                    key={category?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Link
                      href={category?.path}
                      className="flex items-center justify-center gap-2 p-2 rounded-full border bg-gray-100 hover:bg-blue-100 hover:text-gray-700 transition-all duration-300"
                    >
                      <span className="text-lg sm:text-xl text-gray-500">
                        {category?.icon}
                      </span>
                      <span className="text-sm font-medium">
                        {category?.name}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* زر إغلاق */}
              <div className="mt-6 w-full">
                <Button
                  title={'إغلاق'}
                  onClick={() => setIsOpen(false)}
                  emoji={<IoCloseOutline />}
                  style={' '}
                  className="bg-red-500 hover:bg-red-600 text-white w-full min-w-[200px]" // هنا نحدد عرض زر الإغلاق
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isOpen && (
        <motion.div
          key="filters-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] h-screen top-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
