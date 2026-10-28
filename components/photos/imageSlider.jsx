// 'use client';
// import React from 'react';
// import { useKeenSlider } from 'keen-slider/react';
// import 'keen-slider/keen-slider.min.css';
// import Image from 'next/image';

// function ThumbnailPlugin(mainRef) {
//   return (slider) => {
//     function removeActive() {
//       slider.slides.forEach((slide) => {
//         slide.classList.remove('active');
//       });
//     }
//     function addActive(idx) {
//       slider.slides[idx].classList.add('active');
//     }

//     function addClickEvents() {
//       slider.slides.forEach((slide, idx) => {
//         slide.addEventListener('click', () => {
//           if (mainRef.current) mainRef.current.moveToIdx(idx);
//         });
//       });
//     }

//     slider.on('created', () => {
//       if (!mainRef.current) return;
//       addActive(slider.track.details.rel);
//       addClickEvents();
//       mainRef.current.on('animationStarted', (main) => {
//         removeActive();
//         const next = main.animator.targetIdx || 0;
//         addActive(main.track.absToRel(next));
//         slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
//       });
//     });
//   };
// }

// export default function ImageSlider({
//   image1,
//   image2,
//   image3,
//   image4,
//   image5,
// }) {
//   const [sliderRef, instanceRef] = useKeenSlider({
//     initial: 0,
//   });
//   const [thumbnailRef] = useKeenSlider(
//     {
//       initial: 0,
//       slides: {
//         perView: 5,
//         spacing: 10,
//       },
//     },
//     [ThumbnailPlugin(instanceRef)]
//   );

//   return (
//     <div className="w-full flex flex-col justify-center items-center">
//       {/* الصورة الكبيرة */}
//       <div
//         ref={sliderRef}
//         className="keen-slider w-full max-w-[1000px] h-auto max-h-[500px] aspect-[4/3]"
//       >
//         <div className="keen-slider__slide number-slide1 ">
//           <div className="relative w-full size-96 rounded-lg overflow-hidden">
//             {image1 && (
//               <Image
//                 priority
//                 src={image1}
//                 layout="fill"
//                 objectFit="contain"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//         <div className="keen-slider__slide number-slide2">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
//             {image2 && (
//               <Image
//                 priority
//                 src={image2}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//         <div className="keen-slider__slide number-slide3">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
//             {image3 && (
//               <Image
//                 priority
//                 src={image3}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//         <div className="keen-slider_slide number-slide4">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
//             {image4 && (
//               <Image
//                 priority
//                 src={image4}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//         <div className="keen-slider_slide number-slide5">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
//             {image5 && (
//               <Image
//                 priority
//                 src={image5}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//       <h1 className="w-full text-sm sm:text-md my-2 text-center">صور أخرى</h1>
//       {/* الصور الصغيرة */}
//       <div
//         ref={thumbnailRef}
//         className="keen-slider thumbnail w-full h-auto max-h-[150px]"
//       >
//         <div className="keen-slider__slide number-slide1">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
//             {image1 && (
//               <Image
//                 priority
//                 src={image1}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>

//         <div className="keen-slider__slide number-slide2">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
//             {image2 && (
//               <Image
//                 priority
//                 src={image2}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>

//         <div className="keen-slider__slide number-slide3">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
//             {image3 && (
//               <Image
//                 priority
//                 src={image3}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>

//         <div className="keen-slider__slide number-slide4">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
//             {image4 && (
//               <Image
//                 priority
//                 src={image4}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>

//         <div className="keen-slider__slide number-slide5">
//           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden ">
//             {image5 && (
//               <Image
//                 priority
//                 src={image5}
//                 layout="fill"
//                 objectFit="contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 alt={'photo'}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useCallback } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active');
      });
    }
    function addActive(idx) {
      slider.slides[idx].classList.add('active');
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on('created', () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on('animationStarted', (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

export default function ImageSlider({
  image1,
  image2,
  image3,
  image4,
  image5,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // تصفية الصور الفارغة فقط
  const images = [image1, image2, image3, image4, image5].filter(
    (img) => img && img.trim() !== '',
  );

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 12,
      },
      breakpoints: {
        '(max-width: 640px)': {
          slides: {
            perView: 3,
            spacing: 8,
          },
        },
      },
    },
    [ThumbnailPlugin(instanceRef)],
  );

  const nextSlide = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.next();
    }
  }, [instanceRef]);

  const prevSlide = useCallback(() => {
    if (instanceRef.current) {
      instanceRef.current.prev();
    }
  }, [instanceRef]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-neutral-900 rounded-2xl border border-neutral-800 flex items-center justify-center">
        <span className="text-neutral-500 text-lg font-bold">
          لا توجد صور متاحة
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* الصورة الكبيرة مع أزرار التنقل */}
      <div className="relative group">
        <div
          ref={sliderRef}
          className="keen-slider w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/50"
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className="keen-slider__slide relative bg-neutral-900"
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Product image ${idx + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority={idx === 0}
                />
              </div>

              {/* عداد الصور */}
              <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-4 py-2 rounded-full">
                <span className="text-ak-cream font-bold text-sm">
                  {idx + 1}{' '}
                  <span className="text-neutral-500">/ {images.length}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* أزرار التنقل - تظهر عند التحويم */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-neutral-950/90 backdrop-blur-md hover:bg-orange-600 border border-neutral-800 hover:border-orange-500 text-ak-cream p-3 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 shadow-xl z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-neutral-950/90 backdrop-blur-md hover:bg-orange-600 border border-neutral-800 hover:border-orange-500 text-ak-cream p-3 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-0 shadow-xl z-10"
              aria-label="Next image"
            >
              <FaChevronRight className="text-lg" />
            </button>
          </>
        )}

        {/* شريط التقدم */}
        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: images.length }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-8 bg-orange-600'
                    : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* الصور المصغرة */}
      {images.length > 1 && (
        <div className="relative">
          <h3 className="text-neutral-400 text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
            معرض الصور
          </h3>
          <div ref={thumbnailRef} className="keen-slider thumbnail gap-3">
            {images.map((image, idx) => (
              <div
                key={idx}
                className="keen-slider__slide cursor-pointer group/thumb"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-transparent group-hover/thumb:border-orange-500/50 transition-all duration-300 active:scale-[0.95]">
                  <Image
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                  {/* Overlay عند التحويم */}
                  <div className="absolute inset-0 bg-orange-600/0 group-hover/thumb:bg-orange-600/20 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مؤثرات بصرية إضافية */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-2"
      >
        <span className="text-neutral-600 text-xs uppercase tracking-[0.3em]">
          Swipe to explore
        </span>
      </motion.div>
    </div>
  );
}
