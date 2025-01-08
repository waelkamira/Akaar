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

export default function ImageSlider({ image, image1, image2, image3, image4 }) {
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
    <>
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide number-slide1">
          {' '}
          {image && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide2">
          {' '}
          {image1 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image1}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide3">
          {' '}
          {image2 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image2}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide4">
          {' '}
          {image3 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image3}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide5">
          {' '}
          {image4 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image4}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
      </div>

      <div ref={thumbnailRef} className="keen-slider thumbnail">
        <div className="keen-slider__slide number-slide1">
          {' '}
          {image && (
            <div className="relative w-full h-44 sm:h-[700px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide2">
          {' '}
          {image1 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image1}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide3">
          {' '}
          {image2 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image2}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide4">
          {' '}
          {image3 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image3}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
        <div className="keen-slider__slide number-slide5">
          {' '}
          {image4 && (
            <div className="relative w-full h-44 sm:h-[500px] overflow-hidden rounded-lg border bg-gray-100">
              <Image
                priority
                src={image4}
                layout="fill"
                objectFit="cover"
                alt={'photo'}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
