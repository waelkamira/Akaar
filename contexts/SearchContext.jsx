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

const SearchContext = createContext(undefined);

export function SearchProvider({ children, initialCategory = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategory || null);
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [availableFilters, setAvailableFilters] = useState(filterOptions);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log('searchQuery', searchQuery);
  // دالة للحصول على المناطق بناءً على المدينة
  const getTownsByCity = useCallback(
    (cityId) => {
      if (!cityId) return [];
      const city = availableFilters?.static?.cities?.find(
        (c) => c.id === cityId || c.name === cityId
      );
      return city?.towns || []; // تأكد من وجود `city.towns`
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
        priceMin: filters.priceMin === undefined ? null : filters.priceMin, // التأكد من إرسال `null` بدلًا من `undefined`
        priceMax: filters.priceMax === undefined ? null : filters.priceMax, // التأكد من إرسال `null` بدلًا من `undefined`
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search request failed'); // عرض رسالة خطأ من الواجهة الخلفية إذا كانت موجودة
      }

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
  const setFilter = useCallback((key, value) => {
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
    (key) => {
      setFilters((prev) => {
        const { [key]: removed, ...rest } = prev;

        // Special handling for details
        if (key.startsWith('details.')) {
          const detailKey = key.split('.')[1];
          if (prev.details && prev.details[detailKey]) {
            const { [detailKey]: removedDetail, ...remainingDetails } =
              prev.details;
            const details =
              Object.keys(remainingDetails).length > 0
                ? remainingDetails
                : undefined;
            return { ...rest, details };
          }
        }
        if (key === 'city') {
          delete rest.town; // Remove town when city is removed
        }

        return rest;
      });
      if (key === 'category') {
        setCategoryId(null);
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

    setFilters((prev) => {
      const { details, ...rest } = prev;
      return rest;
    });
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
