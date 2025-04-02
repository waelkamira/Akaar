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

export function SearchProvider({ children }) {
  // Core state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({});
  const [dynamicFilters, setDynamicFilters] = useState([]);
  const [shouldSearchOnLoad, setShouldSearchOnLoad] = useState(false);

  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Check if we're on the search page
  const isSearchPage = pathname === '/search';

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
      console.log(`Loading filters for category: ${categoryObj.name}`);
      const module = await import(
        `../components/categoryFields/${categoryObj.name}.jsx`
      );
      const filters = Array.isArray(module.default) ? module.default : [];
      console.log('Loaded filters:', filters);
      return filters;
    } catch (err) {
      console.error(`Failed to load filters for ${categoryObj.name}:`, err);
      return [];
    }
  }, []);

  // Handle category changes from URL (only on search page)
  useEffect(() => {
    // if (!isSearchPage) return;

    const handleUrlCategory = async () => {
      const categoryId = searchParams.get('categoryId');
      console.log('URL Category ID:', categoryId);

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

        console.log('Loading category:', categoryObj);

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

        console.log('Category and filters loaded successfully');
      } catch (err) {
        console.error('Error loading category:', err);
        setDynamicFilters([]);
      } finally {
        setLoading(false);
      }
    };

    handleUrlCategory();
  }, [searchParams, loadDynamicFilters, isSearchPage]);

  // Perform search
  const performSearch = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
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
          page: pageNum,
          limit: 8,
        };

        console.log('Search request:', searchBody);

        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(searchBody),
        });

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        console.log('Search response:', data);

        // Only update results based on whether it's a new search or load more
        if (!isLoadMore) {
          setResults(data.products);
          setShouldScrollTop(true); // Signal that we want to scroll to top
        } else {
          setResults((prev) => [...prev, ...data.products]);
        }

        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch results');
        if (!isLoadMore) {
          setResults([]);
          setTotalCount(0);
        }
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, category, filters, isSearchPage]
  );

  // Handle scrolling separately
  useEffect(() => {
    if (shouldScrollTop && !loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Remove automatic search trigger
  useEffect(() => {
    if (!isSearchPage) return;

    if (shouldSearchOnLoad) {
      setPage(1);
      performSearch(1, false);
      setShouldSearchOnLoad(false);
    }
  }, [shouldSearchOnLoad, loading, performSearch, isSearchPage]);

  // Update URL when category changes (only on search page)
  useEffect(() => {
    if (!isSearchPage) return;

    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('categoryId', category.id.toString());
    } else {
      params.delete('categoryId');
    }

    // Only update URL for category changes, not for pagination
    if (page === 1) {
      router.replace(`/search?${params.toString()}`, { scroll: false }); // Changed push to replace
    }
  }, [category, router, searchParams, isSearchPage, page]);

  // Filter management functions
  const setFilter = useCallback((key, value) => {
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

      return newFilters;
    });
    setPage(1);
  }, []);

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
      // Trigger search after removing filter
      setShouldSearchOnLoad(true);
    },
    [setCategory]
  );

  const clearFilters = useCallback(() => {
    // Keep the category but clear all other filters
    setFilters({});
    setPage(1);
    // Trigger search after clearing filters
    setShouldSearchOnLoad(true);
  }, []);

  const clearAll = useCallback(() => {
    // Clear everything including category
    setFilters({});
    setCategory(null);
    setPage(1);
    // Trigger search after clearing everything
    setShouldSearchOnLoad(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(nextPage, true);
    }
  }, [loading, hasMore, page, performSearch]);

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
