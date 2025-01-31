'use client';
import React from 'react';
import BackButton from './BackButton';
import SideBarMenu from './SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { FiActivity } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { LuArrowDownNarrowWide, LuArrowUpNarrowWide } from 'react-icons/lu';

export default function MiddleBarAndPhoto({
  isOpen,
  setIsOpen,
  noButton,
  isShow,
  setIsShow,
}) {
  const router = useRouter();
  return (
    <div className="relative xl:hidden flex justify-between items-center w-full gap-2 my-2 bg-one p-1 md:p-2 rounded-[5px]">
      <div>
        <TfiMenuAlt
          className="text-[30px] lg:text-5xl text-white cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <div className="absolute top-14 lg:top-20 right-0 z-50">
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      </div>
      {noButton && (
        <button
          onClick={() => router.push('/newPost')}
          className="relative text-sm lg:text-xl bg-white h-8 lg:h-11 w-3/4 border-r-[30%] shadow-lg border-one rounded-[5px] hover:scale-[101%]"
        >
          إعلان جديد{' '}
          <span className="absolute left-3/4 top-1/4 mx-auto my-auto">
            <FiActivity className="text-one sm:text-sm lg:text-xl" />
          </span>
        </button>
      )}

      <BackButton />
    </div>
  );
}
