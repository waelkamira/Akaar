import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider({ images = [] }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (images.length === 0) return;

    const resetTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    };

    resetTimeout();

    return () => clearTimeout(timeoutRef.current);
  }, [images, index]);

  if (images.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-lg">
        لا توجد صور للعرض
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        <motion.div key={index} className="absolute w-full h-full">
          {/* الصورة */}
          <motion.img
            src={images[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="w-full h-full object-cover"
          />

          {/* طبقة التعتيم */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* النص فوق الصورة */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4">REAL ESTATE</h1>
            <p className="text-lg md:text-2xl mb-2">Luxury Homes & Designs</p>
            <p className="text-sm md:text-base mb-1">Direct: (123) 456-7890</p>
            <p className="text-sm md:text-base mb-1">
              Email: contact@realestate.com
            </p>
            <p className="text-sm md:text-base">
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
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
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
            className={`w-4 h-1 rounded-full transition-all duration-300 cursor-pointer ${
              i === index ? 'bg-white w-6' : 'bg-gray-500 w-4'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
