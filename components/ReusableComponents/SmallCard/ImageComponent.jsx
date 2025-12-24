// ImageComponent.jsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import LoadingPhoto from '../../photos/LoadingPhoto';
import FormatDate from '../FormatDate';

function ImageComponent({ item }) {
  return (
    <motion.div
      className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!item?.image1 && <LoadingPhoto />}
      {item?.image1 && (
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <Image
            src={item?.image1}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={item?.title || 'عقار'}
            className="object-cover transition-all duration-700 ease-out overflow-hidden rounded-lg"
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
                className="absolute bottom-2 right-2 w-fit flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg"
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
