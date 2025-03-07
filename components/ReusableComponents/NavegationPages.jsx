'use client';
import Link from 'next/link';
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
    <div className="flex items-center justify-around my-16">
      {hasMore && (
        <button
          className="flex items-center justify-center gap-2 py-2 px-6 bg-three text-white rounded-[5px] hover:bg-two transition-colors shadow-md hover:shadow-lg"
          onClick={() => setPageNumber(pageNumber + 1)}
        >
          الصفحة التالية
          <MdKeyboardDoubleArrowRight className="text-xl" />
        </button>
      )}
      {pageNumber > 1 && (
        <button
          className="flex items-center justify-center gap-2 py-2 px-6 bg-three text-white rounded-[5px] hover:bg-two transition-colors shadow-md hover:shadow-lg"
          onClick={() => setPageNumber(pageNumber - 1)}
        >
          <MdKeyboardDoubleArrowLeft className="text-xl" />
          الصفحة السابقة
        </button>
      )}
    </div>
  );
}
