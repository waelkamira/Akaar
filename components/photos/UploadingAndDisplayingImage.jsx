// 'use client';
// import { useContext, useState } from 'react';
// import Image from 'next/image';
// import { MdOutlineAddPhotoAlternate, MdClose } from 'react-icons/md';
// import { inputsContext } from '@/features/auth/inputs-context';
// import LoadingPhoto from './LoadingPhoto';
// import Link from 'next/link';
// import toast from 'react-hot-toast';

// export default function UploadingAndDisplayingImage({ images = [] }) {
//   const { dispatch, addImages } = useContext(inputsContext);
//   const [isLoading, setIsLoading] = useState(false);

//   // دالة للتحقق من وجود الصورة في المصفوفة
//   const isImageAlreadyAdded = (imageLink) => {
//     const allImages = [...(addImages || []), ...(images || [])];
//     return allImages.includes(imageLink);
//   };

//   // دالة لرفع الصورة إلى الخدمات بالتناوب
//   const uploadImage = async (file) => {
//     const services = ['Imgur', 'Imgbb', 'ImageKit'];
//     let uploadedLink = null;

//     for (const service of services) {
//       try {
//         let response;
//         let data;

//         if (service === 'ImageKit') {
//           const formData = new FormData();
//           formData.append('file', file);

//           response = await fetch('/api/uploadImageToImageKit', {
//             method: 'POST',
//             body: formData,
//           });

//           data = await response.json();
//         } else {
//           const formData = new FormData();
//           formData.append('image', file);

//           response = await fetch(`/api/uploadImageTo${service}`, {
//             method: 'POST',
//             body: formData,
//           });

//           data = await response.json();
//         }

//         if (data.success) {
//           uploadedLink =
//             data?.data?.url || data?.image?.url || data?.data?.link;
//           console.log(
//             `تم الرفع بنجاح إلى: ${service} - الرابط: ${uploadedLink}`
//           );
//           toast.success('تم رفع الصورة بنجاح');
//           break;
//         }
//       } catch (error) {
//         console.error(`فشل الرفع إلى ${service}:`, error);
//       }
//     }

//     if (!uploadedLink) {
//       toast.error('تعذر رفع الصورة. حاول مرة أخرى لاحقًا.');
//     }

//     return uploadedLink;
//   };

//   // دالة لمعالجة تغيير الملفات
//   const handleFileChange = async (event) => {
//     const selectedFiles = event.target.files;

//     const currentImagesCount = Array.isArray(addImages) ? addImages.length : 0;
//     if (currentImagesCount + selectedFiles.length > 5) {
//       alert('لا يمكن رفع أكثر من 5 صور للبوست الواحد');
//       return;
//     }

//     setIsLoading(true);

//     const newImages = [];

//     for (let i = 0; i < selectedFiles.length; i++) {
//       const file = selectedFiles[i];
//       const imageLink = await uploadImage(file);

//       if (imageLink && !isImageAlreadyAdded(imageLink)) {
//         newImages.push(imageLink);
//       } else if (imageLink) {
//         toast.error('هذه الصورة موجودة مسبقًا.');
//       }
//     }

//     setIsLoading(false);

//     // تحديث الحالة بإضافة الصور الجديدة
//     dispatch({
//       type: 'ADD_IMAGE',
//       payload: [...(addImages || []), ...newImages],
//     });
//   };

//   // دالة لإزالة صورة معينة
//   const handleRemoveImage = (index) => {
//     const updatedImages = [...(addImages || [])];
//     updatedImages.splice(index, 1);

//     // تحديث الحالة بإزالة الصورة
//     dispatch({
//       type: 'ADD_IMAGE',
//       payload: updatedImages,
//     });
//   };

//   // دمج الصور وتصفية الصور غير الصحيحة
//   const allImages = [...(images || []), ...(addImages || [])];
//   const filteredImages = allImages.filter(Boolean);

//   return (
//     <div className="flex flex-col justify-center items-center w-full px-2 sm:px-8 h-full my-8">
//       {/* الصورة الكبيرة في الأعلى */}
//       <div className="flex justify-center items-center relative w-full min-h-72 lg:h-[500px] border border-gray-300 rounded-lg mb-4 bg-white">
//         {isLoading ? (
//           <LoadingPhoto />
//         ) : filteredImages[0] ? (
//           <>
//             <Link href={'#post1'}>
//               <Image
//                 priority
//                 src={filteredImages[0]}
//                 alt="الصورة الرئيسية"
//                 fill
//                 style={{ objectFit: 'cover' }}
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 className="rounded-lg"
//               />
//             </Link>
//             <label
//               htmlFor="file-upload"
//               className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
//             >
//               <MdOutlineAddPhotoAlternate className="text-xl" />
//             </label>
//             <button
//               onClick={() => handleRemoveImage(0)}
//               className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
//             >
//               <MdClose className="text-xl" />
//             </button>
//           </>
//         ) : (
//           <label
//             htmlFor="file-upload"
//             className="flex flex-col items-center justify-center h-full cursor-pointer bg-white"
//           >
//             <MdOutlineAddPhotoAlternate className="text-primary-500 text-3xl" />
//             <h1 className="text-sm sm:text-lg">أضف صورة رئيسية</h1>
//           </label>
//         )}
//       </div>

//       {/* الأربع صور الصغيرة في الأسفل */}
//       <div className="flex justify-center items-center gap-2 w-full">
//         {Array.from({ length: 4 }).map((_, index) => (
//           <div
//             key={index}
//             className="relative size-16 sm:size-32 border border-gray-300 rounded-lg flex justify-center items-center bg-white"
//           >
//             {isLoading ? (
//               <LoadingPhoto />
//             ) : filteredImages[index + 1] ? (
//               <>
//                 <Image
//                   priority
//                   src={filteredImages[index + 1]}
//                   alt={`الصورة ${index + 2}`}
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   className="rounded-lg"
//                 />
//                 <label
//                   htmlFor="file-upload"
//                   className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
//                 >
//                   <MdOutlineAddPhotoAlternate className="text-xl" />
//                 </label>
//                 <button
//                   onClick={() => handleRemoveImage(index + 1)}
//                   className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
//                 >
//                   <MdClose className="text-xl" />
//                 </button>
//               </>
//             ) : (
//               <label
//                 htmlFor="file-upload"
//                 className="flex flex-col items-center cursor-pointer"
//               >
//                 <MdOutlineAddPhotoAlternate className="text-primary-500 text-xl sm:text-2xl lg:text-3xl" />
//                 <h1 className="text-[8px] sm:text-sm lg:text-lg">أضف صورة</h1>
//               </label>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Input لتحميل الصور */}
//       <input
//         type="file"
//         id="file-upload"
//         className="hidden"
//         onChange={handleFileChange}
//         multiple
//         accept="image/*"
//       />
//     </div>
//   );
// }
'use client';

import { useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // ✅ استيراد بوابة React
import Image from 'next/image';
import {
  MdOutlineAddPhotoAlternate,
  MdClose,
  MdCloudUpload,
  MdCheckCircle,
  MdError,
} from 'react-icons/md';
import { inputsContext } from '@/features/auth/inputs-context';

// 🌟 مكون العداد الزجاجي الفخم أثناء الرفع (مع Portal)
const GlassUploadLoader = ({ current, total, fileName }) => {
  // منع الأخطاء أثناء التصيير على الخادم (SSR)
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-2xl border border-orange-200/60 shadow-2xl shadow-orange-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* الحلقة الخلفية */}
        <svg
          className="w-12 h-12 text-gray-200 animate-spin"
          viewBox="0 0 50 50"
          style={{ animationDuration: '3s' }}
        >
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="3" />
        </svg>
        {/* الحلقة الأمامية البرتقالية */}
        <svg
          className="absolute top-0 left-0 w-12 h-12 text-orange-500 animate-spin"
          viewBox="0 0 50 50"
          style={{ animationDuration: '1.2s' }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="3"
            strokeDasharray="80"
            strokeDashoffset="20"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-orange-600">
          {current}/{total}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800">
          جاري رفع الصورة <span className="text-orange-600">{current}</span> من{' '}
          <span className="text-gray-500">{total}</span>
        </span>
        <span className="text-xs text-gray-500 mt-1 truncate max-w-[200px] font-medium">
          {fileName}
        </span>
      </div>
    </div>,
    document.body, // ✅ renders directly to the body, escaping all parent z-index/overflow limits
  );
};

// 🌟 مكون الإشعارات المخصص (مع Portal)
const CustomNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  const isSuccess = type === 'success';

  return createPortal(
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-xl backdrop-blur-2xl border shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500 ${
        isSuccess
          ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 shadow-emerald-500/20'
          : 'bg-rose-50/95 border-rose-200 text-rose-800 shadow-rose-500/20'
      }`}
    >
      {isSuccess ? (
        <MdCheckCircle className="text-2xl text-emerald-500 shrink-0" />
      ) : (
        <MdError className="text-2xl text-rose-500 shrink-0" />
      )}
      <span className="text-sm font-semibold leading-tight">{message}</span>
      <button
        onClick={onClose}
        className="mr-2 opacity-60 hover:opacity-100 transition-opacity shrink-0"
      >
        <MdClose className="text-lg" />
      </button>
    </div>,
    document.body, // ✅ renders directly to the body
  );
};

export default function UploadingAndDisplayingImage({ images = [] }) {
  const { dispatch, addImages } = useContext(inputsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const isImageAlreadyAdded = (imageLink) => {
    const allImages = [...(images || []), ...(addImages || [])];
    return allImages.includes(imageLink);
  };

  const uploadImage = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        'حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.',
        'error',
      );
      return null;
    }

    const services = ['Imgur', 'Imgbb', 'ImageKit'];
    let uploadedLink = null;

    for (const service of services) {
      try {
        const formData = new FormData();
        if (service === 'ImageKit') {
          formData.append('file', file);
          const response = await fetch('/api/uploadImageToImageKit', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.success) {
            uploadedLink =
              data?.data?.url || data?.image?.url || data?.data?.link;
            break;
          }
        } else {
          formData.append('image', file);
          const response = await fetch(`/api/uploadImageTo${service}`, {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          if (data.success) {
            uploadedLink =
              data?.data?.url || data?.image?.url || data?.data?.link;
            break;
          }
        }
      } catch (error) {
        console.error(`فشل الرفع إلى ${service}:`, error);
      }
    }

    if (!uploadedLink) {
      showNotification(
        'تعذر رفع الصورة. تحقق من اتصالك وحاول مرة أخرى.',
        'error',
      );
    }

    return uploadedLink;
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const currentImagesCount = (addImages || []).length + (images || []).length;

    if (currentImagesCount + selectedFiles.length > 5) {
      showNotification('لا يمكن رفع أكثر من 5 صور للإعلان الواحد', 'error');
      return;
    }

    setIsLoading(true);
    const newImages = [];
    const totalToUpload = selectedFiles.length;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      setUploadStatus({
        current: i + 1,
        total: totalToUpload,
        fileName: file.name,
      });

      const imageLink = await uploadImage(file);

      if (imageLink && !isImageAlreadyAdded(imageLink)) {
        newImages.push(imageLink);
      } else if (imageLink) {
        showNotification('هذه الصورة موجودة مسبقًا في الإعلان.', 'error');
      }
    }

    setIsLoading(false);
    setUploadStatus(null);
    event.target.value = '';

    if (newImages.length > 0) {
      dispatch({
        type: 'ADD_IMAGE',
        payload: [...(addImages || []), ...newImages],
      });
      showNotification(`تم رفع ${newImages.length} صورة بنجاح`, 'success');
    }
  };

  const handleRemoveImage = (imageUrlToRemove) => {
    const updatedImages = (addImages || []).filter(
      (img) => img !== imageUrlToRemove,
    );
    dispatch({
      type: 'ADD_IMAGE',
      payload: updatedImages,
    });
    showNotification('تم حذف الصورة بنجاح', 'success');
  };

  const allImages = [...(images || []), ...(addImages || [])];
  const filteredImages = allImages.filter(Boolean);

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-4xl mx-auto px-4 sm:px-8 my-8">
      {/* ✅ يتم استدعاء المكونات هنا، وسيقوم Portal بنقلها تلقائياً إلى body */}
      {notification && (
        <CustomNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {isLoading && uploadStatus && (
        <GlassUploadLoader
          current={uploadStatus.current}
          total={uploadStatus.total}
          fileName={uploadStatus.fileName}
        />
      )}

      {/* 🖼️ الصورة الكبيرة الرئيسية */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 bg-gray-50 group">
        {filteredImages[0] ? (
          <>
            <Image
              priority
              src={filteredImages[0]}
              alt="الصورة الرئيسية"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <label
              htmlFor="file-upload"
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white border border-white/30 p-3 rounded-full cursor-pointer shadow-lg hover:bg-orange-500 hover:border-orange-500 hover:scale-110 transition-all duration-300 z-20"
              title="إضافة صورة"
            >
              <MdOutlineAddPhotoAlternate className="text-xl" />
            </label>

            <button
              onClick={() => handleRemoveImage(filteredImages[0])}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border border-white/30 p-3 rounded-full cursor-pointer shadow-lg hover:bg-rose-500 hover:border-rose-500 hover:scale-110 transition-all duration-300 z-20"
              title="حذف الصورة"
            >
              <MdClose className="text-xl" />
            </button>
          </>
        ) : (
          <label
            htmlFor="file-upload"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/30 hover:bg-orange-100/50 hover:border-orange-400 transition-all duration-300 group"
          >
            <div className="bg-white p-4 rounded-full mb-3 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
              <MdCloudUpload className="text-orange-500 text-4xl" />
            </div>
            <h1 className="text-gray-700 font-bold text-lg">
              اضغط لإضافة الصورة الرئيسية
            </h1>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, WEBP حتى 5MB</p>
          </label>
        )}
      </div>

      {/* 🎞️ مصفوفة الصور الصغيرة (Thumbnails) */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full mt-5">
        {Array.from({ length: 4 }).map((_, index) => {
          const imgUrl = filteredImages[index + 1];

          return (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm group hover:shadow-lg hover:border-orange-200 transition-all duration-300"
            >
              {imgUrl ? (
                <>
                  <Image
                    src={imgUrl}
                    alt={`صورة إضافية ${index + 2}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  <label
                    htmlFor="file-upload"
                    className="absolute bottom-2 right-2 bg-white/30 backdrop-blur-md text-white border border-white/40 p-1.5 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
                  >
                    <MdOutlineAddPhotoAlternate className="text-sm" />
                  </label>

                  <button
                    onClick={() => handleRemoveImage(imgUrl)}
                    className="absolute top-2 right-2 bg-white/30 backdrop-blur-md text-white border border-white/40 p-1.5 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:border-rose-500 transition-all duration-300"
                  >
                    <MdClose className="text-sm" />
                  </button>
                </>
              ) : (
                <label
                  htmlFor="file-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/40 transition-all duration-300"
                >
                  <MdOutlineAddPhotoAlternate className="text-gray-400 text-2xl mb-1 group-hover:text-orange-500 transition-colors duration-300" />
                  <span className="text-[10px] sm:text-xs text-gray-500 font-semibold">
                    إضافة
                  </span>
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* 📥 حقل الإدخال المخفي */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
}
