'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MdOutlineBedroomParent,
  MdOutlineAttachMoney,
  MdOutlineAddLocationAlt,
  MdOutlineAlternateEmail,
  MdOutlineMapsHomeWork,
} from 'react-icons/md';
import { GiBuyCard, GiExitDoor, GiPayMoney, GiCarKey } from 'react-icons/gi';
import {
  FaDollarSign,
  FaHome,
  FaHouseDamage,
  FaFacebookF,
  FaCanadianMapleLeaf,
} from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail, TbTargetArrow } from 'react-icons/tb';
import { FcConferenceCall } from 'react-icons/fc';
import { ImProfile } from 'react-icons/im';

export default function Footer() {
  const router = useRouter();
  const session = useSession();

  return (
    <footer className="bg-two text-white py-8 my-8">
      <div className=" flex justify-between items-start gap-8 px-4 w-full">
        {/* القسم الأول: وصف الموقع */}
        <div className="space-y-4 p-4 rounded-lg bg-one h-72 w-full">
          <h3 className="text-3xl font-bold">موقع متجر</h3>
          <p className="text-md">
            يتميز موقع متجر بخاصية البحث المتقدمة، مما يسمح للمستخدمين بالبحث
            بسهولة عن العقارات والسيارات كما يوفر الموقع إمكانية التواصل المباشر
            بين البائعين والمشترين بسهولة، مما يعزز الثقة ويسهل إتمام الصفقات
            بنجاح. تم تصميم الموقع لتوفير تجربة تصفح سلسة وسريعة، مع تحسينات
            تضمن توافقه مع جميع الأجهزة، يعد موقع متجر وجهة مثالية للبيع
            والتأجير، حيث يجمع بين التصميم الجذاب، الوظائف العملية، والخدمة
            الممتازة في مكان واحد. 🚀
          </p>
        </div>

        {/* القسم الثاني: الوصول السريع */}
        <div className="space-y-4 p-4 rounded-lg bg-one h-72 w-full">
          <h3 className="text-xl font-bold">وصول سريع</h3>
          <ul className="flex flex-col justify-start items-start space-y-2">
            <div
              className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300"
              onClick={() => router.push('/')}
            >
              <FaHome className="text-lg select-none text-two" />
              <li className=" text-md select-none">الرئيسية</li>
            </div>
            <div
              className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300"
              onClick={() => router.push('/myPosts')}
            >
              <FaCanadianMapleLeaf className="text-lg select-none text-two" />
              <li className=" text-md xl:text-md select-none text-nowrap">
                متجري
              </li>
            </div>
            <div className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300">
              {session?.status === 'unauthenticated' && (
                <div
                  className="flex items-center justify-start gap-2 hover:cursor-pointer transition-all duration-300"
                  onClick={() => router.push('/login')}
                >
                  <GiExitDoor className="text-lg select-none text-two" />
                  <li className=" text-md select-none">تسجيل الدخول</li>
                </div>
              )}
              {session?.status === 'authenticated' && (
                <div
                  className="flex items-center justify-start gap-2 border-one transition-all duration-300"
                  onClick={() => router.push('/profile')}
                >
                  <ImProfile className="text-lg select-none text-two" />
                  <li className=" text-md select-none">بروفايل</li>
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300"
              onClick={() => router.push('/favorite')}
            >
              <TbTargetArrow className="text-lg select-none text-two" />
              <li className=" text-md xl:text-md select-none text-nowrap">
                المفضلة
              </li>
            </div>

            <div
              className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300"
              onClick={() => router.push('/newPost')}
            >
              <MdOutlineMapsHomeWork className="text-lg select-none text-two" />
              <li className=" text-md select-none">إنشاء إعلان</li>
            </div>

            <div
              className="flex items-center justify-start gap-2  shadow-one   hover:scale-105 hover:cursor-pointer px-2 transition-all duration-300"
              onClick={() => router.push('/contactUs')}
            >
              <FcConferenceCall className="text-lg select-none text-two" />
              <li className=" text-md xl:text-md select-none text-nowrap">
                اتصل بنا
              </li>
            </div>
          </ul>
        </div>

        {/* القسم الثالث: ساعات العمل */}
        <div className="space-y-4 p-4 rounded-lg bg-one h-72 w-full">
          <h3 className="text-xl font-bold">ساعات العمل</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-white ml-2">الاثنين</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">الثلاثاء</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">الأربعاء</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">الخميس</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">الجمعة</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">السبت</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white ml-2">الأحد</span>
              <span className="text-two">09:00 - 18:00</span>
            </li>
          </ul>
        </div>

        {/* القسم الرابع: معلومات الاتصال */}
        <div className="space-y-4 p-4 rounded-lg bg-one h-72 w-full">
          <h3 className="text-xl font-bold">معلومات الاتصال</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <MdOutlineAddLocationAlt className="text-two ml-2" />
              <span>سوريا - دمشق</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaFacebookF className="text-two ml-2" />
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-two hover:scale-105"
              >
                Facebook
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <FiLinkedin className="text-two ml-2" />
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-two hover:scale-105"
              >
                LinkedIn
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <TbBrandGmail className="text-two ml-2" />
              <button
                onClick={() => router.push('/contactUs/byEmail')}
                className="hover:text-two hover:scale-105"
              >
                Gmail
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
