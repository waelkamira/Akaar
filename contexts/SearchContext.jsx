'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { filterOptions } from '../lib/mockData';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cities } from '../components/lists/Cities';

const SearchContext = createContext(undefined);

export function SearchProvider({ children, initialCategory }) {
  // Core state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory || null);
  const [filters, setFilters] = useState({});
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [shouldSearchOnLoad, setShouldSearchOnLoad] =
    useState(!!initialCategory);
  console.log('filters from search context', filters);
  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Check if we're on the search page
  const isSearchPage = pathname.startsWith('/search');

  // Static filters state
  const [staticFilters] = useState({
    cities: cities,
  });

  // Results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [shouldScrollTop, setShouldScrollTop] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(true); // إضافة حالة لتتبع إذا كان بحث جديد

  // Handle URL query changes
  useEffect(() => {
    if (!isSearchPage) return;

    const query = searchParams.get('query');
    if (query !== null) {
      setSearchQuery(query);
      setShouldSearchOnLoad(true);
    }
  }, [searchParams, isSearchPage]);

  // Load dynamic filters when category changes
  const loadDynamicFilters = useCallback(async (categoryObj) => {
    if (!categoryObj?.name) {
      console.log('No category or name provided');
      return [];
    }

    try {
      const selectedModule = await import(
        `../components/categoryFields/${categoryObj.name}.jsx`
      );
      const filters = Array.isArray(selectedModule.default)
        ? selectedModule.default
        : [];
      return filters;
    } catch (err) {
      console.error(`Failed to load filters for ${categoryObj.name}:`, err);
      return [];
    }
  }, []);

  // Handle initial category
  useEffect(() => {
    if (initialCategory) {
      const categoryObj = filterOptions.categories.find(
        (cat) => cat.id === initialCategory.id
      );
      if (categoryObj) {
        setCategory(categoryObj);
        loadDynamicFilters(categoryObj).then((filters) => {
          setDynamicFilters(filters);
        });
      }
    }
  }, [initialCategory, loadDynamicFilters]);

  // Handle category changes from URL (only on search page)
  useEffect(() => {
    const handleUrlCategory = async () => {
      // Extract categoryId from pathname
      const categoryIdMatch = pathname.match(/\/search\/categoryId=(\d+)/);
      const categoryId = categoryIdMatch ? categoryIdMatch[1] : null;

      setLoading(true);
      try {
        if (!categoryId) {
          setCategory(null);
          setDynamicFilters([]);
          setFilters((prev) => {
            const { details, ...rest } = prev;
            return rest;
          });
          setPage(1);
          setShouldSearchOnLoad(true);
          return;
        }

        const categoryObj = filterOptions.categories.find(
          (cat) => cat.id.toString() === categoryId
        );

        if (!categoryObj) {
          console.log('Category not found:', categoryId);
          return;
        }

        // Load dynamic filters first
        const filters = await loadDynamicFilters(categoryObj);

        // Then update state
        setCategory(categoryObj);
        setDynamicFilters(filters);
        setFilters((prev) => {
          const { details, ...rest } = prev;
          return rest;
        });
        setPage(1);
        setShouldSearchOnLoad(true);
      } catch (err) {
        console.error('Error loading category:', err);
        setDynamicFilters([]);
      } finally {
        setLoading(false);
      }
    };

    handleUrlCategory();
  }, [pathname, loadDynamicFilters]);

  // Perform search - التعديل الرئيسي هنا
  const performSearch = useCallback(
    async (targetPage = page, isLoadMore = false) => {
      if (!isSearchPage) return;

      setLoading(true);
      setError(null);

      try {
        const searchBody = {
          query: searchQuery,
          categoryId: category?.id,
          filters: {
            ...filters,
            details: filters.details || {},
          },
          page: targetPage,
          limit: 20,
        };

        // Remove query from filters if it exists to avoid duplication
        if (searchBody.filters.query) {
          delete searchBody.filters.query;
        }

        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchBody),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();

        // التعديل الرئيسي: عرض النتائج الجديدة فقط وليس إضافتها للنتائج السابقة
        setResults(data.products); // دائماً استبدال النتائج القديمة بالجديدة
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);

        // إذا كان هذا بحث جديد وليس تحميل المزيد، ننتقل للأعلى
        if (!isLoadMore) {
          setShouldScrollTop(true);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(
          'لم يتم العثور على نتائج مطابقة قم بتعديل كلمات البحث للحصول على نتائج أفضل'
        );
        setResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
        setIsNewSearch(false);
      }
    },
    [searchQuery, category, filters, isSearchPage]
  );

  // Handle scrolling separately
  useEffect(() => {
    if (shouldScrollTop && !loading && typeof window !== 'undefined') {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      setShouldScrollTop(false);
    }
  }, [shouldScrollTop, loading]);

  // Get towns by city
  const getTownsByCity = useCallback(
    (cityId) => {
      if (!cityId) return [];
      const city = staticFilters.cities.find(
        (c) => c.id === cityId || c.name === cityId
      );
      return city?.towns || [];
    },
    [staticFilters.cities]
  );

  // إضافة useEffect جديد لإدارة طلبات البحث عند تغيير الصفحة
  useEffect(() => {
    if (page > 1 && !shouldSearchOnLoad && !isNewSearch) {
      performSearch(page, false); // false يعني أن هذا ليس تحميلاً للمزيد بل صفحة جديدة
    }
  }, [page, performSearch, shouldSearchOnLoad, isNewSearch]);

  // Remove automatic search trigger
  useEffect(() => {
    if (!isSearchPage) return;

    if (shouldSearchOnLoad) {
      setIsNewSearch(true); // تمييز أن هذا بحث جديد
      performSearch(1, false);
      setShouldSearchOnLoad(false);
    }
  }, [shouldSearchOnLoad, performSearch, isSearchPage]);

  // Update URL when category changes (only on search page)
  useEffect(() => {
    if (!isSearchPage) return;

    // Only update URL for category changes, not for pagination
    if (page === 1) {
      if (category) {
        router.replace(`/search/categoryId=${category.id}`, { scroll: false });
      } else {
        router.replace('/search', { scroll: false });
      }
    }
  }, [category, router, isSearchPage, page]);

  // Filter management functions
  const setFilter = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (key.startsWith('details.')) {
          const fieldName = key.split('.')[1];
          newFilters.details = { ...prev.details, [fieldName]: value };
        } else {
          // Clear town when city changes
          if (key === 'city' && prev.town) {
            delete newFilters.town;
          }
          newFilters[key] = value;
        }

        // Add search query to filters if it exists
        if (searchQuery) {
          newFilters.query = searchQuery;
        }

        return newFilters;
      });
      setPage(1);
      setIsNewSearch(true); // تمييز أن هذا بحث جديد
    },
    [searchQuery]
  );

  const removeFilter = useCallback(
    (key) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (key.startsWith('details.')) {
          const fieldName = key.split('.')[1];
          if (newFilters.details) {
            const { [fieldName]: removed, ...rest } = newFilters.details;
            newFilters.details =
              Object.keys(rest).length > 0 ? rest : undefined;
          }
        } else if (key === 'city') {
          // Remove both city and town
          delete newFilters.city;
          delete newFilters.town;
        } else if (key === 'category') {
          setCategory(null);
        } else if (key === 'priceMin' || key === 'priceMax') {
          // Handle price filters separately
          delete newFilters[key];
        } else {
          delete newFilters[key];
        }

        return newFilters;
      });
      setPage(1);
      setIsNewSearch(true); // تمييز أن هذا بحث جديد
      // Trigger search after removing filter
      setShouldSearchOnLoad(true);
    },
    [setCategory]
  );

  const clearFilters = useCallback(() => {
    // Keep the category but clear all other filters and search query
    setFilters({});
    setSearchQuery('');
    setPage(1);
    setIsNewSearch(true); // تمييز أن هذا بحث جديد
    // Trigger search after clearing filters
    setShouldSearchOnLoad(true);
  }, []);

  const clearAll = useCallback(() => {
    // Clear everything including category and search query
    setFilters({});
    setCategory(null);
    setSearchQuery('');
    setPage(1);
    setIsNewSearch(true); // تمييز أن هذا بحث جديد
    // Trigger search after clearing everything
    setShouldSearchOnLoad(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      // سيتم التعامل مع البحث عبر useEffect الجديد
    }
  }, [loading, hasMore, page]);

  const value = {
    // Search state
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    clearAll,
    dynamicFilters,
    performSearch,

    // Results
    results,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,

    // Pagination
    page,
    setPage,

    // Static filters
    staticFilters,
    getTownsByCity,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
