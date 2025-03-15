'use client';
import { useContext, useState } from 'react';
import Image from 'next/image';
import { MdOutlineAddPhotoAlternate, MdClose } from 'react-icons/md';
import { inputsContext } from '../authContext/Context';
import LoadingPhoto from './LoadingPhoto';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ImageUploader({ images = [] }) {
  const { dispatch, addImages } = useContext(inputsContext);
  const [isLoading, setIsLoading] = useState(false);

  // دالة للتحقق من وجود الصورة في المصفوفة
  const isImageAlreadyAdded = (imageLink) => {
    const allImages = [...(addImages || []), ...(images || [])];
    return allImages.includes(imageLink);
  };

  // دالة لرفع الصورة إلى الخدمات بالتناوب
  const uploadImage = async (file) => {
    const services = ['Imgur', 'Imgbb', 'ImageKit'];
    let uploadedLink = null;

    for (const service of services) {
      try {
        let response;
        let data;

        if (service === 'ImageKit') {
          const formData = new FormData();
          formData.append('file', file);

          response = await fetch('/api/uploadImageToImageKit', {
            method: 'POST',
            body: formData,
          });

          data = await response.json();
        } else {
          const formData = new FormData();
          formData.append('image', file);

          response = await fetch(`/api/uploadImageTo${service}`, {
            method: 'POST',
            body: formData,
          });

          data = await response.json();
        }

        if (data.success) {
          uploadedLink =
            data?.data?.url || data?.image?.url || data?.data?.link;
          console.log(
            `تم الرفع بنجاح إلى: ${service} - الرابط: ${uploadedLink}`
          );
          toast.success('تم رفع الصورة بنجاح');
          break;
        }
      } catch (error) {
        console.error(`فشل الرفع إلى ${service}:`, error);
      }
    }

    if (!uploadedLink) {
      toast.error('تعذر رفع الصورة. حاول مرة أخرى لاحقًا.');
    }

    return uploadedLink;
  };

  // دالة لمعالجة تغيير الملفات
  const handleFileChange = async (event) => {
    const selectedFiles = event.target.files;

    const currentImagesCount = Array.isArray(addImages) ? addImages.length : 0;
    if (currentImagesCount + selectedFiles.length > 5) {
      alert('لا يمكن رفع أكثر من 5 صور للبوست الواحد');
      return;
    }

    setIsLoading(true);

    const newImages = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const imageLink = await uploadImage(file);

      if (imageLink && !isImageAlreadyAdded(imageLink)) {
        newImages.push(imageLink);
      } else if (imageLink) {
        toast.error('هذه الصورة موجودة مسبقًا.');
      }
    }

    setIsLoading(false);

    // تحديث الحالة بإضافة الصور الجديدة
    dispatch({
      type: 'ADD_IMAGE',
      payload: [...(addImages || []), ...newImages],
    });
  };

  // دالة لإزالة صورة معينة
  const handleRemoveImage = (index) => {
    const updatedImages = [...(addImages || [])];
    updatedImages.splice(index, 1);

    // تحديث الحالة بإزالة الصورة
    dispatch({
      type: 'ADD_IMAGE',
      payload: updatedImages,
    });
  };

  // دمج الصور وتصفية الصور غير الصحيحة
  const allImages = [...(images || []), ...(addImages || [])];
  const filteredImages = allImages.filter(Boolean);

  return (
    <div className="flex flex-col justify-center items-center w-full px-2 sm:px-8">
      {/* الصورة الكبيرة في الأعلى */}
      <div className="relative w-full h-72 sm:h-96 border border-gray-300 rounded-[5px] mb-4 bg-white">
        {isLoading ? (
          <LoadingPhoto />
        ) : filteredImages[0] ? (
          <>
            <Link href={'#post1'}>
              <Image
                priority
                src={filteredImages[0]}
                alt="الصورة الرئيسية"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-[5px]"
              />
            </Link>
            <label
              htmlFor="file-upload"
              className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
            >
              <MdOutlineAddPhotoAlternate className="text-xl" />
            </label>
            <button
              onClick={() => handleRemoveImage(0)}
              className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
            >
              <MdClose className="text-xl" />
            </button>
          </>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center h-full cursor-pointer bg-white"
          >
            <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
            <h1 className="text-sm sm:text-lg">أضف صورة رئيسية</h1>
          </label>
        )}
      </div>

      {/* الأربع صور الصغيرة في الأسفل */}
      <div className="flex justify-center items-center gap-2 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative size-16 sm:size-44 lg:size-72 border border-gray-300 rounded-[5px] flex justify-center items-center bg-white"
          >
            {isLoading ? (
              <LoadingPhoto />
            ) : filteredImages[index + 1] ? (
              <>
                <Image
                  priority
                  src={filteredImages[index + 1]}
                  alt={`الصورة ${index + 2}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-[5px]"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
                >
                  <MdOutlineAddPhotoAlternate className="text-xl" />
                </label>
                <button
                  onClick={() => handleRemoveImage(index + 1)}
                  className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
                >
                  <MdClose className="text-xl" />
                </button>
              </>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <MdOutlineAddPhotoAlternate className="text-one text-xl sm:text-2xl lg:text-3xl" />
                <h1 className="text-[8px] sm:text-sm lg:text-lg">أضف صورة</h1>
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
