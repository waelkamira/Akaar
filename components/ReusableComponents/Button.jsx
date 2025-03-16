'use client';
import Link from 'next/link';
import React from 'react';
import { FaCanadianMapleLeaf } from 'react-icons/fa';

export default function Button({ style, title, onClick, path = '', emoji }) {
  return (
    <Link
      href={path}
      className="flex justify-center items-center gap-1 w-full text-three hover:text-one"
    >
      <button
        type="submit"
        onClick={onClick}
        className={
          (style ? 'sm:text-lg text-sm p-2 lg:p-3 ' + style : 'text-sm p-0.5') +
          ' btn flex justify-between text-white items-center my-2 text-nowrap select-none rounded-[5px] w-full max-h-12 transition-all duration-300 ease-in-out transform hover:scale-[102%] shadow-md hover:shadow-lg'
        }
        style={{
          background: 'linear-gradient(90deg, #FF7C34, #7E7F81)',
          border: 'none',
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        }}
      >
        <span className="mx-2 select-none">
          {emoji || <FaCanadianMapleLeaf className="" />}
        </span>
        <span className="text-center w-full border-r border-white  pl-4">
          {' '}
          {title}
        </span>
      </button>
    </Link>
  );
}
