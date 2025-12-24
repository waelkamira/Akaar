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
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import BackButton from '../../../components/Buttons/BackButton';

// تحميل المكونات بشكل ديناميكي مع تعطيل SSR
const ImageSlider = dynamic(
  () => import('../../../components/photos/imageSlider'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
  loading: () => <Loading />,
  ssr: false,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    ),
    ssr: false,
  }
);

export default function Page() {
  const [post, setPost] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // تهيئة العميل وجلب البيانات من localStorage
  useEffect(() => {
    setIsClient(true);
    const loadData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const itemData = localStorage.getItem('item');
          if (itemData) {
            const parsedItem = JSON.parse(itemData);
            setPost(parsedItem);
          } else {
            setError('لا توجد بيانات للإعلان');
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // تحميل حقول التصنيف عندما يكون العميل جاهزًا
  useEffect(() => {
    if (isClient && post?.categoryName) {
      import(`../../../components/categoryFields/${post?.categoryName}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
          setError('فشل في تحميل الحقول');
        });
    }
  }, [isClient, post?.categoryName]);

  // جلب رابط الفيديو المدمج
  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (isClient && post?.link) {
        const embedUrl = await getEmbedUrl(post?.link);
        setIframeSrc(embedUrl);
      }
    };
    fetchEmbedUrl();
  }, [isClient, post?.link]);

  const getFieldValue = (field, value) => {
    if (field.options && field.options[value]) {
      return field.options[value];
    }
    return value;
  };

  const commonFields = useMemo(() => {
    if (!isClient) return [];

    return [
      {
        name: 'العنوان',
        icon: <FaTag className="text-purple-500 text-lg sm:text-xl" />,
        value: post?.title,
      },
      {
        name: 'تاريخ الإعلان',
        icon: <FaClock className="text-blue-500 text-lg sm:text-xl" />,
        value: post?.createdAt,
      },
      {
        name: 'السعر',
        icon: <FaDollarSign className="text-green-500 text-lg sm:text-xl" />,
        value: post?.basePrice,
      },
      {
        name: 'المدينة',
        icon: <FaMapMarkerAlt className="text-red-500 text-lg sm:text-xl" />,
        value: post?.city,
      },
      {
        name: 'المنطقة',
        icon: <FaMapMarkerAlt className="text-orange-500 text-lg sm:text-xl" />,
        value: post?.town,
      },
      {
        name: 'رقم الهاتف',
        icon: <FaPhone className="text-teal-500 text-lg sm:text-xl" />,
        value: post?.phoneNumber,
      },
    ];
  }, [isClient, post]);

  const fields = useMemo(
    () => [...commonFields, ...categoryFields],
    [commonFields, categoryFields]
  );

  const getEmbedUrl = async (url) => {
    if (!url) return null;

    if (url.includes('youtube.com') || url.includes('youtube')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (videoId && videoId[1]) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }

    if (url.includes('tiktok.com')) {
      const videoId = url.match(/\/video\/(\d+)/);
      if (videoId && videoId[1]) {
        const embedUrl = `https://www.tiktok.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }

    return null;
  };

  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('رابط غير صالح:', error);
      return false;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('تم نسخ الرابط إلى الحافظة');
      });
    }
  };

  // عرض حالة التحميل
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Loading myMessage={'جاري تحميل البيانات...'} />
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            title="العودة للرئيسية"
            path="/"
            style="btn bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          />
        </motion.div>
      </div>
    );
  }

  // إذا لم توجد بيانات الإعلان
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
        >
          <div className="text-yellow-500 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            لا توجد بيانات
          </h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على بيانات الإعلان</p>
          <Button
            title="العودة للرئيسية"
            path="/"
            style="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex flex-col items-center w-full min-h-screen p-4 sm:p-6 pt-20 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full xl:w-[85%] 2xl:w-[75%] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/60 overflow-hidden"
        >
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-primary-600 via-primary-400 to-primary-500 p-6">
            <div className="absolute top-4 right-4 z-20">
              <UserNameAndPhoto post={post} size={'size-10'} rounded={true} />
            </div>

            <div className="flex justify-end items-center gap-2 mb-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-3 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                    isLiked
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                  }`}
                >
                  <FaHeart className="text-lg" />
                </motion.button>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-end"
              >
                <BackButton />
              </motion.div>
            </div>

            {post?.title && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-4xl font-bold text-white text-center leading-tight mt-8 mb-4 drop-shadow-lg"
                suppressHydrationWarning={true}
              >
                {post.title}
              </motion.h1>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-8">
            {/* Image Slider */}
            <AnimatePresence>
              {!post?.image1 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8"
                >
                  <Loading myMessage={'جاري تحميل الصور'} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <ImageSlider
                    image1={post?.image1}
                    image2={post?.image2}
                    image3={post?.image3}
                    image4={post?.image4}
                    image5={post?.image5}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Specifications Section */}
            {post?.details && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    مواصفات الإعلان
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => {
                    const value = post?.details?.[field?.name] || field?.value;
                    const displayValue = getFieldValue(field, value);

                    return displayValue ? (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ItemSmallItem
                          icon={field?.icon}
                          text={field?.label || field?.name}
                          value={displayValue}
                        />
                      </motion.div>
                    ) : null;
                  })}
                </div>
              </motion.section>
            )}

            {/* Description Section */}
            {post?.description && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    وصف الإعلان
                  </h2>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-loose text-lg sm:text-xl bg-transparent overflow-y-auto max-h-96">
                    {post?.description}
                  </pre>
                </motion.div>
              </motion.section>
            )}

            {/* Map Section */}
            {post?.lng && post?.lat && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-12"
              >
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    الموقع على الخريطة
                  </h2>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
                >
                  <SyriaMap lng={post?.lng} lat={post?.lat} />
                </motion.div>
              </motion.section>
            )}

            {/* Video Section */}
            {post?.link && iframeSrc && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-12"
              >
                <div className="flex items-center mb-8">
                  <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full mr-4"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    الفيديو
                  </h2>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-black"
                >
                  {iframeSrc && (
                    <iframe
                      src={iframeSrc}
                      className="w-full h-64 sm:h-96"
                      title="Property Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </motion.div>
              </motion.section>
            )}
          </div>

          {/* Footer Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-6 bg-gradient-to-r from-gray-50 to-slate-100 border-t border-gray-200/50"
          >
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  title="عودة للصفحة الرئيسية"
                  path="/"
                  style="btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 text-lg"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}
