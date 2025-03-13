'use client';
import { motion } from 'framer-motion';
import React from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

export default function NavegationPages({
  hasMore,
  setPageNumber,
  pageNumber,
}) {
  // console.log('array', array);
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-around my-16"
    >
      {hasMore && (
        <button
          className="flex items-center justify-center gap-2 py-2 px-6 text-two transition-colors"
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-xl text-one" />
        </button>
      )}
      {pageNumber > 1 && (
        <button
          className="flex items-center justify-center gap-2 py-2 px-6 text-two transition-colors"
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          <MdKeyboardDoubleArrowLeft className="text-xl text-one" />
          الصفحة السابقة
        </button>
      )}
    </motion.div>
  );
}
