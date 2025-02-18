'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

export default function HeroSlider({ images = [] }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const minHeight = isDesktop ? '100vh' : isTablet ? '70vh' : '50vh';
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
  }, [images, index]);

  if (images.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-white text-lg bg-gray-900">
        لا توجد صور للعرض
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-[50vh] md:min-h-[70vh] lg:min-h-[100vh] overflow-hidden bg-black"
      style={{ minHeight }}
    >
      {/* الصورة المتحركة */}
      <AnimatePresence>
        <motion.div key={index} className="absolute w-full h-full">
          {/* الصورة */}
          <motion.img
            src={images[index]}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="w-full h-full object-cover"
          />
          {/* طبقة التعتيم مع تأثير ضوئي خفيف */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"
            style={{
              boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)',
            }}
          ></div>
          {/* النص فوق الصورة */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {/* REAL ESTATE AND CARS */}
              عقارات وسيارات
            </h1>
            <p className="text-base sm:text-lg md:text-2xl mb-2 drop-shadow-md">
              Luxury Homes & Cars
            </p>
            <p className="text-xs sm:text-sm md:text-base mb-1 drop-shadow-sm">
              Direct: (123) 456-7890
            </p>
            <p className="text-xs sm:text-sm md:text-base mb-1 drop-shadow-sm">
              Email: contact@realestate.com
            </p>
            <p className="text-xs sm:text-sm md:text-base drop-shadow-sm">
              Location: 1453 Macka TRB, L1984
            </p>
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
                ? 'bg-white w-8 shadow-md'
                : 'bg-gray-500 hover:bg-gray-400'
            }`}
            style={{
              transform: i === index ? 'scale(1.2)' : 'scale(1)',
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
