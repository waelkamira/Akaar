'use client';
import { FaHome } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { MdOutlineMapsHomeWork } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ImProfile } from 'react-icons/im';
import { GiCarWheel } from 'react-icons/gi';
import { TbTargetArrow } from 'react-icons/tb';

export default function FirsrNavBar() {
  const router = useRouter();
  const session = useSession();

  return (
    <div
      className={`hidden xl:flex xl:flex-col xl:justify-between w-full overflow-hidden bg-two text-white border-b-[10px] border-one px-4`}
    >
      <div className="flex justify-between items-center w-full">
        <ul className="flex justify-between gap-4 items-center h-20 py-4 w-5/6">
          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/')}
          >
            <FaHome className="text-xl select-none text-one" />
            <li className=" text-xl select-none">الرئيسية</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/myPosts')}
          >
            <FaCanadianMapleLeaf className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              متجري
            </li>
          </div>
          <div className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300">
            {session?.status === 'unauthenticated' && (
              <div
                className="flex items-center justify-center gap-2 hover:cursor-pointer h-14 transition-all duration-300"
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
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/favorite')}
          >
            <TbTargetArrow className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              المفضلة
            </li>
          </div>
          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/RealEstate')}
          >
            <MdOutlineMapsHomeWork className="text-xl select-none text-one" />
            <li className=" text-xl select-none">عقارات</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/DynamicForm')}
          >
            <MdOutlineMapsHomeWork className="text-xl select-none text-one" />
            <li className=" text-xl select-none">إنشاء إعلان</li>
          </div>
          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/Cars')}
          >
            <GiCarWheel className="text-xl select-none text-one" />
            <li className=" text-xl select-none">سيارات</li>
          </div>

          <div
            className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px]  hover:scale-105 hover:cursor-pointer  px-2 lg:px-4 h-14 transition-all duration-300"
            onClick={() => router.push('/contactUs')}
          >
            <FcConferenceCall className="text-xl select-none text-one" />
            <li className=" text-md xl:text-xl select-none text-nowrap">
              اتصل بنا
            </li>
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
