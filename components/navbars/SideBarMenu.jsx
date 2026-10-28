'use client';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Button from '../Buttons/Button';
import UserNameAndPhoto from '../ReusableComponents/userNameAndPhoto';
import categories from '../Categories/categories';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import LoadingPhoto from '../photos/LoadingPhoto';

export default function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();


  // if (session?.status === 'unauthenticated') {
  //   return;
  // }

  return (
    <>
      <div className="lg:hidden fixed right-3 top-3 z-[1001] flex w-fit flex-col items-start justify-start gap-3 p-2">
        {/* زر فتح القائمة */}
        <button
          type="button"
          aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-ak-line-strong bg-ak-surface text-2xl text-ak-honey shadow-ak-card transition hover:scale-105 hover:text-ak-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ak-amber"
        >
          <TfiMenuAlt aria-hidden="true" />
        </button>

        {/* قائمة جانبية مع تأثيرات */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="fixed right-0 top-0 z-50 flex h-screen w-72 flex-col items-center overflow-y-auto border-l border-ak-line-strong bg-ak-ink/95 p-6 text-ak-cream shadow-ak-panel backdrop-blur-2xl"
            >
              {/* زر الإغلاق */}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-ak-muted transition hover:text-ak-honey"
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

                {session?.status === 'authenticated' && session?.data?.user?.role === 'ADMIN' && (
                  <>
                    <Button path={'/admin/dashboard'} title={'لوحة الإدارة'} />
                    <Button path={'/users'} title={'المستخدمين'} />
                  </>
                )}
                {session?.status === 'authenticated' && (
                  <Button path={'/seller/dashboard'} title={'متجري ولوحة البائع'} />
                )}
                {/* User Profile Section */}

                <Link href={'/profile'}>
                  <motion.div
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ak-line bg-ak-surface/60 p-4 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative size-24 overflow-hidden rounded-full border-2 border-ak-line-strong/20">
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
                    <h1 className="text-ak-cream">
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
                  {session.status === 'authenticated' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="my-2 flex max-h-12 w-full items-center justify-between rounded-xl border border-ak-line-strong bg-ak-surface/60 p-2 text-nowrap text-ak-cream shadow-ak-card transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft sm:text-lg"
                    >
                      <FaSignOutAlt className="mx-2" />
                      <span className="w-full text-center lg:text-base">
                        تسجيل الخروج
                      </span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="my-2 flex max-h-12 w-full items-center justify-between rounded-xl border border-ak-line-strong bg-ak-surface/60 p-2 text-nowrap text-ak-cream shadow-ak-card transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft sm:text-lg"
                    >
                      <FaSignInAlt className="mx-2" />
                      <span className="w-full text-center lg:text-base">
                        تسجيل الدخول
                      </span>
                    </Link>
                  )}
                </div>
              </div>
              {/* اختيار الفئات */}
              <h1
                className="mt-8 w-full border-b border-ak-line pb-2 text-center text-lg text-ak-honey"
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
                      className="flex items-center justify-center gap-2 rounded-xl border border-ak-line bg-ak-surface/70 p-3 text-ak-cream transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft"
                    >
                      <span className="text-lg text-ak-honey sm:text-xl">
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
                  className="bg-red-500 hover:bg-red-600 text-ak-cream w-full min-w-[200px]" // هنا نحدد عرض زر الإغلاق
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
          className="fixed inset-0 top-0 z-40 h-screen bg-ak-ink/65 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
