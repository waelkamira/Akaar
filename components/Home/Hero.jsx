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
    <section className="ak-page-shell pt-5 sm:pt-8" aria-label="واجهة أكار الرئيسية">
      <div className="ak-panel-raised grid overflow-hidden lg:min-h-[430px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
        <div className="order-1 flex flex-col justify-center p-5 sm:p-8 lg:order-2 lg:p-10 xl:p-12">
          <p className="ak-eyebrow inline-flex w-fit items-center gap-2 rounded-full border border-ak-amber/25 bg-ak-amber/10 px-3 py-2">
            اكتشف موقع متجر
          </p>
          <h1 className="mt-5 max-w-xl text-3xl font-black leading-[1.35] tracking-tight text-white sm:text-4xl xl:text-5xl">
            كل ما تبحث عنه،
            <span className="mt-1 block bg-ak-brand bg-clip-text text-transparent">في مكان واحد.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ak-muted sm:text-base">
            اكتشف المنتجات، قارن التفاصيل، وتواصل مع البائع المناسب عبر تجربة تسوق عربية واضحة وسهلة.
          </p>
          <div className="ak-glass-strong mt-6 rounded-2xl p-2 sm:mt-8">
            <Search />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/search" className="ak-button-primary">
              استكشف المنتجات <FaChevronLeft aria-hidden="true" />
            </Link>
            <Link href="/categories/1" className="ak-button-secondary">
              تصفح الأقسام
            </Link>
          </div>
        </div>
        <div className="relative order-2 min-h-64 overflow-hidden lg:order-1 lg:min-h-full">
          <Image
            src={images[currentImageIndex]}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            alt=""
            aria-hidden="true"
            className="object-cover transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ak-ink/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
            <span className="rounded-full border border-white/20 bg-ak-ink/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl">
              سوق واحد، خيارات أكثر
            </span>
            {images.length > 1 && (
              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-ak-ink/55 p-1.5 text-white backdrop-blur-xl">
                <button type="button" onClick={goToPreviousSlide} aria-label="الصورة السابقة" className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-ak-honey">
                  <FaChevronRight aria-hidden="true" />
                </button>
                <span className="min-w-9 text-center text-xs tabular-nums">{currentImageIndex + 1} / {images.length}</span>
                <button type="button" onClick={goToNextSlide} aria-label="الصورة التالية" className="flex size-8 items-center justify-center rounded-full transition hover:bg-white/10 hover:text-ak-honey">
                  <FaChevronLeft aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
