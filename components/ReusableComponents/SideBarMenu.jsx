'use client';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import CurrentUser from './CurrentUser';
import Button from '../Buttons/Button';
import UserNameAndPhoto from './userNameAndPhoto';
import categories from '../Categories/categories';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';

export default function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const user = CurrentUser();

  // مجموعة ألوان أنيقة
  const primaryColor = '#7E7F81';
  const secondaryColor = '#374151'; // رمادي داكن
  const backgroundColor = 'rgba(255, 255, 255, 0.2)'; // أبيض شفاف

  return (
    <div className="relative flex flex-col justify-start items-start gap-3 w-fit">
      {/* زر فتح القائمة */}
      <TfiMenuAlt
        className="sm:hidden w-fit pr-1 text-4xl lg:text-5xl text-white cursor-pointer z-[1005] transition-transform duration-300 hover:scale-110"
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
            className="fixed top-0 right-0 h-screen w-64 bg-white/90 backdrop-blur-md shadow-xl z-[1006] p-6 overflow-y-auto flex flex-col items-center"
            style={{ backgroundColor: backgroundColor, color: secondaryColor }}
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
            <div className="flex flex-col items-center gap-4 mt-6 w-full ">
              {/* معلومات المستخدم */}
              {session?.status === 'authenticated' && (
                <div onClick={() => setIsOpen(false)}>
                  <UserNameAndPhoto />
                </div>
              )}
              {session?.status === 'unauthenticated' && (
                <Button title={'تسجيل الدخول'} path={'/login'} />
              )}

              {session?.status === 'authenticated' && user?.isAdmin === 1 && (
                <Button path={'/users'} title={'المستخدمين'} />
              )}

              {/* عرض الأزرار الرئيسية */}
              {session?.status === 'authenticated' && (
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
                        emoji={button?.emoji}
                        onClick={() => setIsOpen(false)}
                        style={' '}
                        className="w-full min-w-[200px] h-14" // هنا نحدد عرض الأزرار
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* اختيار الفئات */}
            <h1
              className="mt-8 text-lg font-semibold border-b pb-2 w-full text-center"
              style={{ color: primaryColor }}
            >
              اختر فئة:
            </h1>
            <div className="mt-4 w-full flex flex-col gap-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setIsOpen(false)}
                >
                  <Link
                    href={category.path}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-gray-100 hover:bg-blue-100 hover:text-gray-700 transition-all duration-300"
                  >
                    <span className="text-2xl text-one">{category?.icon}</span>
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
  );
}
