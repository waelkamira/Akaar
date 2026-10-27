'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cities } from '@/components/lists/Cities';
import categories from '@/components/Categories/categories';

const SearchContext = createContext(undefined);

export function SearchProvider({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchPage = pathname.startsWith('/search');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({});
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const requestId = useRef(0);
  const requestController = useRef(null);
  const searchTimer = useRef(null);

  const staticFilters = useMemo(() => ({ cities }), []);

  const loadDynamicFilters = useCallback(async (categoryName) => {
    if (!categoryName) return [];
    try {
      const categoryModule = await import(`../../components/categoryFields/${categoryName}.jsx`);
      return Array.isArray(categoryModule.default) ? categoryModule.default : [];
    } catch (loadError) {
      console.error(`Unable to load filters for ${categoryName}:`, loadError);
      return [];
    }
  }, []);

  const safeAbort = (controller) => {
    if (controller && !controller.signal.aborted) {
      try {
        controller.abort(new Error('Request aborted by cleanup or superseded'));
      } catch (e) {
        // تجاهل الأخطاء
      }
    }
  };

  // ✅ الإصلاح الجذري هنا: مزامنة صحيحة مع الرابط
  useEffect(() => {
    if (!isSearchPage) return;

    const query = searchParams.get('query') || '';
    setSearchQuery((current) => (current === query ? current : query));

    // نقرأ categoryId مباشرة من searchParams (الطريقة الحديثة والصحيحة)
    const routeCategoryId = searchParams.get('categoryId');
    
    const nextCategory = routeCategoryId
      ? categories.find((item) => String(item.id) === String(routeCategoryId)) || null
      : null;

    // منع إعادة التعيين إذا كانت الفئة هي نفسها (يمنع الحلقات اللانهائية)
    setCategory((current) =>
      current?.id === nextCategory?.id ? current : nextCategory
    );
  }, [isSearchPage, searchParams]); // أزلت pathname من الاعتماديات لأنه لا يتغير في /search

  useEffect(() => {
    let active = true;
    loadDynamicFilters(category?.name).then((nextFilters) => {
      if (active) setDynamicFilters(nextFilters);
    });
    return () => {
      active = false;
    };
  }, [category?.name, loadDynamicFilters]);

  const performSearch = useCallback(
    async (targetPage = 1, isLoadMore = false) => {
      if (!isSearchPage) return;

      window.clearTimeout(searchTimer.current);
      safeAbort(requestController.current);

      const controller = new AbortController();
      requestController.current = controller;
      const currentRequestId = ++requestId.current;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: searchQuery,
            categoryId: category?.id,
            filters: { ...filters, details: filters.details || {} },
            page: targetPage,
            limit: 20,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Search request failed.');
        if (currentRequestId !== requestId.current) return;

        setResults((current) => (isLoadMore ? [...current, ...data.products] : data.products));
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
      } catch (searchError) {
        if (controller.signal.aborted || searchError?.name === 'AbortError') return;
        if (currentRequestId !== requestId.current) return;

        console.error('Search request failed:', searchError);
        setError('تعذر إكمال البحث. يرجى المحاولة مرة أخرى.');
        setResults([]);
        setTotalCount(0);
        setHasMore(false);
      } finally {
        if (requestController.current === controller) requestController.current = null;
        if (currentRequestId === requestId.current) setLoading(false);
      }
    },
    [category, filters, isSearchPage, searchQuery]
  );

  useEffect(() => {
    if (!isSearchPage) return undefined;

    searchTimer.current = window.setTimeout(() => {
      setPage(1);
      performSearch(1, false);
    }, 300);

    return () => {
      window.clearTimeout(searchTimer.current);
      safeAbort(requestController.current);
      if (requestController.current) requestController.current = null;
    };
  }, [isSearchPage, searchQuery, category?.id, filters, performSearch]);

  useEffect(() => {
    if (page > 1 && isSearchPage) performSearch(page, true);
  }, [page, isSearchPage, performSearch]);

  useEffect(
    () => () => {
      safeAbort(requestController.current);
      if (requestController.current) requestController.current = null;
    },
    []
  );

  const getTownsByCity = useCallback(
    (cityId) => {
      if (!cityId) return [];
      const city = staticFilters.cities.find((item) => item.id === cityId || item.name === cityId);
      return city?.towns || [];
    },
    [staticFilters.cities]
  );

  const setFilter = useCallback((key, value) => {
    setFilters((current) => {
      const next = { ...current };
      if (key.startsWith('details.')) {
        const detailKey = key.slice('details.'.length);
        const details = { ...current.details };
        if (value === null || value === undefined || value === '') {
          delete details[detailKey];
        } else {
          details[detailKey] = value;
        }
        if (Object.keys(details).length) next.details = details;
        else delete next.details;
      } else if (value === null || value === undefined || value === '') {
        delete next[key];
      } else {
        next[key] = value;
      }
      if (key === 'city') delete next.town;
      return next;
    });
    setPage(1);
  }, []);

  const removeFilter = useCallback(
    (key) => {
      if (key === 'category' || key === 'categoryId') {
        setFilters((current) => {
          const next = { ...current };
          delete next.details;
          return next;
        });
        setCategory(null);
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete('categoryId');
        const queryString = nextParams.toString();
        router.replace(queryString ? `/search?${queryString}` : '/search', { scroll: false });
        setPage(1);
        return;
      }
      if (key.startsWith('details.')) {
        setFilter(key, null);
        return;
      }
      setFilters((current) => {
        const next = { ...current };
        if (key === 'city') delete next.town;
        delete next[key];
        return next;
      });
      setPage(1);
    },
    [setFilter, searchParams, router]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({});
    setCategory(null);
    setSearchQuery('');
    setPage(1);
    router.replace('/search', { scroll: false });
  }, [router]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((current) => current + 1);
  }, [hasMore, loading]);

  const value = {
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
    results,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    page,
    setPage,
    staticFilters,
    getTownsByCity,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
}