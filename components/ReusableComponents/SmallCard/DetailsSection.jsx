'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight, Star } from 'lucide-react';
import { cn } from '../../../lib/utils';

const DetailsSection = ({ item, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn('flex flex-col gap-4 w-full', 'text-gray-800', className)}
    >
      {/* العنوان */}
      {item?.title && (
        <motion.h1
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-semibold text-gray-900 line-clamp-1 leading-snug hover:text-primary transition-colors duration-200"
        >
          {item.title}
        </motion.h1>
      )}

      {/* الموقع */}
      <motion.div
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
      >
        <MapPin className="w-4 h-4 text-primary" strokeWidth={2.5} />
        <span className="font-medium">{item?.city || 'غير محدد'}</span>
        {item?.town && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">{item.town}</span>
          </>
        )}
      </motion.div>

      {/* الوصف */}
      {item?.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 line-clamp-1 leading-relaxed hover:line-clamp-none transition-all duration-300"
        >
          {item.description}
        </motion.p>
      )}

      {/* معلومات إضافية */}
      {(item?.area || item?.rooms) && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {item?.area && (
            <span className="text-sm bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-200">
              <span className="font-medium">{item.area}</span> م²
            </span>
          )}
          {item?.rooms && (
            <span className="text-sm bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-200">
              <span className="font-medium">{item.rooms}</span> غرف
            </span>
          )}
          {item?.rating && (
            <div className="flex items-center gap-1 text-sm bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-lg border border-yellow-100">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span className="font-medium">{item.rating}</span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(DetailsSection);
