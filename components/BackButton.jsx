import Link from 'next/link';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';

export default function BackButton() {
  return (
    <Link
      href={'/'}
      className=" top-3 left-2 sm:left-16 z-40 rounded-md overflow-hidden bg-white"
    >
      <div className="flex items-center justify-center  overflow-hidden cursor-pointer xl:w-fit border border-white">
        <button className="flex items-center justify-center text-white text-sm lg:text-xl  bg-one p-1 pb-2 lg:p-2">
          رجوع
        </button>
        <TbArrowBigLeftLinesFilled className=" text-one white text-3xl xl:text-[40px]   transition-all duration-300  rounded-l-lg" />
      </div>
    </Link>
  );
}
