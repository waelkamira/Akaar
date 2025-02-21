'use client';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../LoadingPhoto';

export default function Card({ cardName, path, image, text, color, emoji }) {
  const router = useRouter();

  // تحديد الألوان بناءً على القيمة الممررة
  const borderColor =
    color === 'green'
      ? 'border-[#119530]'
      : color === 'orange'
      ? 'border-[#FF7C34]'
      : color === 'purple'
      ? 'border-#803084'
      : 'border-[#666666]';

  const bgColor =
    color === 'green'
      ? 'bg-[#119530]'
      : color === 'orange'
      ? 'bg-[#FF7C34]'
      : color === 'purple'
      ? 'bg-#803084'
      : 'bg-[#666666]';

  const btnBackground =
    color === 'green'
      ? '#119530'
      : color === 'orange'
      ? '#FF7C34'
      : color === 'purple'
      ? '#803084'
      : '#666666';

  const btnHoverBackground =
    color === 'green'
      ? '#119530'
      : color === 'orange'
      ? '#FF7C34'
      : color === 'purple'
      ? '#803084'
      : '#666666';

  return (
    <div
      className={`item w-72 xl:w-80 transition-transform duration-300 ease-in-out cursor-pointer m-2 xl:m-8`}
    >
      <div className="layer w-full">
        <div
          onClick={() => router.push(path)}
          className={`relative w-full h-[200px] lg:h-[300px] overflow-visible`}
        >
          {!image && <LoadingPhoto />}
          {image && <Image src={image} fill objectFit="cover" alt={cardName} />}
        </div>

        <div
          className={` w-full border overflow-hidden rounded-b-[15px] sm:rounded-b-3xl`}
        >
          <div className="flex justify-center items-center gap-2 my-2">
            <h1 className="text-md sm:text-xl">{emoji}</h1>
            <h1 className="text-md sm:text-lg">{cardName}</h1>
          </div>
          <p className="p-2 px-4 text-sm lg:text-md select-none text-center w-full">
            {text}
          </p>
          <div className="px-4 mt-2">
            <button
              onClick={() => router.push(path)}
              className="btn relative w-full my-2 text-white rounded-[5px] hover:scale-[101%] text-md sm:text-ةي hover:shadow-sm shadow-purple-300 p-1 lg:p-2 transition-transform duration-200 ease-in-out"
              style={{
                '--btn-background': btnBackground,
                '--btn-hover-background': btnHoverBackground,
              }}
            >
              {cardName}
            </button>
          </div>
          {/* <div
            className={`flex justify-around items-start py-2 h-10 lg:h-12 w-full hover:${bgColor} transition-transform duration-500 ease-linear`}
          >
            <div className="flex flex-col justify-center items-center gap-1">
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
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
