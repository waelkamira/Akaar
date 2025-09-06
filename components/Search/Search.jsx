'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImSearch } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { SearchProvider } from '../../contexts/SearchContext';
import SideBarMenu from '../navbars/SideBarMenu';

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
          console.log('data?.suggestions', data?.suggestions);
          setSuggestions(data?.suggestions);
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
    console.log('inputValue', inputValue);

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
    <div className="w-full sm:pb-32 z-40">
      <div className="flex flex-col items-center justify-center w-full lg:pb-4">
        <div className="w-full sm:w-2/3 p-2 sm:p-4 bg-white sm:bg-white/90 backdrop-blur-sm sm:rounded-lg shadow-sm flex justify-center items-center gap-2 relative z-20">
          <div className="sm:hidden">
            <SideBarMenu />
          </div>{' '}
          <button
            onClick={handleSearch}
            className="flex justify-center items-center bg-gradient-to-r from-primary-500 to-primary-400 text-white text-nowrap rounded-md h-10 px-2 sm:px-6 hover:bg-primary-600 transition-all cursor-pointer"
          >
            <ImSearch className="ml-2" /> بحث
          </button>
          <div className="flex-grow relative">
            <input
              type="text"
              id={inputValue}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="ابحث عن عقار أو سيارة..."
              className="flex-grow text-gray-800 w-full rounded-md h-10 p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-sm placeholder:lg:text-lg"
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

      <SearchProvider>
        <CategoriesNavBar />
      </SearchProvider>
    </div>
  );
}
