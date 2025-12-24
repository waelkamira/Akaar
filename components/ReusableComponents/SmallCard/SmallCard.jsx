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
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -4 }}
//       transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
//       className="relative flex flex-col w-full cursor-pointer rounded-lg group border border-gray-300 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-300 ease-out overflow-hidden"
//     >
//       {/* تأثير خلفي عند التحويم */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

//       {/* زر المفضلة */}
//       <FavoriteButton item={item} className="top-3 left-3 z-20" />

//       {/* شارة جديدة */}
//       {item.isNew && (
//         <motion.div
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="absolute top-3 left-12 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 backdrop-blur-sm border border-white/20"
//         >
//           جديد
//         </motion.div>
//       )}

//       {/* الصورة الرئيسية */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-lg"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="transition-transform duration-700 ease-out group-hover:scale-105"
//         />
//         {/* التاريخ */}
//         {item && (
//           <div
//             className={`absolute bottom-3 right-3 z-10 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full px-2 text-[10px] text-gray-600 select-none shadow-sm`}
//             dir="ltr"
//           >
//             {formatDate(item?.createdAt) || ''}
//           </div>
//         )}
//         {/* تدرج شفاف فوق الصورة */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//         {/* المخزون */}
//         {item?.stockQuantity && (
//           <div className="absolute bottom-3 left-3 z-10 flex justify-center items-center bg-white/90 backdrop-blur-sm rounded-full px-2 shadow-sm text-xs text-gray-700 border border-white/20">
//             {item?.stockQuantity} متوفر
//           </div>
//         )}
//       </div>

//       {/* المستخدم */}

//       <UserNameAndPhoto post={item} size={'size-9'} />

//       {/* محتوى البطاقة */}
//       <div
//         className="flex-1 m-5 mt-2 relative overflow-hidden"
//         onClick={handleClick}
//       >
//         {/* العنوان والموقع */}
//         <div className="relative z-20">
//           <DetailsSection item={item} />
//         </div>

//         {/* الحقول الإضافية */}
//         <div className="relative flex justify-center items-center z-20 border-t border-gray-100/80">
//           <AdditionalFields item={item} category={category} />
//         </div>

//         {/* السعر وزر التفاصيل */}
//         <motion.div
//           className="flex flex-col justify-between items-center relative z-20 border-t border-gray-100/80"
//           whileHover={{ scale: 1.01 }}
//         >
//           {/* السعر */}
//           <div className="flex items-baseline gap-3 w-full justify-center">
//             <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
//               {item.basePrice?.toLocaleString()} $
//             </span>
//             {item.oldPrice && (
//               <span className="text-sm text-gray-400 line-through font-medium">
//                 {item.oldPrice?.toLocaleString()} $
//               </span>
//             )}
//           </div>

//           {/* زر التفاصيل */}
//           <motion.button
//             whileHover={{
//               scale: 1.05,
//               boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
//             }}
//             whileTap={{ scale: 0.95 }}
//             className="w-full bg-gradient-to-r from-primary-400 to-primary-500 hover:bg-primary-400 text-white px-6 py-3 rounded-lg text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group/btn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <span>عرض التفاصيل</span>
//             <motion.svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 rtl:rotate-180"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               initial={{ x: 0 }}
//               whileHover={{ x: 4 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 10 }}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </motion.svg>
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* تأثير إضاءة عند التحويم */}
//       <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary-200/50 transition-all duration-300 pointer-events-none" />
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
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
//       className="relative flex flex-col w-full cursor-pointer rounded-2xl group bg-white border-transparent border-y-[5px] hover:border-primary-400 backdrop-blur shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden"
//     >
//       {/* تأثير خلفي متطور */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

//       {/* تأثير إشعاعي */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//       {/* زر المفضلة محسّن */}
//       <FavoriteButton
//         item={item}
//         className="top-4 left-4 z-20 bg-white/80 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl"
//       />

//       {/* شارة جديدة محسنة */}
//       {item.isNew && (
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
//           className="absolute top-4 left-12 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl z-20 backdrop-blur-sm border border-white/30 flex items-center gap-1"
//         >
//           <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
//           جديد
//         </motion.div>
//       )}

//       {/* الصورة الرئيسية مع تأثيرات محسنة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-2xl"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="transition-all duration-700 ease-out group-hover:scale-110"
//         />
//         {/* المستخدم */}
//         <UserNameAndPhoto post={item} size={'size-10'} />
//         {/* طبقة تدرج لوني فوق الصورة */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

//         {/* تأثير ضبابي عند التحويم */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary-200/20 via-transparent to-blue-200/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

//         {/* التاريخ محسّن */}
//         {item && (
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className={`absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl px-3 py-1.5 text-xs text-gray-700 font-medium shadow-lg flex items-center gap-1`}
//             dir="ltr"
//           >
//             {formatDate(item?.createdAt) || ''}

//             <svg
//               className="w-3 h-3 text-indigo-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </motion.div>
//         )}

//         {/* المخزون محسّن */}
//         {item?.stockQuantity && (
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="absolute bottom-4 left-4 z-10 flex justify-center items-center bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-lg text-xs font-medium text-gray-700 border border-white/40 gap-1"
//           >
//             <svg
//               className="size-4 text-green-500 font-bold"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {item?.stockQuantity} متوفر
//           </motion.div>
//         )}
//       </div>

//       {/* محتوى البطاقة */}
//       <div className="flex-1 p-6 relative overflow-hidden">
//         {/* تأثير خلفي للمحتوى */}
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//         {/* العنوان والموقع */}
//         <div className="relative z-20 mb-4" onClick={handleClick}>
//           <DetailsSection item={item} />
//         </div>

//         {/* الحقول الإضافية */}
//         <div className="relative flex justify-center items-center z-20 border-t border-gray-200/60 pt-4 mb-4">
//           <AdditionalFields item={item} category={category} />
//         </div>

//         {/* السعر وزر التفاصيل */}
//         <motion.div
//           className="flex flex-col justify-between items-center relative z-20 pt-4 border-t border-gray-200/60"
//           whileHover={{ scale: 1.01 }}
//         >
//           {/* السعر مع أيقونة */}
//           <div className="flex items-baseline gap-3 w-full justify-center mb-4">
//             {item.oldPrice && (
//               <>
//                 {' '}
//                 <span className="text-sm text-gray-400 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               </>
//             )}
//             <div className="flex items-center gap-2">
//               {/* <svg
//                 className="w-5 h-5 text-primary-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
//                   clipRule="evenodd"
//                 />
//               </svg> */}
//               <span className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
//                 <span className="text-green-600 mx-2">$</span>
//                 {item.basePrice?.toLocaleString()}
//               </span>
//             </div>
//           </div>

//           {/* زر التفاصيل محسّن */}
//           <motion.button
//             whileHover={{
//               scale: 1.05,
//               // boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.5)',
//             }}
//             whileTap={{ scale: 0.95 }}
//             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 active:scale-95"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* تأثير خلفي للزر */}
//             {/* <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" /> */}

//             <span>عرض التفاصيل</span>
//             <motion.svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 rtl:rotate-180"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               initial={{ x: 0 }}
//               whileHover={{ x: 4 }}
//               transition={{ type: 'spring', stiffness: 400, damping: 10 }}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </motion.svg>
//           </motion.button>
//         </motion.div>
//       </div>

//       {/* تأثير حدود متحركة */}
//       <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r from-primary-200/80 to-blue-200/80 transition-all duration-500 pointer-events-none" />

//       {/* تأثير ضوء متحرك */}
//       <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
//         <div className="absolute -inset-1 bg-gradient-to-r from-white to-indigo-200/30 blur-lg group-hover:blur-xl transition-all duration-1000" />
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
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
//       className="relative flex flex-col w-full cursor-pointer rounded-2xl group bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden hover:-translate-y-2"
//     >
//       {/* تأثير خلفية متحركة */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700" />

//       {/* حدود متدرجة */}
//       <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//       {/* قسم الصورة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-2xl"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="transition-all duration-700 ease-out group-hover:scale-110"
//         />

//         {/* طبقة تدرج لوني */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

//         {/* زر المفضلة */}
//         <FavoriteButton
//           item={item}
//           className="top-4 left-4 z-20 bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:bg-white hover:shadow-xl"
//         />

//         {/* شارة جديدة */}
//         {item.isNew && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.2, type: 'spring' }}
//             className="absolute top-4 left-12 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl z-20 backdrop-blur-sm"
//           >
//             <span className="flex items-center gap-1">
//               <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
//               جديد
//             </span>
//           </motion.div>
//         )}

//         {/* المستخدم */}
//         <UserNameAndPhoto post={item} size={'size-10'} />

//         {/* المعلومات السفلية */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
//           <div className="flex justify-between items-center">
//             {/* التاريخ */}
//             {item && (
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1 border border-white/30"
//               >
//                 <svg
//                   className="w-3 h-3"
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
//                 whileHover={{ scale: 1.05 }}
//                 className="bg-green-500/90 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1 border border-green-400/30"
//               >
//                 <svg
//                   className="w-3 h-3"
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
//       <div className="flex-1 p-5 relative">
//         <div className="relative z-20">
//           {/* العنوان والموقع */}
//           <div className="mb-4" onClick={handleClick}>
//             <DetailsSection item={item} />
//           </div>

//           {/* الحقول الإضافية */}
//           <div className="flex justify-center items-center border-t border-gray-200/50 pt-4 mb-4">
//             <AdditionalFields item={item} category={category} />
//           </div>

//           {/* السعر وزر التفاصيل */}
//           <motion.div
//             className="flex flex-col justify-between items-center pt-4 border-t border-gray-200/50"
//             whileHover={{ scale: 1.02 }}
//           >
//             {/* السعر */}
//             <div className="flex items-baseline gap-3 w-full justify-center mb-4">
//               {item.oldPrice && (
//                 <span className="text-sm text-gray-500 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
//                   ${item.basePrice?.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* زر التفاصيل */}
//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//                 background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
//               }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-blue-500 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <span className="font-semibold">عرض التفاصيل</span>
//               <motion.svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 rtl:rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 initial={{ x: 0 }}
//                 whileHover={{ x: 4 }}
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
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
//       className="relative flex flex-col w-full cursor-pointer rounded-3xl group bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden hover:bg-white/20"
//     >
//       {/* تأثير الخلفية الزجاجية */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 backdrop-blur-xl" />

//       {/* تأثير إشعاعي متحرك */}
//       <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-1000" />

//       {/* زر المفضلة */}
//       <FavoriteButton
//         item={item}
//         className="top-4 left-4 z-20 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30"
//       />

//       {/* شارة جديدة */}
//       {item.isNew && (
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
//           className="absolute top-4 left-12 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl z-20 backdrop-blur-sm border border-white/30 flex items-center gap-1"
//         >
//           <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
//           جديد
//         </motion.div>
//       )}

//       {/* قسم الصورة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-3xl"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="transition-all duration-700 ease-out group-hover:scale-110"
//         />

//         {/* المستخدم */}
//         <UserNameAndPhoto post={item} size={'size-10'} />

//         {/* طبقة تدرج لوني */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

//         {/* التاريخ */}
//         {item && (
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1.5 text-xs text-white font-medium shadow-lg flex items-center gap-1"
//             dir="ltr"
//           >
//             {formatDate(item?.createdAt) || ''}
//             <svg
//               className="w-3 h-3 text-white/80"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </motion.div>
//         )}

//         {/* المخزون */}
//         {item?.stockQuantity && (
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             className="absolute bottom-4 left-4 z-10 flex justify-center items-center bg-black/40 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-lg text-xs font-medium text-white border border-white/20 gap-1"
//           >
//             <svg
//               className="size-4 text-green-300"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {item?.stockQuantity} متوفر
//           </motion.div>
//         )}
//       </div>

//       {/* محتوى البطاقة */}
//       <div className="flex-1 p-6 relative">
//         <div className="relative z-20">
//           {/* العنوان والموقع */}
//           <div className="mb-4" onClick={handleClick}>
//             <DetailsSection item={item} />
//           </div>

//           {/* الحقول الإضافية */}
//           <div className="flex justify-center items-center border-t border-white/20 pt-4 mb-4">
//             <AdditionalFields item={item} category={category} />
//           </div>

//           {/* السعر وزر التفاصيل */}
//           <motion.div
//             className="flex flex-col justify-between items-center pt-4 border-t border-white/20"
//             whileHover={{ scale: 1.01 }}
//           >
//             {/* السعر */}
//             <div className="flex items-baseline gap-3 w-full justify-center mb-4">
//               {item.oldPrice && (
//                 <span className="text-sm text-gray-400 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl font-bold text-white">
//                   <span className="text-green-300 mx-2">$</span>
//                   {item.basePrice?.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* زر التفاصيل */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:bg-white/30 hover:shadow-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <span>عرض التفاصيل</span>
//               <motion.svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 rtl:rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 initial={{ x: 0 }}
//                 whileHover={{ x: 4 }}
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

//       {/* تأثير حدود متوهجة */}
//       <div className="absolute inset-0 rounded-3xl border border-white/10 group-hover:border-white/30 transition-all duration-500 pointer-events-none" />
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
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5 }}
//       className="relative flex flex-col w-full cursor-pointer rounded-2xl group bg-gradient-to-br from-gray-900 to-black border border-gray-800 shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out overflow-hidden hover:border-cyan-500/30"
//     >
//       {/* تأثير إشعاعي */}
//       <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

//       {/* خطوط متوهجة */}
//       <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />

//       {/* زر المفضلة */}
//       <FavoriteButton
//         item={item}
//         className="top-4 left-4 z-20 bg-gray-800/80 backdrop-blur-md border border-gray-700 text-white shadow-xl hover:bg-gray-700 hover:scale-110 transition-all duration-300"
//       />

//       {/* شارة جديدة */}
//       {item.isNew && (
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: 'spring' }}
//           className="absolute top-4 left-12 z-20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1 border border-cyan-400/30"
//         >
//           <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
//           جديد
//         </motion.div>
//       )}

//       {/* قسم الصورة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-2xl"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="w-full h-48 object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
//         />

//         {/* طبقة تدرج لوني */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

//         {/* المستخدم */}
//         <div className="absolute top-3 right-3 z-10">
//           <UserNameAndPhoto post={item} size={'size-9'} />
//         </div>

//         {/* المعلومات السفلية */}
//         <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
//           {/* التاريخ */}
//           {item && (
//             <div className="bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 text-xs text-gray-300 font-medium flex items-center gap-1 border border-gray-700">
//               <svg
//                 className="w-3 h-3 text-cyan-400"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {formatDate(item?.createdAt) || ''}
//             </div>
//           )}

//           {/* المخزون */}
//           {item?.stockQuantity && (
//             <div className="bg-green-600/80 backdrop-blur-md rounded-lg px-2 py-1 text-xs text-white font-medium flex items-center gap-1 border border-green-500/30">
//               <svg
//                 className="w-3 h-3 text-white"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {item?.stockQuantity}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* محتوى البطاقة */}
//       <div className="flex-1 p-5 relative">
//         <div className="relative z-20">
//           {/* العنوان والموقع */}
//           <div className="mb-4" onClick={handleClick}>
//             <DetailsSection item={item} />
//           </div>

//           {/* الحقول الإضافية */}
//           <div className="flex justify-center items-center border-t border-gray-800 pt-4 mb-4">
//             <AdditionalFields item={item} category={category} />
//           </div>

//           {/* السعر وزر التفاصيل */}
//           <motion.div
//             className="flex flex-col justify-between items-center pt-4 border-t border-gray-800"
//             whileHover={{ scale: 1.01 }}
//           >
//             {/* السعر */}
//             <div className="flex items-baseline gap-3 w-full justify-center mb-4">
//               {item.oldPrice && (
//                 <span className="text-sm text-gray-500 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
//                   ${item.basePrice?.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* زر التفاصيل */}
//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//                 background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
//               }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 font-semibold"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <span>عرض التفاصيل</span>
//               <motion.svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 rtl:rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 initial={{ x: 0 }}
//                 whileHover={{ x: 4 }}
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
//       initial={{ opacity: 0, y: 25 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="relative flex flex-col w-full cursor-pointer rounded-3xl group bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 ease-out overflow-hidden border border-gray-100 hover:border-blue-200"
//     >
//       {/* خلفية جراديانت ديناميكية */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//       {/* تأثير إشعاعي */}
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

//       {/* زر المفضلة */}
//       <FavoriteButton
//         item={item}
//         className="top-5 left-5 z-20 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
//       />

//       {/* شارة جديدة */}
//       {item.isNew && (
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.3, type: 'spring' }}
//           className="absolute top-5 left-16 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2"
//         >
//           <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
//           جديد
//         </motion.div>
//       )}

//       {/* قسم الصورة */}
//       <div
//         className="relative w-full overflow-hidden rounded-t-3xl"
//         onClick={handleClick}
//       >
//         <ImageComponent
//           item={item}
//           className="w-full h-48 object-cover transition-all duration-700 ease-out group-hover:scale-110"
//         />

//         {/* طبقة تدرج لوني */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

//         {/* المستخدم */}
//         <div className="absolute top-4 right-4 z-10">
//           <UserNameAndPhoto post={item} size={'size-10'} />
//         </div>

//         {/* المعلومات السفلية */}
//         <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
//           {/* التاريخ */}
//           {item && (
//             <div className="bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 text-xs text-gray-700 font-semibold flex items-center gap-2 shadow-lg">
//               <svg
//                 className="w-3 h-3 text-blue-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {formatDate(item?.createdAt) || ''}
//             </div>
//           )}

//           {/* المخزون */}
//           {item?.stockQuantity && (
//             <div className="bg-green-500/90 backdrop-blur-md rounded-xl px-3 py-2 text-xs text-white font-semibold flex items-center gap-2 shadow-lg">
//               <svg
//                 className="w-3 h-3 text-white"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {item?.stockQuantity}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* محتوى البطاقة */}
//       <div className="flex-1 p-6 relative">
//         <div className="relative z-20">
//           {/* العنوان والموقع */}
//           <div className="mb-4" onClick={handleClick}>
//             <DetailsSection item={item} />
//           </div>

//           {/* الحقول الإضافية */}
//           <div className="flex justify-center items-center border-t border-gray-100 pt-4 mb-4">
//             <AdditionalFields item={item} category={category} />
//           </div>

//           {/* السعر وزر التفاصيل */}
//           <motion.div
//             className="flex flex-col justify-between items-center pt-4 border-t border-gray-100"
//             whileHover={{ scale: 1.01 }}
//           >
//             {/* السعر */}
//             <div className="flex items-baseline gap-3 w-full justify-center mb-4">
//               {item.oldPrice && (
//                 <span className="text-base text-gray-500 line-through font-medium">
//                   {item.oldPrice?.toLocaleString()}
//                 </span>
//               )}
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   ${item.basePrice?.toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* زر التفاصيل */}
//             <motion.button
//               whileHover={{
//                 scale: 1.05,
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//               }}
//               whileTap={{ scale: 0.95 }}
//               className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <span>عرض التفاصيل</span>
//               <motion.svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 rtl:rotate-180"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 initial={{ x: 0 }}
//                 whileHover={{ x: 4 }}
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
import AdditionalFields from './AdditionalFields';
import FavoriteButton from './FavoriteButton';
import UserNameAndPhoto from '../userNameAndPhoto';
import { formatDistanceToNow } from 'date-fns';

const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('item', JSON.stringify(item));
      localStorage.setItem('category', JSON.stringify(category));
    }
    router.push(`/post/${item?.id}`);
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
        scale: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      className="relative flex flex-col w-full cursor-pointer rounded-lg group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border-2 border-gray-200 hover:border-primary-400 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] hover:shadow-[0_16px_64px_0_rgba(59,130,246,0.15)] transition-all duration-700 ease-out overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%,
            rgba(255,255,255,0.05) 50%,
            rgba(255,255,255,0.1) 100%
          )
        `,
      }}
    >
      {/* تأثير إشعاعي متحرك */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute -inset-10 bg-gradient-to-r from-violet-500/10 via-transparent to-fuchsia-500/10 animate-pulse" />
      </div>

      {/* تأثير نيومورفيك للحدود */}
      <div className="absolute inset-0 rounded-lg border border-white/30 shadow-[inset_1px_1px_2px_0_rgba(255,255,255,0.2),inset_-1px_-1px_2px_0_rgba(0,0,0,0.1)]" />

      {/* زر المفضلة متطور */}
      <FavoriteButton
        item={item}
        className="top-5 left-5 z-30 bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_0_rgba(0,0,0,0.1)] hover:bg-white/25 hover:scale-110 transition-all duration-300"
      />

      {/* شارة جديدة بتأثير متطور */}
      {item.isNew && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.4,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="absolute top-5 left-16 z-30 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl border border-white/30 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          <span>جديد</span>
        </motion.div>
      )}

      {/* قسم الصورة مع تأثيرات متطورة */}
      <div
        className="relative w-full overflow-hidden rounded-t-lg min-h-[200px]"
        onClick={handleClick}
      >
        <ImageComponent
          item={item}
          className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
        />

        {/* طبقات متعددة من التدرجات */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* المستخدم */}
        <div className="absolute top-2 right-2 z-20">
          <UserNameAndPhoto post={item} size={'size-11'} />
        </div>

        {/* المعلومات السفلية */}
        <div className="absolute bottom-0 left-0 right-0 p-2 ">
          <div className="flex justify-between items-center">
            {/* التاريخ */}
            {item && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {formatDate(item?.createdAt) || ''}
              </motion.div>
            )}

            {/* المخزون */}
            {item?.stockQuantity && (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="bg-white/20 backdrop-blur-xl rounded-2xl px-2 py-1 text-nowrap text-xs text-white font-semibold flex items-center gap-2 border border-white/20 shadow-lg"
              >
                <svg
                  className="w-4 h-4 text-lime-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item?.stockQuantity} متوفر
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="flex-1 p-6 pt-2 relative">
        {/* تأثير خلفية للمحتوى */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5" />

        <div className="relative z-20">
          {/* العنوان والموقع */}
          <div onClick={handleClick}>
            <DetailsSection item={item} />
          </div>

          {/* الحقول الإضافية */}
          <div className="flex justify-center items-center rounded-b-lg p-2 ">
            <AdditionalFields item={item} category={category} />
          </div>

          {/* السعر وزر التفاصيل */}
          <motion.div
            className="flex flex-col justify-between items-center pt-5 border-t border-white/20"
            whileHover={{ scale: 1.01 }}
          >
            {/* السعر */}
            <div className="flex items-baseline gap-4 w-full justify-center mb-5">
              {item.oldPrice && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  {item.oldPrice?.toLocaleString()}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  <span className="text-green-500 mx-2">$</span>
                  {item.basePrice?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* زر التفاصيل */}
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary-600 to-primary-400 hover:from-gray-600 hover:to-gray-400 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl group/btn relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* تأثير إشعاعي للزر */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

              <span className="font-bold text-lg">عرض التفاصيل</span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 rtl:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* تأثير ضوء متحرك */}
      {/* <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" />
      </div> */}
    </motion.div>
  );
});

export default SmallCard;
