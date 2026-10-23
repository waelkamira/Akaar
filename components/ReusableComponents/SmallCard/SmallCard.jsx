// 'use client';
// import React, { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import ImageComponent from './ImageComponent';
// import DetailsSection from './DetailsSection';
// import AdditionalFields from './AdditionalFields';
// import FavoriteButton from './FavoriteButton';
// import UserNameAndPhoto from '../userNameAndPhoto';
// import { formatDistanceToNow } from 'date-fns';

// const SmallCard = React.memo(function SmallCard({ item, category }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     const date = new Date(dateString);
//     return isNaN(date)
//       ? 'Invalid date'
//       : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const handleClick = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('item', JSON.stringify(item));
//       localStorage.setItem('category', JSON.stringify(category));
//     }
//     router.push(`/post/${item?.id}`);
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{
//         duration: 0.6,
//         ease: [0.23, 1, 0.32, 1],
//         scale: { type: 'spring', stiffness: 300, damping: 30 },
//       }}
//       className="relative flex flex-col w-full cursor-pointer rounded-lg group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-gray-300 hover:border-primary-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_64px_0_rgba(59,130,246,0.15)] transition-all duration-700 ease-out overflow-hidden"
//       style={{
//         background: `
//           linear-gradient(135deg,
//             rgba(255,255,255,0.1) 0%,
//             rgba(255,255,255,0.05) 50%,
//             rgba(255,255,255,0.1) 100%
//           )
//         `,
//       }}
//     >
//       {/* تأثير إشعاعي متحرك */}
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
//         <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10 animate-pulse" />
//       </div>

//       {/* تأثير نيومورفيك للحدود */}
//       <div className="absolute inset-0 rounded-lg border border-white/30 shadow-[inset_1px_1px_2px_0_rgba(255,255,255,0.2),inset_-1px_-1px_2px_0_rgba(0,0,0,0.1)]" />

//       {/* زر المفضلة متطور */}
//       <FavoriteButton
//         item={item}
//         className="top-5 left-5 z-30 bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:bg-white/25 hover:scale-110 transition-all duration-300"
//       />

//       {/* شارة جديدة بتأثير متطور */}
//       {item.isNew && (
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{
//             delay: 0.4,
//             type: 'spring',
//             stiffness: 200,
//             damping: 15,
//           }}
//           className="absolute top-5 left-16 z-30 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl border border-white/30 flex items-center gap-2"
//         >
//           <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
//           <span>جديد</span>
//         </motion.div>
//       )}

//       {/* قسم الصورة مع تأثيرات متطورة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-lg min-h-[200px]"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
//         />

//         {/* طبقات متعددة من التدرجات */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

//         {/* المستخدم */}
//         <div className="absolute top-2 right-2 z-20">
//           <UserNameAndPhoto post={item} size={'size-11'} />
//         </div>

//         {/* المعلومات السفلية */}
//         <div className="absolute bottom-0 left-0 right-0 p-2 ">
//           <div className="flex justify-between items-center">
//             {/* التاريخ */}
//             {item && (
//               <motion.div
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
//               >
//                 <svg
//                   className="w-4 h-4 text-blue-600"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {formatDate(item?.createdAt) || ''}
//               </motion.div>
//             )}

//             {/* المخزون */}
//             {item?.stockQuantity && (
//               <motion.div
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
//               >
//                 <svg
//                   className="w-4 h-4 text-lime-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {item?.stockQuantity} متوفر
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* محتوى البطاقة */}
//       <div className="flex-1 p-6 pt-2 relative">
//         {/* تأثير خلفية للمحتوى */}
//         <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-white/5" />

//         <div className="relative z-20">
//           {/* العنوان والموقع */}
//           <div onClick={handleClick}>
//             <DetailsSection item={item} />
//           </div>

//           {/* الحقول الإضافية */}
//           <div className="flex justify-center items-center rounded-b-lg p-2 ">
//             <AdditionalFields item={item} category={category} />
//           </div>

//           {/* السعر وزر التفاصيل */}
//           <motion.div
//             className="flex flex-col justify-between items-center pt-5 border-t border-white/20"
//             whileHover={{ scale: 1.01 }}
//           >
//             {/* السعر */}
//             <div className="flex items-baseline gap-4 w-full justify-center mb-5">
//               {item.oldPrice && (
//                 <span className="text-lg text-gray-400 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-3">
//                 <span className="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//                   <span className="text-green-500 mx-2">$</span>
//                   {item.basePrice?.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* زر التفاصيل */}
//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//                 y: -2,
//                 boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.5)',
//               }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-400 hover:from-gray-600 hover:to-gray-400 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl group/btn relative overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* تأثير إشعاعي للزر */}
//               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

//               <span className="font-bold text-lg">عرض التفاصيل</span>
//               <motion.svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 rtl:rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 initial={{ x: 0 }}
//                 whileHover={{ x: 6 }}
//                 transition={{ type: 'spring', stiffness: 400, damping: 10 }}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </motion.svg>
//             </motion.button>
//           </motion.div>
//         </div>
//       </div>

//       {/* تأثير ضوء متحرك */}
//       {/* <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
//         <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" />
//       </div> */}
//     </motion.div>
//   );
// });

// export default SmallCard;
// 'use client';

// import React, { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import ImageComponent from './ImageComponent';
// import DetailsSection from './DetailsSection';
// import FavoriteButton from './FavoriteButton';
// import { formatDistanceToNow } from 'date-fns';

// const SmallCard = React.memo(function SmallCard({ item, category }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const handleClick = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('item', JSON.stringify(item));
//       localStorage.setItem('category', JSON.stringify(category));
//     }
//     router.push(`/post/${item?.id}`);
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: 'easeOut' }}
//       whileHover={{ y: -6, transition: { duration: 0.3 } }}
//       onClick={handleClick}
//       className="group relative flex flex-col w-full cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-100 transition-all duration-300 overflow-hidden"
//     >
//       {/* ================= قسم الصورة (نسبة ثابتة وأنيقة) ================= */}
//       <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
//         <ImageComponent
//           item={item}
//           className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//         />

//         {/* تدرج سفلي خفيف جداً لتحسين قراءة النصوص العائمة */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

//         {/* شارة "جديد" الفاخرة (بسيطة وأنيقة) */}
//         {item.isNew && (
//           <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-primary-100">
//             <span className="relative flex h-1.5 w-1.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
//             </span>
//             جديد
//           </div>
//         )}

//         {/* زر المفضلة (أنيق وغير مزعج) */}
//         <div
//           className="absolute top-3 left-3 z-20"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <FavoriteButton
//             item={item}
//             className="bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300 rounded-full p-2 shadow-sm"
//           />
//         </div>

//         {/* التاريخ (مدمج بشكل أنيق في أسفل الصورة) */}
//         {item?.createdAt && (
//           <div className="absolute bottom-3 left-3 z-20">
//             <div className="bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1.5">
//               <svg
//                 className="w-3 h-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               {formatDate(item.createdAt)}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= قسم المحتوى (مضغوط ومركز) ================= */}
//       <div className="flex-1 flex flex-col p-4 gap-3">
//         {/* العنوان والتفاصيل الأساسية */}
//         <div className="space-y-1.5">
//           <DetailsSection item={item} />
//         </div>

//         {/* فاصل أنيق جداً */}
//         <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

//         {/* السعر والمخزون (إن وجد) */}
//         <div className="flex items-end justify-between mt-auto">
//           <div className="flex flex-col">
//             {item.oldPrice && item.oldPrice > item.basePrice && (
//               <span className="text-xs text-slate-400 line-through font-medium mb-0.5">
//                 {item.oldPrice?.toLocaleString()}
//               </span>
//             )}
//             <div className="flex items-baseline gap-1">
//               <span className="text-xl font-bold text-slate-900 tracking-tight">
//                 {item.basePrice?.toLocaleString()}
//               </span>
//               <span className="text-xs font-semibold text-primary-600">
//                 ر.س
//               </span>
//             </div>
//           </div>

//           {/* حالة المخزون (شارة صغيرة جداً وأنيقة) */}
//           {item?.stockQuantity !== undefined && (
//             <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
//               متوفر ({item.stockQuantity})
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// });

// export default SmallCard;
// 'use client';

// import React, { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import ImageComponent from './ImageComponent';
// import DetailsSection from './DetailsSection';
// import FavoriteButton from './FavoriteButton';
// import { formatDistanceToNow } from 'date-fns';

// const SmallCard = React.memo(function SmallCard({ item, category }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   // دالة آمنة لتحويل الكائنات إلى JSON مع تجنب البنى الدائرية
//   const safeStringify = (obj) => {
//     if (!obj) return '{}';

//     // استخراج فقط الحقول الضرورية من category
//     if (obj === category) {
//       const safeCategory = {
//         id: category?.id,
//         name: category?.name,
//         slug: category?.slug,
//         categoryName: category?.categoryName,
//       };
//       return JSON.stringify(safeCategory);
//     }

//     // للـ item، نستخدم replacer function
//     try {
//       return JSON.stringify(obj, (key, value) => {
//         // تخطي الدوال والمراجع الدائرية
//         if (typeof value === 'function') return undefined;
//         if (typeof value === 'object' && value !== null) {
//           // تخطي كائنات React الخاصة
//           if (value.$$typeof || value.Provider || value.Consumer) {
//             return undefined;
//           }
//         }
//         return value;
//       });
//     } catch (error) {
//       console.error('Error stringifying object:', error);
//       return '{}';
//     }
//   };

//   const handleClick = () => {
//     try {
//       if (typeof window !== 'undefined') {
//         // تخزين البيانات بأمان
//         localStorage.setItem('item', safeStringify(item));
//         localStorage.setItem('category', safeStringify(category));
//       }
//       router.push(`/post/${item?.id}`);
//     } catch (error) {
//       console.error('Error saving to localStorage:', error);
//       // المتابعة حتى لو فشل التخزين
//       router.push(`/post/${item?.id}`);
//     }
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: 'easeOut' }}
//       whileHover={{ y: -6, transition: { duration: 0.3 } }}
//       onClick={handleClick}
//       className="group relative flex flex-col w-full cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-100 transition-all duration-300 overflow-hidden"
//     >
//       {/* ================= قسم الصورة ================= */}
//       <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
//         <ImageComponent
//           item={item}
//           className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
//         />

//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

//         {/* شارة "جديد" */}
//         {item.isNew && (
//           <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-primary-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-primary-100">
//             <span className="relative flex h-1.5 w-1.5">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
//             </span>
//             جديد
//           </div>
//         )}

//         {/* زر المفضلة */}
//         <div
//           className="absolute top-3 left-3 z-20"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <FavoriteButton
//             item={item}
//             className="bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-300 rounded-full p-2 shadow-sm"
//           />
//         </div>

//         {/* التاريخ */}
//         {item?.createdAt && (
//           <div className="absolute bottom-3 left-3 z-20">
//             <div className="bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1.5">
//               <svg
//                 className="w-3 h-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               {formatDate(item.createdAt)}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= قسم المحتوى ================= */}
//       <div className="flex-1 flex flex-col p-4 gap-3">
//         <div className="space-y-1.5">
//           <DetailsSection item={item} />
//         </div>

//         <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

//         <div className="flex items-end justify-between mt-auto">
//           <div className="flex flex-col">
//             {item.oldPrice && item.oldPrice > item.basePrice && (
//               <span className="text-xs text-slate-400 line-through font-medium mb-0.5">
//                 {item.oldPrice?.toLocaleString()}
//               </span>
//             )}
//             <div className="flex items-baseline gap-1">
//               <span className="text-xl font-bold text-slate-900 tracking-tight">
//                 {item.basePrice?.toLocaleString()}
//               </span>
//               <span className="text-xs font-semibold text-primary-600">
//                 ر.س
//               </span>
//             </div>
//           </div>

//           {item?.stockQuantity !== undefined && (
//             <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
//               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
//               متوفر ({item.stockQuantity})
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// });

// export default SmallCard;
'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ImageComponent from './ImageComponent';
import DetailsSection from './DetailsSection';
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
  }, []);

  // دالة آمنة لتجنب circular structure
  const safeStringify = (obj, isCategory = false) => {
    if (!obj) return '{}';

    if (isCategory) {
      const safeCategory = {
        id: category?.id,
        name: category?.name,
        slug: category?.slug,
        categoryName: category?.categoryName,
      };
      return JSON.stringify(safeCategory);
    }

    try {
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'function') return undefined;
        if (typeof value === 'object' && value !== null) {
          if (value.$$typeof || value.Provider || value.Consumer) {
            return undefined;
          }
        }
        return value;
      });
    } catch (error) {
      console.error('Error stringifying:', error);
      return '{}';
    }
  };

  const handleClick = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('item', safeStringify(item));
        localStorage.setItem('category', safeStringify(category, true));
      }
      router.push(`/post/${item?.id}`);
    } catch (error) {
      console.error('Error:', error);
      router.push(`/post/${item?.id}`);
    }
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* البطاقة الرئيسية */}
      <div className="relative bg-neutral-950 border-2 border-neutral-800 hover:border-orange-500 transition-all duration-300 overflow-hidden">
        {/* ================= قسم الصورة ================= */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
          <ImageComponent
            item={item}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Overlay متدرج قوي */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* شارة "جديد" عصرية */}
          {item.isNew && (
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-orange-500 text-black text-[10px] font-black px-3 py-1.5 uppercase tracking-wider clip-path-slant">
                NEW DROP
              </div>
            </div>
          )}

          {/* زر المفضلة */}
          <div
            className="absolute top-4 left-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton
              item={item}
              className="bg-black/80 backdrop-blur-sm border-2 border-white/20 text-white hover:text-red-500 hover:border-red-500 transition-all duration-300 p-2.5"
            />
          </div>

          {/* التاريخ */}
          {item?.createdAt && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-white/10">
                {formatDate(item.createdAt)}
              </div>
            </div>
          )}

          {/* رقم المنتج كعنصر تصميمي */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="text-6xl font-black text-white tracking-tighter">
              {String(item?.id || '').slice(-3)}
            </span>
          </div>
        </div>

        {/* ================= قسم المحتوى ================= */}
        <div className="p-5 space-y-4">
          {/* التصنيف */}
          {category?.name && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-orange-500" />
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
                {category.name}
              </span>
            </div>
          )}

          {/* العنوان */}
          <div className="space-y-1">
            <DetailsSection item={item} />
          </div>

          {/* السعر والمخزون */}
          <div className="flex items-end justify-between pt-4 border-t-2 border-neutral-800">
            <div className="flex flex-col">
              {item.oldPrice && item.oldPrice > item.basePrice && (
                <span className="text-xs text-neutral-500 line-through font-bold mb-1">
                  {item.oldPrice?.toLocaleString()}
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  {item.basePrice?.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-orange-500 uppercase">
                  ر.س
                </span>
              </div>
            </div>

            {/* حالة المخزون */}
            {item?.stockQuantity !== undefined && (
              <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                IN STOCK ({item.stockQuantity})
              </div>
            )}
          </div>

          {/* زر "عرض التفاصيل" العصري */}
          <div className="pt-2">
            <div className="w-full bg-neutral-900 hover:bg-orange-500 text-white hover:text-black font-black text-xs uppercase tracking-[0.2em] py-3 px-4 transition-all duration-300 text-center border-2 border-neutral-800 hover:border-orange-500 group-hover:translate-x-0 -translate-x-2">
              VIEW DETAILS →
            </div>
          </div>
        </div>

        {/* تأثير الزاوية العلوية */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-500 clip-path-corner" />
      </div>

      {/* ظل البطاقة */}
      <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 translate-y-4" />
    </motion.div>
  );
});

export default SmallCard;
