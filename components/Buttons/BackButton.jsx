import Link from 'next/link';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { HiMiniArrowSmallLeft } from 'react-icons/hi2';

export default function BackButton() {
  return (
    <Link href={'/'}>
      <div className="p-3 rounded-2xl backdrop-blur-sm border font-extrabold transition-all duration-300 bg-white/20 text-white border-white/30 hover:bg-white/30">
        <HiMiniArrowSmallLeft className="text-xl " />
      </div>
    </Link>
  );
}
