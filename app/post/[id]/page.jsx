// 'use client';
// import React, { useEffect, useState, useMemo } from 'react';
// import Loading from '../../../components/ReusableComponents/Loading';
// import dynamic from 'next/dynamic';
// import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
// import {
//   FaTag,
//   FaClock,
//   FaDollarSign,
//   FaMapMarkerAlt,
//   FaPhone,
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import LoginButton from '../../../components/Buttons/LoginButton';
// import categories from '../../../components/Categories/categories';
// import Button from '../../../components/Buttons/Button';
// // تحميل المكونات بشكل ديناميكي
// const ImageSlider = dynamic(
//   () => import('../../../components/photos/imageSlider'),
//   {
//     loading: () => <Loading />,
//   }
// );

// const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
//   loading: () => <Loading />,
// });

// const UserNameAndPhoto = dynamic(
//   () => import('../../../components/ReusableComponents/userNameAndPhoto'),
//   {
//     loading: () => <Loading />,
//   }
// );

// export default function Page() {
//   const [post, setPost] = useState({});
//   const [iframeSrc, setIframeSrc] = useState(null);
//   const [categoryFields, setCategoryFields] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const item = JSON.parse(localStorage.getItem('item'));
//       setPost(item);
//       // console.log('item', item);
//     }
//   }, []);

//   useEffect(() => {
//     if (post?.categoryName) {
//       import(`../../../components/categoryFields/${post?.categoryName}.jsx`)
//         .then((module) => {
//           setCategoryFields(module.default);
//         })
//         .catch((err) => {
//           console.error('Failed to load fields:', err);
//           setError('فشل في تحميل الحقول');
//         });
//     }
//   }, [post?.categoryName]);

//   const getFieldValue = (field, value) => {
//     if (field.options && field.options[value]) {
//       // console.log('field.options[value]', field.options[value]);
//       return field.options[value];
//     }
//     return value;
//   };

//   const commonFields = useMemo(
//     () => [
//       {
//         name: 'العنوان',
//         icon: <FaTag className="text-primary-500 text-lg sm:text-xl" />,
//         value: post?.title,
//       },
//       {
//         name: 'تاريخ الإعلان',
//         icon: <FaClock className="text-primary-500 text-lg sm:text-xl" />,
//         value: post?.createdAt,
//       },
//       {
//         name: 'السعر',
//         icon: <FaDollarSign className="text-primary-500 text-lg sm:text-xl" />,
//         value: post?.basePrice,
//       },
//       {
//         name: 'المدينة',
//         icon: (
//           <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
//         ),
//         value: post?.city,
//       },
//       {
//         name: 'المنطقة',
//         icon: (
//           <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
//         ),
//         value: post?.town,
//       },
//       {
//         name: 'رقم الهاتف',
//         icon: <FaPhone className="text-primary-500 text-lg sm:text-xl" />,
//         value: post?.phoneNumber,
//       },
//     ],
//     [post]
//   );

//   const fields = useMemo(
//     () => [...commonFields, ...categoryFields],
//     [commonFields, categoryFields]
//   );

//   useEffect(() => {
//     const fetchEmbedUrl = async () => {
//       if (post?.link) {
//         const embedUrl = await getEmbedUrl(post?.link);
//         setIframeSrc(embedUrl);
//       }
//     };
//     fetchEmbedUrl();
//   }, [post?.link]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   const getEmbedUrl = async (url) => {
//     if (!url) return null;

//     // رابط يوتيوب
//     if (url.includes('youtube.com') || url.includes('youtube')) {
//       const videoId = url.match(
//         /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
//       );
//       if (videoId && videoId[1]) {
//         const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
//         return (await checkUrl(embedUrl)) ? embedUrl : null;
//       }
//     }

//     // رابط تيك توك
//     if (url.includes('tiktok.com')) {
//       const videoId = url.match(/\/video\/(\d+)/);
//       if (videoId && videoId[1]) {
//         const embedUrl = `https://www.tiktok.com/embed/${videoId[1]}`;
//         return (await checkUrl(embedUrl)) ? embedUrl : null;
//       }
//     }

//     return null; // إذا لم يكن الرابط يوتيوب أو تيك توك صالح
//   };

//   // دالة للتحقق من صلاحية الرابط
//   const checkUrl = async (url) => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
//       return response.ok;
//     } catch (error) {
//       console.error('رابط غير صالح:', error);
//       return false;
//     }
//   };

//   return (
//     <div className="flex flex-col justify-start items-center w-full min-h-screen p-2 sm:p-12 mt-16 sm:mt-2 rounded-lg overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full xl:w-[80%] 2xl:w-[70%] rounded-lg bg-gray-100 shadow-2xl overflow-hidden"
//       >
//         <div className="relative w-[200px] z-50 top-2 right-2">
//           <UserNameAndPhoto post={post} size={'size-8'} rounded={true} />
//         </div>
//         <div className="relative flex flex-col justify-center items-center w-full h-full sm:px-16 pt-2 z-10 px-2 border">
//           <div className="flex justify-center w-full">
//             <div className="flex flex-col w-full p-2 sm:p-8 my-2">
//               {/* عرض العنوان إذا كان موجودًا */}
//               {post?.title && (
//                 <div className="flex justify-center w-full mt-12">
//                   <h1 className="my-4 text-sm sm:text-3xl select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
//                     {post?.title}
//                   </h1>
//                 </div>
//               )}

//               {/* عرض Loading إذا لم توجد صورة */}
//               {!post?.image1 && <Loading myMessage={'جاري تحميل الصورة'} />}

//               {/* عرض ImageSlider إذا كانت هناك صور */}
//               {(post?.image1 ||
//                 post?.image2 ||
//                 post?.image3 ||
//                 post?.image4 ||
//                 post?.image5) && (
//                 <ImageSlider
//                   image1={post?.image1}
//                   image2={post?.image2}
//                   image3={post?.image3}
//                   image4={post?.image4}
//                   image5={post?.image5}
//                 />
//               )}

//               <div className="mt-4 sm:mt-16">
//                 {/* عرض مواصفات الإعلان إذا كانت هناك تفاصيل */}
//                 {post?.details && (
//                   <div>
//                     <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
//                       <h1 className="text-lg sm:text-xl w-full mb-2 select-none">
//                         <span className="text-primary-500 text-lg sm:text-2xl mx-2 select-none">
//                           #
//                         </span>
//                         مواصفات الإعلان:
//                       </h1>
//                     </div>

//                     <div className="flex flex-col w-full">
//                       <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
//                         {fields.map((field, index) => {
//                           const value =
//                             post?.details?.[field?.name] || field?.value;
//                           const displayValue = getFieldValue(field, value);
//                           // console.log('displayValue', displayValue);

//                           // عرض الحقل فقط إذا كانت القيمة موجودة
//                           return displayValue ? (
//                             <ItemSmallItem
//                               key={index}
//                               icon={field?.icon}
//                               text={field?.label || field?.name}
//                               value={displayValue}
//                             />
//                           ) : null;
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* عرض وصف الإعلان إذا كان موجودًا */}
//                 {post?.description && (
//                   <div>
//                     <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
//                       <h1 className="text-primary-500 text-lg sm:text-xl w-full mb-2 select-none">
//                         <span className="text-primary-500 text-lg lg:text-2xl mx-2 select-none">
//                           #
//                         </span>
//                         وصف الإعلان:
//                       </h1>
//                     </div>

//                     <div className="p-4 w-full rounded-lg">
//                       <pre className="flex justify-start items-start bg-white rounded-lg h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
//                         {post?.description}
//                       </pre>
//                     </div>
//                   </div>
//                 )}

//                 {/* عرض الخريطة إذا كانت الإحداثيات موجودة */}
//                 {post?.lng && post?.lat && (
//                   <div>
//                     <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
//                       <h1 className="text-primary-500 text-lg sm:text-xl w-full mb-2 select-none">
//                         <span className="text-primary-500 text-2xl mx-2 select-none">
//                           #
//                         </span>
//                         الموقع على الخريطة:
//                       </h1>
//                     </div>
//                     <div>
//                       <SyriaMap lng={post?.lng} lat={post?.lat} />
//                     </div>
//                   </div>
//                 )}

//                 {/* عرض الفيديو إذا كان الرابط موجودًا */}
//                 {post?.link && iframeSrc && (
//                   <div>
//                     <div className="flex justify-between items-center my-4 sm:my-4 h-10 sm:h-16 w-full overflow-visible">
//                       <h1 className="text-primary-500 text-lg sm:text-xl w-full mb-2 select-none">
//                         <span className="text-primary-500 text-2xl mx-2 select-none">
//                           #
//                         </span>
//                         الفيديو :
//                       </h1>
//                     </div>
//                     <div className="flex justify-center items-center w-full">
//                       <div className="flex flex-col w-full">
//                         {iframeSrc && (
//                           <iframe
//                             src={iframeSrc}
//                             className="w-full h-44 sm:h-96"
//                             title="Property Video"
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Button
//           title="عودة للصفحة الرئيسية"
//           path="/"
//           style="btn bg-primary-500 text-white hover:bg-primary-600 transition-all py-3 mb-4 rounded-lg w-1/2 text-lg font-semibold w-[80%] lg:w-1/2"
//         />
//       </motion.div>
//     </div>
//   );
// }
// 'use client';
// import React, { useEffect, useState, useMemo } from 'react';
// import Loading from '../../../components/ReusableComponents/Loading';
// import dynamic from 'next/dynamic';
// import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
// import {
//   FaTag,
//   FaClock,
//   FaDollarSign,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaArrowLeft,
//   FaShareAlt,
//   FaHeart,
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import Button from '../../../components/Buttons/Button';
// import BackButton from '../../../components/Buttons/BackButton';

// // تحميل المكونات بشكل ديناميكي مع تعطيل SSR
// const ImageSlider = dynamic(
//   () => import('../../../components/photos/imageSlider'),
//   {
//     loading: () => <Loading />,
//     ssr: false,
//   },
// );

// const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
//   loading: () => <Loading />,
//   ssr: false,
// });

// const UserNameAndPhoto = dynamic(
//   () => import('../../../components/ReusableComponents/userNameAndPhoto'),
//   {
//     loading: () => (
//       <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
//     ),
//     ssr: false,
//   },
// );

// export default function Page() {
//   const [post, setPost] = useState(null);
//   const [isClient, setIsClient] = useState(false);
//   const [iframeSrc, setIframeSrc] = useState(null);
//   const [categoryFields, setCategoryFields] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // تهيئة العميل وجلب البيانات من localStorage
//   useEffect(() => {
//     setIsClient(true);
//     const loadData = async () => {
//       try {
//         if (typeof window !== 'undefined') {
//           const itemData = localStorage.getItem('item');
//           if (itemData) {
//             const parsedItem = JSON.parse(itemData);
//             setPost(parsedItem);
//           } else {
//             setError('لا توجد بيانات للإعلان');
//           }
//         }
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('حدث خطأ في تحميل البيانات');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // تحميل حقول التصنيف عندما يكون العميل جاهزًا
//   useEffect(() => {
//     if (isClient && post?.categoryName) {
//       import(`../../../components/categoryFields/${post?.categoryName}.jsx`)
//         .then((module) => {
//           setCategoryFields(module.default);
//         })
//         .catch((err) => {
//           console.error('Failed to load fields:', err);
//           setError('فشل في تحميل الحقول');
//         });
//     }
//   }, [isClient, post?.categoryName]);

//   // جلب رابط الفيديو المدمج
//   useEffect(() => {
//     const fetchEmbedUrl = async () => {
//       if (isClient && post?.link) {
//         const embedUrl = await getEmbedUrl(post?.link);
//         setIframeSrc(embedUrl);
//       }
//     };
//     fetchEmbedUrl();
//   }, [isClient, post?.link]);

//   const getFieldValue = (field, value) => {
//     if (field.options && field.options[value]) {
//       return field.options[value];
//     }
//     return value;
//   };

//   const commonFields = useMemo(() => {
//     if (!isClient) return [];

//     return [
//       {
//         name: 'العنوان',
//         icon: <FaTag className="text-purple-500 text-lg sm:text-xl" />,
//         value: post?.title,
//       },
//       {
//         name: 'تاريخ الإعلان',
//         icon: <FaClock className="text-blue-500 text-lg sm:text-xl" />,
//         value: post?.createdAt,
//       },
//       {
//         name: 'السعر',
//         icon: <FaDollarSign className="text-green-500 text-lg sm:text-xl" />,
//         value: post?.basePrice,
//       },
//       {
//         name: 'المدينة',
//         icon: <FaMapMarkerAlt className="text-red-500 text-lg sm:text-xl" />,
//         value: post?.city,
//       },
//       {
//         name: 'المنطقة',
//         icon: <FaMapMarkerAlt className="text-orange-500 text-lg sm:text-xl" />,
//         value: post?.town,
//       },
//       {
//         name: 'رقم الهاتف',
//         icon: <FaPhone className="text-teal-500 text-lg sm:text-xl" />,
//         value: post?.phoneNumber,
//       },
//     ];
//   }, [isClient, post]);

//   const fields = useMemo(
//     () => [...commonFields, ...categoryFields],
//     [commonFields, categoryFields],
//   );

//   const getEmbedUrl = async (url) => {
//     if (!url) return null;

//     if (url.includes('youtube.com') || url.includes('youtube')) {
//       const videoId = url.match(
//         /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
//       );
//       if (videoId && videoId[1]) {
//         const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
//         return (await checkUrl(embedUrl)) ? embedUrl : null;
//       }
//     }

//     if (url.includes('tiktok.com')) {
//       const videoId = url.match(/\/video\/(\d+)/);
//       if (videoId && videoId[1]) {
//         const embedUrl = `https://www.tiktok.com/embed/${videoId[1]}`;
//         return (await checkUrl(embedUrl)) ? embedUrl : null;
//       }
//     }

//     return null;
//   };

//   const checkUrl = async (url) => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
//       return response.ok;
//     } catch (error) {
//       console.error('رابط غير صالح:', error);
//       return false;
//     }
//   };

//   const handleLike = () => {
//     setIsLiked(!isLiked);
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: post?.title,
//         text: post?.description,
//         url: window.location.href,
//       });
//     } else {
//       // Fallback for browsers that don't support Web Share API
//       navigator.clipboard.writeText(window.location.href).then(() => {
//         alert('تم نسخ الرابط إلى الحافظة');
//       });
//     }
//   };

//   // عرض حالة التحميل
//   if (!isClient || isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         <Loading myMessage={'جاري تحميل البيانات...'} />
//       </div>
//     );
//   }

//   // عرض حالة الخطأ
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
//         >
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button
//             title="العودة للرئيسية"
//             path="/"
//             style="btn bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
//           />
//         </motion.div>
//       </div>
//     );
//   }

//   // إذا لم توجد بيانات الإعلان
//   if (!post) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
//         >
//           <div className="text-yellow-500 text-6xl mb-4">📝</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             لا توجد بيانات
//           </h2>
//           <p className="text-gray-600 mb-4">لم يتم العثور على بيانات الإعلان</p>
//           <Button
//             title="العودة للرئيسية"
//             path="/"
//             style="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
//           />
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-red-600 to-indigo-100 ">
//       <div className="flex flex-col items-center w-full min-h-screen p-4 sm:p-6 pt-20 sm:pt-8 mt-64">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: 'easeOut' }}
//           className="w-full xl:w-[85%] 2xl:w-[75%] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/60 overflow-hidden"
//         >
//           {/* Header Section */}
//           <div className="relative bg-gradient-to-r from-primary-600 via-primary-400 to-primary-500 p-6">
//             <div className="absolute top-4 right-4 z-20">
//               <UserNameAndPhoto post={post} size={'size-10'} rounded={true} />
//             </div>

//             <div className="flex justify-end items-center gap-2 mb-4">
//               <div className="flex gap-3">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleLike}
//                   className={`p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
//                     isLiked
//                       ? 'bg-red-500 text-white border-red-500'
//                       : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
//                   }`}
//                 >
//                   <FaHeart className="text-lg" />
//                 </motion.button>
//               </div>
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex justify-end"
//               >
//                 <BackButton />
//               </motion.div>
//             </div>

//             {post?.title && (
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-2xl sm:text-4xl font-bold text-white text-center leading-tight mt-8 mb-4 drop-shadow-lg"
//                 suppressHydrationWarning={true}
//               >
//                 {post.title}
//               </motion.h1>
//             )}
//           </div>

//           {/* Content Section */}
//           <div className="p-4 sm:p-8">
//             {/* Image Slider */}
//             <AnimatePresence>
//               {!post?.image1 ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="mb-8"
//                 >
//                   <Loading myMessage={'جاري تحميل الصور'} />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="mb-8"
//                 >
//                   <ImageSlider
//                     image1={post?.image1}
//                     image2={post?.image2}
//                     image3={post?.image3}
//                     image4={post?.image4}
//                     image5={post?.image5}
//                   />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Specifications Section */}
//             {post?.details && (
//               <motion.section
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="mb-12"
//               >
//                 <div className="flex items-center mb-8">
//                   <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                     مواصفات الإعلان
//                   </h2>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   {fields.map((field, index) => {
//                     const value = post?.details?.[field?.name] || field?.value;
//                     const displayValue = getFieldValue(field, value);

//                     return displayValue ? (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: 0.5 + index * 0.1 }}
//                       >
//                         <ItemSmallItem
//                           icon={field?.icon}
//                           text={field?.label || field?.name}
//                           value={displayValue}
//                         />
//                       </motion.div>
//                     ) : null;
//                   })}
//                 </div>
//               </motion.section>
//             )}

//             {/* Description Section */}
//             {post?.description && (
//               <motion.section
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="mb-12"
//               >
//                 <div className="flex items-center mb-8">
//                   <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                     وصف الإعلان
//                   </h2>
//                 </div>

//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100"
//                 >
//                   <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-loose text-lg sm:text-xl bg-transparent overflow-y-auto max-h-96">
//                     {post?.description}
//                   </pre>
//                 </motion.div>
//               </motion.section>
//             )}

//             {/* Map Section */}
//             {post?.lng && post?.lat && (
//               <motion.section
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.7 }}
//                 className="mb-12"
//               >
//                 <div className="flex items-center mb-8">
//                   <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
//                     الموقع على الخريطة
//                   </h2>
//                 </div>

//                 <motion.div
//                   whileHover={{ scale: 1.01 }}
//                   className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
//                 >
//                   <SyriaMap lng={post?.lng} lat={post?.lat} />
//                 </motion.div>
//               </motion.section>
//             )}

//             {/* Video Section */}
//             {post?.link && iframeSrc && (
//               <motion.section
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.8 }}
//                 className="mb-12"
//               >
//                 <div className="flex items-center mb-8">
//                   <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full mr-4"></div>
//                   <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
//                     الفيديو
//                   </h2>
//                 </div>

//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-black"
//                 >
//                   {iframeSrc && (
//                     <iframe
//                       src={iframeSrc}
//                       className="w-full h-64 sm:h-96"
//                       title="Property Video"
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                     />
//                   )}
//                 </motion.div>
//               </motion.section>
//             )}
//           </div>

//           {/* Footer Button */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9 }}
//             className="p-6 bg-gradient-to-r from-gray-50 to-slate-100 border-t border-gray-200/50"
//           >
//             <div className="flex justify-center">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <Button
//                   title="عودة للصفحة الرئيسية"
//                   path="/"
//                   style="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 text-lg"
//                 />
//               </motion.div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Floating Background Elements */}
//       <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
//         <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Loading from '../../../components/ReusableComponents/Loading';
import dynamic from 'next/dynamic';
import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
import {
  FaTag,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaHeart,
  FaShareAlt,
  FaArrowLeft,
  Fire,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import BackButton from '../../../components/Buttons/BackButton';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCommerce } from '../../../contexts/CommerceContext';
import { useParams } from 'next/navigation';
import demoProducts from '../../../lib/demoProducts';

const ImageSlider = dynamic(
  () => import('../../../components/photos/imageSlider'),
  {
    loading: () => <Loading myMessage="جاري التحميل..." />,
    ssr: false,
  },
);

const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
  loading: () => <Loading myMessage="جاري تحميل الخريطة..." />,
  ssr: false,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => (
      <div className="w-10 h-10 bg-neutral-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  },
);

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart, favoriteItems, toggleFavorite } = useCommerce();

  useEffect(() => {
    if (post?.isDemo) {
      setIsLiked(favoriteItems.some((item) => item.id === post.id));
    }
  }, [post, favoriteItems]);

  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const itemData = localStorage.getItem('item');
          if (itemData) {
            const storedItem = JSON.parse(itemData);
            if (storedItem?.id === id) {
              setPost(storedItem);
              return;
            }
          }

          const demoProduct = demoProducts.find((product) => product.id === id);
          if (demoProduct) {
            setPost(demoProduct);
          } else {
            setError('لم يتم العثور على الإعلان');
          }
        }
      } catch (err) {
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (isClient && post?.categoryName) {
      import(`../../../components/categoryFields/${post.categoryName}.jsx`)
        .then((module) => setCategoryFields(module.default))
        .catch(() => setError('فشل في تحميل الحقول'));
    }
  }, [isClient, post?.categoryName]);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (isClient && post?.link) {
        const embedUrl = await getEmbedUrl(post.link);
        setIframeSrc(embedUrl);
      }
    };
    fetchEmbedUrl();
  }, [isClient, post?.link]);

  const getFieldValue = (field, value) =>
    field.options && field.options[value] ? field.options[value] : value;

  const commonFields = useMemo(() => {
    if (!isClient || !post) return [];
    return [
      {
        name: 'العنوان',
        icon: <FaTag className="text-orange-500" />,
        value: post.title,
      },
      {
        name: 'تاريخ النشر',
        icon: <FaClock className="text-amber-500" />,
        value: post.createdAt,
      },
      {
        name: 'السعر',
        icon: <FaDollarSign className="text-yellow-500" />,
        value: post.basePrice,
      },
      {
        name: 'المدينة',
        icon: <FaMapMarkerAlt className="text-red-500" />,
        value: post.city,
      },
      {
        name: 'المنطقة',
        icon: <FaMapMarkerAlt className="text-orange-600" />,
        value: post.town,
      },
      {
        name: 'الهاتف',
        icon: <FaPhone className="text-emerald-500" />,
        value: post.phoneNumber,
      },
    ];
  }, [isClient, post]);

  const fields = useMemo(
    () => [...commonFields, ...categoryFields],
    [commonFields, categoryFields],
  );

  const getEmbedUrl = async (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      if (videoId?.[1]) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }
    if (url.includes('tiktok.com')) {
      const videoId = url.match(/\/video\/(\d+)/);
      if (videoId?.[1]) {
        return `https://www.tiktok.com/embed/${videoId[1]}`;
      }
    }
    return null;
  };

  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleLike = () => {
    if (post?.isDemo) {
      toggleFavorite(post);
      return;
    }
    setIsLiked((liked) => !liked);
  };

  const handleAddToCart = () => {
    try {
      addToCart(post);
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (addError) {
      toast.error(addError.message);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loading myMessage="جاري التحميل..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/20 to-neutral-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-900/80 backdrop-blur-xl border border-orange-500/20 p-8 rounded-2xl text-center max-w-md w-full"
        >
          <div className="text-5xl mb-4">️</div>
          <h2 className="text-2xl font-bold text-white mb-2">حدث خطأ</h2>
          <p className="text-neutral-400 mb-6">
            {error || 'لم يتم العثور على الإعلان'}
          </p>
          <Button
            title="العودة للرئيسية"
            path="/"
            style="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden mt-60"
      dir="rtl"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          ADS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header with Price */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-3 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-all text-neutral-300 hover:text-white"
              >
                {copied ? (
                  <FiCheck className="text-emerald-500" />
                ) : (
                  <FaShareAlt className="text-lg" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                aria-label={isLiked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                aria-pressed={isLiked}
                className={`p-3 rounded-xl border transition-all ${
                  isLiked
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-red-500'
                }`}
              >
                <FaHeart className="text-lg" />
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4 rounded-2xl shadow-2xl shadow-orange-600/20 border border-orange-500/30"
          >
            <span className="text-3xl font-black text-white">
              {post.basePrice} <span className="text-lg font-bold">ل.س</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Image & Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/50"
            >
              {post?.image1 ? (
                <ImageSlider
                  image1={post.image1}
                  image2={post.image2}
                  image3={post.image3}
                  image4={post.image4}
                  image5={post.image5}
                />
              ) : (
                <div className="h-96 bg-neutral-900 flex items-center justify-center">
                  <Loading myMessage="لا توجد صور" />
                </div>
              )}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 overflow-hidden"
            >
              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-4 px-6 font-bold text-sm transition-all ${
                    activeTab === 'details'
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-900/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  التفاصيل
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-4 px-6 font-bold text-sm transition-all ${
                    activeTab === 'description'
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-900/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  الوصف
                </button>
                {post?.lng && post?.lat && (
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex-1 py-4 px-6 font-bold text-sm transition-all ${
                      activeTab === 'map'
                        ? 'bg-orange-600 text-white'
                        : 'bg-neutral-900/50 text-neutral-400 hover:text-white'
                    }`}
                  >
                    الموقع
                  </button>
                )}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {fields.map((field, index) => {
                      const value =
                        post?.details?.[field?.name] || field?.value;
                      const displayValue = getFieldValue(field, value);
                      if (!displayValue) return null;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 hover:border-orange-500/30 transition-all group"
                        >
                          <ItemSmallItem
                            icon={field?.icon}
                            text={field?.label || field?.name}
                            value={displayValue}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'description' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-invert max-w-none"
                  >
                    <p className="whitespace-pre-line text-neutral-300 leading-relaxed text-lg">
                      {post.description}
                    </p>
                  </motion.div>
                )}

                {activeTab === 'map' && post?.lng && post?.lat && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl overflow-hidden border border-neutral-700 h-96"
                  >
                    <SyriaMap lng={post.lng} lat={post.lat} />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Video Section */}
            {post?.link && iframeSrc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl overflow-hidden border border-neutral-800 shadow-xl"
              >
                <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-red-600 rounded-full" />
                    فيديو توضيحي
                  </h3>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full"
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Title & Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-8 border border-neutral-800 shadow-2xl"
            >
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold mb-4">
                  {post.categoryName || 'إعلان'}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                  {post.title}
                </h1>
              </div>

              <div className="space-y-4">
                <UserNameAndPhoto post={post} size="size-12" rounded={true} />

                {post?.isDemo && (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full rounded-xl bg-orange-500 px-6 py-4 font-bold text-black transition hover:bg-orange-400"
                  >
                    أضف إلى سلة التسوق
                  </button>
                )}

                {post?.phoneNumber && (
                  <a
                    href={`tel:${post.phoneNumber}`}
                    className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 group"
                  >
                    <FaPhone className="group-hover:scale-110 transition-transform" />
                    اتصل الآن
                  </a>
                )}

                <Button
                  title="العودة للرئيسية"
                  path="/"
                  style="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 px-6 rounded-xl transition-all border border-neutral-700"
                />
              </div>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/50 backdrop-blur-xl rounded-2xl p-6 border border-neutral-800"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
                معلومات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">المدينة</span>
                  <span className="text-white font-bold">{post.city}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">المنطقة</span>
                  <span className="text-white font-bold">
                    {post.town || 'غير محدد'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-400">تاريخ النشر</span>
                  <span className="text-white font-bold text-sm">
                    {post.createdAt}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
