import Link from 'next/link';
import React from 'react';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { HiMiniArrowSmallLeft } from 'react-icons/hi2';

export default function BackButton() {
  return (
    <Link href={'/'}>
      <div className="p-3 rounded-2xl backdrop-blur-sm border font-extrabold transition-all duration-300 bg-ak-surface/20 text-white border-ak-line-strong/30 hover:bg-ak-surface/30">
        <HiMiniArrowSmallLeft className="text-xl " />
      </div>
    </Link>
  );
}
