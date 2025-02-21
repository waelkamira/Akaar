import Link from 'next/link';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { HiMiniArrowSmallLeft } from 'react-icons/hi2';

export default function BackButton() {
  return (
    <Link
      href={'/'}
      className=" sm:left-16 rounded-[5px] overflow-hidden bg-white"
    >
      <div className="flex items-center justify-center overflow-hidden cursor-pointer xl:w-fit border border-white">
        {/* <button className="flex items-center justify-center  text-sm lg:text-xl bg-one p-1 pb-2 lg:p-2">
          رجوع
        </button> */}
        <HiMiniArrowSmallLeft className=" text-one white text-3xl xl:text-[40px]   transition-all duration-300  rounded-l-lg" />
      </div>
    </Link>
  );
}
