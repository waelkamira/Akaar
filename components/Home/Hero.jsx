'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-ak-canvas sm:min-h-[600px]" aria-label="واجهة أكار الرئيسية">
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
        <div className="absolute inset-0 bg-ak-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-ak-ink via-transparent to-ak-ink/20" />
      </div>

      <div className="relative z-10 mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ak-amber/30 bg-ak-ink/45 px-4 py-2 text-[10px] font-semibold tracking-[.15em] text-ak-honey shadow-ak-card backdrop-blur-xl sm:text-xs">
            اكتشف سوقًا من الخيارات
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.25] tracking-tight text-ak-cream sm:text-5xl lg:text-6xl">
            كل ما تبحث عنه،
            <span className="mt-2 block bg-ak-brand bg-clip-text text-transparent">في مكان واحد.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-stone-200 sm:text-base">
            اكتشف المنتجات، قارن التفاصيل، وتواصل مع البائع المناسب عبر تجربة تسوق عربية واضحة وسهلة.
          </p>
          <div className="mt-8 w-full rounded-2xl border border-ak-line-strong bg-ak-surface/80 p-2 shadow-ak-panel backdrop-blur-2xl">
            <Search />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/search" className="ak-button-primary">
              استكشف المنتجات
            </Link>
            <Link href="/categories/1" className="inline-flex items-center justify-center rounded-xl border border-ak-line-strong bg-ak-surface/40 px-5 py-3 text-sm font-semibold text-ak-cream backdrop-blur-lg transition hover:border-ak-amber/60 hover:bg-ak-brand-soft">
              تصفح الأقسام
            </Link>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2 sm:bottom-8 sm:left-8">
          <button type="button" onClick={goToPreviousSlide} aria-label="الصورة السابقة" className="flex h-10 w-10 items-center justify-center rounded-full border border-ak-line-strong bg-ak-ink/60 text-ak-cream backdrop-blur-lg transition hover:border-ak-amber/60 hover:text-ak-honey">
            <FaChevronRight aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-xs tabular-nums text-ak-cream/80">{currentImageIndex + 1} / {images.length}</span>
          <button type="button" onClick={goToNextSlide} aria-label="الصورة التالية" className="flex h-10 w-10 items-center justify-center rounded-full border border-ak-line-strong bg-ak-ink/60 text-ak-cream backdrop-blur-lg transition hover:border-ak-amber/60 hover:text-ak-honey">
            <FaChevronLeft aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
