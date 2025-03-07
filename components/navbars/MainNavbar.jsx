'use client';
import React, { useState } from 'react';
import FirstNavBar from './FirstNavBar';
import CategoriesProductsSearchBar from '../Search/CategoriesProductsSearchBar';
import SearchBar from '../Search/SearchBar';

export default function MainNavbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center w-full inset-0 bg-one/5">
      <FirstNavBar />
      <SearchBar />
      {/* <div className="p-2 bg-three">
        <button
          className="flex justify-center items-center rounded-[5px] sm:text-lg text-sm bg-one text-white h-12 w-full hover:scale-105 transition-transform"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? 'إخفاء فلاتر البحث' : 'عرض فلاتر البحث'}
        </button>
      </div>
      {showSearch && <CategoriesProductsSearchBar />} */}
    </div>
  );
}
