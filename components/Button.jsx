import Link from 'next/link';
import React from 'react';

export default function Button({ style, title, onClick, path = '', emoji }) {
  return (
    <Link href={path} className="w-full">
      <button
        type="submit"
        onClick={onClick}
        className={
          (style ? 'text-lg p-2 ' + style : 'text-sm p-0.5') +
          ' btn relative my-2 text-one text-nowrap select-none rounded-lg w-full max-h-12 hover:text-white border hover:border-[#596067] hover:scale-[101%]'
        }
      >
        {title}
        <span className="absolute left-[60%] top-1/4 mx-auto my-auto z-50 text-one hover:text-white">
          {emoji}
        </span>
      </button>
    </Link>
  );
}
