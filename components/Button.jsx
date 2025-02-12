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
          (style ? 'sm:text-lg p-1 lg:p-2 ' + style : 'text-sm p-0.5') +
          ' btn flex justify-center items-center text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:scale-[101%]'
        }
      >
        {title}
        <span className="mx-2">{emoji}</span>
      </button>
    </Link>
  );
}
