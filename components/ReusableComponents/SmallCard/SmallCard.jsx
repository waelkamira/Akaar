'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';

const SmallCard = React.memo(function SmallCard({
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
      });
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
      <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-[2rem] overflow-hidden border border-neutral-800/50 shadow-2xl shadow-black/50 hover:shadow-orange-500/10 hover:border-[#C99B70]/20 transition-all duration-500">
        
        {/* ================= قسم الصورة ================= */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 z-10" />
          <ImageComponent
            item={item}
            priority={priority}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Overlay متدرج */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10" />

          {/* الشريط العلوي - معلومات سريعة */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
            {/* زر المفضلة - تصميم عصري */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <FavoriteButton
                item={item}
                className="text-white hover:text-red-400 transition-colors"
              />
            </div>

            {/* بطاقة التصنيف - تصميم عائم */}
            {category?.name && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-4 py-2 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-2"
              >
                <FaTag className="text-[10px]" />
                {category.name}
              </motion.div>
            )}
          </div>

          {/* بطاقة الوقت - أسفل اليسار */}
          {item?.createdAt && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 text-neutral-300 text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                <FaClock className="text-[#C99B70] text-[10px]" />
                {formatDate(item.createdAt)}
              </div>
            </div>
          )}

          {/* مؤشر السعر العائم - أسفل اليمين */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-1">
              {item.basePrice?.toLocaleString() || '0'}
              <span className="text-xs font-bold opacity-80">ل.س</span>
            </div>
          </div>
        </div>

        {/* ================= قسم المحتوى ================= */}
        <div className="p-5 space-y-4 relative">
          {/* خط زخرفي علوي */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full opacity-50" />

          {/* العنوان والموقع */}
          <div className="space-y-3">
            {/* الموقع بتصميم أنيق */}
            <div className="flex items-center gap-2 text-neutral-400 text-sm group/location">
              <div className="w-8 h-8 rounded-xl bg-neutral-800/50 flex items-center justify-center group-hover/location:bg-[#C99B70]/20 transition-colors">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#C99B70]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-neutral-300 font-medium block truncate">
                  {item?.location || 'غير محدد'}
                </span>
                {item?.subLocation && (
                  <span className="text-neutral-500 text-xs block">
                    {item.subLocation}
                  </span>
                )}
              </div>
            </div>

            {/* الوصف */}
            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
              {item?.description || item?.title || 'لا يوجد وصف متاح'}
            </p>
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
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
              className="group/btn flex items-center gap-2 bg-gradient-to-r from-[#C99B70] to-[#A8754D] hover:from-[#D9B18C] hover:to-[#C99B70] text-[#171512] font-bold text-sm py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C99B70]/20 hover:shadow-[#C99B70]/30 hover:scale-105 active:scale-95"
            >
              <span>التفاصيل</span>
              <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* تأثير ضوئي عند التمرير */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  );
});

export default SmallCard;