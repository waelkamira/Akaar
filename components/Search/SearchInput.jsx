'use client';
import React, { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../ReusableComponents/SideBarMenu';
import toast from 'react-hot-toast';

export default function SearchInput({ searchData, setSearchData, onSearch }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    setSearchData((prev) => ({ ...prev, searchedKeyword: e.target.value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 p-2 bg-one">
      <div className="xl:hidden">
        <TfiMenuAlt
          className="text-[30px] lg:text-5xl text-white cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <div className="absolute top-14 lg:top-20 right-0 z-50">
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      </div>
      <button
        onClick={onSearch}
        className="flex justify-center items-center bg-one sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[50px] xl:w-[195px] p-2 hover:scale-[101%] transition-transform shadow-md border border-white hover:shadow-lg"
      >
        <span className="flex justify-center items-center gap-1 h-full cursor-pointer">
          <ImSearch className="mr-2" /> بحث
        </span>
      </button>

      <input
        type="text"
        value={searchData.searchedKeyword}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="ابحث عن عقار أو سيارة..."
        className="flex-grow sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[50px] text-[10px] sm:text-[15px] xl:text-[22px] bg-white backdrop-blur-lg border focus:outline-none border-white transition-all shadow-md hover:shadow-lg placeholder:pr-2 placeholder:text-md pr-2"
      />
    </div>
  );
}
