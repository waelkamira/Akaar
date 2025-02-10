'use client';
import Link from 'next/link';
import React from 'react';

export default function Button({ style, title, onClick, path = '', emoji }) {
  return (
    <Link href={path} className="w-full">
      <button
        type="submit"
        onClick={onClick}
        className={
          (style ? 'text-lg p-1 sm:p-2 ' + style : 'text-sm p-0.5') +
          ' btn flex justify-center items-center relative my-2 text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover: border hover:border-[#596067] hover:scale-[101%]'
        }
      >
        {title}
        <span className="absolute hidden sm:block right-[65%] top-1/4 mx-auto my-auto z-50">
          {emoji}
        </span>
      </button>
    </Link>
  );
}
