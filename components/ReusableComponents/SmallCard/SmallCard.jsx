'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import DetailsSection from './DetailsSection';
import AdditionalFields from './AdditionalFields';
import FavoriteButton from './FavoriteButton';
import UserNameAndPhoto from '../userNameAndPhoto';
import { formatDistanceToNow } from 'date-fns';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  }, []);

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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        scale: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      className="relative flex flex-col w-full cursor-pointer rounded-lg group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-gray-300 hover:border-primary-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_64px_0_rgba(59,130,246,0.15)] transition-all duration-700 ease-out overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0.1) 100%
          )
        `,
      }}
    >
      {/* تأثير إشعاعي متحرك */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10 animate-pulse" />
      </div>

      {/* تأثير نيومورفيك للحدود */}
      <div className="absolute inset-0 rounded-lg border border-white/30 shadow-[inset_1px_1px_2px_0_rgba(255,255,255,0.2),inset_-1px_-1px_2px_0_rgba(0,0,0,0.1)]" />

      {/* زر المفضلة متطور */}
      <FavoriteButton
        item={item}
        className="top-5 left-5 z-30 bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:bg-white/25 hover:scale-110 transition-all duration-300"
      />

      {/* شارة جديدة بتأثير متطور */}
      {item.isNew && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.4,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="absolute top-5 left-16 z-30 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl border border-white/30 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          <span>جديد</span>
        </motion.div>
      )}

      {/* قسم الصورة مع تأثيرات متطورة */}
      <div
        className="relative w-full overflow-hidden rounded-t-lg min-h-[200px]"
        onClick={handleClick}
      >
        <ImageComponent
          item={item}
          className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* طبقات متعددة من التدرجات */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* المستخدم */}
        <div className="absolute top-2 right-2 z-20">
          <UserNameAndPhoto post={item} size={'size-11'} />
        </div>

        {/* المعلومات السفلية */}
        <div className="absolute bottom-0 left-0 right-0 p-2 ">
          <div className="flex justify-between items-center">
            {/* التاريخ */}
            {item && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(item?.createdAt) || ''}
              </motion.div>
            )}

            {/* المخزون */}
            {item?.stockQuantity && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <svg
                  className="w-4 h-4 text-lime-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item?.stockQuantity} متوفر
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="flex-1 p-6 pt-2 relative">
        {/* تأثير خلفية للمحتوى */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-white/5" />

        <div className="relative z-20">
          {/* العنوان والموقع */}
          <div onClick={handleClick}>
            <DetailsSection item={item} />
          </div>

          {/* الحقول الإضافية */}
          <div className="flex justify-center items-center rounded-b-lg p-2 ">
            <AdditionalFields item={item} category={category} />
          </div>

          {/* السعر وزر التفاصيل */}
          <motion.div
            className="flex flex-col justify-between items-center pt-5 border-t border-white/20"
            whileHover={{ scale: 1.01 }}
          >
            {/* السعر */}
            <div className="flex items-baseline gap-4 w-full justify-center mb-5">
              {item.oldPrice && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  {item.oldPrice?.toLocaleString()}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  <span className="text-green-500 mx-2">$</span>
                  {item.basePrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* زر التفاصيل */}
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-400 hover:from-gray-600 hover:to-gray-400 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl group/btn relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* تأثير إشعاعي للزر */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

              <span className="font-bold text-lg">عرض التفاصيل</span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* تأثير ضوء متحرك */}
      {/* <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" />
      </div> */}
    </motion.div>
  );
});

export default SmallCard;
