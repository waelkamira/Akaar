'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MdOutlineAddLocationAlt, MdOutlineMapsHomeWork } from 'react-icons/md';
import { GiExitDoor } from 'react-icons/gi';
import { FaHome, FaFacebookF, FaCanadianMapleLeaf } from 'react-icons/fa';
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail, TbTargetArrow } from 'react-icons/tb';
import { FcConferenceCall } from 'react-icons/fc';
import { ImProfile } from 'react-icons/im';
import Image from 'next/image';

export default function Footer() {
  const router = useRouter();
  const session = useSession();

  return (
    <footer className="bg-two text-black py-12 my-8 w-full xl:w-[99%] shadow-lg">
      {/* القسم الأول: وصف الموقع */}
      <div className="flex flex-col justify-center items-center mx-auto px-4 gap-2">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <Link
            href={'/'}
            className="relative flex justify-end w-full md:w-auto min-w-[218px] cursor-pointer mb-4 md:mb-0"
          >
            <div className="relative h-20 w-64 hover:scale-105 transition-transform duration-300 z-20">
              <Image
                src="/logo.png"
                fill
                objectFit="contain"
                alt="home_photo"
                objectPosition="top"
              />
            </div>
          </Link>
          <div className="max-w-2xl text-center md:text-right">
            <p className="text-sm sm:text-lg leading-relaxed text-five">
              يتميز موقع متجر بخاصية البحث المتقدمة، مما يسمح للمستخدمين بالبحث
              بسهولة عن العقارات والسيارات. كما يوفر الموقع إمكانية التواصل
              المباشر بين البائعين والمشترين، مما يعزز الثقة ويسهل إتمام الصفقات
              بنجاح. 🚀
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-8 w-full">
          {/* القسم الثاني: الوصول السريع */}
          <div className="bg-white p-6 rounded-[5px] shadow-md w-full min-w-[200px]">
            <h3 className="text-xl font-bold mb-4 text-one">وصول سريع</h3>
            <ul className="space-y-2">
              {[
                { icon: <FaHome />, text: 'الرئيسية', path: '/' },
                {
                  icon: <FaCanadianMapleLeaf />,
                  text: 'متجري',
                  path: '/myPosts',
                },
                { icon: <TbTargetArrow />, text: 'المفضلة', path: '/favorite' },
                {
                  icon: <MdOutlineMapsHomeWork />,
                  text: 'إنشاء إعلان',
                  path: '/newPost',
                },
                {
                  icon: <FcConferenceCall />,
                  text: 'اتصل بنا',
                  path: '/contactUs',
                },
              ].map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => router.push(item.path)}
                    className="flex items-center space-x-2 hover:text-one transition-colors duration-300 gap-2"
                  >
                    <span className="text-one">{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                </li>
              ))}
              {session?.status === 'unauthenticated' ? (
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center space-x-2 hover:text-one transition-colors duration-300 gap-2"
                  >
                    <GiExitDoor className="text-one" />
                    <span>تسجيل الدخول</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center space-x-2 hover:text-one transition-colors duration-300 gap-2"
                  >
                    <ImProfile className="text-one" />
                    <span>بروفايل</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* القسم الثالث: ساعات العمل */}
          <div className="bg-white p-6 rounded-[5px] shadow-md w-full min-w-[200px]">
            <h3 className="text-xl font-bold mb-4 text-one">معلومات الاتصال</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <MdOutlineAddLocationAlt className="text-one text-xl" />
                <span>سوريا - دمشق</span>
              </li>
              {[
                {
                  icon: <FaFacebookF />,
                  text: 'Facebook',
                  href: 'https://facebook.com',
                },
                {
                  icon: <FiLinkedin />,
                  text: 'LinkedIn',
                  href: 'https://linkedin.com',
                },
                {
                  icon: <TbBrandGmail />,
                  text: 'Gmail',
                  onClick: () => router.push('/contactUs/byEmail'),
                },
              ].map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-one transition-colors duration-300 gap-2"
                    >
                      <span className="text-one text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </a>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex items-center space-x-2 hover:text-one transition-colors duration-300 gap-2"
                    >
                      <span className="text-one text-xl">{item.icon}</span>
                      <span>{item.text}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* القسم الرابع: معلومات الاتصال */}

          <div className="bg-white p-6 rounded-[5px] shadow-md w-full min-w-[200px]">
            <h3 className="text-xl font-bold mb-4 text-one">ساعات العمل</h3>
            <ul className="space-y-2">
              {[
                'الاثنين',
                'الثلاثاء',
                'الأربعاء',
                'الخميس',
                'الجمعة',
                'السبت',
                'الأحد',
              ].map((day, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-gray-200 py-2 text-nowrap gap-2"
                >
                  <span>{day}</span>
                  <span className="text-one font-semibold">09:00 - 18:00</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
