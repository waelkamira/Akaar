// 'use client';
// import React from 'react';
// import { FaCalendarDays, FaFacebookF } from 'react-icons/fa6'; // أيقونات من react-icons/fa6
// import { FiLinkedin } from 'react-icons/fi'; // أيقونات من react-icons/fi
// import { TbBrandGmail } from 'react-icons/tb'; // أيقونات من react-icons/tb
// import {
//   MdOutlineAddLocationAlt,
//   MdOutlineAlternateEmail,
//   MdOutlineSell,
//   MdCarRental,
// } from 'react-icons/md'; // أيقونات من react-icons/md
// import { GiCarKey } from 'react-icons/gi'; // أيقونات من react-icons/gi
// import { useRouter } from 'next/navigation';
// import Card from '../../components/ReusableComponents/Card'; // تأكد من تعديل المسار حسب مكان المكون
// import Image from 'next/image';
// import LoadingPhoto from '../../components/photos/LoadingPhoto';

// export default function ContactUs() {
//   const router = useRouter();

//   // مصفوفة معلومات الاتصال
//   const contactInfo = [
//     {
//       icon: (
//         <MdOutlineAddLocationAlt className="text-lg select-none text-primary-500" />
//       ),
//       text: 'سوريا - دمشق',
//       link: null,
//     },
//     {
//       icon: <FaFacebookF className="text-lg select-none text-primary-500" />,
//       text: 'facebook',
//       link: 'https://www.facebook.com/WaelKhamira/',
//     },
//     {
//       icon: <FiLinkedin className="text-lg select-none text-primary-500" />,
//       text: 'linkedin',
//       link: 'https://www.linkedin.com/in/wael-kamira-476200130/',
//     },
//     {
//       icon: <TbBrandGmail className="text-lg select-none text-primary-500" />,
//       text: 'gmail',
//       link: '/contactUs/byEmail',
//     },
//     {
//       icon: (
//         <MdOutlineAlternateEmail className="text-lg select-none text-primary-500" />
//       ),
//       text: 'hotmail',
//       link: '/contactUs/byEmail',
//     },
//   ];

//   // مصفوفة ساعات العمل
//   const workingHours = [
//     { day: 'الجمعة', hours: '09:00 - 18:00' },
//     { day: 'السبت', hours: '09:00 - 18:00' },
//     { day: 'الأحد', hours: '09:00 - 18:00' },
//     { day: 'الإثنين', hours: '09:00 - 18:00' },
//     { day: 'الثلاثاء', hours: '09:00 - 18:00' },
//     { day: 'الأربعاء', hours: '09:00 - 18:00' },
//     { day: 'الخميس', hours: '09:00 - 18:00' },
//   ];

//   // مصفوفة البطاقات
//   const cardsData = [
//     {
//       cardName: 'بيع',
//       path: '/newPost',
//       text: 'يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو المستأجرين والملاك. يمكن للمستخدمين الاتصال بالبائعين مباشرة عبر الهاتف لطرح أي أسئلة أو استفسارات.',
//       color: 'orange',
//       image: '/images/ph4.jpg',
//       emoji: <MdOutlineSell className="text-primary-500" />,
//     },
//     {
//       cardName: 'شراء ',
//       path: '/categories/1',
//       text: 'يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي استفسارات أو مشاكل قد تواجهها أثناء استخدام الموقع 24 ساعة على مدار الإسبوع.',
//       color: 'purple',
//       image: '/images/ph2.png',
//       emoji: <GiCarKey className="text-[#803084]" />,
//     },
//     {
//       cardName: 'استأجار',
//       path: '/categories/2',
//       text: 'تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة. يتم تحميل صفحات الموقع بسرعة عالية، مما يقلل من وقت الانتظار ويحسن رضا المستخدمين.',
//       color: 'green',
//       image: '/images/ph8.jpg',
//       emoji: <MdCarRental className="text-[#119530]" />,
//     },
//   ];
//   const image = '/logo.png';
//   return (
//     <main className="flex flex-col justify-center items-center sm:pb-16 w-full rounded-b mt-16 sm:mt-0">
//       <div className="flex flex-col justify-center items-center w-full xl:w-[90%]  h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
//         <div className="flex flex-col justify-between items-center w-full h-full mt-2 cursor-pointer">
//           {/* قسم البطاقات */}
//           <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 gap-6">
//             <div className="flex flex-col justify-center items-center w-full p-4 gap-6">
//               <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
//                 <div
//                   onClick={() => router.push('/')}
//                   className={`relative w-full h-[100px] overflow-visible`}
//                 >
//                   {!image && <LoadingPhoto />}
//                   {Image && (
//                     <Image
//                       src={image}
//                       layout="fill"
//                       objectFit="contain"
//                       alt={'image'}
//                       priority={false}
//                     />
//                   )}
//                 </div>
//               </h1>
//               <div className="flex flex-col md:flex-row justify-center items-center w-full p-4 gap-6">
//                 {cardsData.map((card, index) => (
//                   <Card
//                     key={index}
//                     cardName={card.cardName}
//                     path={card.path}
//                     text={card.text}
//                     color={card.color}
//                     image={card.image}
//                     emoji={card.emoji}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//           {/* قسم وصف الموقع */}
//           <div className="p-2 h-full rounded   xl:border  border-gray-300/50 shadow-md">
//             <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
//               موقع متجر
//             </h1>
//             <div className="text-start w-full select-none my-2 text-sm xl:text-lg leading-loose p-4">
//               موقع متجر هو منصة شاملة للبيع والتأجير لكل من العقارات والسيارات
//               وجميع أشكال السلع بمختلف أنواعها يوفر الموقع تجربة مستخدم سلسة
//               وممتعة مع تصميم جذاب وسهل الاستخدام. سواء كنت تبحث عن منزل جديد،
//               شقة للإيجار، أو سيارة حديثة، فإن موقع متجر يقدم لك كل ما تحتاجه في
//               مكان واحد.
//               <h1 className="text-primary-500 w-full text-center my-4">
//                 - - - -
//               </h1>
//               يوفر موقع متجر إمكانية التواصل المباشر بين البائعين والمشترين أو
//               المستأجرين والملاك. يمكن للمستخدمين الاتصال بالبائعين مباشرة عبر
//               الهاتف لطرح أي أسئلة أو استفسارات.
//               <h1 className="text-primary-500 w-full text-center my-4">
//                 - - - -
//               </h1>
//               يحتوي موقع متجر على قسم خاص للمساعدة والدعم الفني لضمان حل أي
//               استفسارات أو مشاكل قد تواجهها أثناء استخدام الموقع.
//               <h1 className="text-primary-500 w-full text-center my-4">
//                 - - - -
//               </h1>
//               تصميم موقع متجر يركز على توفير تجربة تصفح سلسة وسريعة. يتم تحميل
//               صفحات الموقع بسرعة عالية، مما يقلل من وقت الانتظار ويحسن رضا
//               المستخدمين.
//               <h1 className="text-primary-500 w-full text-center my-4">
//                 - - - -
//               </h1>
//               في النهاية، موقع متجر هو وجهة مثالية لكل من يبحث عن خدمات البيع
//               .والتأجير للعقارات والسيارات ,و بيع المنتجات بمختلف أنواعها
//             </div>
//           </div>
//           {/* قسم معلومات الاتصال */}
//           <div className="w-full h-full">
//             {/* قسم معلومات الاتصال */}
//             <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
//               <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
//                 معلومات الإتصال
//               </h1>
//               <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
//                 {contactInfo.map((info, index) =>
//                   info.link ? (
//                     // للروابط الخارجية التي تفتح في نافذة جديدة
//                     <a
//                       key={index}
//                       href={info.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
//                     >
//                       <div className="flex gap-2 items-center">
//                         {info.icon}
//                         <span className="text-md sm:text-lg select-none text-nowrap">
//                           {info.text}
//                         </span>
//                       </div>
//                     </a>
//                   ) : (
//                     // للروابط الداخلية
//                     <div
//                       key={index}
//                       onClick={() => router.push(info.internalLink)}
//                       className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
//                     >
//                       <div className="flex gap-2 items-center">
//                         {info.icon}
//                         <span className="text-md sm:text-lg select-none text-nowrap">
//                           {info.text}
//                         </span>
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </ul>
//             </div>

//             {/* قسم ساعات العمل */}
//             <div className="p-2 h-full rounded my-2 xl:border border-gray-300/50 shadow-md">
//               <h1 className="text-center text-2xl w-full select-none my-4 font-bold">
//                 ساعات العمل
//               </h1>
//               <ul className="flex flex-col justify-start gap-4 items-start h-full w-full p-4">
//                 {workingHours.map((work, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between gap-2 w-full hover:bg-white hover:bg-opacity-20 rounded-lg hover:scale-[101%] hover:cursor-pointer px-4 py-2 transition-all duration-300"
//                   >
//                     <div className="flex gap-2 items-center">
//                       <FaCalendarDays className="text-lg select-none text-primary-500" />
//                       <span className="text-md sm:text-lg select-none text-nowrap">
//                         {work.day}
//                       </span>
//                     </div>
//                     <span className="text-nowrap">{work.hours}</span>
//                   </div>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
'use client';

import React from 'react';
// ✅ تم تصحيح الاسم من FaCheckCircle إلى FaCircleCheck
import { FaCalendarDays, FaFacebookF, FaCircleCheck } from 'react-icons/fa6';
import { FiLinkedin } from 'react-icons/fi';
import { TbBrandGmail } from 'react-icons/tb';
import {
  MdOutlineAddLocationAlt,
  MdOutlineAlternateEmail,
  MdOutlineSell,
  MdCarRental,
  MdSupportAgent,
  MdSpeed,
} from 'react-icons/md';
import { GiCarKey } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import Card from '../../components/ReusableComponents/Card';
import Image from 'next/image';
import LoadingPhoto from '../../components/photos/LoadingPhoto';
import { motion } from 'framer-motion';

export default function ContactUs() {
  const router = useRouter();
  const logoImage = '/images/matjar.png';

  const contactInfo = [
    {
      icon: <MdOutlineAddLocationAlt className="text-xl text-orange-500" />,
      text: 'سوريا - دمشق',
      link: null,
    },
    {
      icon: <FaFacebookF className="text-xl text-blue-500" />,
      text: 'Facebook',
      link: 'https://www.facebook.com/WaelKhamira/',
    },
    {
      icon: <FiLinkedin className="text-xl text-blue-600" />,
      text: 'LinkedIn',
      link: 'https://www.linkedin.com/in/wael-kamira-476200130/',
    },
    {
      icon: <TbBrandGmail className="text-xl text-red-500" />,
      text: 'Gmail',
      link: '/contactUs/byEmail',
    },
    {
      icon: <MdOutlineAlternateEmail className="text-xl text-sky-500" />,
      text: 'Hotmail',
      link: '/contactUs/byEmail',
    },
  ];

  const workingHours = [
    { day: 'الجمعة', hours: '09:00 - 18:00' },
    { day: 'السبت', hours: '09:00 - 18:00' },
    { day: 'الأحد', hours: '09:00 - 18:00' },
    { day: 'الإثنين', hours: '09:00 - 18:00' },
    { day: 'الثلاثاء', hours: '09:00 - 18:00' },
    { day: 'الأربعاء', hours: '09:00 - 18:00' },
    { day: 'الخميس', hours: '09:00 - 18:00' },
  ];

  const cardsData = [
    {
      cardName: 'بيع',
      path: '/newPost',
      text: 'تواصل مباشر بين البائعين والمشترين لطرح الاستفسارات وإتمام الصفقات بسهولة وأمان.',
      color: 'orange',
      image: '/images/ph4.jpg',
      emoji: <MdOutlineSell className="text-3xl text-orange-500" />,
    },
    {
      cardName: 'شراء',
      path: '/categories/1',
      text: 'قسم خاص للمساعدة والدعم الفني لضمان حل أي استفسارات قد تواجهك على مدار الساعة.',
      color: 'purple',
      image: '/images/ph2.png',
      emoji: <GiCarKey className="text-3xl text-purple-500" />,
    },
    {
      cardName: 'استئجار',
      path: '/categories/2',
      text: 'تجربة تصفح سلسة وسريعة مع تحميل فوري للصفحات لضمان أفضل تجربة مستخدم ممكنة.',
      color: 'green',
      image: '/images/ph8.jpg',
      emoji: <MdCarRental className="text-3xl text-emerald-500" />,
    },
  ];

  const features = [
    {
      icon: <MdOutlineSell className="text-2xl text-orange-500" />,
      title: 'منصة شاملة',
      desc: 'لبيع وتأجير العقارات، السيارات، وجميع أشكال السلع بمختلف أنواعها في مكان واحد.',
    },
    {
      icon: <MdSupportAgent className="text-2xl text-amber-500" />,
      title: 'تواصل مباشر',
      desc: 'إمكانية الاتصال بالبائعين أو الملاك مباشرة عبر الهاتف لطرح أي أسئلة أو استفسارات.',
    },
    {
      // ✅ تم تحديث الاستخدام هنا أيضاً
      icon: <FaCircleCheck className="text-2xl text-emerald-500" />,
      title: 'دعم فني متواصل',
      desc: 'قسم خاص للمساعدة لضمان حل أي مشاكل قد تواجهك أثناء استخدام الموقع بسرعة.',
    },
    {
      icon: <MdSpeed className="text-2xl text-blue-500" />,
      title: 'أداء وسرعة',
      desc: 'تصميم يركز على توفير تجربة تصفح سلسة مع تحميل صفحات عالي السرعة.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          CONTACT
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header & Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative w-1/2 h-40 mx-auto mb-6 group cursor-pointer" onClick={() => router.push('/')}>
            {!logoImage ? (
              <LoadingPhoto />
            ) : (
              <div className="w-full h-full relative rounded-3xl overflow-hidden bg-neutral-900/50 border border-neutral-800 p-4 group-hover:border-orange-500/30 transition-all">
                <Image
                  src={logoImage}
                  fill
                  className="object-contain"
                  alt="شعار موقع متجر"
                  priority
                />
              </div>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">موقع متجر</h1>
          <p className="text-white max-w-2xl mx-auto">
            وجهتك المثالية لكل من يبحث عن خدمات البيع والتأجير للعقارات والسيارات والمنتجات بمختلف أنواعها.
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {cardsData.map((card, index) => (
            <div key={index} className="h-full">
              <Card
                cardName={card.cardName}
                path={card.path}
                text={card.text}
                color={card.color}
                image={card.image}
                emoji={card.emoji}
              />
            </div>
          ))}
        </motion.div>

        {/* Main Content Split: About (Left/Top) & Contact Info (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Column (Main): About Site Features */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                لماذا تختار موقع متجر؟
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl bg-neutral-800/30 border border-neutral-700/50 hover:border-orange-500/30 transition-all group">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-orange-600/10 to-amber-600/10 border border-orange-500/20 rounded-2xl">
                <p className="text-neutral-300 leading-loose text-center font-medium">
                  في النهاية، موقع متجر هو وجهة مثالية تجمع بين <span className="text-orange-400 font-bold">المصداقية</span>، <span className="text-orange-400 font-bold">السرعة</span>، و <span className="text-orange-400 font-bold">سهولة الاستخدام</span> لتلبية جميع احتياجاتك من بيع وشراء وتأجير.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Left Column (Sidebar): Contact & Hours */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Contact Info Card */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <MdOutlineAlternateEmail className="text-orange-500 text-2xl" />
                معلومات الاتصال
              </h2>
              <ul className="space-y-3">
                {contactInfo.map((info, index) => {
                  const content = (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                        {info.icon}
                      </div>
                      <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                        {info.text}
                      </span>
                    </div>
                  );

                  return info.link ? (
                    <a
                      key={index}
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center p-3 rounded-xl hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700 transition-all duration-300 group"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-xl hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700 transition-all duration-300 group cursor-pointer"
                    >
                      {content}
                    </div>
                  );
                })}
              </ul>
            </div>

            {/* Working Hours Card */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl lg:sticky lg:top-24">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <FaCalendarDays className="text-amber-500 text-xl" />
                ساعات العمل
              </h2>
              <ul className="space-y-2">
                {workingHours.map((work, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/30 border border-neutral-700/30 hover:border-amber-500/30 transition-all"
                  >
                    <span className="text-neutral-300 font-medium">{work.day}</span>
                    <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">
                      {work.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}