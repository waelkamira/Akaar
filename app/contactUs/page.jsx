'use client';
import { Suspense } from 'react';
import { FaCalendarDays, FaFacebookF } from 'react-icons/fa6';
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail } from 'react-icons/tb';
import {
  MdOutlineAddLocationAlt,
  MdOutlineAlternateEmail,
  MdOutlineSell,
  MdCarRental,
} from 'react-icons/md';
import { GiCarKey } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import Card from '../../components/ReusableComponents/Card';
import Image from 'next/image';
import LoadingPhoto from '../../components/photos/LoadingPhoto';

function ContactUsContent() {
  const router = useRouter();

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
      link: 'https://www.linkedin.com/in/wael-kamira-476200130/',
    },
    {
      icon: <TbBrandGmail className="text-lg select-none text-primary-500" />,
      text: 'gmail',
      link: '/byEmail',
    },
    {
      icon: (
        <MdOutlineAlternateEmail className="text-lg select-none text-primary-500" />
      ),
      text: 'hotmail',
      link: '/byEmail',
    },
  ];

  const workingHours = [
    { day: 'الإثنين', hours: '09:00 - 18:00' },
    { day: 'الثلاثاء', hours: '09:00 - 18:00' },
    { day: 'الأربعاء', hours: '09:00 - 18:00' },
    { day: 'الخميس', hours: '09:00 - 18:00' },
    { day: 'الجمعة', hours: '09:00 - 18:00' },
    { day: 'السبت', hours: '09:00 - 18:00' },
    { day: 'الأحد', hours: '09:00 - 18:00' },
  ];

  const cardsData = [
    {
      cardName: 'بيع',
      path: '/newPost',
      text: 'يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو المستأجرين والملاك.',
      color: 'orange',
      image: 'https://i.imgur.com/uGXmBJO.jpg',
      emoji: <MdOutlineSell className="text-primary-500" />,
    },
    {
      cardName: 'شراء',
      path: '/categories/1',
      text: 'يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي استفسارات.',
      color: 'purple',
      image: 'https://i.imgur.com/qnZeVQk.jpg',
      emoji: <GiCarKey className="text-[#803084]" />,
    },
    {
      cardName: 'استأجار',
      path: '/categories/2',
      text: 'تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة.',
      color: 'green',
      image: 'https://i.imgur.com/sZoXjKz.png',
      emoji: <MdCarRental className="text-[#119530]" />,
    },
  ];

  const image = '/logo.png';

  return (
    <div className="flex flex-col justify-center items-center sm:pb-16 w-full rounded-b">
      <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
        <div className="flex flex-col justify-between items-center w-full h-full mt-2 cursor-pointer">
          <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 gap-6">
            <div className="flex flex-col justify-center items-center w-full p-4 gap-6">
              <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                <div className="relative w-full h-[100px] overflow-visible">
                  {!image && <LoadingPhoto />}
                  {image && (
                    <Image
                      src={image}
                      layout="fill"
                      objectFit="contain"
                      alt={'logo'}
                      priority={false}
                    />
                  )}
                </div>
              </h1>
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
            </div>
          </div>

          <div className="p-2 h-full rounded xl:border border-gray-300/50 shadow-md">
            <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
              موقع متجر
            </h1>
            <div className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose p-4">
              موقع متجر هو منصة شاملة للبيع والتأجير لكل من العقارات والسيارات.
              <h1 className="text-primary-500 w-full text-center my-4">
                - - - -
              </h1>
              يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين.
              <h1 className="text-primary-500 w-full text-center my-4">
                - - - -
              </h1>
              يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني.
              <h1 className="text-primary-500 w-full text-center my-4">
                - - - -
              </h1>
              تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة.
            </div>
          </div>

          <div className="w-full h-full">
            <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
              <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
                معلومات الإتصال
              </h1>
              <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
                {contactInfo.map((info, index) =>
                  info.link ? (
                    <a
                      key={index}
                      href={info.link}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                    >
                      <div className="flex gap-2 items-center">
                        {info.icon}
                        <span className="text-md sm:text-lg select-none text-nowrap">
                          {info.text}
                        </span>
                      </div>
                    </a>
                  ) : (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
                    >
                      <div className="flex gap-2 items-center">
                        {info.icon}
                        <span className="text-md sm:text-lg select-none text-nowrap">
                          {info.text}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </ul>
            </div>

            <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
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
                      <span className="text-md sm:text-lg select-none text-nowrap">
                        {work.day}
                      </span>
                    </div>
                    <span className="text-nowrap">{work.hours}</span>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactUs() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <ContactUsContent />
    </Suspense>
  );
}
