'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ImSearch, ImSpinner8, ImCross } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { useSearch } from '../../contexts/SearchContext';
import SideBarMenu from '../navbars/SideBarMenu';
import { debounce } from 'lodash';

export default function EnhancedSearch() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { setSearchQuery, results } = useSearch();

  // تحميل عمليات البحث الحديثة من localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // حفظ عمليات البحث الحديثة
  const saveToRecentSearches = (searchTerm) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // إغلاق الاقتراحات عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // دالة لجلب الاقتراحات
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/search/suggestions?query=${encodeURIComponent(query.trim())}`
          );
          const data = await response.json();

          // دمج الاقتراحات مع عمليات البحث الحديثة
          const allSuggestions = [
            ...(data?.suggestions || []),
            ...recentSearches
              .filter(
                (search) =>
                  search.toLowerCase().includes(query.toLowerCase()) &&
                  !data?.suggestions.includes(search)
              )
              .map((search) => ({ type: 'recent', text: search })),
          ];

          setSuggestions(allSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else if (query.trim().length === 0 && recentSearches.length > 0) {
        // عرض عمليات البحث الحديثة عندما يكون حقل البحث فارغاً
        setSuggestions(
          recentSearches.map((search) => ({ type: 'recent', text: search }))
        );
        // setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    [recentSearches]
  );

  // اغلاق الاقتراحات
  useEffect(() => {
    setShowSuggestions(false);
  }, [isSearching]);

  // التعامل مع تغيير قيمة الإدخال
  useEffect(() => {
    fetchSuggestions(inputValue);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [inputValue, fetchSuggestions]);

  // إجراء البحث
  const handleSearch = useCallback(
    (searchTerm = inputValue) => {
      const term = searchTerm.trim();
      if (term) {
        setIsSearching(true);
        saveToRecentSearches(term);

        // تحديث عوامل التصفية في السياق
        setSearchQuery(term);

        router.push(`/search?query=${encodeURIComponent(term)}`);
        setShowSuggestions(false);

        setTimeout(() => setIsSearching(false), 1000);
      }
    },
    [inputValue, router, setSearchQuery]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
    setShowSuggestions(false);
    setTimeout(() => handleSearch(suggestion.text), 10);
  };

  const handleInputFocus = () => {
    if (recentSearches.length > 0 && inputValue === '') {
      setSuggestions(
        recentSearches.map((search) => ({ type: 'recent', text: search }))
      );
      // setShowSuggestions(true);
    } else if (suggestions.length > 0) {
      // setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full sm:pb-32 z-40">
      <div className="flex flex-col items-center justify-center w-full lg:pb-4">
        <div className="w-full fixed sm:absolute top-0 sm:bottom-0 sm:my-auto sm:w-2/3 p-2 sm:p-4 bg-white sm:bg-white/90 backdrop-blur-sm sm:rounded-lg shadow-sm flex justify-center items-center gap-2 z-20 sm:h-20">
          <div className="sm:hidden">
            <SideBarMenu />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="flex justify-center items-center bg-gradient-to-r from-primary-500 to-primary-400 text-white text-nowrap rounded-lg h-10 px-2 sm:px-6 hover:bg-primary-600 hover:scale-105 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <ImSpinner8 className="animate-spin ml-2" />
            ) : (
              <ImSearch className="ml-2" />
            )}
            بحث
          </button>
          <div className="flex-grow relative" ref={suggestionsRef}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                id="search-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                placeholder="ابحث عن عقار، سيارة، أو أي منتج..."
                className="flex-grow w-full rounded-lg h-10 p-2 text-sm sm:text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-sm lg:placeholder:text-lg pr-8"
                aria-autocomplete="list"
                aria-controls="search-suggestions"
              />
              {inputValue && (
                <button
                  onClick={clearSearch}
                  className="absolute left-2 top-3 text-gray-400 hover:text-gray-600"
                >
                  <ImCross size={14} />
                </button>
              )}
            </div>
            {isLoading && (
              <div className="absolute right-2 top-3">
                <ImSpinner8 className="animate-spin text-gray-400" />
              </div>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div
                id="search-suggestions"
                className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-right flex justify-between items-center"
                  >
                    <span>{suggestion.text}</span>
                    {suggestion.type === 'recent' && (
                      <span className="text-xs text-gray-400">حديث</span>
                    )}
                    {suggestion.type === 'popular' && (
                      <span className="text-xs text-primary-500">شائع</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CategoriesNavBar />
    </div>
  );
}
