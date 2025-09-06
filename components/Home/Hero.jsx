'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SideBarMenu from '../navbars/SideBarMenu';

export default function Hero({
  images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ],
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const goToPreviousSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  useEffect(() => {
    if (!sliderRef.current) return;

    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div
      ref={sliderRef}
      className="hidden sm:block w-full h-full overflow-hidden sm:h-96 z-50"
    >
      <SideBarMenu />{' '}
      {images.map((image, index) => (
        <div
          key={index}
          className={`sm:h-96 w-full transition-opacity duration-500 ${
            index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image}
            fill
            alt={`Slide ${index + 1}`}
            className="object-cover w-full s"
          />
        </div>
      ))}
      <button
        onClick={goToPreviousSlide}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-20"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
