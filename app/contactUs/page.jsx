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
import MiddleBarAndPhoto from '../../components/RealEstate/RealEstateSideBar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MainNavbar from '../../components/navbars/MainNavbar';
import HeroSlider from '../../components/photos/HeroSlider';

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];
  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b text-black">
      <MainNavbar />

      <HeroSlider images={images} />

      <main className="flex flex-col justify-center items-center pb-16 w-full rounded-b">
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex flex-col justify-between items-center w-full h-full mt-2 cursor-pointer">
            <div className="p-2 min-h-72 h-full rounded bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
              <h1 className="text-center  text-lg w-full select-none my-2 font-bold">
                موقع متجر
              </h1>
              <div className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose  p-4">
                موقع متجر هو منصة شاملة للبيع والتأجير لكل من العقارات
                والسيارات. يوفر الموقع تجربة مستخدم سلسة وممتعة مع تصميم جذاب
                وسهل الاستخدام. سواء كنت تبحث عن منزل جديد، شقة للإيجار، أو
                سيارة حديثة، فإن موقع متجر يقدم لك كل ما تحتاجه في مكان واحد.
                يتميز موقع متجر بخاصية البحث المتقدمة التي تتيح للمستخدمين
                إمكانية البحث بسهولة عن العقارات والسيارات المفضلة لديهم. يمكنك
                استخدام مجموعة متنوعة من الفلاتر مثل الموقع، السعر، عدد الغرف،
                المساحة، وغيرها لتحديد النتائج بدقة. كما يتم تحديث نتائج البحث
                بشكل فوري عند تغيير أي من هذه الفلاتر، مما يجعل عملية البحث أكثر
                كفاءة وفعالية.
                <h1 className="text-one w-full text-center">- - - -</h1>
                يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو
                المستأجرين والملاك. يمكن للمستخدمين الاتصال بالبائعين مباشرة عبر
                الهاتف لطرح أي أسئلة أو استفسارات. هذا يساعد على بناء الثقة
                والتواصل الفعال بين جميع الأطراف المعنية، مما يزيد من فرص إتمام
                الصفقات بنجاح.
                <h1 className="text-one w-full text-center">- - - -</h1>
                يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي
                استفسارات أو مشاكل قد تواجهها أثناء استخدام الموقع. فريق الدعم
                متواجد 24/7 للرد على أي استفسارات وتوفير الدعم اللازم
                للمستخدمين. بالإضافة إلى ذلك، يوجد دليل مستخدم شامل يشرح كيفية
                استخدام مختلف ميزات الموقع وخدماته.
                <h1 className="text-one w-full text-center">- - - -</h1>
                تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة. يتم تحميل
                صفحات الموقع بسرعة عالية، مما يقلل من وقت الانتظار ويحسن رضا
                المستخدمين. كما تم تحسين الموقع ليكون متجاوبًا مع جميع أجهزة
                الكمبيوتر المحمولة والهواتف الذكية، مما يتيح للمستخدمين الوصول
                إلى خدماتك من أي مكان وفي أي وقت.
                <h1 className="text-one w-full text-center">- - - -</h1>
                في النهاية، موقع متجر هو وجهة مثالية لكل من يبحث عن خدمات البيع
                والتأجير للعقارات والسيارات. يجمع بين التصميم الجذاب، والوظائف
                العملية، والخدمة الممتازة لتقديم تجربة استثنائية للمستخدمين.
                سواء كنت ترغب في شراء منزل جديد، أو تأجير سيارة لرحلة قصيرة، فإن
                موقع متجر يوفر لك كل ما تحتاجه في مكان واحد.
              </div>
            </div>
            <div className="w-full">
              <div className=" p-2 min-h-72 h-full rounded my-2 bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
                <h1 className="text-center  text-lg w-full select-none my-2 font-bold">
                  معلومات الإتصال
                </h1>
                <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <MdOutlineAddLocationAlt className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        سوريا - دمشق
                      </li>
                    </div>
                    <span className="text-nowrap"> </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
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
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FiLinkedin className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        linkedin
                      </li>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer px-2 xl:px-8 h-6 transition-all duration-300"
                    onClick={() => router.push('/contactUs/byEmail')} // إضافة حدث النقر
                  >
                    <div className="flex gap-1 items-center">
                      <TbBrandGmail className="text-lg select-none text-one" />
                      <li className="text-md sm:text-lg text-nowrap">gmail </li>
                    </div>
                  </div>
                  <div
                    className="flex flex-col sm:flex-row items-start justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer px-2 xl:px-8 h-6 transition-all duration-300"
                    onClick={() => router.push('/contactUs/byEmail')} // إضافة حدث النقر
                  >
                    <div className="flex gap-1 items-center">
                      <MdOutlineAlternateEmail className="text-lg select-none text-one" />
                      <li className="text-md sm:text-lg text-nowrap">
                        hotmail
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
              <div className=" p-2 min-h-72 h-full rounded my-2 bg-gray-400/5 xl:bg-transparent xl:border border-gray-400/10 ">
                <h1 className="text-center  text-lg w-full select-none my-2 font-bold">
                  ساعات العمل
                </h1>
                <ul className="flex flex-col justify-start gap-2 items-start h-20 w-full">
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الإثنين
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الثلاثاء
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الأربعاء
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الخميس
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        الجمعة
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
                    <div className="flex gap-1 items-center">
                      <FaCalendarDays className="text-lg select-none text-one" />
                      <li className=" text-md sm:text-lg select-none text-nowrap">
                        السبت
                      </li>
                    </div>
                    <span className="text-nowrap"> 09:00 - 18:00</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 w-full  hover:border border-one rounded-[5px] hover:scale-[101%] hover:cursor-pointer  px-2 xl:px-8 h-6 transition-all duration-300">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
