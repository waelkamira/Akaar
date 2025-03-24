'use client';
import React from 'react';
import { FaCalendarDays, FaFacebookF } from 'react-icons/fa6'; // أيقونات من react-icons/fa6
import { FiLinkedin } from 'react-icons/fi'; // أيقونات من react-icons/fi
import { TbBrandGmail } from 'react-icons/tb'; // أيقونات من react-icons/tb
import {
  MdOutlineAddLocationAlt,
  MdOutlineAlternateEmail,
  MdOutlineSell,
  MdCarRental,
} from 'react-icons/md'; // أيقونات من react-icons/md
import { GiCarKey } from 'react-icons/gi'; // أيقونات من react-icons/gi
import { useRouter } from 'next/navigation';
import Hero from '../../components/Home/Hero';
import Card from '../../components/ReusableComponents/Card'; // تأكد من تعديل المسار حسب مكان المكون

export default function ContactUs() {
  const router = useRouter();

  // مصفوفة معلومات الاتصال
  const contactInfo = [
    {
      icon: (
        <MdOutlineAddLocationAlt className="text-lg select-none text-primary-500" />
      ),
      text: 'سوريا - دمشق',
      link: null,
    },
    {
      icon: <FaFacebookF className="text-lg select-none text-primary-500" />,
      text: 'facebook',
      link: 'https://www.facebook.com/WaelKhamira/',
    },
    {
      icon: <FiLinkedin className="text-lg select-none text-primary-500" />,
      text: 'linkedin',
      link: null,
    },
    {
      icon: <TbBrandGmail className="text-lg select-none text-primary-500" />,
      text: 'gmail',
      link: '/contactUs/byEmail',
    },
    {
      icon: (
        <MdOutlineAlternateEmail className="text-lg select-none text-primary-500" />
      ),
      text: 'hotmail',
      link: '/contactUs/byEmail',
    },
  ];

  // مصفوفة ساعات العمل
  const workingHours = [
    { day: 'الإثنين', hours: '09:00 - 18:00' },
    { day: 'الثلاثاء', hours: '09:00 - 18:00' },
    { day: 'الأربعاء', hours: '09:00 - 18:00' },
    { day: 'الخميس', hours: '09:00 - 18:00' },
    { day: 'الجمعة', hours: '09:00 - 18:00' },
    { day: 'السبت', hours: '09:00 - 18:00' },
    { day: 'الأحد', hours: '09:00 - 18:00' },
  ];

  // مصفوفة البطاقات
  const cardsData = [
    {
      cardName: 'بيع',
      path: '/newPost',
      text: 'يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو المستأجرين والملاك. يمكن للمستخدمين الاتصال بالبائعين مباشرة عبر الهاتف لطرح أي أسئلة أو استفسارات.',
      color: 'orange',
      image: 'https://i.imgur.com/uGXmBJO.jpg',
      emoji: <MdOutlineSell className="text-primary-500" />,
    },
    {
      cardName: 'شراء ',
      path: '/categories/1',
      text: 'يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي استفسارات أو مشاكل قد تواجهها أثناء استخدام الموقع 24 ساعة على مدار الإسبوع.',
      color: 'purple',
      image: 'https://i.imgur.com/qnZeVQk.jpg',
      emoji: <GiCarKey className="text-[#803084]" />,
    },
    {
      cardName: 'استأجار',
      path: '/categories/2',
      text: 'تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة. يتم تحميل صفحات الموقع بسرعة عالية، مما يقلل من وقت الانتظار ويحسن رضا المستخدمين.',
      color: 'green',
      image: 'https://i.imgur.com/sZoXjKz.png',
      emoji: <MdCarRental className="text-[#119530]" />,
    },
  ];

  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];
  return (
    <div className="absolute top-8 xl:top-16 flex flex-col justify-center items-center w-full rounded-b text-black">
      {/* <MainNavbar /> */}
      <Hero images={images} />

      <main className="flex flex-col justify-center items-center pb-16 w-full rounded-b">
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="flex flex-col justify-between items-center w-full h-full mt-2 cursor-pointer">
            {/* قسم وصف الموقع */}
            <div className="p-2 h-full rounded  text-gray-100 xl:border bg-gradient-to-r from-four to-three border-gray-300/50 shadow-2xl">
              <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                موقع متجر
              </h1>
              <div className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose p-4">
                موقع متجر هو منصة شاملة للبيع والتأجير لكل من العقارات
                والسيارات. يوفر الموقع تجربة مستخدم سلسة وممتعة مع تصميم جذاب
                وسهل الاستخدام. سواء كنت تبحث عن منزل جديد، شقة للإيجار، أو
                سيارة حديثة، فإن موقع متجر يقدم لك كل ما تحتاجه في مكان واحد.
                <h1 className="text-primary-500 w-full text-center my-4">
                  - - - -
                </h1>
                يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو
                المستأجرين والملاك. يمكن للمستخدمين الاتصال بالبائعين مباشرة عبر
                الهاتف لطرح أي أسئلة أو استفسارات.
                <h1 className="text-primary-500 w-full text-center my-4">
                  - - - -
                </h1>
                يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي
                استفسارات أو مشاكل قد تواجهها أثناء استخدام الموقع.
                <h1 className="text-primary-500 w-full text-center my-4">
                  - - - -
                </h1>
                تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة. يتم تحميل
                صفحات الموقع بسرعة عالية، مما يقلل من وقت الانتظار ويحسن رضا
                المستخدمين.
                <h1 className="text-primary-500 w-full text-center my-4">
                  - - - -
                </h1>
                في النهاية، موقع متجر هو وجهة مثالية لكل من يبحث عن خدمات البيع
                والتأجير للعقارات والسيارات.
              </div>
            </div>

            {/* قسم البطاقات */}
            <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 gap-6">
              {cardsData.map((card, index) => (
                <Card
                  key={index}
                  cardName={card.cardName}
                  path={card.path}
                  text={card.text}
                  color={card.color}
                  image={card.image}
                  emoji={card.emoji}
                />
              ))}
            </div>

            {/* قسم معلومات الاتصال */}
            <div className="w-full h-full">
              <div className="p-2 h-full rounded my-2  text-gray-100 xl:border bg-gradient-to-r from-four to-three border-gray-300/50 shadow-2xl">
                <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                  معلومات الإتصال
                </h1>
                <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                      onClick={() => info.link && router.push(info.link)}
                    >
                      <div className="flex gap-2 items-center">
                        {info.icon}
                        <li className="text-md sm:text-lg select-none text-nowrap">
                          {info.text}
                        </li>
                      </div>
                      <span className="text-nowrap"> </span>
                    </div>
                  ))}
                </ul>
              </div>

              {/* قسم ساعات العمل */}
              <div className="p-2 h-full rounded my-2  text-gray-100 xl:border bg-gradient-to-r from-four to-three border-gray-300/50 shadow-2xl">
                <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                  ساعات العمل
                </h1>
                <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
                  {workingHours.map((work, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                    >
                      <div className="flex gap-2 items-center">
                        <FaCalendarDays className="text-lg select-none text-primary-500" />
                        <li className="text-md sm:text-lg select-none text-nowrap">
                          {work.day}
                        </li>
                      </div>
                      <span className="text-nowrap">{work.hours}</span>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
