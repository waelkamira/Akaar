


'use client';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Button from '../Buttons/Button';
import UserNameAndPhoto from '../ReusableComponents/userNameAndPhoto';
import categories from '../Categories/categories';
import mainButtons from '../lists/mainButtons';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaHome, FaSearch, FaShoppingCart, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';
import LoadingPhoto from '../photos/LoadingPhoto';
import { useCommerce } from '@/features/cart/commerce-context';
import CategoryThumbnail from '@/components/Categories/CategoryThumbnail';
import { isControlPanelAdmin } from '@/lib/auth/control-panel-access.mjs';

export default function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const { cartCount } = useCommerce();
  const dockLinks = [
    { title: 'الرئيسية', path: '/', icon: FaHome },
    { title: 'البحث', path: '/search', icon: FaSearch },
    { title: 'المفضلة', path: '/favorite', icon: FaHeart },
    { title: 'السلة', path: '/cart', icon: FaShoppingCart },
  ];

  // if (session?.status === 'unauthenticated') {
  //   return;
  // }

  return (
    <>
      <nav
        aria-label="التنقل السريع"
        className="ak-mobile-dock fixed inset-x-0 bottom-0 z-[1001] xl:hidden"
      >
          <div className="mx-auto flex max-w-xl items-stretch justify-around gap-1">
            {dockLinks.map(({ title, path, icon: Icon }) => {
              const isActive = path === '/'
                ? pathname === '/'
                : pathname === path || pathname.startsWith(`${path}/`);
              const isCart = path === '/cart';
              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={isCart && cartCount > 0 ? `${title}، ${cartCount} منتج` : title}
                  className="ak-dock-link"
                >
                  <span className="relative text-lg" aria-hidden="true">
                    <Icon />
                    {isCart && cartCount > 0 && (
                      <span className="absolute -left-2 -top-1 flex min-w-4 items-center justify-center rounded-full bg-ak-amber px-1 text-[9px] font-black text-ak-ink">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span>{title}</span>
                </Link>
              );
            })}
            <button
              type="button"
              aria-label={isOpen ? 'إغلاق القائمة' : 'المزيد'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className={`ak-dock-link ${isOpen ? 'text-ak-honey' : ''}`}
            >
              {isOpen ? <IoCloseOutline className="text-xl" aria-hidden="true" /> : <TfiMenuAlt className="text-lg" aria-hidden="true" />}
              <span>المزيد</span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0.7 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.7 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="ak-glass-strong fixed inset-x-0 bottom-0 bg-gradient-to-b from-[#fdba74] to-[#FF5733] backdrop-blur-md shadow-xl z-[1002] mx-auto flex max-h-[88dvh] w-full max-w-2xl flex-col items-center overflow-y-auto rounded-t-[2rem] border-x border-t border-ak-line-strong p-5 pb-[calc(6rem+env(safe-area-inset-bottom))] text-white sm:p-7 xl:hidden"

            >
              {/* زر الإغلاق */}
              <div className="w-full flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-white transition hover:text-ak-honey"
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

                {session?.status === 'authenticated' && isControlPanelAdmin(session.data?.user) && (
                  <Button path={'/admin/control-panel'} title={'Control Panel'} />
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
                  {session.status === 'authenticated' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="my-2 flex max-h-12 w-full items-center justify-between rounded-xl border border-ak-line-strong bg-ak-surface/60 p-2 text-nowrap text-white shadow-ak-card transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft sm:text-lg"
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
                      className="my-2 flex max-h-12 w-full items-center justify-between rounded-xl border border-ak-line-strong bg-ak-surface/60 p-2 text-nowrap text-white shadow-ak-card transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft sm:text-lg"
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
                      className="flex items-center justify-center gap-2 rounded-xl border border-ak-line bg-ak-surface/70 p-3 text-white transition-all duration-300 hover:border-ak-amber/40 hover:bg-ak-brand-soft"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center">
                        <CategoryThumbnail category={category} className="size-8" />
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
      {isOpen && (
        <motion.div
          key="filters-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-ak-ink/65 backdrop-blur-sm xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
