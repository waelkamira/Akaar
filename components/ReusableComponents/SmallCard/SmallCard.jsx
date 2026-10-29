'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

const SmallCard = React.memo(
  /** @param {{ item: { id: string; createdAt?: string | Date; basePrice?: number | null; location?: string; subLocation?: string; description?: string; title?: string; stockQuantity?: number; images?: string[] }; category?: { id?: string; name?: string | null; slug?: string; categoryName?: string | null }; priority?: boolean }} props */
  function SmallCard({
    item,
    category,
    priority = false,
  }) {
  const router = useRouter();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
  }, []);

  const safeStringify = (obj, isCategory = false) => {
    if (!obj) return '{}';

    if (isCategory) {
      const safeCategory = {
        id: category?.id,
        name: category?.name,
        slug: category?.slug,
        categoryName: category?.categoryName,
      };
      return JSON.stringify(safeCategory);
    }

    try {
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'function') return undefined;
        if (typeof value === 'object' && value !== null) {
          if (value.$$typeof || value.Provider || value.Consumer) {
            return undefined;
          }
        }
        return value;
        }
      );
    } catch (error) {
      console.error('Error stringifying:', error);
      return '{}';
    }
  };

  const handleClick = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('item', safeStringify(item));
        localStorage.setItem('category', safeStringify(category, true));
      }
      router.push(`/post/${item?.id}`);
    } catch (error) {
      console.error('Error:', error);
      router.push(`/post/${item?.id}`);
    }
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={handleClick}
      className="group h-full cursor-pointer"
    >
      <div className="h-full rounded-[2rem] border-4 border-white/90 bg-white p-1.5 shadow-[0_18px_48px_rgba(15,23,42,0.22)] transition-shadow duration-300 group-hover:shadow-[0_24px_60px_rgba(15,23,42,0.32)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-ak-line bg-ak-surface">
          <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[1.3rem] bg-gradient-to-br from-orange-400 via-pink-500 to-violet-500 p-1.5">
            <div className="relative h-full overflow-hidden rounded-[1.05rem] bg-ak-raised">
              <ImageComponent
                item={item}
                priority={priority}
                className="absolute inset-0 h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ak-ink/80 via-ak-ink/10 to-ak-ink/10" />

              <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3">
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-10 items-center justify-center rounded-2xl border border-white/40 bg-ak-ink/55 shadow-lg backdrop-blur-md"
                >
                  <FavoriteButton item={item} />
                </div>
                {category?.name && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex max-w-[65%] items-center gap-2 truncate rounded-full border border-white/50 bg-white/90 px-3.5 py-2 text-xs font-bold text-ak-ink shadow-lg backdrop-blur-md"
                  >
                    <FaTag className="shrink-0 text-[10px] text-rose-500" />
                    <span className="truncate">{category.name}</span>
                  </motion.div>
                )}
              </div>

              {item?.createdAt && (
                <div className="absolute bottom-3 left-3 z-20 max-w-[34%]">
                  <div className="flex items-center gap-2 overflow-hidden rounded-full border border-white/35 bg-ak-ink/60 px-3 py-2 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md">
                    <FaClock className="text-[10px] text-ak-honey" />
                    <span className="truncate">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 right-3 z-20 min-w-32 max-w-[58%] rounded-[1.15rem] bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 px-4 py-3 text-white shadow-[0_10px_28px_rgba(190,24,93,0.35)]">
                <span className="block text-[10px] font-bold text-white/75">السعر</span>
                <span className="mt-1 flex min-w-0 items-baseline gap-1.5">
                  <span className="truncate text-2xl font-black leading-none tracking-tight">
                    {item.basePrice?.toLocaleString() || '0'}
                  </span>
                  <span className="text-[11px] font-bold text-white/80">ل.س</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 min-h-12 flex-1 text-base font-black leading-6 text-white transition-colors group-hover:text-ak-honey sm:text-lg">
                {item?.title || 'إعلان جديد'}
              </h2>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-violet-200 shadow-inner">
                <FaTag className="text-sm" />
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ak-amber/10 text-ak-amber">
                <FaMapMarkerAlt className="text-xs" />
              </span>
              <div className="min-w-0">
                <span className="block truncate font-semibold text-white/90">
                  {item?.location || 'غير محدد'}
                </span>
                {item?.subLocation && (
                  <span className="block truncate text-xs text-ak-quiet">
                    {item.subLocation}
                  </span>
                )}
              </div>
            </div>

            <p className="line-clamp-2 min-h-10 text-sm leading-5 text-white/70">
              {item?.description || 'اكتشف تفاصيل هذا الإعلان والمزيد.'}
            </p>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-ak-line pt-3">
              {item?.stockQuantity !== undefined ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  متاح ({item.stockQuantity})
                </div>
              ) : (
                <span className="text-xs font-medium text-ak-quiet">
                  اضغط لاكتشاف المزيد
                </span>
              )}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleClick();
                }}
                className="group/btn inline-flex items-center gap-2 rounded-xl bg-ak-brand px-4 py-2.5 text-xs font-black text-ak-ink shadow-ak-glow transition-all duration-300 hover:brightness-110 active:scale-95 sm:text-sm"
              >
                <span>التفاصيل</span>
                <FaArrowLeft className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default SmallCard;