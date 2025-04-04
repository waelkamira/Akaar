'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

  if (!item) {
    return (
      <div className="flex flex-col w-full bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse p-6">
        <div className="w-full h-64 bg-gray-300 rounded-lg" />
        <div className="mt-4 h-6 w-3/4 bg-gray-300 rounded" />
        <div className="mt-2 h-4 w-1/2 bg-gray-300 rounded" />
        <div className="mt-6 h-10 w-full bg-gray-300 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col w-full cursor-pointer bg-white rounded-2xl overflow-hidden relative group border border-gray-100/50 hover:border-primary/20 shadow-sm"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none" />

      <FavoriteButton item={item} className="top-4 right-4 z-20" />

      {item.isNew && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg z-20 backdrop-blur-sm"
        >
          جديد
        </motion.div>
      )}

      <div className="relative h-64 w-full overflow-hidden">
        <ImageComponent
          item={item}
          className="group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6 pt-0 space-y-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white to-white -top-10 z-10 pointer-events-none" />

        <div className="relative z-20">
          <DetailsSection item={item} />
        </div>

        <div className="relative flex justify-center items-center z-20">
          <AdditionalFields
            item={item}
            category={category}
            className="border-t border-gray-100/75"
          />
        </div>

        <motion.div
          className="flex flex-col justify-between items-center relative z-20 text-nowrap"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-baseline gap-2 font-serif">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
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
            className="bg-gradient-to-r from-primary-500 to-primary-400 hover:bg-primary-600 text-white px-6 py-1 rounded-full text-sm font-medium shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            عرض التفاصيل
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 rtl:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
});

export default SmallCard;
