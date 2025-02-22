'use client';
import { useContext, useState } from 'react';
import Image from 'next/image';
import { MdOutlineAddPhotoAlternate, MdClose } from 'react-icons/md'; // إضافة أيقونة الإغلاق
import { inputsContext } from './Context';
import LoadingPhoto from './LoadingPhoto'; // استيراد مكون LoadingPhoto
import Link from 'next/link';

export default function ImageUploader({ images = [] }) {
  const { dispatch, addImages } = useContext(inputsContext);
  const [isLoading, setIsLoading] = useState(false); // حالة لتتبع حالة التحميل

  // دالة لمعالجة تغيير الملفات
  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;

    if (addImages.length + selectedFiles.length > 5) {
      alert('لا يمكن رفع أكثر من 5 صور للبوست الواحد');
      return;
    }

    setIsLoading(true); // بدء التحميل

    const newImages = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('image', file);
      // console.log('formData', formData);
      try {
        const response = await fetch('/api/uploadImageToImgur', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          newImages.push(data.data.link);
        } else {
          console.error('Error uploading image:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    setIsLoading(false); // انتهاء التحميل

    dispatch({
      type: 'ADD_IMAGE',
      payload: [...addImages, ...newImages, ...images],
    });
  };

  // دالة لإزالة صورة معينة
  const handleRemoveImage = (index) => {
    const updatedImages = [...addImages];
    updatedImages.splice(index, 1); // إزالة الصورة من المصفوفة
    dispatch({
      type: 'ADD_IMAGE',
      payload: updatedImages,
    });
  };

  // دمج الصور وتصفية الصور غير الصحيحة
  const allImages = [...images, ...addImages];
  const filteredImages = allImages.filter((image) => image !== null);

  return (
    <div className="flex flex-col justify-center items-center w-full px-2 sm:px-8">
      {/* الصورة الكبيرة في الأعلى */}
      <div className="relative w-full h-72 sm:h-96 border border-gray-300 rounded-[5px] mb-4 bg-white">
        {isLoading ? ( // إذا كانت الصور قيد التحميل، عرض مؤشر التحميل
          <LoadingPhoto />
        ) : filteredImages[0] ? ( // إذا كانت هناك صورة متاحة
          <>
            <Link href={'#post1'}>
              <Image
                priority
                src={filteredImages[0]}
                alt="الصورة الرئيسية"
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-[5px]"
              />
            </Link>
            {/* زر تغيير الصورة */}
            <label
              htmlFor="file-upload"
              className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50  p-2 rounded-full cursor-pointer"
            >
              <MdOutlineAddPhotoAlternate className="text-xl" />
            </label>
            {/* زر إزالة الصورة */}
            <button
              onClick={() => handleRemoveImage(0)}
              className="absolute top-2 right-2 bg-black text-white bg-opacity-50  p-2 rounded-full cursor-pointer"
            >
              <MdClose className="text-xl" />
            </button>
          </>
        ) : (
          // إذا لم تكن هناك صورة، عرض زر إضافة صورة
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center h-full cursor-pointer bg-white"
          >
            <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
            <h1 className=" text-sm sm:text-lg">أضف صورة رئيسية</h1>
          </label>
        )}
      </div>

      {/* الأربع صور الصغيرة في الأسفل */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative w-full h-48 border border-gray-300 rounded-[5px] flex justify-center items-center bg-white"
          >
            {isLoading ? ( // إذا كانت الصور قيد التحميل، عرض مؤشر التحميل
              <LoadingPhoto />
            ) : filteredImages[index + 1] ? ( // إذا كانت هناك صورة متاحة
              <>
                <Image
                  priority
                  src={filteredImages[index + 1]}
                  alt={`الصورة ${index + 2}`}
                  layout="fill"
                  objectFit="cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-[5px]"
                />
                {/* زر تغيير الصورة */}
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50  p-2 rounded-full cursor-pointer "
                >
                  <MdOutlineAddPhotoAlternate className="text-xl" />
                </label>
                {/* زر إزالة الصورة */}
                <button
                  onClick={() => handleRemoveImage(index + 1)}
                  className="absolute top-2 right-2 bg-black text-white bg-opacity-50  p-2 rounded-full cursor-pointer"
                >
                  <MdClose className="text-xl" />
                </button>
              </>
            ) : (
              // إذا لم تكن هناك صورة، عرض زر إضافة صورة
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
                <h1 className=" text-sm sm:text-lg">أضف صورة</h1>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Input لتحميل الصور */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept="image/*"
      />
    </div>
  );
}
