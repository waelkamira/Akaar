'use client';
import Link from 'next/link';
import React from 'react';
import { FaCanadianMapleLeaf } from 'react-icons/fa';

export default function Button({ style, title, onClick, path = '', emoji }) {
  return (
    <Link
      href={path}
      className="flex justify-center items-center gap-2 w-full text-three hover:text-primary-500"
    >
      <button
        type="submit"
        onClick={onClick}
        className={
          (style
            ? 'sm:text-lg p-2 text-sm lg:p-3 ' + style
            : ' text-sm p-0.5') +
          ' flex justify-between text-white items-center border border-white/20 my-2 text-nowrap select-none rounded-full w-full max-h-12 transition-all duration-300 ease-in-out bg-transparent transform hover:scale-[102%] shadow-lg hover:shadow-lg'
        }
        // style={{
        //   background: 'linear-gradient(90deg, #FF7C34, #fb923c)',
        //   border: 'none',
        //   boxShadow:
        //     '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)',
        // }}
      >
        <span className="mx-2 select-none text-lg">
          {emoji || <FaCanadianMapleLeaf />}
        </span>
        |<span className="text-center lg:text-base w-full pl-4">{title}</span>
      </button>
    </Link>
  );
}
