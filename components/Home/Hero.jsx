'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Search from '../Search/Search';

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

  const goToNextSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const goToPreviousSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [goToNextSlide]);

  return (
    // 🟢 جعلنا الحاوية الرئيسية تظهر على كل الشاشات (أزلنا hidden sm:block) وثبتنا الارتفاع
    <div className="relative flex flex-col justify-end w-full h-[350px] sm:h-[500px] overflow-hidden z-0">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={images[currentImageIndex]}
          fill
          sizes="100vw"
          priority={currentImageIndex === 0}
          alt={`Slide ${currentImageIndex + 1}`}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/* زر الانتقال للخلف */}
      <button
        onClick={goToPreviousSlide}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 z-30 transition-all hidden sm:block"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* زر الانتقال للأمام */}
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 z-30 transition-all hidden sm:block"
      >
        <FaChevronRight size={20} />
      </button>
      {/* 🟢 حاوية التوسيط المطلق لمربع البحث */}
      <div className=" flex items-end justify-center z-20 ">
        <div className="w-full">
          {' '}
          {/* يمكنك التحكم في أقصى عرض لمربع البحث من هنا */}
          <Search />
        </div>
      </div>
    </div>
  );
}
