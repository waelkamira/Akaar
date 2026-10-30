'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';

const SmallCard = React.memo(
  /** @param {{ item: { id: string; createdAt?: string | Date; basePrice?: number | null; location?: string; subLocation?: string; description?: string; title?: string; stockQuantity?: number; images?: string[] }; category?: { id?: string; name?: string | null; slug?: string; categoryName?: string | null }; priority?: boolean; onFavoriteChange?: (favorited: boolean) => void }} props */
  function SmallCard({
    item,
    category,
    priority = false,
    onFavoriteChange,
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
      className="group h-full min-w-0 cursor-pointer"
    >
      <article className="ak-listing-card flex h-full min-w-0 flex-col overflow-hidden rounded-[1.65rem] border border-ak-line bg-ak-surface shadow-ak-card transition duration-300 group-hover:border-ak-amber/35 group-hover:shadow-ak-panel">
          <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-ak-raised">
            <div className="relative h-full">
              <ImageComponent
                item={item}
                priority={priority}
                className="absolute inset-0 h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ak-ink/75 via-transparent to-ak-ink/10" />

              <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-3">
                <div
                  onClick={(event) => event.stopPropagation()}
                  className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-ak-ink/55 shadow-lg backdrop-blur-md"
                >
                  <FavoriteButton item={item} onFavoriteChange={onFavoriteChange} />
                </div>
                {category?.name && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex max-w-[65%] items-center gap-2 truncate rounded-full border border-white/25 bg-ak-ink/70 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
                  >
                    <FaTag className="shrink-0 text-[10px] text-ak-honey" />
                    <span className="truncate">{category.name}</span>
                  </motion.div>
                )}
              </div>

              <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold text-white/70">السعر</span>
                  <span className="mt-1 flex min-w-0 items-baseline gap-1.5 text-white">
                    <span className="truncate text-2xl font-black leading-none tracking-tight">
                      {item.basePrice?.toLocaleString() || '0'}
                    </span>
                    <span className="text-[11px] font-bold text-white/80">ل.س</span>
                  </span>
                </div>
                {item?.createdAt && (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-ak-ink/45 px-2.5 py-1.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                    <FaClock className="text-[9px] text-ak-honey" />
                    {formatDate(item.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 min-h-12 flex-1 text-base font-bold leading-6 text-white transition-colors group-hover:text-ak-honey sm:text-lg">
                {item?.title || 'إعلان جديد'}
              </h2>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-ak-amber/20 bg-ak-amber/10 text-ak-honey">
                <FaTag className="text-xs" />
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-2.5 text-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ak-amber/10 text-ak-amber">
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

            <p className="line-clamp-2 min-h-10 text-sm leading-6 text-ak-muted">
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
                className="group/btn inline-flex items-center gap-2 rounded-full border border-ak-amber/25 bg-ak-amber/10 px-4 py-2.5 text-xs font-bold text-ak-honey transition-all duration-300 hover:bg-ak-brand hover:text-ak-ink active:scale-95 sm:text-sm"
              >
                <span>التفاصيل</span>
                <FaArrowLeft className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
              </button>
            </div>
          </div>
          </article>
    </motion.div>
  );
});

export default SmallCard;