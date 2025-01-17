'use client';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const smallSize = [
  {
    name: 'وجبة رئيسية',
    image: '/photo (12).png',
  },
  {
    name: 'معجنات',
    image: '/photo (13).png',
  },
  {
    name: 'شوربات',
    image: '/photo (14).png',
  },
  {
    name: 'مقبلات',
    image: '/photo (11).png',
  },
  {
    name: 'سلطات',
    image: '/photo (10).png',
  },
  {
    name: 'حلويات',
    image: '/photo (16).png',
  },
  {
    name: 'عصائر و مشروبات',
    image: '/photo (15).png',
  },
];
export default function CategoriesSlid() {
  const router = useRouter();

  return (
    <div className="hidden xl:flex flex-col items-center justify-center px-2 w-full bg-four  ">
      <h1 className="text-lg sm:text-xl text-center py-4 mt- text-white mx-4 font-semibold w-full select-none">
        ابحث حسب الصنف
      </h1>
      {smallSize.map((category, index) => (
        <div
          className=" flex flex-col justify-center items-center mx-4 cursor-pointer w-full "
          key={index}
        >
          <div
            className="relative border border-one w-full h-[150px]  overflow-hidden hover:scale-[101%] transition-all duration-300 shadow-lg"
            onClick={() => router.push(`?searchedCategory=${category?.name}`)}
          >
            <Image
              loading="lazy"
              src={category?.image}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          </div>
          <h1 className="text-lg sm:text-xl text-center p-2 text-white mx-4 font-ةي w-full select-none">
            {category.name}
          </h1>
        </div>
      ))}
    </div>
  );
}
