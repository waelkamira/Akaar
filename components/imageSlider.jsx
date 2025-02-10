'use client';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

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
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 5,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className="w-full flex flex-col justify-center items-center">
      {/* الصورة الكبيرة */}
      <div
        ref={sliderRef}
        className="keen-slider w-full max-w-[1000px] h-auto max-h-[500px] aspect-[4/3]"
      >
        <div className="keen-slider__slide number-slide1 ">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden">
            {image1 && (
              <Image
                priority
                src={image1}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            )}
          </div>
        </div>
        <div className="keen-slider__slide number-slide2">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden">
            {image2 && (
              <Image
                priority
                src={image2}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>
        <div className="keen-slider__slide number-slide3">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden">
            {image3 && (
              <Image
                priority
                src={image3}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>
        <div className="keen-slider__slide number-slide4">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden">
            {image4 && (
              <Image
                priority
                src={image4}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>
        <div className="keen-slider__slide number-slide5">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden">
            {image5 && (
              <Image
                priority
                src={image5}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>
      </div>
      <h1 className="w-full text-sm sm:text-md my-2 text-center">صور أخرى</h1>
      {/* الصور الصغيرة */}
      <div
        ref={thumbnailRef}
        className="keen-slider thumbnail w-full h-auto max-h-[150px]"
      >
        <div className="keen-slider__slide number-slide1">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden ">
            {image1 && (
              <Image
                priority
                src={image1}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>

        <div className="keen-slider__slide number-slide2">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden ">
            {image2 && (
              <Image
                priority
                src={image2}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>

        <div className="keen-slider__slide number-slide3">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden ">
            {image3 && (
              <Image
                priority
                src={image3}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>

        <div className="keen-slider__slide number-slide4">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden ">
            {image4 && (
              <Image
                priority
                src={image4}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>

        <div className="keen-slider__slide number-slide5">
          <div className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden ">
            {image5 && (
              <Image
                priority
                src={image5}
                layout="fill"
                objectFit="contain"
                alt={'photo'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
