// 'use client';
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import {
//   Home,
//   Heart,
//   PlusCircle,
//   MessageCircle,
//   User,
//   LogIn,
//   MapPin,
//   Facebook,
//   Linkedin,
//   Mail,
//   ArrowDown,
//   Instagram,
//   Twitter,
//   Phone,
// } from 'lucide-react';

// export default function Footer() {
//   const session = useSession();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const images = [
//     '/images/image (1).jpg',
//     '/images/image (2).jpg',
//     '/images/image (3).jpg',
//     '/images/image (4).jpg',
//     '/images/image (5).jpg',
//     '/images/image (6).jpg',
//     '/images/image (7).jpg',
//     '/images/image (8).jpg',
//     '/images/image (9).jpg',
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [images.length]);

//   const quickLinks = [
//     { name: 'الرئيسية', path: '/', icon: <Home size={16} className="ml-2" /> },
//     {
//       name: 'المفضلة',
//       path: '/favorite',
//       icon: <Heart size={16} className="ml-2" />,
//     },
//     {
//       name: 'إنشاء إعلان',
//       path: '/newPost',
//       icon: <PlusCircle size={16} className="ml-2" />,
//     },
//     {
//       name: 'متجري',
//       path: '/posts',
//       icon: <User size={16} className="ml-2" />,
//     },
//     {
//       name: 'اتصل بنا',
//       path: '/contactUs',
//       icon: <MessageCircle size={16} className="ml-2" />,
//     },
//     { name: 'من نحن', path: '/about', icon: <User size={16} className="ml-2" /> },
//     { name: 'الشروط والأحكام', path: '/terms', icon: <PlusCircle size={16} className="ml-2" /> },
//     { name: 'سياسة الخصوصية', path: '/privacy', icon: <Heart size={16} className="ml-2" /> },
//   ];

//   const socialLinks = [
//     {
//       name: 'Facebook',
//       href: 'https://facebook.com',
//       icon: <Facebook size={16} className="ml-2" />,
//     },
//     {
//       name: 'LinkedIn',
//       href: 'https://linkedin.com',
//       icon: <Linkedin size={16} className="ml-2" />,
//     },
//     {
//       name: 'Instagram',
//       href: 'https://instagram.com',
//       icon: <Instagram size={16} className="ml-2" />,
//     },
//     {
//       name: 'Twitter',
//       href: 'https://twitter.com',
//       icon: <Twitter size={16} className="ml-2" />,
//     },
//   ];

//   const workingHours = [
//     { day: 'الاثنين', hours: '09:00 - 18:00' },
//     { day: 'الثلاثاء', hours: '09:00 - 18:00' },
//     { day: 'الأربعاء', hours: '09:00 - 18:00' },
//     { day: 'الخميس', hours: '09:00 - 18:00' },
//     { day: 'الجمعة', hours: '09:00 - 18:00' },
//     { day: 'السبت', hours: '09:00 - 18:00' },
//     { day: 'الأحد', hours: '09:00 - 18:00' },
//   ];

//   return (
//     <footer className="bg-neutral-900 text-white w-full">
//       {/* App Download Section */}
//       <div className="bg-gradient-to-br from-primary-600 to-primary-400 py-12">
//         <div className="container-custom mx-auto">
//           <div className="flex flex-col lg:flex-row items-center justify-between">
//             {/* Image Slider */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden mb-8 lg:mb-0"
//             >
//               <motion.div
//                 key={currentImageIndex}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="absolute inset-0"
//               >
//                 <Image
//                   src={images[currentImageIndex] || '/placeholder.svg'}
//                   alt={`Image ${currentImageIndex + 1}`}
//                   fill
//                   sizes="(max-width: 768px) 256px, 320px"
//                   className="object-cover rounded-lg"
//                 />
//               </motion.div>
//             </motion.div>

//             {/* Download Info */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="lg:w-1/2 text-center lg:text-right"
//             >
//               <h2 className="text-2xl lg:text-3xl font-bold mb-4">
//                 حمل تطبيقنا الآن
//               </h2>
//               <p className="text-white/80 mb-6 max-w-lg mx-auto lg:mr-0">
//                 استمتع بتجربة تصفح أفضل وإشعارات فورية للإعلانات الجديدة. متاح
//                 الآن للتحميل المباشر.
//               </p>

//               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium"
//                 >
//                   <ArrowDown size={18} />
//                   <span>تحميل التطبيق</span>
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Main Footer */}
//       <div className="py-12">
//         <div className="container-custom mx-auto">
//           {/* Top Section */}
//           <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12">
//             {/* Logo and Description */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//               className="mb-8 md:mb-0 text-center md:text-right md:w-1/3"
//             >
//               <Link href="/" className="inline-block mb-4">
//                 <div className="relative h-16 w-48 hover:scale-105 transition-transform duration-300">
//                   <Image
//                     src="/images/matjar.png"
//                     fill
//                     className="object-contain"
//                     alt="Matjar Logo"
//                   />
//                 </div>
//               </Link>
//               <p className="text-neutral-400 max-w-md">
//                 يتميز موقع عقار بخاصية البحث المتقدمة، مما يسمح للمستخدمين
//                 بالبحث بسهولة عن العقارات والسيارات. كما يوفر الموقع إمكانية
//                 التواصل المباشر بين البائعين والمشترين، مما يعزز الثقة ويسهل
//                 إتمام الصفقات بنجاح.
//               </p>
//             </motion.div>

//             {/* Quick Links */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: true }}
//               className="mb-8 md:mb-0"
//             >
//               <h3 className="text-xl font-semibold mb-6 text-primary-500">
//                 روابط سريعة
//               </h3>
//               <ul className="space-y-3">
//                 {quickLinks.map((link, index) => (
//                   <li key={index}>
//                     <Link
//                       href={link.path}
//                       className="flex items-center text-neutral-400 hover:text-primary-500 transition-colors duration-200"
//                     >
//                       {link.icon}
//                       <span>{link.name}</span>
//                     </Link>
//                   </li>
//                 ))}
//                 {session?.status === 'unauthenticated' ? (
//                   <li>
//                     <Link
//                       href="/login"
//                       className="flex items-center text-neutral-400 hover:text-primary-500 transition-colors duration-200"
//                     >
//                       <LogIn size={16} className="ml-2" />
//                       <span>تسجيل الدخول</span>
//                     </Link>
//                   </li>
//                 ) : (
//                   <li>
//                     <Link
//                       href="/profile"
//                       className="flex items-center text-neutral-400 hover:text-primary-500 transition-colors duration-200"
//                     >
//                       <User size={16} className="ml-2" />
//                       <span>الملف الشخصي</span>
//                     </Link>
//                   </li>
//                 )}
//               </ul>
//             </motion.div>

//             {/* Contact Info */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-xl font-semibold mb-6 text-primary-500">
//                 معلومات الاتصال
//               </h3>
//               <ul className="space-y-3">
//                 <li className="flex items-center text-neutral-400">
//                   <MapPin size={16} className="ml-2 text-primary-500" />
//                   <span>سوريا - دمشق</span>
//                 </li>
//                 <li className="flex items-center text-neutral-400">
//                   <Phone size={16} className="ml-2 text-primary-500" />
//                   <span>+963 11 123 4567</span>
//                 </li>
//                 <li className="flex items-center text-neutral-400">
//                   <Mail size={16} className="ml-2 text-primary-500" />
//                   <span>info@Matjar.com</span>
//                 </li>

//                 {/* Social Media */}
//                 <li className="pt-3">
//                   <div className="flex items-center gap-2">
//                     {socialLinks.map((social, index) => (
//                       <a
//                         key={index}
//                         href={social.href}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-500 hover:text-white transition-colors duration-200"
//                         aria-label={social.name}
//                       >
//                         {React.cloneElement(social.icon, {
//                           size: 14,
//                           className: '',
//                         })}
//                       </a>
//                     ))}
//                   </div>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* Working Hours */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-xl font-semibold mb-6 text-primary-500">
//                 ساعات العمل
//               </h3>
//               <ul className="space-y-2">
//                 {workingHours.map((item, index) => (
//                   <li
//                     key={index}
//                     className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2"
//                   >
//                     <span className="text-neutral-400">{item.day}</span>
//                     <span className="text-primary-500 font-medium">
//                       {item.hours}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           </div>

//           {/* Bottom Section */}
//           <div className="pt-8 border-t border-neutral-800 text-center">
//             <p className="text-neutral-500 text-sm">
//               Copyright © {new Date().getFullYear()} Matjar. جميع الحقوق محفوظة
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import {
//   Home,
//   Heart,
//   PlusCircle,
//   MessageCircle,
//   User,
//   LogIn,
//   MapPin,
//   Facebook,
//   Linkedin,
//   Mail,
//   ArrowDown,
//   Instagram,
//   Twitter,
//   Phone,
//   ChevronLeft,
//   Clock,
//   Download,
// } from 'lucide-react';

// export default function Footer() {
//   const session = useSession();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const images = [
//     '/images/image (1).jpg',
//     '/images/image (2).jpg',
//     '/images/image (3).jpg',
//     '/images/image (4).jpg',
//     '/images/image (5).jpg',
//     '/images/image (6).jpg',
//     '/images/image (7).jpg',
//     '/images/image (8).jpg',
//     '/images/image (9).jpg',
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [images.length]);

//   const quickLinks = [
//     { name: 'الرئيسية', path: '/', icon: <Home size={16} /> },
//     { name: 'المفضلة', path: '/favorite', icon: <Heart size={16} /> },
//     { name: 'إنشاء إعلان', path: '/newPost', icon: <PlusCircle size={16} /> },
//     { name: 'إعلاناتي', path: '/posts', icon: <User size={16} /> },
//     { name: 'اتصل بنا', path: '/contactUs', icon: <MessageCircle size={16} /> },
//     { name: 'الشروط والأحكام', path: '/terms', icon: <PlusCircle size={16} /> },
//     { name: 'سياسة الخصوصية', path: '/privacy', icon: <Heart size={16} /> },
//   ];

//   const socialLinks = [
//     { name: 'Facebook', href: 'https://facebook.com', icon: <Facebook size={18} /> },
//     { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin size={18} /> },
//     { name: 'Instagram', href: 'https://instagram.com', icon: <Instagram size={18} /> },
//     { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter size={18} /> },
//   ];

//   const workingHours = [
//     { day: 'السبت - الخميس', hours: '09:00 ص - 06:00 م' },
//     { day: 'الجمعة', hours: 'إجازة أسبوعية' },
//   ];

//   // متغيرات الحركة للدخول الانسيابي
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.15, delayChildren: 0.2 },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
//   };

//   return (
//     <footer className="relative bg-neutral-950 text-white overflow-hidden" dir="rtl">
//       {/* خلفية متوهجة علوية للفوتر */}
//       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
//       <div className="absolute -top-40 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
//       <div className="absolute -top-40 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">

//         {/* ================= القسم العلوي: عرض التطبيق ================= */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="relative mb-20"
//         >
//           <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-3xl blur-2xl -z-10" />
//           <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

//               {/* عرض الصور المتحرك بشكل أنيق */}
//               <motion.div
//                 className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-neutral-700 shadow-2xl shrink-0 group"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {images.map((img, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: currentImageIndex === index ? 1 : 0 }}
//                     transition={{ duration: 0.8 }}
//                     className="absolute inset-0"
//                   >
//                     <Image
//                       src={img}
//                       alt={`عرض ${index + 1}`}
//                       fill
//                       sizes="(max-width: 768px) 192px, 256px"
//                       className="object-cover"
//                     />
//                   </motion.div>
//                 ))}
//                 {/* لمعان فوق الصورة */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none" />
//               </motion.div>

//               {/* معلومات التحميل */}
//               <div className="flex-1 text-center lg:text-right">
//                 <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
//                   <Download size={16} className="text-orange-400" />
//                   <span className="text-sm font-bold text-orange-400">تطبيق متجر متاح الآن</span>
//                 </div>
//                 <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
//                   حمل تطبيقنا واستمتع بتجربة <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">استثنائية</span>
//                 </h2>
//                 <p className="text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
//                   تصفح آلاف الإعلانات، احفظ مفضلاتك، وتواصل مع البائعين مباشرة بكل سهولة وسرعة. متاح للتحميل على جميع الأجهزة.
//                 </p>

//                 <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-orange-600/20 transition-all duration-300 w-full sm:w-auto justify-center"
//                   >
//                     <Download size={20} />
//                     <span>تحميل التطبيق مباشرة</span>
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 w-full sm:w-auto justify-center"
//                   >
//                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
//                     <span>App Store</span>
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* ================= القسم الرئيسي: الشبكة ================= */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
//         >

//           {/* العمود 1: العلامة التجارية */}
//           <motion.div variants={itemVariants} className="space-y-6">
//             <Link href="/" className="inline-block group">
//               <div className="relative h-32 w-56 hover:scale-105 transition-transform duration-300">
//                 <Image src="/images/matjar.png" fill className="object-contain" alt="Matjar Logo" />
//               </div>
//             </Link>
//             <p className="text-neutral-400 leading-relaxed text-sm">
//               منصة متجر هي وجهتك الأولى والموثوقة للبيع والشراء وتأجير العقارات والسيارات وجميع المنتجات. نوفر لك بيئة آمنة وسريعة لإتمام صفقاتك بنجاح.
//             </p>

//             {/* شارات الثقة */}
//             <div className="flex items-center gap-3 pt-2">
//               <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400">
//                 <MapPin size={18} />
//               </div>
//               <div>
//                 <p className="text-xs text-neutral-500">المقر الرئيسي</p>
//                 <p className="text-sm font-bold text-white">سوريا - دمشق</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* العمود 2: روابط سريعة */}
//           <motion.div variants={itemVariants}>
//             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
//               <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
//               روابط سريعة
//             </h3>
//             <ul className="space-y-3">
//               {quickLinks.map((link, index) => (
//                 <li key={index}>
//                   <Link
//                     href={link.path}
//                     className="group flex items-center gap-2 text-neutral-400 hover:text-orange-400 transition-all duration-300"
//                   >
//                     <span className="group-hover:-translate-x-1 transition-transform duration-300">
//                       {link.icon}
//                     </span>
//                     <span className="group-hover:font-medium">{link.name}</span>
//                   </Link>
//                 </li>
//               ))}
//               {session?.status === 'unauthenticated' ? (
//                 <li>
//                   <Link href="/login" className="group flex items-center gap-2 text-neutral-400 hover:text-orange-400 transition-all duration-300">
//                     <span className="group-hover:-translate-x-1 transition-transform duration-300"><LogIn size={16} /></span>
//                     <span className="group-hover:font-medium">تسجيل الدخول</span>
//                   </Link>
//                 </li>
//               ) : (
//                 <li>
//                   <Link href="/profile" className="group flex items-center gap-2 text-neutral-400 hover:text-orange-400 transition-all duration-300">
//                     <span className="group-hover:-translate-x-1 transition-transform duration-300"><User size={16} /></span>
//                     <span className="group-hover:font-medium">الملف الشخصي</span>
//                   </Link>
//                 </li>
//               )}
//             </ul>
//           </motion.div>

//           {/* العمود 3: معلومات الاتصال */}
//           <motion.div variants={itemVariants}>
//             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
//               <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
//               تواصل معنا
//             </h3>
//             <ul className="space-y-4 mb-6">
//               <li className="flex items-center gap-3 text-neutral-400 group">
//                 <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-all">
//                   <Phone size={16} />
//                 </div>
//                 <span className="group-hover:text-white transition-colors dir-ltr text-right">+963 11 123 4567</span>
//               </li>
//               <li className="flex items-center gap-3 text-neutral-400 group">
//                 <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-all">
//                   <Mail size={16} />
//                 </div>
//                 <span className="group-hover:text-white transition-colors">info@Matjar.com</span>
//               </li>
//             </ul>

//             {/* أيقونات التواصل الاجتماعي */}
//             <div className="flex items-center gap-3">
//               {socialLinks.map((social, index) => (
//                 <a
//                   key={index}
//                   href={social.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/30 transition-all duration-300 hover:-translate-y-1"
//                   aria-label={social.name}
//                 >
//                   {social.icon}
//                 </a>
//               ))}
//             </div>
//           </motion.div>

//           {/* العمود 4: ساعات العمل */}
//           <motion.div variants={itemVariants}>
//             <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
//               <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
//               ساعات العمل
//             </h3>
//             <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-4 space-y-3">
//               {workingHours.map((item, index) => (
//                 <div key={index} className="flex justify-between items-center group">
//                   <div className="flex items-center gap-2 text-neutral-400 group-hover:text-white transition-colors">
//                     <Clock size={14} className="text-orange-500" />
//                     <span className="text-sm">{item.day}</span>
//                   </div>
//                   <span className={`text-sm font-bold ${item.day.includes('جمعة') ? 'text-red-400' : 'text-emerald-400'}`}>
//                     {item.hours}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* رسالة صغيرة إضافية */}
//             <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
//               <p className="text-xs text-orange-300 text-center leading-relaxed">
//                 فريق الدعم متاح للرد على استفساراتكم خلال أوقات العمل الرسمية.
//               </p>
//             </div>
//           </motion.div>

//         </motion.div>

//         {/* ================= القسم السفلي: حقوق النشر ================= */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.8 }}
//           className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4"
//         >
//           <p className="text-neutral-500 text-sm text-center md:text-right">
//             Copyright © {new Date().getFullYear()} <span className="text-orange-400 font-bold">Matjar</span>. جميع الحقوق محفوظة.
//           </p>
//           <div className="flex items-center gap-6 text-sm text-neutral-500">
//             <Link href="/terms" className="hover:text-orange-400 transition-colors">الشروط والأحكام</Link>
//             <Link href="/privacy" className="hover:text-orange-400 transition-colors">سياسة الخصوصية</Link>
//           </div>
//         </motion.div>

//       </div>
//     </footer>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Home,
  Heart,
  PlusCircle,
  MessageCircle,
  User,
  LogIn,
  MapPin,
  Facebook,
  Linkedin,
  Mail,
  ArrowDown,
  Instagram,
  Twitter,
  Phone,
  Clock,
  Download,
  Sparkles,
  Zap,
  Shield,
  Globe,
  ArrowUp,
} from 'lucide-react';

export default function Footer() {
  const session = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);

  const images = [
    '/images/image (1).jpg',
    '/images/image (2).jpg',
    '/images/image (3).jpg',
    '/images/image (4).jpg',
    '/images/image (5).jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) return;

    const installPrompt = deferredInstallPrompt;
    setDeferredInstallPrompt(null);

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.info(`PWA installation prompt ${outcome}.`);
    } catch (error) {
      console.error('Could not show the PWA installation prompt:', error);
    }
  };

  const quickLinks = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'المفضلة', path: '/favorite', icon: Heart },
    { name: 'إنشاء إعلان', path: '/newPost', icon: PlusCircle },
    { name: 'إعلاناتي', path: '/posts', icon: User },
    { name: 'اتصل بنا', path: '/contactUs', icon: MessageCircle },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: Facebook,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin,
      color: 'hover:bg-blue-700',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: Instagram,
      color: 'hover:bg-pink-600',
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
      color: 'hover:bg-sky-500',
    },
  ];

  const features = [
    { icon: Shield, title: 'آمن وموثوق', desc: 'حماية كاملة لبياناتك' },
    { icon: Zap, title: 'سريع وفعال', desc: 'تصفح بدون تأخير' },
    { icon: Globe, title: 'متاح 24/7', desc: 'في أي وقت ومكان' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative bg-neutral-950 text-white overflow-hidden"
      dir="rtl"
    >
      {/* تأثيرات ضوئية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-600/10 to-amber-600/10 rounded-full blur-[100px]" />
      </div>

      {/* خط علوي متدرج متوهج */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-orange-500 via-amber-500 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* ================= القسم العلوي الرئيسي ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* العمود الأيمن: الشعار والوصف */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 space-y-8"
          >
            <Link href="/" className="inline-block group">
              <div className="relative h-20 w-64 hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/matjar.png"
                  fill
                  className="object-contain drop-shadow-2xl"
                  alt="Matjar Logo"
                />
              </div>
            </Link>

            <p className="text-neutral-400 leading-loose text-lg">
              منصة <span className="text-orange-400 font-bold">متجر</span>{' '}
              الرائدة في مجال الإعلانات المبوبة. نوفر لك تجربة تسوق فريدة مع
              آلاف الإعلانات في مختلف المجالات.
            </p>

            {/* ميزات سريعة */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="text-center p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                  <p className="text-xs font-bold text-white mb-1">
                    {feature.title}
                  </p>
                  <p className="text-[10px] text-neutral-500">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* العمود الأوسط: روابط سريعة */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              روابط سريعة
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="group flex items-center gap-3 text-neutral-400 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-neutral-900/50"
                  >
                    <link.icon className="w-5 h-5 group-hover:text-orange-400 transition-colors" />
                    <span className="font-medium">{link.name}</span>
                    <ArrowDown className="w-4 h-4 mr-auto rotate-90 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* العمود الأيسر: تحميل التطبيق */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <h3 className="text-xl font-black text-white mb-6">حمل تطبيقنا</h3>

            {/* عرض الصور المتحرك */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-6 border-2 border-neutral-800 shadow-2xl">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    scale: currentImageIndex === index ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={img}
                    alt={`App preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

              {/* مؤشر الصور */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index
                        ? 'bg-orange-500 w-6'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {deferredInstallPrompt && (
              <motion.button
                type="button"
                onClick={handleInstallClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-orange-600/25 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                <span>تحميل التطبيق</span>
              </motion.button>
            )}
          </motion.div>

          {/* العمود الأيسر جداً: التواصل الاجتماعي */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <h3 className="text-xl font-black text-white mb-6">تابعنا على</h3>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 ${social.color} hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <social.icon className="w-6 h-6 text-white relative z-10" />
                  <span className="block text-xs text-white/80 mt-2 relative z-10">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>

            {/* معلومات الاتصال */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-400 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-sm">+963 11 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800">
                <Mail className="w-5 h-5 text-amber-400" />
                <span className="text-sm">info@matjar.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= شريط المعلومات الوسطي ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-amber-600/10 to-orange-600/10 rounded-3xl blur-xl" />
          <div className="relative bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-neutral-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ================= القسم السفلي ================= */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-neutral-500 text-sm text-center md:text-right">
              Copyright © {new Date().getFullYear()}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-black">
                Matjar
              </span>
              . جميع الحقوق محفوظة
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-neutral-500 hover:text-orange-400 transition-colors text-sm font-medium"
              >
                الشروط والأحكام
              </Link>
              <Link
                href="/privacy"
                className="text-neutral-500 hover:text-orange-400 transition-colors text-sm font-medium"
              >
                سياسة الخصوصية
              </Link>
            </div>

            {/* زر الصعود للأعلى */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 transition-all z-50"
              style={{
                opacity: scrollY > 500 ? 1 : 0,
                pointerEvents: scrollY > 500 ? 'auto' : 'none',
              }}
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
