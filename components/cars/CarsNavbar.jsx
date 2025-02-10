'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdCarRental, MdOutlineBedroomParent } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ImProfile } from 'react-icons/im';
import { MdFavoriteBorder } from 'react-icons/md';
import { TbTargetArrow } from 'react-icons/tb';
import ClockWidget from '../ClockWidget';

export default function CarsNavbar() {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  return (
    <div
      className={`hidden xl:flex xl:flex-col xl:justify-between w-full overflow-hidden bg-two text-white px-4 border-b-[10px] border-one ${
        pathname !== '/' ? ' pb' : ''
      }`}
    >
      <div className="flex justify-between w-full">
        <ul className="flex justify-evenly gap-4 mr-4 items-center h-20 py-4 w-5/6">
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/Cars')}
          >
            <FaHome className="text-xl select-none text-one" />
            <li className=" text-xl select-none">سيارات</li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300">
            {session?.status === 'unauthenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:scale-105 hover:cursor-pointer hover:shadow-lg shadow-gray-300  p-2 px-8 h-14 transition-all duration-300"
                onClick={() => router.push('/login')}
              >
                <GiExitDoor className="text-xl select-none text-one" />
                <li className=" text-xl select-none">تسجيل الدخول</li>
              </div>
            )}
            {session?.status === 'authenticated' && (
              <div
                className="flex items-center justify-center gap-2 border-one px-2 h-14 transition-all duration-300"
                onClick={() => router.push('/profile')}
              >
                <ImProfile className="text-xl select-none text-one" />
                <li className=" text-xl select-none">بروفايل</li>
              </div>
            )}
          </div>

          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/myPosts')}
          >
            <FaCanadianMapleLeaf className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              متجري
            </li>
          </div>
          {/* <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/favoritePosts')}
          >
            <TbTargetArrow className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              المفضلة
            </li>
          </div> */}
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/Cars/newPost')}
          >
            <FaDollarSign className="text-xl select-none text-one" />
            <li className=" text-xl select-none">بيع/تأجير سيارة</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/Cars/buy')}
          >
            <GiPayMoney className="text-xl select-none text-one" />
            <li className=" text-xl select-none">شراء سيارة</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-lg border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/Cars/rent')}
          >
            <MdCarRental className="text-xl select-none text-one" />
            <li className=" text-xl select-none">استأجار سيارة</li>
          </div>
        </ul>
        <div className="flex items-center justify-center">
          {/* <ClockWidget /> */}
          <div
            className="relative flex justify-end w-fit min-w-[218px] cursor-pointer "
            onClick={() => router.push('/')}
          >
            {/* <div className="absolute top-5 left-24 flex justify-end ">
              <div className="absolute">
                <h1 className="akar akarStroke lg:text-4xl lg:font-extrabold text-lg text-nowrap select-none">
                  تؤبرني
                </h1>
                <h1 className="absolute akarStroke lg:text-4xl lg:font-extrabold text-transparent text-lg text-nowrap select-none top-0 left-0 z-0">
                  تؤبرني
                </h1>
              </div>
            </div> */}
            <div className="relative h-16 w-44 py-2">
              <Image
                src="https://i.imgur.com/bhzNopE.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
