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
      ? 'border-[#FF7C34]'
      : color === 'gray'
      ? 'border-three'
      : 'border-[#666666]';

  const bgColor =
    color === 'red'
      ? 'bg-[#F83354]'
      : color === 'orange'
      ? 'bg-[#FF7C34]'
      : color === 'gray'
      ? 'bg-three'
      : 'bg-[#666666]';

  const btnBackground =
    color === 'red'
      ? '#F83354'
      : color === 'orange'
      ? '#FF7C34'
      : color === 'gray'
      ? '#5F5D59'
      : '#666666';

  const btnHoverBackground =
    color === 'red'
      ? '#fa6880'
      : color === 'orange'
      ? '#fdb734'
      : color === 'gray'
      ? '#666666'
      : '#666666';

  return (
    <div
      className={`w-full sm:w-96 bg-four  rounded-t-3xl   overflow-hidden hover:scale-[102%] transition-transform duration-300 ease-in-out cursor-pointer`}
    >
      <div
        onClick={() => router.push(path)}
        className={`relative w-full h-[200px] lg:h-[300px] border-l-[10px] overflow-visible ${borderColor} overflow-visible`}
      >
        <Image src={image} fill objectFit="cover" alt={cardName} />
      </div>

      <div
        className={` w-full border overflow-hidden rounded-b-3xl ${
          color === 'red'
            ? 'border-[#F83354]'
            : color === 'orange'
            ? 'border-[#FF7C34]'
            : color === 'gray'
            ? 'border-three'
            : 'border-[#666666]'
        }`}
      >
        <h1 className="relative text-lg lg:text-2xl my-2 lg:my-4 font-medium text-center w-full">
          {cardName}
          <span className="absolute left-[65%] sm:left-[70%] xl:left-[65%] top-1/4 mx-auto my-auto">
            {emoji}
          </span>
        </h1>
        <p className="p-2 px-4 text-sm lg:text-lg select-none text-three">
          {text}
        </p>
        <div className="px-4 mt-2">
          <button
            onClick={() => router.push(path)}
            className="btn relative w-full my-2 text-white rounded-lg hover:scale-[101%] text-lg sm:text-xl hover:shadow-sm shadow-gray-300 p-1 lg:p-2 transition-transform duration-200 ease-in-out"
            style={{
              '--btn-background': btnBackground,
              '--btn-hover-background': btnHoverBackground,
            }}
          >
            {cardName}
          </button>
        </div>
        <div
          className={`flex justify-around items-start py-2 h-10 lg:h-12 w-full hover:${bgColor} transition-transform duration-500 ease-linear`}
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
    </div>
  );
}
