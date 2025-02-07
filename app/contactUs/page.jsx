'use client';
import React, { useState } from 'react';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import Link from 'next/link';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import toast from 'react-hot-toast'; // استيراد toast من react-hot-toast
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail } from 'react-icons/tb';
import MiddleBarAndPhoto from '../../components/middleBarAndPhoto';
import Image from 'next/image';

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const handleCopy = (email) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        toast.success('تم النسخ إلى الحافظة', {
          duration: 2000, // مدة ظهور الرسالة (2 ثانية)
          position: 'bottom-center', // موقع الرسالة
        });
      })
      .catch((err) => {
        console.error('فشل النسخ: ', err);
        toast.error('فشل النسخ إلى الحافظة');
      });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b">
      <div className="relative w-full h-[300px] lg:h-[400px] border overflow-hidden">
        <Image
          src="https://i.imgur.com/wZ0aruw.jpg"
          fill
          alt="home_photo"
          className="object-cover object-center w-full h-auto"
          objectPosition="center"
        />
      </div>
      <main className="flex flex-col justify-center items-center pb-16 w-full  rounded-b">
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <MiddleBarAndPhoto
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            noButton={true}
          />

          <div className="flex flex-col justify-between items-center w-full h-full text-gray-400 mt-2 cursor-pointer">
            <div className="p-2 min-h-72 h-full rounded bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
              <h1 className="text-center  text-lg w-full select-none my-2">
                موقع عقار
              </h1>
              <p className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose  p-4">
                أولويتنا هي الثقة والاحترام والأمانة في الخدمة المهنية, أكثر من
                موقع عقاري كلاسيكي؛ فريق عمل محترف، ومفهوم جودة الخدمة، مع
                هيكلها الموثوق به، أصبحت مستشارك الذي لا غنى عنه لجميع عقاراتك
                التي تبحث عنها أو تريد بيعها.يقوم موقع عقار للعقارات بتنفيذ
                ومراقبة جميع أعمال البيع والشراء والتأجير والتأجير العقاري بدقة
                وفي بيئة موثوقة. بالنسبة لنا، كانت التعليقات الإيجابية التي
                نتلقاها منكم مصدر تحفيز لنا لتقديم الأفضل.
              </p>
            </div>
            <div className="w-full">
              <div className=" p-2 min-h-72 h-full rounded my-2 bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
                <h1 className="text-center  text-lg w-full select-none my-2">
                  معلومات الإتصال{' '}
                </h1>
                <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <MdOutlineAddLocationAlt className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        سوريا - دمشق{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> </span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <Link
                      href={'https://www.facebook.com/WaelKhamira/'}
                      target="_blank"
                    >
                      {' '}
                      <div className="flex gap-1 items-center">
                        <FaFacebookF className="text-lg select-none text-one" />
                        <li className=" text-md sm:text-lg select-none text-nowrap">
                          facebook{' '}
                        </li>
                      </div>
                      <span className="text-nowrap"> </span>
                    </Link>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FiLinkedin className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        linkedin
                      </li>
                    </div>
                    <span className="text-nowrap"></span>
                  </div>{' '}
                  <div
                    className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer px-2 xl:px-8 h-6 transition-all duration-300"
                    onClick={() => handleCopy('waelkamira@gmail.com')} // إضافة حدث النقر
                  >
                    <div className="flex gap-1 items-center">
                      <TbBrandGmail className="text-lg select-none text-one" />
                      <li className="text-md sm:text-lg text-nowrap">gmail </li>
                    </div>
                    <span className="text-nowrap">waelkamira@gmail.com</span>
                  </div>
                  <div
                    className="flex flex-col sm:flex-row items-start justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer px-2 xl:px-8 h-6 transition-all duration-300"
                    onClick={() => handleCopy('ramond.shnaidr@hotmail.com')} // إضافة حدث النقر
                  >
                    <div className="flex gap-1 items-center">
                      <MdOutlineAlternateEmail className="text-lg select-none text-one" />
                      <li className="text-md sm:text-lg text-nowrap">
                        hotmail
                      </li>
                    </div>
                    <span className="text-nowrap">
                      {' '}
                      <span className="text-nowrap">
                        ramond.shnaidr@hotmail.com
                      </span>
                    </span>
                  </div>
                </ul>
              </div>
              <div className=" p-2 min-h-72 h-full rounded my-2 bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
                <h1 className="text-center  text-lg w-full select-none my-2">
                  ساعات العمل{' '}
                </h1>
                <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الإثنين{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الثلاثاء{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الأربعاء{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الخميس{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الجمعة{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        السبت{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>{' '}
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الأحد{' '}
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
