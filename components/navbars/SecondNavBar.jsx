'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { FaDollarSign } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { MdCarRental } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ImProfile } from 'react-icons/im';
import { FaCarSide } from 'react-icons/fa';
import categories from '../lists/categories';
import { TbTargetArrow } from 'react-icons/tb';

export default function SecondNavBar({ category }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();

  useEffect(() => {
    findCategory();
  }, []);

  function findCategory() {
    if (categories) {
      const result = categories?.filter((ca) => ca?.id === category);
      setSelectedCategory(result[0]);
      console.log('result', result);
    }
  }
  return (
    <div
      className={`hidden xl:flex xl:flex-col xl:justify-between w-full overflow-hidden bg-two text-white px-4 border-b-[10px] border-one ${
        pathname !== '/' ? ' pb' : ''
      }`}
    >
      <div className="flex justify-between w-full">
        <ul className="flex justify-evenly gap-4 mr-4 items-center h-20 py-4 w-5/6">
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/')}
          >
            <FaHome className="text-xl select-none text-one" />
            <li className=" text-xl select-none">الرئيسية</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/')}
          >
            <FaCarSide className="text-xl select-none text-one" />
            <li className=" text-xl select-none">{selectedCategory?.name}</li>
          </div>
          <div className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300">
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
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/myPosts')}
          >
            <FaCanadianMapleLeaf className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              متجري
            </li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/favoritePosts')}
          >
            <TbTargetArrow className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              المفضلة
            </li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/DynamicForm')}
          >
            <FaDollarSign className="text-xl select-none text-one" />
            <li className=" text-xl select-none">إنشاء إعلان</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/products/buy')}
          >
            <GiPayMoney className="text-xl select-none text-one" />
            <li className=" text-xl select-none">شراء </li>
          </div>
          <div
            className="flex items-center justify-center gap-2 hover:border-t-4  shadow-one hover:shadow-lg rounded-[5px] border-one hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 2xl:px-8 h-14 transition-all duration-300"
            onClick={() => router.push('/products/rent')}
          >
            <MdCarRental className="text-xl select-none text-one" />
            <li className=" text-xl select-none">استأجار </li>
          </div>
        </ul>
        <div className="flex items-center justify-center">
          <div
            className="relative flex justify-end w-fit min-w-[218px] cursor-pointer "
            onClick={() => router.push('/')}
          >
            <div className="relative h-16 w-56 my-2 hover:scale-[103%] z-20">
              <Image
                src="https://i.imgur.com/0oHqzqF.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-radial from-white/30 via-transparent to-two z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
