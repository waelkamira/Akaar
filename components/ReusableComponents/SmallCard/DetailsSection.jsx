'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const DetailsSection = ({ item, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col gap-3 w-full p-4 bg-white',
        'rounded-b-xl text-gray-800',
        className
      )}
    >
      {/* الموقع */}
      <motion.div
        whileHover={{ x: 3 }}
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span>{item?.city || 'غير محدد'}</span>
        {item?.town && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span>{item.town}</span>
          </>
        )}
      </motion.div>

      {/* العنوان */}
      {item?.title && (
        <motion.h1
          whileHover={{ scale: 1.01 }}
          className="text-lg font-medium text-gray-900 line-clamp-2 leading-tight"
        >
          {item.title}
        </motion.h1>
      )}

      {/* الوصف */}
      {item?.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-600 line-clamp-3 leading-relaxed"
        >
          {item.description}
        </motion.p>
      )}

      {/* معلومات إضافية */}
      {(item?.area || item?.rooms) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {item?.area && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              {item.area} م²
            </span>
          )}
          {item?.rooms && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              {item.rooms} غرف
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(DetailsSection);
