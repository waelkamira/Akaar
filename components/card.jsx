'use client';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Card({ cardName, path, image, text, color, emoji }) {
  const router = useRouter();

  // تحديد الألوان بناءً على القيمة الممررة
  const borderColor =
    color === 'red'
      ? 'border-[#F83354]'
      : color === 'orange'
      ? 'border-[#ffa500]'
      : color === 'green'
      ? 'border-[#5F5D59]'
      : 'border-[#cccccc]';

  const bgColor =
    color === 'red'
      ? 'bg-[#F83354]'
      : color === 'orange'
      ? 'bg-[#ffa500]'
      : color === 'green'
      ? 'bg-[#5F5D59]'
      : 'bg-[#cccccc]';

  const btnBackground =
    color === 'red'
      ? '#F83354'
      : color === 'orange'
      ? '#ffa500'
      : color === 'green'
      ? '#5F5D59'
      : '#cccccc';

  const btnHoverBackground =
    color === 'red'
      ? '#fa6880'
      : color === 'orange'
      ? '#fdb734'
      : color === 'green'
      ? '#aaaaaa'
      : '#aaaaaa';

  return (
    <div className="w-full sm:w-96 h-[600px] bg-white rounded-3xl overflow-hidden hover:scale-[102%] transition-transform duration-300 ease-in-out cursor-pointer">
      <div
        onClick={() => router.push(path)}
        className={`relative w-full h-[300px] overflow-hidden border-l-[18px] ${borderColor}`}
      >
        <Image src={image} fill objectFit="cover" alt={cardName} />
      </div>
      <h1 className="relative text-2xl my-4 font-bold text-center w-full">
        {cardName}
        <span
          className={`absolute left-[65%] text-3xl top-0 bottom-0 mx-auto my-auto z-50`}
        >
          {emoji}
        </span>
      </h1>
      <p className="p-2 px-4 select-none xl:font-semibold">{text}</p>
      <div className="px-4 mt-2">
        <button
          onClick={() => router.push(path)}
          className="btn relative w-full my-2  rounded-lg hover:scale-[101%] text-lg sm:text-xl hover:shadow-sm shadow-gray-300 p-2 transition-transform duration-200 ease-in-out"
          style={{
            '--btn-background': btnBackground,
            '--btn-hover-background': btnHoverBackground,
          }}
        >
          {cardName}
        </button>
      </div>
      <div
        className={`flex justify-around items-start py-2 h-20 w-full text-white ${bgColor}`}
      >
        {/* <div className="flex flex-col justify-center items-center gap-1">
          <h1>Comments</h1>
          <h1>526</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1>Views</h1>
          <h1>526</h1>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1>Reads</h1>
          <h1>526</h1>
        </div> */}
      </div>
    </div>
  );
}
