// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { ImSearch, ImSpinner8, ImCross } from 'react-icons/im';
// import CategoriesNavBar from '../navbars/CategoriesNavBar';
// import { useSearch } from '@/features/search/search-context';
// import SideBarMenu from '../navbars/SideBarMenu';
// import { debounce } from 'lodash';

// export default function EnhancedSearch() {
//   const [inputValue, setInputValue] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const router = useRouter();
//   const inputRef = useRef(null);
//   const suggestionsRef = useRef(null);
//   const { setSearchQuery, results } = useSearch();

//   // تحميل عمليات البحث الحديثة من localStorage
//   useEffect(() => {
//     const savedSearches = localStorage.getItem('recentSearches');
//     if (savedSearches) {
//       setRecentSearches(JSON.parse(savedSearches));
//     }
//   }, []);

//   // حفظ عمليات البحث الحديثة
//   const saveToRecentSearches = (searchTerm) => {
//     const updatedSearches = [
//       searchTerm,
//       ...recentSearches.filter((item) => item !== searchTerm),
//     ].slice(0, 5);

//     setRecentSearches(updatedSearches);
//     localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
//   };

//   // إغلاق الاقتراحات عند النقر خارجها
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(event.target) &&
//         inputRef.current !== event.target
//       ) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // دالة لجلب الاقتراحات
//   const fetchSuggestions = useCallback(
//     debounce(async (query) => {
//       if (query.trim().length >= 2) {
//         setIsLoading(true);
//         try {
//           const response = await fetch(
//             `/api/search/suggestions?query=${encodeURIComponent(query.trim())}`,
//           );
//           const data = await response.json();

//           // دمج الاقتراحات مع عمليات البحث الحديثة
//           const allSuggestions = [
//             ...(data?.suggestions || []),
//             ...recentSearches
//               .filter(
//                 (search) =>
//                   search.toLowerCase().includes(query.toLowerCase()) &&
//                   !data?.suggestions.includes(search),
//               )
//               .map((search) => ({ type: 'recent', text: search })),
//           ];

//           setSuggestions(allSuggestions);
//         } catch (error) {
//           console.error('Error fetching suggestions:', error);
//           setSuggestions([]);
//         } finally {
//           setIsLoading(false);
//         }
//       } else if (query.trim().length === 0 && recentSearches.length > 0) {
//         // عرض عمليات البحث الحديثة عندما يكون حقل البحث فارغاً
//         setSuggestions(
//           recentSearches.map((search) => ({ type: 'recent', text: search })),
//         );
//         // setShowSuggestions(true);
//       } else {
//         setSuggestions([]);
//         setShowSuggestions(false);
//       }
//     }, 300),
//     [recentSearches],
//   );

//   // اغلاق الاقتراحات
//   useEffect(() => {
//     setShowSuggestions(false);
//   }, [isSearching]);

//   // التعامل مع تغيير قيمة الإدخال
//   useEffect(() => {
//     fetchSuggestions(inputValue);
//     return () => {
//       fetchSuggestions.cancel();
//     };
//   }, [inputValue, fetchSuggestions]);

//   // إجراء البحث
//   const handleSearch = useCallback(
//     (searchTerm = inputValue) => {
//       const term = searchTerm.trim();
//       if (term) {
//         setIsSearching(true);
//         saveToRecentSearches(term);

//         // تحديث عوامل التصفية في السياق
//         setSearchQuery(term);

//         router.push(`/search?query=${encodeURIComponent(term)}`);
//         setShowSuggestions(false);

//         setTimeout(() => setIsSearching(false), 1000);
//       }
//     },
//     [inputValue, router, setSearchQuery],
//   );

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSearch();
//     } else if (e.key === 'Escape') {
//       setShowSuggestions(false);
//       inputRef.current?.blur();
//     }
//   };

//   const handleSuggestionClick = (suggestion) => {
//     setInputValue(suggestion.text);
//     setShowSuggestions(false);
//     setTimeout(() => handleSearch(suggestion.text), 10);
//   };

//   const handleInputFocus = () => {
//     if (recentSearches.length > 0 && inputValue === '') {
//       setSuggestions(
//         recentSearches.map((search) => ({ type: 'recent', text: search })),
//       );
//       // setShowSuggestions(true);
//     } else if (suggestions.length > 0) {
//       // setShowSuggestions(true);
//     }
//   };

//   const clearSearch = () => {
//     setInputValue('');
//     setSuggestions([]);
//     setShowSuggestions(false);
//     inputRef.current?.focus();
//   };

//   return (
//     <div className="w-full sm:pb-32 z-40">
//       <div className="flex flex-col items-center justify-center w-full lg:pb-4">
//         <div className="w-full fixed sm:absolute top-0 sm:bottom-0 sm:my-auto sm:w-2/3 p-2 sm:p-4 bg-white sm:bg-white/90 backdrop-blur-sm sm:rounded-lg shadow-sm flex justify-center items-center gap-2 z-20 sm:h-20">
//           <div className="sm:hidden">
//             <SideBarMenu />
//           </div>
//           <button
//             onClick={() => handleSearch()}
//             disabled={isSearching}
//             className="flex justify-center items-center bg-gradient-to-r from-primary-500 to-primary-400 text-white text-nowrap rounded-lg h-10 px-2 sm:px-6 hover:bg-primary-600 hover:scale-105 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {isSearching ? (
//               <ImSpinner8 className="animate-spin ml-2" />
//             ) : (
//               <ImSearch className="ml-2" />
//             )}
//             بحث
//           </button>
//           <div className="flex-grow relative" ref={suggestionsRef}>
//             <div className="relative">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 id="search-input"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 onFocus={handleInputFocus}
//                 placeholder="ابحث عن عقار، سيارة، أو أي منتج..."
//                 className="flex-grow w-full rounded-lg h-10 p-2 text-sm sm:text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-sm lg:placeholder:text-lg pr-8"
//                 aria-autocomplete="list"
//                 aria-controls="search-suggestions"
//               />
//               {inputValue && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute left-2 top-3 text-gray-400 hover:text-gray-600"
//                 >
//                   <ImCross size={14} />
//                 </button>
//               )}
//             </div>
//             {isLoading && (
//               <div className="absolute right-2 top-3">
//                 <ImSpinner8 className="animate-spin text-gray-400" />
//               </div>
//             )}
//             {showSuggestions && suggestions.length > 0 && (
//               <div
//                 id="search-suggestions"
//                 className="absolute z-[60] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
//               >
//                 {suggestions.map((suggestion, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleSuggestionClick(suggestion)}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-right flex justify-between items-center"
//                   >
//                     <span>{suggestion.text}</span>
//                     {suggestion.type === 'recent' && (
//                       <span className="text-xs text-gray-400">حديث</span>
//                     )}
//                     {suggestion.type === 'popular' && (
//                       <span className="text-xs text-primary-500">شائع</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <CategoriesNavBar />
//     </div>
//   );
// }
'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { ImSearch, ImSpinner8, ImCross } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { useSearch } from '@/features/search/search-context';
import { debounce } from 'lodash';

function subscribeToRecentSearches(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener('recent-searches-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('recent-searches-updated', callback);
  };
}

function getRecentSearchesSnapshot() {
  try {
    return localStorage.getItem('recentSearches') || '[]';
  } catch (error) {
    console.error('Unable to read recent searches:', error);
    return '[]';
  }
}

export default function EnhancedSearch() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const recentSearchesSnapshot = useSyncExternalStore(
    subscribeToRecentSearches,
    getRecentSearchesSnapshot,
    () => '[]',
  );

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { searchQuery, category, setSearchQuery } = useSearch();
  const isSearchPage = pathname.startsWith('/search');

  const recentSearches = useMemo(() => {
    try {
      const parsed = JSON.parse(recentSearchesSnapshot);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === 'string')
        : [];
    } catch (error) {
      console.error('Unable to parse recent searches:', error);
      return [];
    }
  }, [recentSearchesSnapshot]);
  const currentInputValue = isSearchPage ? searchQuery : inputValue;

  // حفظ عمليات البحث الحديثة
  const saveToRecentSearches = useCallback((searchTerm) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 5);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      window.dispatchEvent(new Event('recent-searches-updated'));
    } catch (error) {
      console.error('Unable to save recent searches:', error);
    }
  }, [recentSearches]);

  // إغلاق الاقتراحات عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // دالة لجلب الاقتراحات (مُثبتة باستخدام useMemo لمنع إعادة الإنشاء)
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query) => {
        if (query.trim().length >= 2) {
          setIsLoading(true);
          try {
            const response = await fetch(
              `/api/search/suggestions?query=${encodeURIComponent(query.trim())}`,
            );
            if (!response.ok) {
              throw new Error(`Suggestions request failed: ${response.status}`);
            }
            const data = await response.json();

            // تطبيع الاقتراحات للتأكد من أن كل عنصر يحتوي على خاصية text
            const apiSuggestions = (data?.suggestions || []).map((s) =>
              typeof s === 'string' ? { type: 'suggestion', text: s } : s,
            );

            // دمج الاقتراحات مع عمليات البحث الحديثة وتجنب التكرار
            const allSuggestions = [
              ...apiSuggestions,
              ...recentSearches
                .filter(
                  (search) =>
                    search.toLowerCase().includes(query.toLowerCase()) &&
                    !apiSuggestions.some((apiS) => apiS.text === search),
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
        } else if (
          query.trim().length === 0 &&
          recentSearches.length > 0
        ) {
          setSuggestions(
            recentSearches.map((search) => ({
              type: 'recent',
              text: search,
            })),
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300),
    [recentSearches],
  );

  // التعامل مع تغيير قيمة الإدخال
  useEffect(() => {
    fetchSuggestions(currentInputValue);
    return () => {
      fetchSuggestions.cancel();
    };
  }, [currentInputValue, fetchSuggestions]);

  // إجراء البحث
  const handleSearch = useCallback(
    (searchTerm) => {
      const term = (
        typeof searchTerm === 'string' ? searchTerm : currentInputValue
      ).trim();
      if (term) {
        setIsSearching(true);
        saveToRecentSearches(term);
        setSearchQuery(term);
        const searchPath = isSearchPage ? pathname : '/search';
        const params = new URLSearchParams();
        params.set('query', term);
        if (
          category &&
          searchPath === '/search' &&
          !pathname.match(/\/search\/categoryId=\d+/)
        ) {
          params.set('categoryId', String(category.id));
        }
        router.push(`${searchPath}?${params.toString()}`);
        setShowSuggestions(false);

        // إعادة تعيين حالة البحث بعد فترة قصيرة (اختياري، مفيد إذا لم يتم إعادة تحميل الصفحة)
        setTimeout(() => setIsSearching(false), 1000);
      }
    },
    [
      currentInputValue,
      category,
      isSearchPage,
      pathname,
      router,
      setSearchQuery,
      saveToRecentSearches,
    ],
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(currentInputValue);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text); // تم إزالة setTimeout غير الضروري
  };

  const handleInputFocus = () => {
    if (recentSearches.length > 0 && currentInputValue === '') {
      setSuggestions(
        recentSearches.map((search) => ({ type: 'recent', text: search })),
      );
      setShowSuggestions(true); // تم إصلاح هذا السطر كان معلقاً
    } else if (suggestions.length > 0) {
      setShowSuggestions(true); // تم إصلاح هذا السطر كان معلقاً
    }
  };

  const clearSearch = () => {
    setInputValue('');
    if (isSearchPage) {
      setSearchQuery('');
      router.replace(pathname, { scroll: false });
    }
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 sm:p-0 z-10 relative ">
      {/* حاوية شريط البحث: تم تقليل الارتفاع على الهواتف من h-20 إلى h-14 وإعادته sm:h-20 */}
      <div className="w-full border border-white/10 bg-[#211F1B]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 flex justify-center items-center gap-2 min-h-14 sm:min-h-20 px-2 sm:px-3 py-2">
        {/* زر البحث: تم تقليل الارتفاع والخط على الشاشات الصغيرة h-8 والخط text-xs */}
        <button
          onClick={() => handleSearch(currentInputValue)}
          disabled={isSearching}
          className="flex justify-center items-center bg-[#C99B70] text-[#171512] text-nowrap rounded-xl h-9 sm:h-11 px-3 sm:px-6 hover:bg-[#D9B18C] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-base"
          aria-label="بحث"
        >
          {isSearching ? (
            <ImSpinner8 className="animate-spin ml-1 sm:ml-2 text-xs sm:text-sm" />
          ) : (
            <ImSearch className="ml-1 sm:ml-2 text-xs sm:text-sm" />
          )}
          <span className="mr-0.5 sm:mr-1">بحث</span>
        </button>

        <div className="flex-grow relative" ref={suggestionsRef}>
          <div className="relative">
            {/* حقل الإدخال: تم تقليل الارتفاع h-8، الحشوات pr-6 pl-6، والخط text-xs على الهواتف */}
            <input
              ref={inputRef}
              role="combobox"
              type="text"
              id="search-input"
              value={currentInputValue}
              onChange={(event) => {
                const value = event.target.value;
                setInputValue(value);
                if (isSearchPage) setSearchQuery(value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder="ابحث عن عقار، سيارة، أو أي منتج..."
              className="flex-grow w-full rounded-xl h-9 sm:h-11 p-2 text-xs sm:text-base border border-white/10 bg-[#171512] text-[#F5F0E9] focus:outline-none focus:ring-2 focus:ring-[#C99B70]/40 placeholder:text-[11px] sm:placeholder:text-sm lg:placeholder:text-base placeholder:text-stone-500 pr-6 pl-6 sm:pr-8 sm:pl-8 text-right"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions}
              aria-haspopup="listbox"
            />

            {/* زر مسح البحث: تم تصغير حجم الأيقونة وموضعها على الهواتف */}
            {currentInputValue && (
              <button
                onClick={clearSearch}
                className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#D9B18C] transition-colors"
                aria-label="مسح البحث"
              >
                <ImCross className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            {/* أيقونة التحميل: تم تصغير حجمها وموضعها على الهواتف */}
            {isLoading && (
              <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2">
                <ImSpinner8 className="animate-spin text-stone-400 text-xs sm:text-base" />
              </div>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div
              id="search-suggestions"
              className="absolute z-50 w-full mt-2 bg-[#211F1B] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto text-xs sm:text-sm text-[#F5F0E9]"
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.text}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-[#C99B70]/10 cursor-pointer text-right flex justify-between items-center transition-colors"
                  role="option"
                  aria-selected="false"
                >
                  <span>{suggestion.text}</span>
                  {suggestion.type === 'recent' && (
                    <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap mr-2">
                      حديث
                    </span>
                  )}
                  {suggestion.type === 'popular' && (
                    <span className="text-[10px] sm:text-xs text-primary-500 whitespace-nowrap mr-2">
                      شائع
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* شريط التصنيفات سيظهر هنا مباشرة أسفل شريط البحث */}
      <div className="w-full flex justify-center">
        <CategoriesNavBar />
      </div>
    </div>
  );
}
