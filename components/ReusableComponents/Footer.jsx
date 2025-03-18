'use client';
import React, { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { BsArrowDownSquare } from 'react-icons/bs';

export default function Footer() {
  const router = useRouter();
  const session = useSession();

  const images = [
    '/photos/image (1).jpg',
    '/photos/image (2).jpg',
    '/photos/image (3).jpg',
    '/photos/image (4).jpg',
    '/photos/image (5).jpg',
    '/photos/image (6).jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // تغيير الصورة كل 3 ثوانٍ

    return () => clearInterval(interval); // تنظيف الـ interval عند إلغاء تحميل المكون
  }, [images.length]);

  return (
    <footer className="text-white py-8 w-full xl:w-[99%]">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 py-12 w-full">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between text-center lg:text-right w-full">
          {/* مربع الصورة (سلايدر الصور) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative size-64 md:size-96 rounded-xl overflow-hidden mb-4 md:mb-0"
          >
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            >
              <Image
                src={images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="cover" // يمكنك تعديل هذا الخيار
                objectPosition="center"
                priority={currentImageIndex === 0}
                loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
                className="rounded-xl"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-2/3 px-4 min-w-44"
          >
            <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
              حمل تطبيقنا الآن
            </h2>
            <p className="text-sm lg:text-lg mb-6 w-full ">
              استمتع بتجربة تصفح أفضل وإشعارات فورية للإعلانات الجديدة. متاح
              الآن للتحميل المباشر.
            </p>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white bg-opacity-20 text-white rounded-md p-3 transition-colors duration-300 hover:bg-opacity-40 cursor-pointer"
              >
                <BsArrowDownSquare className="text-2xl" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-two flex flex-col justify-center items-center mx-auto px-4 py-8 gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center md:justify-end w-full md:w-auto min-w-[218px] mb-4 md:mb-0"
          >
            <Link href={'/'}>
              <div className="relative h-16 w-48 md:h-20 md:w-64 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  fill
                  objectFit="contain"
                  alt="home_photo"
                  objectPosition="top"
                />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-center md:text-right"
          >
            <p className="text-xs md:text-sm lg:text-lg leading-relaxed text-five">
              يتميز موقع متجر بخاصية البحث المتقدمة، مما يسمح للمستخدمين بالبحث
              بسهولة عن العقارات والسيارات. كما يوفر الموقع إمكانية التواصل
              المباشر بين البائعين والمشترين، مما يعزز الثقة ويسهل إتمام الصفقات
              بنجاح.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start gap-4 md:gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white bg-opacity-10 p-4 rounded-[10px] shadow-md w-full min-w-[200px]"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-orange-300">
              وصول سريع
            </h3>
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
                    className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-300 gap-2"
                  >
                    <span className="text-orange-300">{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                </li>
              ))}
              {session?.status === 'unauthenticated' ? (
                <li>
                  <button
                    onClick={() => router.push('/login')}
                    className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-300 gap-2"
                  >
                    <GiExitDoor className="text-orange-300" />
                    <span>تسجيل الدخول</span>
                  </button>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-300 gap-2"
                  >
                    <ImProfile className="text-orange-300" />
                    <span>بروفايل</span>
                  </button>
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white bg-opacity-10 p-4 rounded-[10px] shadow-md w-full min-w-[200px]"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-orange-300">
              معلومات الاتصال
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MdOutlineAddLocationAlt className="text-orange-300 text-xl" />
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
                      className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-300 gap-2"
                    >
                      <span className="text-orange-300 text-xl">
                        {item.icon}
                      </span>
                      <span>{item.text}</span>
                    </a>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-300 gap-2"
                    >
                      <span className="text-orange-300 text-xl">
                        {item.icon}
                      </span>
                      <span>{item.text}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ساعات العمل */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white bg-opacity-10 p-4 rounded-[10px] shadow-md w-full min-w-[200px]"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-orange-300">
              ساعات العمل
            </h3>
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
                  className="flex justify-between items-center border-b border-gray-200 py-2 text-nowrap"
                >
                  <span>{day}</span>
                  <span className="text-orange-300 font-semibold">
                    09:00 - 18:00
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
