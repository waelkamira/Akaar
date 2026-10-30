'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaChevronDown, FaSignInAlt, FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa';
import mainButtons from '../lists/mainButtons';
import { useCommerce } from '@/features/cart/commerce-context';
import Search from '@/components/Search/Search';
import WebsiteLogo from '@/components/Brand/WebsiteLogo';

export default function FirstNavBar() {
  const pathname = usePathname();
  const { cartCount } = useCommerce();
  const { data: session, status } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const user = session?.user;
  const userName = user?.userName || user?.name || user?.email?.split('@')[0] || 'مستخدم';
  const userImage = user?.userImage || user?.image;

  useEffect(() => {
    if (!profileOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="ak-glass sticky top-0 z-[1000] block w-full rounded-b-[1.35rem] border-b border-ak-line backdrop-blur-2xl"
    >
      <div className="mx-auto hidden h-[72px] w-full max-w-[1600px] items-center justify-between gap-6 px-5 xl:flex xl:px-8">
        <div ref={profileRef} className="relative shrink-0">
          {status === 'authenticated' ? (
            <>
              <button
                type="button"
                aria-label={`قائمة المستخدم ${userName}`}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className={`group flex h-12 items-center gap-2 rounded-2xl border py-1 pl-3 pr-1.5 text-right transition ${
                  profileOpen
                    ? 'border-ak-amber/40 bg-ak-surface shadow-ak-glow'
                    : 'border-ak-line bg-ak-surface/60 hover:border-ak-amber/30 hover:bg-ak-surface'
                }`}
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ak-amber/30 bg-ak-brand-soft text-sm font-bold text-ak-honey">
                  {userImage ? (
                    // NextAuth image URLs may come from any configured identity provider.
                    <img src={userImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <FaUser aria-hidden="true" />
                  )}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ak-surface bg-emerald-400" />
                </span>
                <span className="max-w-32 truncate text-xs font-semibold text-white">{userName}</span>
                <FaChevronDown className={`text-[10px] text-ak-honey transition-transform ${profileOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    role="menu"
                    aria-label="قائمة المستخدم"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="ak-glass absolute right-0 top-[calc(100%+12px)] z-[1100] w-72 overflow-hidden rounded-2xl border border-ak-line-strong"
                  >
                    <div className="bg-gradient-to-l from-ak-amber/15 via-ak-surface to-ak-surface p-4">
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
                      >
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ak-amber/30 bg-ak-ink text-lg text-ak-honey">
                          {userImage ? (
                            <img src={userImage} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <FaUserCircle aria-hidden="true" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-white">{userName}</span>
                          {user?.email && <span className="mt-1 block truncate text-xs text-ak-muted">{user.email}</span>}
                          <span className="mt-1 block text-[11px] font-medium text-ak-honey">عرض الملف الشخصي</span>
                        </span>
                      </Link>
                    </div>

                    <div className="space-y-1 border-t border-ak-line p-2">
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin/dashboard"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-ak-brand-soft hover:text-ak-honey"
                        >
                          <FaUserCircle aria-hidden="true" /> لوحة الإدارة
                        </Link>
                      )}
                      {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (
                        <Link
                          href="/seller/dashboard"
                          role="menuitem"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-ak-brand-soft hover:text-ak-honey"
                        >
                          <FaUser aria-hidden="true" /> لوحة البائع
                        </Link>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10"
                      >
                        <FaSignOutAlt aria-hidden="true" /> تسجيل الخروج
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : status === 'loading' ? (
            <span aria-label="جاري تحميل حساب المستخدم" className="flex h-11 w-11 items-center justify-center rounded-xl border border-ak-line bg-ak-surface text-lg text-ak-honey">
              <FaUserCircle aria-hidden="true" />
            </span>
          ) : (
            <Link
              href="/login"
              aria-label="تسجيل الدخول"
              className="flex h-11 items-center gap-2 rounded-xl border border-ak-line px-3 text-xs font-semibold text-white transition hover:border-ak-amber/40 hover:bg-ak-brand-soft hover:text-ak-honey"
            >
              <FaSignInAlt aria-hidden="true" />
              تسجيل الدخول
            </Link>
          )}
        </div>

        <nav aria-label="التنقل الرئيسي" className="min-w-0 flex-1">
          <ul className="flex items-center justify-start gap-1 xl:gap-2">
            {mainButtons.map((button) => {
              const isActive = button.path === '/'
                ? pathname === '/'
                : pathname === button.path || pathname.startsWith(`${button.path}/`);
              const isCart = button.path === '/cart';

              return (
                <li key={button.path} className="shrink-0">
                  <Link
                    href={button.path}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={isCart && cartCount > 0 ? `${button.title}، ${cartCount} منتج` : button.title}
                    className={`relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors xl:px-3.5 ${
                      isActive
                        ? 'border-ak-amber/30 bg-ak-brand-soft text-ak-honey shadow-ak-glow'
                        : 'border-transparent text-white hover:border-ak-line hover:bg-ak-surface/70 hover:text-white'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">{button.icon}</span>
                    <span className="whitespace-nowrap">{button.title}</span>
                    {isCart && cartCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-ak-brand py-0.5 text-[10px] font-black text-ak-ink">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <WebsiteLogo priority />
      </div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 sm:p-3 p-0 xl:hidden">
        <div className=" hidden sm:flex min-w-0 items-center justify-between gap-3">
          <WebsiteLogo
            className="h-10 w-24 min-[360px]:w-32"
            priority
          />
          {status === 'authenticated' ? (
            <Link
              href="/profile"
              aria-label={`الملف الشخصي: ${userName}`}
              className="flex min-w-0 max-w-[calc(100vw-8rem)] items-center gap-2 rounded-xl border border-ak-line bg-ak-surface/60 px-2.5 py-2 text-sm font-semibold text-white sm:max-w-none sm:px-3"
            >
              <FaUserCircle className="shrink-0 text-ak-honey" aria-hidden="true" />
              <span className="max-w-24 truncate min-[360px]:max-w-28 sm:max-w-36">{userName}</span>
            </Link>
          ) : status === 'loading' ? (
            <span aria-label="جاري تحميل حساب المستخدم" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-ak-line bg-ak-surface text-lg text-ak-honey">
              <FaUserCircle aria-hidden="true" />
            </span>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-ak-line px-3 text-xs font-semibold text-white transition hover:border-ak-amber/40 hover:bg-ak-brand-soft"
            >
              <FaSignInAlt aria-hidden="true" />
              تسجيل الدخول
            </Link>
          )}
        </div>
        {pathname !== '/' && <Search showCategories={false} />}
      </div>
    </motion.header>
  );
}
