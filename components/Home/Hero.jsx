'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SideBarMenu from '../navbars/SideBarMenu';

export default function Hero({
  images = [
    '/images/img (1).jpg',
    '/images/img (2).jpg',
    '/images/img (3).jpg',
    '/images/img (4).jpg',
    '/images/img (5).jpg',
    '/images/img (6).jpg',
  ],
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // تحسين دالة التوقيت لتعمل بالتزامن مع تغيير الفهرس الحالي لمنع القفزات
  useEffect(() => {
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex]); // 🟢 يتم التحديث بناءً على الفهرس الحالي

  return (
    // 🟢 إضافة كلاس relative لتثبيت أزرار التحكم بداخل السلايدر
    <div className="hidden sm:block relative w-full h-64 sm:h-96 overflow-hidden z-40">
      <SideBarMenu />

      {/* حاوية الصور المترابطة فوق بعضها */}
      {images.map((image, index) => (
        <div
          key={index}
          // 🟢 تم تغيير التموضع ليكون absolute لضمان عرض الصور في نفس البقعة وتناوبها بالـ opacity
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image}
            fill
            priority={index === 0} // تسريع تحميل الصورة الأولى
            alt={`Slide ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}

      {/* زر الانتقال للخلف */}
      <button
        onClick={goToPreviousSlide}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 z-30 transition-all"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* زر الانتقال للأمام */}
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 z-30 transition-all"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}
