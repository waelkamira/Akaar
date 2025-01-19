'use client';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="hidden xl:block border border-black">
      <div className="flex justify-center w-3/4">
        <div className="absolute top-2 left-0 z-50 flex justify-end">
          <div className="relative w-full xl:w-44 h-20 overflow-hidden rounded-xl">
            <Image
              priority
              src="https://i.imgur.com/rXaNY0v.png"
              layout="fill"
              objectFit="contain"
              alt="logo"
            />
          </div>
        </div>
        <ul className="flex justify-evenly items-center w-full h-24">
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/')}
          >
            <FaHome className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none">الرئيسية</li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one h-16">
            {session?.status === 'unauthenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
                onClick={() => router.push('/login')}
              >
                <GiExitDoor className="text-xl select-none text-one hover:text-five" />
                <li className="text-xl select-none">تسجيل الدخول</li>
              </div>
            )}
            {session?.status === 'authenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
                onClick={() => router.push('/profile')}
              >
                <GiExitDoor className="text-xl select-none text-one hover:text-five" />
                <li className="text-xl select-none">بروفايل </li>
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/contactUs')}
          >
            <FcConferenceCall className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none text-nowrap">اتصل بنا</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/newPost')}
          >
            <FaCanadianMapleLeaf className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none text-nowrap">انشاء إعلان</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/sell')}
          >
            <FaDollarSign className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none">بيع</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/buy')}
          >
            <GiPayMoney className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none">شراء</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8  h-16"
            onClick={() => router.push('/rent')}
          >
            <MdOutlineBedroomParent className="text-xl select-none text-one hover:text-five" />
            <li className="text-xl select-none">أجار</li>
          </div>
        </ul>
      </div>
    </div>
  );
}
