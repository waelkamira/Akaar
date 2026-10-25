// 'use client';

// import React, { useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import ImageComponent from './ImageComponent';
// import DetailsSection from './DetailsSection';
// import FavoriteButton from './FavoriteButton';
// import { formatDistanceToNow } from 'date-fns';
// import { FaArrowRight, FaMagic } from 'react-icons/fa';

// const SmallCard = React.memo(function SmallCard({
//   item,
//   category,
//   priority = false,
// }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const safeStringify = (obj, isCategory = false) => {
//     if (!obj) return '{}';

//     if (isCategory) {
//       const safeCategory = {
//         id: category?.id,
//         name: category?.name,
//         slug: category?.slug,
//         categoryName: category?.categoryName,
//       };
//       return JSON.stringify(safeCategory);
//     }

//     try {
//       return JSON.stringify(obj, (key, value) => {
//         if (typeof value === 'function') return undefined;
//         if (typeof value === 'object' && value !== null) {
//           if (value.$$typeof || value.Provider || value.Consumer) {
//             return undefined;
//           }
//         }
//         return value;
//       });
//     } catch (error) {
//       console.error('Error stringifying:', error);
//       return '{}';
//     }
//   };

//   const handleClick = () => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('item', safeStringify(item));
//         localStorage.setItem('category', safeStringify(category, true));
//       }
//       router.push(`/post/${item?.id}`);
//     } catch (error) {
//       console.error('Error:', error);
//       router.push(`/post/${item?.id}`);
//     }
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//       whileHover={{
//         y: -12,
//         transition: { duration: 0.4, ease: 'easeOut' },
//       }}
//       onClick={handleClick}
//       className="group relative cursor-pointer"
//     >
//       {/* البطاقة الرئيسية بتصميم Ninjax */}
//       <div className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 hover:border-emerald-300 transition-all duration-500 overflow-hidden rounded-3xl shadow-lg shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10">
//         {/* خلفية زخرفية */}
//         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//           <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
//           <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl" />
//         </div>

//         {/* ================= قسم الصورة ================= */}
//         <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
//           <ImageComponent
//             item={item}
//             priority={priority}
//             className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
//           />

//           {/* Overlay متدرج ناعم */}
//           <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-emerald-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

//           {/* شارة "جديد" عصرية */}
//           {item.isNew && (
//             <motion.div
//               initial={{ scale: 0, rotate: -10 }}
//               animate={{ scale: 1, rotate: 0 }}
//               transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
//               className="absolute top-4 right-4 z-20"
//             >
//               <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-emerald-900 text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-emerald-900/20 border border-emerald-200">
//                 <FaMagic className="text-emerald-600" />
//                 <span>NEW DROP</span>
//               </div>
//             </motion.div>
//           )}

//           {/* زر المفضلة */}
//           <div
//             className="absolute top-4 left-4 z-20"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <FavoriteButton
//               item={item}
//               className="bg-white/90 backdrop-blur-md border-2 border-white/50 text-emerald-900 hover:text-red-500 hover:border-red-300 hover:bg-white transition-all duration-300 p-3 rounded-full shadow-lg"
//             />
//           </div>

//           {/* التاريخ */}
//           {item?.createdAt && (
//             <div className="absolute bottom-4 left-4 z-20">
//               <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/20">
//                 {formatDate(item.createdAt)}
//               </div>
//             </div>
//           )}

//           {/* رقم المنتج كعنصر تصميمي */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
//             <span className="text-8xl font-black text-white tracking-tighter select-none">
//               {String(item?.id || '').slice(-3)}
//             </span>
//           </div>
//         </div>

//         {/* ================= قسم المحتوى ================= */}
//         <div className="relative p-6 space-y-4">
//           {/* التصنيف */}
//           {category?.name && (
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="flex items-center gap-2"
//             >
//               <div className="w-10 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
//               <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">
//                 {category.name}
//               </span>
//             </motion.div>
//           )}

//           {/* العنوان */}
//           <div className="space-y-2">
//             <DetailsSection item={item} />
//           </div>

//           {/* السعر والمخزون */}
//           <div className="flex items-end justify-between pt-4 border-t border-emerald-100">
//             <div className="flex flex-col">
//               {item.oldPrice && item.oldPrice > item.basePrice && (
//                 <span className="text-xs text-neutral-400 line-through font-bold mb-1">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-baseline gap-1.5">
//                 <span className="text-3xl font-black text-emerald-950 tracking-tight">
//                   {item.basePrice?.toLocaleString()}
//                 </span>
//                 <span className="text-xs font-bold text-emerald-600 uppercase">
//                   ر.س
//                 </span>
//               </div>
//             </div>

//             {/* حالة المخزون */}
//             {item?.stockQuantity !== undefined && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-wider"
//               >
//                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
//                 IN STOCK ({item.stockQuantity})
//               </motion.div>
//             )}
//           </div>

//           {/* زر "عرض التفاصيل" العصري */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="pt-2"
//           >
//             <div className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-[0.2em] py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:shadow-xl group-hover:shadow-emerald-900/20">
//               <span>VIEW DETAILS</span>
//               <FaArrowRight className="transform group-hover:translate-x-1 transition-transform" />
//             </div>
//           </motion.div>
//         </div>

//         {/* تأثير الزاوية العلوية */}
//         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-700" />

//         {/* خط سفلي متحرك */}
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
//       </div>

//       {/* ظل البطاقة */}
//       <div className="absolute inset-0 bg-emerald-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10 translate-y-6 rounded-3xl" />
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
// import { FaArrowRight } from 'react-icons/fa';

// const SmallCard = React.memo(function SmallCard({
//   item,
//   category,
//   priority = false,
// }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const safeStringify = (obj, isCategory = false) => {
//     if (!obj) return '{}';

//     if (isCategory) {
//       const safeCategory = {
//         id: category?.id,
//         name: category?.name,
//         slug: category?.slug,
//         categoryName: category?.categoryName,
//       };
//       return JSON.stringify(safeCategory);
//     }

//     try {
//       return JSON.stringify(obj, (key, value) => {
//         if (typeof value === 'function') return undefined;
//         if (typeof value === 'object' && value !== null) {
//           if (value.$$typeof || value.Provider || value.Consumer) {
//             return undefined;
//           }
//         }
//         return value;
//       });
//     } catch (error) {
//       console.error('Error stringifying:', error);
//       return '{}';
//     }
//   };

//   const handleClick = () => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('item', safeStringify(item));
//         localStorage.setItem('category', safeStringify(category, true));
//       }
//       router.push(`/post/${item?.id}`);
//     } catch (error) {
//       console.error('Error:', error);
//       router.push(`/post/${item?.id}`);
//     }
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       onClick={handleClick}
//       className="group cursor-pointer"
//     >
//       {/* البطاقة الرئيسية */}
//       <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
//         {/* ================= قسم الصورة ================= */}
//         <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
//           <ImageComponent
//             item={item}
//             priority={priority}
//             className="w-full h-full object-cover"
//           />

//           {/* Overlay خفيف */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

//           {/* زر المفضلة - أعلى يسار */}
//           <div
//             className="absolute top-4 left-4 z-20"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <FavoriteButton
//               item={item}
//               className="text-gray-600 hover:text-red-500 transition-colors p-2"
//             />
//           </div>

//           {/* اسم التصنيف - أعلى يمين */}
//           {category?.name && (
//             <div className="absolute top-4 right-4 z-20">
//               <span className="text-white font-bold text-sm drop-shadow-md">
//                 {category.name}
//               </span>
//             </div>
//           )}

//           {/* التاريخ - أسفل يسار الصورة */}
//           {item?.createdAt && (
//             <div className="absolute bottom-4 left-4 z-20">
//               <div className="bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full">
//                 {formatDate(item.createdAt)}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ================= قسم المحتوى ================= */}
//         <div className="p-5 space-y-3">
//           {/* التصنيف باللون البرتقالي */}
//           {category?.name && (
//             <div className="text-right">
//               <span className="text-orange-500 font-bold text-lg">
//                 {category.name}
//               </span>
//             </div>
//           )}

//           {/* الموقع */}
//           <div className="flex items-center gap-1 text-gray-500 text-sm">
//             <svg
//               className="w-4 h-4 text-orange-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             <span>{item?.location || 'حمص'}</span>
//             {item?.subLocation && (
//               <>
//                 <span className="mx-1">›</span>
//                 <span>{item.subLocation}</span>
//               </>
//             )}
//           </div>

//           {/* الوصف */}
//           <div className="text-gray-600 text-sm line-clamp-2">
//             {item?.description || item?.title || 'بيت في حي باب سباع حمص او...'}
//           </div>

//           {/* خط فاصل */}
//           <div className="border-t border-gray-100 pt-3" />

//           {/* السعر والمخزون */}
//           <div className="flex items-end justify-between">
//             <div className="flex items-baseline gap-2">
//               <span className="text-3xl font-black text-gray-900">
//                 {item.basePrice?.toLocaleString()}
//               </span>
//               <div className="flex items-center gap-1">
//                 <span className="text-sm text-gray-500">ر.س</span>
//                 {item?.stockQuantity !== undefined && (
//                   <>
//                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                     <span className="text-[10px] font-bold text-emerald-600 uppercase">
//                       IN STOCK [{item.stockQuantity}]
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* زر "عرض التفاصيل" */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleClick();
//             }}
//             className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider py-4 px-6 rounded-2xl transition-colors duration-300 flex items-center justify-center gap-2 mt-2"
//           >
//             <span>VIEW DETAILS</span>
//             <FaArrowRight />
//           </button>
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
// import FavoriteButton from './FavoriteButton';
// import { formatDistanceToNow } from 'date-fns';
// import { FaArrowLeft } from 'react-icons/fa'; // تم التغيير إلى ArrowLeft ليتناسب مع اتجاه RTL

// const SmallCard = React.memo(function SmallCard({
//   item,
//   category,
//   priority = false,
// }) {
//   const router = useRouter();

//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
//   }, []);

//   const safeStringify = (obj, isCategory = false) => {
//     if (!obj) return '{}';

//     if (isCategory) {
//       const safeCategory = {
//         id: category?.id,
//         name: category?.name,
//         slug: category?.slug,
//         categoryName: category?.categoryName,
//       };
//       return JSON.stringify(safeCategory);
//     }

//     try {
//       return JSON.stringify(obj, (key, value) => {
//         if (typeof value === 'function') return undefined;
//         if (typeof value === 'object' && value !== null) {
//           if (value.$$typeof || value.Provider || value.Consumer) {
//             return undefined;
//           }
//         }
//         return value;
//       });
//     } catch (error) {
//       console.error('Error stringifying:', error);
//       return '{}';
//     }
//   };

//   const handleClick = () => {
//     try {
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('item', safeStringify(item));
//         localStorage.setItem('category', safeStringify(category, true));
//       }
//       router.push(`/post/${item?.id}`);
//     } catch (error) {
//       console.error('Error:', error);
//       router.push(`/post/${item?.id}`);
//     }
//   };

//   if (!item) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       onClick={handleClick}
//       className="group cursor-pointer"
//     >
//       {/* البطاقة الرئيسية */}
//       <div className="relative bg-neutral-900/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-neutral-800 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-600/10 transition-all duration-300">
        
//         {/* ================= قسم الصورة ================= */}
//         <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-800">
//           <ImageComponent
//             item={item}
//             priority={priority}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />

//           {/* Overlay متدرج */}
//           <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

//           {/* زر المفضلة - أعلى يسار */}
//           <div
//             className="absolute top-4 left-4 z-20"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <FavoriteButton
//               item={item}
//               className="bg-neutral-900/50 backdrop-blur-md border border-neutral-700/50 text-neutral-300 hover:text-red-500 hover:border-red-500/50 transition-all p-2.5 rounded-full"
//             />
//           </div>

//           {/* اسم التصنيف - أعلى يمين */}
//           {category?.name && (
//             <div className="absolute top-4 right-4 z-20">
//               <span className="bg-neutral-900/60 backdrop-blur-md border border-neutral-700/50 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
//                 {category.name}
//               </span>
//             </div>
//           )}

//           {/* التاريخ - أسفل يسار الصورة */}
//           {item?.createdAt && (
//             <div className="absolute bottom-4 left-4 z-20">
//               <div className="bg-neutral-900/70 backdrop-blur-md border border-neutral-700/50 text-neutral-300 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
//                 <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
//                 {formatDate(item.createdAt)}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ================= قسم المحتوى ================= */}
//         <div className="p-5 space-y-4">
          
//           {/* التصنيف بتدرج لوني */}
//           {category?.name && (
//             <div className="text-right">
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-black text-lg">
//                 {category.name}
//               </span>
//             </div>
//           )}

//           {/* الموقع */}
//           <div className="flex items-center gap-2 text-neutral-400 text-sm">
//             <svg
//               className="w-4 h-4 text-orange-500 shrink-0"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             <span className="truncate">{item?.location || 'غير محدد'}</span>
//             {item?.subLocation && (
//               <>
//                 <span className="text-neutral-600">/</span>
//                 <span className="truncate">{item.subLocation}</span>
//               </>
//             )}
//           </div>

//           {/* الوصف */}
//           <div className="text-neutral-300 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
//             {item?.description || item?.title || 'لا يوجد وصف متاح لهذا الإعلان'}
//           </div>

//           {/* خط فاصل */}
//           <div className="border-t border-neutral-800" />

//           {/* السعر والمخزون */}
//           <div className="flex items-end justify-between">
//             <div className="flex flex-col">
//               <span className="text-2xl font-black text-white tracking-tight">
//                 {item.basePrice?.toLocaleString() || '0'}
//               </span>
//               <div className="flex items-center gap-1.5 mt-1">
//                 <span className="text-xs font-bold text-orange-400">ل.س</span>
//                 {item?.stockQuantity !== undefined && (
//                   <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
//                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//                     متاح ({item.stockQuantity})
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* زر "عرض التفاصيل" */}
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               handleClick();
//             }}
//             className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 group/btn"
//           >
//             <span>عرض التفاصيل</span>
//             <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
//           </button>
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
import FavoriteButton from './FavoriteButton';
import { formatDistanceToNow } from 'date-fns';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaTag } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';

const SmallCard = React.memo(function SmallCard({
  item,
  category,
  priority = false,
}) {
  const router = useRouter();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? '' : formatDistanceToNow(date, { addSuffix: true });
  }, []);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* البطاقة الرئيسية بتصميم عصري */}
      <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-[2rem] overflow-hidden border border-neutral-800/50 shadow-2xl shadow-black/50 hover:shadow-orange-500/10 hover:border-orange-500/20 transition-all duration-500">
        
        {/* ================= قسم الصورة ================= */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 z-10" />
          <ImageComponent
            item={item}
            priority={priority}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Overlay متدرج */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-10" />

          {/* الشريط العلوي - معلومات سريعة */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start">
            {/* زر المفضلة - تصميم عصري */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <FavoriteButton
                item={item}
                className="text-white hover:text-red-400 transition-colors"
              />
            </div>

            {/* بطاقة التصنيف - تصميم عائم */}
            {category?.name && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs px-4 py-2 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-2"
              >
                <FaTag className="text-[10px]" />
                {category.name}
              </motion.div>
            )}
          </div>

          {/* بطاقة الوقت - أسفل اليسار */}
          {item?.createdAt && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 text-neutral-300 text-xs font-bold px-3 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                <FaClock className="text-orange-500 text-[10px]" />
                {formatDate(item.createdAt)}
              </div>
            </div>
          )}

          {/* مؤشر السعر العائم - أسفل اليمين */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-lg px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center gap-1">
              {item.basePrice?.toLocaleString() || '0'}
              <span className="text-xs font-bold opacity-80">ل.س</span>
            </div>
          </div>
        </div>

        {/* ================= قسم المحتوى ================= */}
        <div className="p-5 space-y-4 relative">
          {/* خط زخرفي علوي */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full opacity-50" />

          {/* العنوان والموقع */}
          <div className="space-y-3">
            {/* الموقع بتصميم أنيق */}
            <div className="flex items-center gap-2 text-neutral-400 text-sm group/location">
              <div className="w-8 h-8 rounded-xl bg-neutral-800/50 flex items-center justify-center group-hover/location:bg-orange-500/20 transition-colors">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-neutral-300 font-medium block truncate">
                  {item?.location || 'غير محدد'}
                </span>
                {item?.subLocation && (
                  <span className="text-neutral-500 text-xs block">
                    {item.subLocation}
                  </span>
                )}
              </div>
            </div>

            {/* الوصف */}
            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
              {item?.description || item?.title || 'لا يوجد وصف متاح'}
            </p>
          </div>

          {/* معلومات إضافية */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/50">
            {/* حالة التوفر */}
            {item?.stockQuantity !== undefined && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-bold">
                  متاح ({item.stockQuantity})
                </span>
              </div>
            )}

            {/* زر التفاصيل - تصميم عصري */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="group/btn flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
            >
              <span>التفاصيل</span>
              <FaArrowLeft className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* تأثير ضوئي عند التمرير */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </div>
    </motion.div>
  );
});

export default SmallCard;