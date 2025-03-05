'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // تحديد الارتفاع بناءً على حجم الشاشة
  const minHeight = isDesktop ? '100vh' : isTablet ? '70vh' : '50vh';
  const maxHeight = isDesktop ? '100vh' : isTablet ? '70vh' : '50vh';

  useEffect(() => {
    if (images.length === 0) return;
    const resetTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 7000);
    };
    resetTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [index]);
  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];

  if (images.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-white text-lg bg-gray-900">
        لا توجد صور للعرض
      </div>
    );
  }
  return (
    <div
      className="relative w-full overflow-hidden bg-five"
      style={{ minHeight, maxHeight }}
    >
      <AnimatePresence>
        <motion.div key={index} className="absolute w-full h-full">
          {/* الصورة */}
          <Image
            src={images[index]}
            alt="صورة السلايدر"
            layout="fill"
            objectFit="cover"
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
          {/* طبقة التعتيم مع تأثير ضوئي خفيف */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"
            style={{ boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)' }}
          ></div>
          {/* النص فوق الصورة */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 drop-shadow-lg">
              عقارات وسيارات
            </h1>
            <div className="flex flex-col gap-2 text-sm sm:text-lg md:text-xl">
              <p className="mb-2 drop-shadow-md">Luxury Homes & Cars</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {/* أزرار التنقل */}
      <button
        onClick={() =>
          setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>
      {/* مؤشرات الصور */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              clearTimeout(timeoutRef.current);
              setIndex(i);
            }}
            className={`w-3 h-1 mx-2 transition-all duration-300 cursor-pointer ${
              i === index
                ? 'bg-white shadow-md'
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
            style={{ transform: i === index ? 'scale(1.2)' : 'scale(1)' }}
          ></button>
        ))}
      </div>
    </div>
  );
}
