'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import DetailsSection from './DetailsSection';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowRight, FaMagic } from 'react-icons/fa';

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -12,
        transition: { duration: 0.4, ease: 'easeOut' },
      }}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* البطاقة الرئيسية بتصميم Ninjax */}
      <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 hover:border-emerald-300 transition-all duration-500 overflow-hidden rounded-3xl shadow-lg shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10">
        {/* خلفية زخرفية */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl" />
        </div>

        {/* ================= قسم الصورة ================= */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
          <ImageComponent
            item={item}
            priority={priority}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay متدرج ناعم */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-emerald-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* شارة "جديد" عصرية */}
          {item.isNew && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="absolute top-4 right-4 z-20"
            >
              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-emerald-900 text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-emerald-900/20 border border-emerald-200">
                <FaMagic className="text-emerald-600" />
                <span>NEW DROP</span>
              </div>
            </motion.div>
          )}

          {/* زر المفضلة */}
          <div
            className="absolute top-4 left-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton
              item={item}
              className="bg-white/90 backdrop-blur-md border-2 border-white/50 text-emerald-900 hover:text-red-500 hover:border-red-300 hover:bg-white transition-all duration-300 p-3 rounded-full shadow-lg"
            />
          </div>

          {/* التاريخ */}
          {item?.createdAt && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20">
                {formatDate(item.createdAt)}
              </div>
            </div>
          )}

          {/* رقم المنتج كعنصر تصميمي */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
            <span className="text-8xl font-black text-white tracking-tighter select-none">
              {String(item?.id || '').slice(-3)}
            </span>
          </div>
        </div>

        {/* ================= قسم المحتوى ================= */}
        <div className="relative p-6 space-y-4">
          {/* التصنيف */}
          {category?.name && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">
                {category.name}
              </span>
            </motion.div>
          )}

          {/* العنوان */}
          <div className="space-y-2">
            <DetailsSection item={item} />
          </div>

          {/* السعر والمخزون */}
          <div className="flex items-end justify-between pt-4 border-t border-emerald-100">
            <div className="flex flex-col">
              {item.oldPrice && item.oldPrice > item.basePrice && (
                <span className="text-xs text-neutral-400 line-through font-bold mb-1">
                  {item.oldPrice?.toLocaleString()}
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-emerald-950 tracking-tight">
                  {item.basePrice?.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  ر.س
                </span>
              </div>
            </div>

            {/* حالة المخزون */}
            {item?.stockQuantity !== undefined && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-wider"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                IN STOCK ({item.stockQuantity})
              </motion.div>
            )}
          </div>

          {/* زر "عرض التفاصيل" العصري */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2"
          >
            <div className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl group-hover:shadow-emerald-900/20">
              <span>VIEW DETAILS</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* تأثير الزاوية العلوية */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-700" />

        {/* خط سفلي متحرك */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      {/* ظل البطاقة */}
      <div className="absolute inset-0 bg-emerald-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 translate-y-6 rounded-3xl" />
    </motion.div>
  );
});

export default SmallCard;
