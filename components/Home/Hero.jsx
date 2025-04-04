'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// تحميل القائمة الجانبية فقط عند الحاجة
const SideBarMenu = dynamic(() => import('../navbars/SideBarMenu'), {
  ssr: false,
});

export default function Hero({
  images = [
    '/heroImages/img (1).jpg',
    '/heroImages/img (2).jpg',
    '/heroImages/img (3).jpg',
    '/heroImages/img (4).jpg',
    '/heroImages/img (5).jpg',
    '/heroImages/img (6).jpg',
  ],
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);

  // دوال الانتقال بين الصور باستخدام useCallback لتحسين الأداء
  const goToPreviousSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNextSlide = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  useEffect(() => {
    if (!sliderRef.current) return;

    const intervalId = setInterval(goToNextSlide, 5000);

    return () => clearInterval(intervalId);
  }, [goToNextSlide]);

  return (
    <div
      ref={sliderRef}
      className="hidden sm:block w-full h-full overflow-hidden sm:h-96 z-50 relative"
    >
      <SideBarMenu />
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${(index - currentImageIndex) * 100}%)`,
            }}
          >
            <Image
              src={image}
              fill
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* أزرار التنقل */}
      <button
        onClick={goToPreviousSlide}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-20"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
