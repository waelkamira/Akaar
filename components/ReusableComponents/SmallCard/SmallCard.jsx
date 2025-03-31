'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageComponent from './ImageComponent';
import DetailsSection from './DetailsSection';
import AdditionalFields from './AdditionalFields';
import FavoriteButton from './FavoriteButton';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('item', JSON.stringify(item));
      localStorage.setItem('category', JSON.stringify(category));
    }
    router.push(`/post/${item?.id}`);
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col w-full cursor-pointer bg-white rounded-xl overflow-hidden relative group border border-gray-100"
      onClick={handleClick}
    >
      {/* شريط التظليل العلوي */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* زر المفضلة */}
      <FavoriteButton item={item} className="top-4 right-4 z-20" />

      {/* شارة جديدة إذا كان المنتج حديث */}
      {item.isNew && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-20">
          جديد
        </div>
      )}

      {/* الصورة الرئيسية */}
      <div className="relative h-60 w-full overflow-hidden">
        <ImageComponent
          item={item}
          className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* محتوى البطاقة */}
      <div className="p-5 space-y-3">
        {/* العنوان والموقع */}
        <DetailsSection item={item} />

        {/* الحقول الإضافية */}
        <AdditionalFields
          item={item}
          category={category}
          className="border-t border-gray-100 pt-3 mt-3"
        />

        {/* السعر وزر التفاصيل */}
        <motion.div
          className="flex justify-between items-center pt-3"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">
              {item.basePrice?.toLocaleString()} $
            </span>
            {item.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {item.oldPrice?.toLocaleString()} $
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            عرض التفاصيل
          </motion.button>
        </motion.div>
      </div>

      {/* تأثير تحويم خلفي */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
});

export default SmallCard;
