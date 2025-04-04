'use client';

import { motion } from 'framer-motion';

export default function Loading({ itemCount = 4, myMessage }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Spinner في الأعلى */}
      <div className="flex flex-col items-center justify-center py-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'linear',
          }}
          className="w-12 h-12 border-4 border-gray-300 border-t-primary-500 rounded-full"
        />
        <p className="mt-4 text-neutral-600">
          {myMessage || 'جاري التحميل...'}
        </p>
      </div>

      {/* Skeleton Cards لحجز المساحة */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {Array.from({ length: itemCount }).map((_, index) => (
          <motion.div
            key={index}
            className="w-[300px] h-[400px] bg-gray-200 rounded-lg shadow-lg animate-pulse"
          >
            <div className="w-full h-[60%] bg-gray-300 rounded-t-lg"></div>
            <div className="p-4">
              <div className="w-3/4 h-6 bg-gray-400 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-400 rounded mb-2"></div>
              <div className="w-full h-8 bg-gray-400 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
