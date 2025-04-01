'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { SearchProvider } from '../../contexts/SearchContext';

export default function Search() {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.push(`/post?keyword=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full z-50">
      <div className="flex flex-col items-center justify-center w-full pb-8">
        <div className="w-full sm:w-2/3 p-2 sm:p-4 bg-white sm:bg-white/90 backdrop-blur-sm rounded-lg shadow-lg flex justify-center items-center gap-2">
          <button
            onClick={handleSearch}
            className="flex justify-center items-center bg-primary-500 text-white text-nowrap rounded-md h-10 px-6 hover:bg-primary-600 transition-all cursor-pointer min-w-[100px]"
          >
            <ImSearch className="ml-2" /> بحث
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ابحث عن عقار أو سيارة..."
            className="flex-grow text-gray-800 w-full rounded-md h-10 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <SearchProvider>
        <CategoriesNavBar />
      </SearchProvider>
    </div>
  );
}
