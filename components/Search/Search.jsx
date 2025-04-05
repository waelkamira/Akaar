'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import SideBarMenu from '../navbars/SideBarMenu';
import Hero from '../Home/Hero';

export default function Search() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length >= 2) {
        try {
          const response = await fetch(
            `/api/search/suggestions?query=${encodeURIComponent(
              inputValue.trim()
            )}`
          );
          const data = await response.json();
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const handleSearch = () => {
    if (inputValue.trim()) {
      console.log('inputValue.trim()', inputValue.trim());
      router.push(`/search?query=${encodeURIComponent(inputValue.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSearch();
  };

  return (
    <div className="relative w-full h-full">
      <div className="fixed top-0 left-0 right-0 mx-auto xl:absolute xl:top-44 xl:left-0 xl:right-0 xl:mx-auto z-50 w-full xl:w-2/3 p-2 sm:p-4 bg-white xl:bg-white/90 xl:backdrop-blur-sm xl:rounded-lg xl:shadow-lg flex justify-center items-center gap-2">
        <SideBarMenu />
        <button
          onClick={handleSearch}
          className="flex justify-center items-center bg-primary-500 text-white text-nowrap rounded-md px-2 h-8 md:h-10 sm:px-6 hover:bg-primary-600 transition-all cursor-pointer"
        >
          <ImSearch className="ml-2" /> بحث
        </button>
        <div className="flex-grow relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="ابحث عن عقار أو سيارة..."
            className="flex-grow text-gray-800 w-full rounded-md h-8 sm:h-10 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-right"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
