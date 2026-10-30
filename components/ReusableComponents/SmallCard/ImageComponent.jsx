// ImageComponent.jsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaRegImage } from 'react-icons/fa';

function ImageComponent({ item, priority = false, className = 'relative h-56' }) {
  const image = item?.image1 || item?.images?.[0];

  return (
    <motion.div
      className={`w-full overflow-hidden bg-gradient-to-br from-ak-raised to-ak-surface ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!image && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ak-quiet">
          <FaRegImage className="text-3xl" aria-hidden="true" />
          <span className="text-xs">لا توجد صورة</span>
        </div>
      )}
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={image}
            fill
            priority={priority}
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            alt={item?.title || 'عقار'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* تأثير التدرج عند التحويم */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}

          {/* معلومات إضافية */}
          {/* <div className=" p-4 flex justify-between items-end z-10">
            {item?.createdAt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-2 right-2 w-fit flex items-center gap-2 bg-ak-surface/20 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg"
              >
                <span className="text-xs font-medium text-white">
                  <FormatDate dateString={item?.createdAt} />
                </span>
              </motion.div>
            )}

            {item?.details?.propertyType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-2 right-2 flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-white rounded-full px-4 py-0.5 shadow-lg"
              >
                <span className="text-xs font-medium">
                  {item?.details?.propertyType === '1' ? 'بيع' : 'إجار'}
                </span>
              </motion.div>
            )}
          </div> */}
        </div>
      )}
    </motion.div>
  );
}

export default ImageComponent;
