// ImageComponent.jsx
import React from 'react';
import Image from 'next/image';
import LoadingPhoto from '../../photos/LoadingPhoto';
import FormatDate from '../FormatDate';

function ImageComponent({ item }) {
  return (
    <div className="relative w-full h-48 bg-gray-300">
      {!item?.image1 && <LoadingPhoto />}
      {item?.image1 && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={item?.image1 || '/placeholder.svg?height=400&width=600'}
            fill
            priority
            objectFit="cover"
            alt="item_photo"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item?.createdAt && (
            <div className="absolute bottom-2 right-2 z-0 flex justify-center items-center bg-white rounded-full px-2 py-1 shadow-sm text-xs text-black">
              <FormatDate dateString={item?.createdAt} />
            </div>
          )}
          {item?.details?.propertyType && (
            <div className="absolute top-2 right-2 z-0 flex justify-center items-center bg-primary-500 rounded-full px-3 py-1 shadow-sm text-xs text-white">
              {item?.details?.propertyType === '1' ? 'بيع' : 'إجار'}
            </div>
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}

export default ImageComponent;
// 'use client';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// export default function ImageComponent({ images, isHovered }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   // Reset state when images change
//   useEffect(() => {
//     setCurrentIndex(0);
//     setIsLoading(true);
//     setHasError(false);
//   }, [images]);

//   console.log('images', images);
//   console.log('images', images);

//   const handlePrevious = (e) => {
//     e.stopPropagation();
//     setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNext = (e) => {
//     e.stopPropagation();
//     setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   const handleImageLoad = () => {
//     setIsLoading(false);
//   };

//   const handleImageError = () => {
//     setHasError(true);
//     setIsLoading(false);
//   };

//   return (
//     <div className="relative w-full h-full">
//       {/* Loading Indicator */}
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
//           <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Error Fallback */}
//       {hasError && (
//         <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
//           <div className="text-neutral-500 text-center p-4">
//             <span className="block text-3xl mb-2">🖼️</span>
//             <span>الصورة غير متوفرة</span>
//           </div>
//         </div>
//       )}

//       {/* Image */}
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentIndex}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="w-full h-full"
//         >
//           <Image
//             src={images || '/placeholder.svg?height=400&width=600'}
//             alt="Property"
//             fill
//             className="object-cover transition-transform duration-300"
//             style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
//             onLoad={handleImageLoad}
//             onError={handleImageError}
//           />
//         </motion.div>
//       </AnimatePresence>

//       {/* Navigation Arrows - Only show when hovered and multiple images */}
//       {isHovered && images.length > 1 && (
//         <>
//           <button
//             onClick={handlePrevious}
//             className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-700 hover:text-primary-500 transition-colors duration-200 z-10"
//             aria-label="Previous image"
//           >
//             <ChevronRight size={20} />
//           </button>

//           <button
//             onClick={handleNext}
//             className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-700 hover:text-primary-500 transition-colors duration-200 z-10"
//             aria-label="Next image"
//           >
//             <ChevronLeft size={20} />
//           </button>

//           {/* Image Counter */}
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
//             {currentIndex + 1}/{images.length}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
