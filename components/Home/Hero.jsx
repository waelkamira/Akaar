'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Search from '../Search/Search';

const DEFAULT_IMAGES = [
  '/images/img (1).jpg',
  '/images/img (2).jpg',
  '/images/img (3).jpg',
  '/images/img (4).jpg',
  '/images/img (5).jpg',
  '/images/img (6).jpg',
];

export default function Hero({ images = DEFAULT_IMAGES }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const goToNextSlide = useCallback(() => {
    setCurrentImageIndex((index) => (index + 1) % images.length);
  }, [images.length]);
  const goToPreviousSlide = useCallback(() => {
    setCurrentImageIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const intervalId = setInterval(goToNextSlide, 6500);
    return () => clearInterval(intervalId);
  }, [goToNextSlide, images.length]);

  if (!images.length) return null;

  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#171512] sm:min-h-[600px]" aria-label="واجهة أكار الرئيسية">
      <div className="absolute inset-0">
        <Image
          src={images[currentImageIndex]}
          fill
          priority
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#141311]/95 via-[#141311]/75 to-[#141311]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141311] via-transparent to-[#141311]/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C99B70]/30 bg-black/25 px-4 py-2 text-[10px] font-semibold tracking-[.15em] text-[#E5C5A5] sm:text-xs">
            اكتشف سوقًا من الخيارات
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.25] tracking-tight text-[#F5F0E9] sm:text-5xl lg:text-6xl">
            كل ما تبحث عنه،
            <span className="mt-2 block text-[#D9B18C]">في مكان واحد.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-200 sm:text-base">
            اكتشف المنتجات، قارن التفاصيل، وتواصل مع البائع المناسب عبر تجربة تسوق عربية واضحة وسهلة.
          </p>
          <div className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-[#171512]/90 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <Search />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/search" className="inline-flex items-center justify-center rounded-xl bg-[#C99B70] px-5 py-3 text-sm font-bold text-[#171512] transition hover:bg-[#D9B18C]">
              استكشف المنتجات
            </a>
            <a href="/categories/1" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-black/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#C99B70]/60">
              تصفح الأقسام
            </a>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2 sm:bottom-8 sm:left-8">
          <button type="button" onClick={goToPreviousSlide} aria-label="الصورة السابقة" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:border-[#C99B70]/60 hover:text-[#E5C5A5]">
            <FaChevronRight aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-xs tabular-nums text-white/80">{currentImageIndex + 1} / {images.length}</span>
          <button type="button" onClick={goToNextSlide} aria-label="الصورة التالية" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:border-[#C99B70]/60 hover:text-[#E5C5A5]">
            <FaChevronLeft aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
