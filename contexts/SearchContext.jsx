'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { filterOptions } from '../lib/mockData';
import { useRouter, useSearchParams } from 'next/navigation';
import { cities } from '../components/lists/Cities';

const SearchContext = createContext(undefined);

export function SearchProvider({ children }) {
  // Core state
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({});
  const [dynamicFilters, setDynamicFilters] = useState([]);

  // Static filters state
  const [staticFilters] = useState({
    cities: cities,
    adTypes: [
      { id: 1, name: 'للبيع' },
      { id: 2, name: 'للإيجار' },
      { id: 3, name: 'مطلوب' },
    ],
  });

  // Results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  // Navigation
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Load dynamic filters when category changes
  const loadDynamicFilters = useCallback(async (categoryObj) => {
    if (!categoryObj?.enName) {
      console.log('No category or enName provided');
      return [];
    }

    try {
      console.log(`Loading filters for category: ${categoryObj.enName}`);
      const module = await import(
        `../components/categoryFields/${categoryObj.enName}.jsx`
      );
      const filters = Array.isArray(module.default) ? module.default : [];
      console.log('Loaded filters:', filters);
      return filters;
    } catch (err) {
      console.error(`Failed to load filters for ${categoryObj.enName}:`, err);
      return [];
    }
  }, []);

  // Handle category changes from URL
  useEffect(() => {
    const handleUrlCategory = async () => {
      const categoryId = searchParams.get('categoryId');
      console.log('URL Category ID:', categoryId);

      if (!categoryId) {
        if (category) {
          setCategory(null);
          setDynamicFilters([]);
          setFilters((prev) => {
            const { details, ...rest } = prev;
            return rest;
          });
          setPage(1);
        }
        return;
      }

      const categoryObj = filterOptions.categories.find(
        (cat) => cat.id.toString() === categoryId
      );

      if (!categoryObj) {
        console.log('Category not found:', categoryId);
        return;
      }

      if (category?.id.toString() === categoryId) {
        console.log('Category already selected');
        return;
      }

      console.log('Loading category:', categoryObj);
      setLoading(true);

      try {
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

        console.log('Category and filters loaded successfully');
      } catch (err) {
        console.error('Error loading category:', err);
        setDynamicFilters([]);
      } finally {
        setLoading(false);
      }
    };

    handleUrlCategory();
  }, [searchParams, loadDynamicFilters]);

  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('categoryId', category.id.toString());
    } else {
      params.delete('categoryId');
    }

    router.push(`/search?${params.toString()}`, { scroll: false });
  }, [category, router, searchParams]);

  // Perform search
  const performSearch = useCallback(async () => {
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
        page,
        limit: 12,
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

      setResults(page === 1 ? data.products : [...results, ...data.products]);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results');
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, filters, page]);

  // Trigger search on relevant changes
  useEffect(() => {
    if (!searchQuery && !category && Object.keys(filters).length === 0) {
      return;
    }

    const timer = setTimeout(performSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, category?.id, JSON.stringify(filters), page, performSearch]);

  // Filter management
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

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (key.startsWith('details.')) {
        const fieldName = key.split('.')[1];
        const { [fieldName]: removed, ...rest } = newFilters.details || {};
        newFilters.details = rest;
      } else if (key === 'city') {
        // Remove both city and town
        delete newFilters.city;
        delete newFilters.town;
      } else {
        delete newFilters[key];
      }

      return newFilters;
    });
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCategory(null);
    setPage(1);
  }, []);

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
    dynamicFilters,

    // Results
    results,
    loading,
    error,
    totalCount,

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
