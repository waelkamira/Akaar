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
    <div className="hidden xl:block ">
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
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <FaHome className="text-xl text-one" />
            <li className="text-xl" onClick={() => router.push('/')}>
              الرئيسية
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 h-16">
            {session?.status === 'unauthenticated' && (
              <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
                <GiExitDoor className="text-xl text-one" />
                <li className="text-xl" onClick={() => router.push('/login')}>
                  تسجيل الدخول
                </li>
              </div>
            )}
            {session?.status === 'authenticated' && (
              <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
                <GiExitDoor className="text-xl text-one" />
                <li className="text-xl" onClick={() => router.push('/profile')}>
                  بروفايل{' '}
                </li>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <FcConferenceCall className="text-xl text-one" />
            <li
              className="text-xl text-nowrap"
              onClick={() => router.push('/contactUs')}
            >
              اتصل بنا
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <FaCanadianMapleLeaf className="text-xl text-one" />
            <li
              className="text-xl text-nowrap"
              onClick={() => router.push('/newPost')}
            >
              انشاء إعلان
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <FaDollarSign className="text-xl text-one" />
            <li className="text-xl" onClick={() => router.push('/sell')}>
              بيع
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <GiPayMoney className="text-xl text-one" />
            <li className="text-xl" onClick={() => router.push('/buy')}>
              شراء
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg p-2 px-8 rounded-lg h-16">
            <MdOutlineBedroomParent className="text-xl text-one" />
            <li className="text-xl" onClick={() => router.push('/rent')}>
              أجار
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
