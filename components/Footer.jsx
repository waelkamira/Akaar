'use client';
import React from 'react';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { GiBuyCard, GiExitDoor, GiPayMoney } from 'react-icons/gi';
import { GiCarKey } from 'react-icons/gi';
import { FaDollarSign, FaHome, FaHouseDamage } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { GiAnchor } from 'react-icons/gi';
import { FcConferenceCall } from 'react-icons/fc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { FaFacebookF } from 'react-icons/fa';
import Link from 'next/link';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import toast from 'react-hot-toast'; // استيراد toast من react-hot-toast
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail } from 'react-icons/tb';

export default function Footer() {
  const router = useRouter();
  const session = useSession();

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
    <>
      <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-between items-center bg-five gap-2 mt-16 border-t w-full h-full pt-8 p-4">
        <div className=" p-2 min-h-72 h-full rounded my-2 bg-white xl:border border-gray-400/10   cursor-pointer">
          <h1 className="text-center  text-lg w-full select-none my-2  font-medium">
            موقع تؤبرني
          </h1>
          <p className="text-start w-full select-none my-2 text-sm xl:text-md leading-loose ">
            بصفتنا موقعًا متخصصًا في مجال العقارات والسيارات، نضع الدقة والأمانة
            على رأس أولوياتنا لضمان تقديم أفضل تجربة ممكنة. نحن ملتزمون بتلبية
            جميع توقعات عملائنا من خلال توفير حلول متكاملة وموثوقة، سواء قبل أو
            بعد عمليات البيع أو التأجير. نسعى دائمًا لفهم احتياجات عملائنا
            وتحليلها بدقة، مع الأخذ بعين الاعتبار إمكانياتهم وتطلعاتهم، مما
            يمكننا من تقديم الخدمة الأسرع والأكثر كفاءة في السوق. كما نعمل بجد
            لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم الدعم الكامل في
            جميع مراحل عملية البيع أو الشراء أو الإيجار، وضمان تحقيق أقصى درجات
            الرضا والثقة.
          </p>
        </div>
        <div className=" p-2 min-h-72 h-full rounded my-2 bg-white xl:border border-gray-400/10  ">
          <h1 className="text-center  text-lg w-full select-none my-2  font-medium">
            وصول سريع
          </h1>
          <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
            <div
              className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
              onClick={() => router.push('/')}
            >
              <FaHome className="text-lg select-none text-one" />
              <li className=" text-md sm:text-lg select-none">الرئيسية</li>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg h-6">
              {session?.status === 'unauthenticated' && (
                <div
                  className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer hover:shadow-sm shadow-gray-300  p-2 px-8 h-6 transition-all duration-300"
                  onClick={() => router.push('/login')}
                >
                  <GiExitDoor className="text-lg select-none text-one" />
                  <li className=" text-md sm:text-lg select-none">
                    تسجيل الدخول
                  </li>
                </div>
              )}
              {session?.status === 'authenticated' && (
                <div
                  className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
                  onClick={() => router.push('/profile')}
                >
                  <GiExitDoor className="text-lg select-none text-one" />
                  <li className=" text-md sm:text-lg select-none">بروفايل</li>
                </div>
              )}
            </div>
            <div
              className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
              onClick={() => router.push('/myPosts')}
            >
              <FcConferenceCall className="text-lg select-none text-one" />
              <li className=" text-md sm:text-lg select-none text-nowrap">
                متجري
              </li>
            </div>
            <div
              className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
              onClick={() => router.push('/RealEstate')}
            >
              <FaDollarSign className="text-lg select-none text-one" />
              <li className=" text-md sm:text-lg select-none">عقارات</li>
            </div>
            <div
              className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
              onClick={() => router.push('/Cars')}
            >
              <GiPayMoney className="text-lg select-none text-one" />
              <li className=" text-md sm:text-lg select-none">سيارات</li>
            </div>
            <div
              className="flex items-center justify-start gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300"
              onClick={() => router.push('/contactUs')}
            >
              <FcConferenceCall className="text-lg select-none text-one" />
              <li className=" text-md sm:text-lg select-none text-nowrap">
                اتصل بنا
              </li>
            </div>
          </ul>
        </div>
        <div className=" p-2 min-h-72 h-full rounded my-2 bg-white xl:border border-gray-400/10  ">
          <h1 className="text-center  text-lg w-full select-none my-2  font-medium">
            ساعات العمل
          </h1>
          <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الإثنين
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الثلاثاء
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الأربعاء
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الخميس
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الجمعة
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  السبت
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FaCalendarDays className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  الأحد
                </li>
              </div>
              <span className="text-nowrap"> 09:00 - 18:00</span>
            </div>
          </ul>
        </div>
        <div className=" p-2 min-h-72 h-full rounded my-2 bg-white xl:border border-gray-400/10  ">
          <h1 className="text-center  text-lg w-full select-none my-2  font-medium">
            معلومات الإتصال
          </h1>
          <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <MdOutlineAddLocationAlt className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  سوريا - دمشق
                </li>
              </div>
              <span className="text-nowrap"> </span>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <Link
                href={'https://www.facebook.com/WaelKhamira/'}
                target="_blank"
              >
                <div className="flex gap-1 items-center">
                  <FaFacebookF className="text-lg select-none text-one" />
                  <li className=" text-md sm:text-lg select-none text-nowrap">
                    facebook
                  </li>
                </div>
                <span className="text-nowrap"> </span>
              </Link>
            </div>
            <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-lg hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
              <div className="flex gap-1 items-center">
                <FiLinkedin className="text-lg select-none text-one" />
                <li className=" text-md sm:text-lg select-none text-nowrap">
                  linkedin
                </li>
              </div>
              <span className="text-nowrap"></span>
            </div>
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
                <li className="text-md sm:text-lg text-nowrap">hotmail</li>
              </div>
              <span className="text-nowrap">
                <span className="text-nowrap">ramond.shnaidr@hotmail.com</span>
              </span>
            </div>
          </ul>
        </div>
      </footer>
    </>
  );
}
