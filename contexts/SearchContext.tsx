'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { filterOptions } from '../lib/mockData';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Town {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  towns: Town[];
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
  filters: {
    city?: string | null;
    town?: string | null;
    priceMin?: number;
    priceMax?: number;
    details?: Record<string, any>;
  };
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  results: any[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  loadMore: () => void;
  selectedFilters: Array<{
    key: string;
    value: any;
    label: string;
  }>;
  availableFilters: any;
  performSearch: () => void;
  getTownsByCity: (cityId: string | null) => Town[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children, initialCategory = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(initialCategory);
  const [filters, setFilters] = useState<SearchContextType['filters']>({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [availableFilters, setAvailableFilters] = useState(filterOptions);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // دالة للحصول على المناطق بناءً على المدينة
  const getTownsByCity = useCallback(
    (cityId: string | null) => {
      if (!cityId) return [];
      const city = availableFilters?.static?.cities?.find(
        (c) => c.id === cityId || c.name === cityId
      );
      return city?.towns || [];
    },
    [availableFilters]
  );

  // دالة البحث
  const performSearch = useCallback(async () => {
    if (!searchQuery && !categoryId && Object.keys(filters).length === 0) {
      setResults([]);
      setTotalCount(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // تحضير الفلاتر للبحث
      const searchFilters = {
        ...filters,
        city: filters.city || null,
        town: filters.town || null,
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchQuery,
          categoryId,
          filters: searchFilters,
          page,
          limit: 10,
        }),
      });

      if (!response.ok) throw new Error('Search request failed');

      const data = await response.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid response format');
      }

      setResults((prev) =>
        page === 1 ? data.products : [...prev, ...data.products]
      );
      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while searching'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryId, filters, page]);

  useEffect(() => {
    performSearch();
  }, [searchQuery, categoryId, filters, page, performSearch]);

  // تحديث URL عند تغيير الفلاتر
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) params.set('category', categoryId.toString());
    else params.delete('category');

    if (filters.city) params.set('city', filters.city);
    else params.delete('city');

    if (filters.town) params.set('town', filters.town);
    else params.delete('town');

    // تنفيذ البحث عند تغيير المدينة أو المنطقة
    if (filters.city || filters.town) {
      performSearch();
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    categoryId,
    pathname,
    router,
    searchParams,
    filters.city,
    filters.town,
    performSearch,
  ]);

  // إنشاء قائمة الفلاتر المختارة
  const selectedFilters = useMemo(() => {
    const selected = [];

    // إضافة التصنيف إذا تم اختياره
    if (categoryId) {
      const category = filterOptions.categories.find(
        (c) => c.id === categoryId
      );
      if (category) {
        selected.push({
          key: 'category',
          value: categoryId,
          label: `التصنيف: ${category.name}`,
        });
      }
    }

    // إضافة المدينة إذا تم اختيارها
    if (filters.city) {
      const city = availableFilters?.static?.cities?.find(
        (c) => c.id === filters.city
      );
      if (city) {
        selected.push({
          key: 'city',
          value: filters.city,
          label: `المدينة: ${city.name}`,
        });
      }
    }

    // إضافة المنطقة إذا تم اختيارها
    if (filters.town && filters.city) {
      const city = availableFilters?.static?.cities?.find(
        (c) => c.id === filters.city
      );
      if (city) {
        const town = city.towns.find((t) => t.id === filters.town);
        if (town) {
          selected.push({
            key: 'town',
            value: filters.town,
            label: `المنطقة: ${town.name}`,
          });
        }
      }
    }

    // إضافة مدى السعر إذا تم تحديده
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      selected.push({
        key: 'price',
        value: 'price-range',
        label: `السعر: ${filters.priceMin || 0} - ${
          filters.priceMax || 'ماكس'
        }`,
      });
    }

    // إضافة الفلاتر الديناميكية حسب التصنيف
    if (categoryId && filters.details) {
      const categoryFilters = filterOptions.dynamic[categoryId];
      if (categoryFilters) {
        for (const [key, value] of Object.entries(filters.details)) {
          if (categoryFilters[key]) {
            if (Array.isArray(categoryFilters[key])) {
              const option = categoryFilters[key].find(
                (opt) => opt.id === value
              );
              if (option) {
                selected.push({
                  key: `details.${key}`,
                  value: value,
                  label: `${key}: ${option.name}`,
                });
              }
            } else if (typeof categoryFilters[key] === 'object') {
              selected.push({
                key: `details.${key}`,
                value: value,
                label: `${key}: ${value}`,
              });
            }
          }
        }
      }
    }

    return selected;
  }, [categoryId, filters, availableFilters]);

  // تعيين قيمة الفلتر
  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => {
      if (key.startsWith('details.')) {
        const detailKey = key.split('.')[1];
        return {
          ...prev,
          details: {
            ...(prev.details || {}),
            [detailKey]: value,
          },
        };
      }
      return { ...prev, [key]: value };
    });
    setPage(1);
  }, []);

  // حذف فلتر
  const removeFilter = useCallback(
    (key: string) => {
      if (key === 'price') {
        // حذف فلتر السعر
        setFilters((prev) => ({
          ...prev,
          priceMin: undefined,
          priceMax: undefined,
        }));
      } else if (key === 'category') {
        // حذف التصنيف
        setCategoryId(null);
        setFilters((prev) => ({
          ...prev,
          details: undefined,
        }));
      } else if (key === 'city') {
        // حذف المدينة والمنطقة
        setFilters((prev) => {
          const { city, town, ...rest } = prev;
          return rest;
        });
      } else if (key === 'town') {
        // حذف المنطقة فقط
        setFilters((prev) => {
          const { town, ...rest } = prev;
          return rest;
        });
      } else if (key.startsWith('details.')) {
        // حذف فلتر تفاصيل
        setFilters((prev) => {
          const detailKey = key.split('.')[1];
          if (!prev.details) return prev;

          const newDetails = { ...prev.details };
          delete newDetails[detailKey];

          return {
            ...prev,
            details:
              Object.keys(newDetails).length > 0 ? newDetails : undefined,
          };
        });
      }

      setPage(1);
      performSearch();
    },
    [performSearch, setCategoryId]
  );

  // مسح جميع الفلاتر
  const clearFilters = useCallback(() => {
    setFilters({});
    setCategoryId(null);
    setPage(1);
    performSearch();
  }, [performSearch, setCategoryId]);

  // تحميل المزيد من النتائج
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  // تحديث الفلاتر المتاحة عند تغيير التصنيف
  useEffect(() => {
    if (categoryId) {
      setAvailableFilters({
        ...filterOptions,
        currentCategory: filterOptions.categories.find(
          (c) => c.id === categoryId
        ),
        currentDynamicFilters: filterOptions.dynamic[categoryId],
      });
    } else {
      setAvailableFilters(filterOptions);
    }

    setFilters((prev) => ({ ...prev, details: undefined }));
  }, [categoryId]);

  const value = {
    searchQuery,
    setSearchQuery,
    categoryId,
    setCategoryId,
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    results,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    selectedFilters,
    availableFilters,
    performSearch,
    getTownsByCity: getTownsByCity,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
