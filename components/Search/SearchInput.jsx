'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../navbars/SideBarMenu';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import HeroSlider from '../photos/HeroSlider';

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
    <div className="flex relative flex-col items-center justify-center w-full sm:h-96">
      {/* السلايدر */}

      <HeroSlider />
      {/* حقل البحث */}
      <div className="sm:absolute bottom-10 z-20 w-full sm:w-2/3 p-2 sm:p-4 bg-one sm:bg-white sm:bg-opacity-75 sm:backdrop-blur-sm sm:rounded-lg shadow-lg flex justify-center items-center gap-2">
        <div className="sm:hidden">
          <SideBarMenu />{' '}
        </div>
        <button
          onClick={onSearch}
          className="flex justify-center items-center bg-one sm:text-lg text-sm text-white text-nowrap border border-gray-300 sm:border-none select-none rounded-md h-[32px] sm:h-[40px] xl:h-[50px] px-4 hover:bg-one-dark transition-transform duration-300 hover:scale-105"
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
