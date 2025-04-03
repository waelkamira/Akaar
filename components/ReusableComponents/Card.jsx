'use client';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';

export default function Card({ cardName, path, image, text, color, emoji }) {
  const router = useRouter();

  // تحديد الألوان بناءً على القيمة الممررة
  const getColors = () => {
    switch (color) {
      case 'green':
        return {
          border: 'border-[#50F999]',
          bg: 'bg-[#50F999]',
          btn: '#50F999',
          hover: '#7AFFB8', // لون أفتح للأخضر
        };
      case 'orange':
        return {
          border: 'border-[#FF7C34]',
          bg: 'bg-[#FF7C34]',
          btn: '#FF7C34',
          hover: '#FF9D65', // لون أفتح للبرتقالي
        };
      case 'purple':
        return {
          border: 'border-[#803084]',
          bg: 'bg-[#803084]',
          btn: '#803084',
          hover: '#9D4BA1', // لون أفتح للبنفسجي
        };
      default: // gray
        return {
          border: 'border-[#666666]',
          bg: 'bg-[#666666]',
          btn: '#666666',
          hover: '#858585', // لون أفتح للرمادي
        };
    }
  };

  const colors = getColors();

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
          {image && (
            <Image
              src={image}
              fill
              style={{ objectFit: 'cover' }}
              alt={cardName}
              priority={false}
            />
          )}
        </div>

        <div
          className={`w-full border overflow-hidden rounded-[5px] ${colors.border}`}
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
              className={`relative w-full my-2 text-white rounded-[5px] hover:scale-[101%] text-md sm:text-lg hover:shadow-sm hover:bg-${colors.hover} p-1 lg:p-2 transition-all duration-200 ease-in-out`}
              style={{
                backgroundColor: colors.bg,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = colors.hover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = colors.btn)
              }
            >
              {cardName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
