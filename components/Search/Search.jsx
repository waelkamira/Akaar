
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
import { createPortal } from 'react-dom';
import { ImSearch, ImSpinner8, ImCross } from 'react-icons/im';
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import { useSearch } from '@/features/search/search-context';

const MAX_RECENT_SEARCHES = 5;

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

export default function EnhancedSearch({ showCategories = true }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionsPosition, setSuggestionsPosition] = useState(null);
  const recentSearchesSnapshot = useSyncExternalStore(
    subscribeToRecentSearches,
    getRecentSearchesSnapshot,
    () => '[]',
  );

  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const suggestionsListRef = useRef(null);
  const { searchQuery, category, setSearchQuery } = useSearch();
  const isSearchPage = pathname.startsWith('/search');

  const recentSearches = useMemo(() => {
    try {
      const parsed = JSON.parse(recentSearchesSnapshot);
      if (!Array.isArray(parsed)) return [];

      const uniqueSearches = new Set();
      return parsed
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => {
          const normalized = item.toLocaleLowerCase();
          if (!item || uniqueSearches.has(normalized)) return false;
          uniqueSearches.add(normalized);
          return true;
        })
        .slice(0, MAX_RECENT_SEARCHES);
    } catch (error) {
      console.error('Unable to parse recent searches:', error);
      return [];
    }
  }, [recentSearchesSnapshot]);
  const currentInputValue = isSearchPage ? searchQuery : inputValue;
  const suggestions = useMemo(() => {
    const query = currentInputValue.trim().toLocaleLowerCase();
    return recentSearches
      .filter((search) => !query || search.toLocaleLowerCase().includes(query))
      .map((search) => ({ type: 'recent', text: search }))
      .slice(0, MAX_RECENT_SEARCHES);
  }, [currentInputValue, recentSearches]);

  // حفظ عمليات البحث الحديثة
  const saveToRecentSearches = useCallback((searchTerm) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(
        (item) => item.toLocaleLowerCase() !== searchTerm.toLocaleLowerCase(),
      ),
    ].slice(0, MAX_RECENT_SEARCHES);
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
        !suggestionsListRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!showSuggestions || suggestions.length === 0 || !inputRef.current) {
      return undefined;
    }

    const updateSuggestionsPosition = () => {
      const inputRect = inputRef.current?.getBoundingClientRect();
      if (!inputRect) return;

      const maxHeight = Math.min(240, window.innerHeight - 16);
      const belowTop = inputRect.bottom + 8;
      const top =
        belowTop + maxHeight <= window.innerHeight
          ? belowTop
          : Math.max(8, inputRect.top - maxHeight - 8);

      setSuggestionsPosition({
        top,
        left: inputRect.left,
        width: inputRect.width,
        maxHeight,
      });
    };

    const animationFrameId = window.requestAnimationFrame(
      updateSuggestionsPosition,
    );
    window.addEventListener('resize', updateSuggestionsPosition);
    window.addEventListener('scroll', updateSuggestionsPosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSuggestionsPosition);
      window.removeEventListener('scroll', updateSuggestionsPosition, true);
    };
  }, [showSuggestions, suggestions.length]);

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
    setShowSuggestions(suggestions.length > 0);
  };

  const clearSearch = () => {
    setInputValue('');
    if (isSearchPage) {
      setSearchQuery('');
      router.replace(pathname, { scroll: false });
    }
    setShowSuggestions(true);
    inputRef.current?.focus();
  };

  return (
    <div className="relative z-10 flex w-full min-w-0 flex-col items-center justify-center gap-4 sm:p-0">
      {/* حاوية شريط البحث: تم تقليل الارتفاع على الهواتف من h-20 إلى h-14 وإعادته sm:h-20 */}
      <div className="flex min-h-14 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border border-ak-line-strong bg-ak-surface/90 px-2 py-2 shadow-ak-panel backdrop-blur-2xl sm:min-h-20 sm:px-3">
        {/* زر البحث: تم تقليل الارتفاع والخط على الشاشات الصغيرة h-8 والخط text-xs */}
        <button
          onClick={() => handleSearch(currentInputValue)}
          disabled={isSearching}
          className="flex h-9 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl bg-ak-brand px-3 text-xs text-ak-ink shadow-ak-glow transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:px-6 sm:text-base"
          aria-label="بحث"
        >
          {isSearching ? (
            <ImSpinner8 className="animate-spin ml-1 sm:ml-2 text-xs sm:text-sm" />
          ) : (
            <ImSearch className="ml-1 sm:ml-2 text-xs sm:text-sm" />
          )}
          <span className="mr-0.5 sm:mr-1">بحث</span>
        </button>

        <div className="relative min-w-0 flex-1" ref={suggestionsRef}>
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
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder="ابحث عن عقار، سيارة، أو أي منتج..."
              className="h-9 w-full min-w-0 rounded-xl border border-ak-line bg-ak-ink/70 p-2 pl-6 pr-6 text-right text-xs text-white placeholder:text-[11px] placeholder:text-ak-quiet focus:outline-none focus:ring-2 focus:ring-ak-amber/40 sm:h-11 sm:pl-8 sm:pr-8 sm:text-base sm:placeholder:text-sm lg:placeholder:text-base"
              aria-autocomplete="list"
              aria-controls="search-suggestions"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-haspopup="listbox"
            />

            {/* زر مسح البحث: تم تصغير حجم الأيقونة وموضعها على الهواتف */}
            {currentInputValue && (
              <button
                onClick={clearSearch}
                className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ak-honey transition-colors"
                aria-label="مسح البحث"
              >
                <ImCross className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

          </div>
        </div>
      </div>

      {showSuggestions &&
        suggestions.length > 0 &&
        suggestionsPosition &&
        createPortal(
          <div
            ref={suggestionsListRef}
            id="search-suggestions"
            className="fixed z-[1200] overflow-y-auto rounded-xl border border-ak-line-strong bg-ak-raised/95 text-xs text-white shadow-ak-panel backdrop-blur-2xl sm:text-sm"
            style={suggestionsPosition}
            role="listbox"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-right transition-colors hover:bg-ak-brand-soft sm:px-4 sm:py-3"
                role="option"
                aria-selected="false"
              >
                <span>{suggestion.text}</span>
                <span className="mr-2 whitespace-nowrap text-[10px] text-white sm:text-xs">
                  حديث
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* شريط التصنيفات سيظهر هنا مباشرة أسفل شريط البحث */}
      {showCategories && (
        <div className="flex w-full justify-center">
          <CategoriesNavBar />
        </div>
      )}
    </div>
  );
}
