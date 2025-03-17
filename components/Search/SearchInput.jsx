'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../ReusableComponents/SideBarMenu';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

export default function HeroSection({ searchData, setSearchData, onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleInputChange = (e) => {
    setSearchData((prev) => ({ ...prev, searchedKeyword: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

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

  const images = [
    'https://i.imgur.com/wZ0aruw.jpg',
    'https://i.imgur.com/uPsQqzu.png',
    'https://i.imgur.com/wHyvDAD.png',
    'https://i.imgur.com/Kc6Pcu1.png',
    'https://i.imgur.com/rLz58YH.jpg',
    'https://i.imgur.com/VVu5la7.png',
  ];

  useEffect(() => {
    if (!sliderRef.current) return;

    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div className="relative w-full sm:h-96 flex flex-col items-center justify-center">
      {/* السلايدر */}
      <div
        ref={sliderRef}
        className="hidden sm:block relative w-full h-full overflow-hidden"
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={image}
              fill
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {/* أزرار التنقل */}
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

      {/* حقل البحث */}
      <div className="sm:absolute bottom-10 z-20 w-full sm:w-2/3 p-2 sm:p-4 bg-one sm:bg-white sm:bg-opacity-75 sm:backdrop-blur-sm sm:rounded-lg shadow-lg flex justify-center items-center gap-2">
        <SideBarMenu />{' '}
        <button
          onClick={onSearch}
          className="flex justify-center items-center bg-one sm:text-lg text-sm text-white text-nowrap border border-gray-300 sm:border-none select-none rounded-md h-[32px] sm:h-[40px] xl:h-[50px] px-4 hover:bg-one-dark transition-colors"
        >
          <span className="flex justify-center items-center gap-1 h-full cursor-pointer">
            <ImSearch className="mr-1" /> بحث
          </span>
        </button>
        <input
          type="text"
          value={searchData.searchedKeyword}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="ابحث عن عقار أو سيارة..."
          className="flex-grow sm:text-lg text-sm text-gray-800 w-full text-nowrap select-none rounded-md h-[32px] sm:h-[40px] xl:h-[50px] p-2 focus:outline-none"
        />
      </div>
    </div>
  );
}
