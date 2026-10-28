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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* البطاقة الرئيسية بتصميم عصري */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-ak-line bg-gradient-to-br from-ak-raised to-ak-surface shadow-ak-card transition-all duration-500 hover:-translate-y-1 hover:border-ak-amber/35 hover:shadow-ak-panel">
        
        {/* ================= قسم الصورة ================= */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-ak-amber/10 to-transparent" />
          <ImageComponent
            item={item}
            priority={priority}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Overlay متدرج */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-ak-ink via-ak-ink/25 to-transparent" />

          {/* الشريط العلوي - معلومات سريعة */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
            {/* زر المفضلة - تصميم عصري */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl border border-ak-line-strong/20 bg-ak-ink/35 p-2.5 shadow-ak-card backdrop-blur-xl transition-all duration-300 hover:bg-ak-surface/75"
            >
              <FavoriteButton
                item={item}
                className="text-ak-cream hover:text-red-400 transition-colors"
              />
            </div>

            {/* بطاقة التصنيف - تصميم عائم */}
            {category?.name && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-full bg-ak-brand px-4 py-2 text-xs font-bold text-ak-ink shadow-ak-glow"
              >
                <FaTag className="text-[10px]" />
                {category.name}
              </motion.div>
            )}
          </div>

          {/* بطاقة الوقت - أسفل اليسار */}
          {item?.createdAt && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="flex items-center gap-2 rounded-full border border-ak-line-strong bg-ak-ink/75 px-3 py-2 text-xs font-bold text-ak-cream/85 shadow-ak-card backdrop-blur-xl">
                <FaClock className="text-[10px] text-ak-honey" />
                {formatDate(item.createdAt)}
              </div>
            </div>
          )}

          {/* مؤشر السعر العائم - أسفل اليمين */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="flex items-center gap-1 rounded-2xl border border-ak-honey/30 bg-ak-brand px-4 py-2.5 text-lg font-black text-ak-ink shadow-ak-glow">
              {item.basePrice?.toLocaleString() || '0'}
              <span className="text-xs font-bold opacity-80">ل.س</span>
            </div>
          </div>
        </div>

        {/* ================= قسم المحتوى ================= */}
        <div className="p-5 space-y-4 relative">
          {/* خط زخرفي علوي */}
          <div className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 rounded-full bg-ak-brand opacity-75" />

          {/* العنوان والموقع */}
          <div className="space-y-3">
            {/* الموقع بتصميم أنيق */}
            <div className="group/location flex items-center gap-2 text-sm text-ak-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ak-elevated/70 transition-colors group-hover/location:bg-ak-amber/15">
                <FaMapMarkerAlt className="h-3.5 w-3.5 text-ak-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block truncate font-medium text-ak-cream/90">
                  {item?.location || 'غير محدد'}
                </span>
                {item?.subLocation && (
                  <span className="block text-xs text-ak-quiet">
                    {item.subLocation}
                  </span>
                )}
              </div>
            </div>

            {/* الوصف */}
            <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-ak-muted">
              {item?.description || item?.title || 'لا يوجد وصف متاح'}
            </p>
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center justify-between border-t border-ak-line pt-3">
            {/* حالة التوفر */}
            {item?.stockQuantity !== undefined && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-bold">
                  متاح ({item.stockQuantity})
                </span>
              </div>
            )}

            {/* زر التفاصيل - تصميم عصري */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="group/btn flex items-center gap-2 rounded-xl bg-ak-brand px-5 py-2.5 text-sm font-bold text-ak-ink shadow-ak-glow transition-all duration-300 hover:scale-105 hover:brightness-105 active:scale-95"
            >
              <span>التفاصيل</span>
              <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* تأثير ضوئي عند التمرير */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ak-honey/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>
    </motion.div>
  );
});

export default SmallCard;