import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FormatDate from '../FormatDate';

function ImageComponent({ item }) {
  return (
    <motion.div
      className="relative w-full h-56 bg-gray-200 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* عرض صورة بديلة عند عدم وجود صورة */}
      {!item?.image1 ? (
        <div className="w-full h-full bg-gray-300 animate-pulse" />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={item.image1 || '/fallback.jpg'}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={item?.title || 'عقار'}
            className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          />

          {/* تأثير التدرج عند التحويم */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* معلومات إضافية */}
          {item?.createdAt && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-2 right-2 flex items-center bg-white/80 rounded-full px-3 py-1 shadow-md"
            >
              <span className="text-xs font-medium text-gray-800">
                <FormatDate dateString={item.createdAt} />
              </span>
            </motion.div>
          )}

          {item?.details?.propertyType && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-2 right-2 bg-primary text-white rounded-full px-4 py-1 shadow-md"
            >
              <span className="text-xs font-medium">
                {item.details.propertyType === '1' ? 'بيع' : 'إجار'}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default ImageComponent;
