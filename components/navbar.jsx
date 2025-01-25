'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <div
      className={`hidden xl:flex xl:justify-between bg-[rgba(255,255,255,0.1)]${
        pathname !== '/' ? ' border border-seven' : ''
      }`}
    >
      <div className="flex justify-between w-full gap-8">
        <ul className="flex justify-evenly gap-4 mr-4 items-center h-20 w-4/6">
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/')}
          >
            <FaHome className="text-xl select-none text-one hover:text-eight" />
            <li className="text-white text-xl select-none">الرئيسية</li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one h-16">
            {session?.status === 'unauthenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:border-t-4 rounded-lg border-one hover:scale-105 hover:cursor-pointer hover:shadow-sm shadow-gray-300  p-2 px-8 h-16 transition-all duration-300"
                onClick={() => router.push('/login')}
              >
                <GiExitDoor className="text-xl select-none text-one hover:text-eight" />
                <li className="text-white text-xl select-none">تسجيل الدخول</li>
              </div>
            )}
            {session?.status === 'authenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
                onClick={() => router.push('/profile')}
              >
                <GiExitDoor className="text-xl select-none text-one hover:text-eight" />
                <li className="text-white text-xl select-none">بروفايل</li>
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/contactUs')}
          >
            <FcConferenceCall className="text-xl select-none text-one hover:text-eight" />
            <li className="text-white text-xl select-none text-nowrap">
              اتصل بنا
            </li>
          </div>
          {/* <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/newPost')}
          >
            <FaCanadianMapleLeaf className="text-xl select-none text-one hover:text-eight" />
            <li className="text-xl select-none text-nowrap">إنشاء إعلان</li>
          </div> */}
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/newPost')}
          >
            <FaDollarSign className="text-xl select-none text-one hover:text-eight" />
            <li className="text-white text-xl select-none">بيع</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/buy')}
          >
            <GiPayMoney className="text-xl select-none text-one hover:text-eight" />
            <li className="text-white text-xl select-none">شراء</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-sm rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 xl:px-8 h-16 transition-all duration-300"
            onClick={() => router.push('/rent')}
          >
            <MdOutlineBedroomParent className="text-xl select-none text-one hover:text-eight" />
            <li className="text-white text-xl select-none">إيجار</li>
          </div>
        </ul>
        <div
          className=" flex justify-end w-fit min-w-56 bg-[#888888] cursor-pointer "
          onClick={() => router.push('/')}
        >
          <div className="absolute top-5 left-24 z-50 flex justify-end ">
            <div className="absolute z-30">
              <h1 className="akar akarStroke lg:text-4xl lg:font-extrabold text-lg text-nowrap select-none">
                AKAR
              </h1>
              <h1 className="absolute akarStroke lg:text-4xl lg:font-extrabold text-transparent text-lg text-nowrap select-none top-0 left-0 z-0">
                AKAR
              </h1>
            </div>
          </div>
          <div className="relative size-20 border-l-[18px] border-one">
            <Image
              src="https://i.imgur.com/teY3Ui4.jpg"
              fill
              objectFit="cover"
              alt="home_photo"
              objectPosition="top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
