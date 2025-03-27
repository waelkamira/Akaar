"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { filterOptions } from "../lib/mockData";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SearchContext = createContext(undefined);

export function SearchProvider({ children, initialCategory = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategory);
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
  console.log("searchQuery", searchQuery);

  // Separate search function from the debounced version
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
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery,
          categoryId,
          filters: {
            city: filters.city,
            priceMin: filters.priceMin,
            priceMax: filters.priceMax,
            details: filters.details,
          },
          page,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      console.log("data", data);
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid response format");
      }

      if (page === 1) {
        setResults(data.products);
      } else {
        setResults((prev) => [...prev, ...data.products]);
      }

      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while searching");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryId, filters, page]);

  useEffect(() => {
    performSearch();
  }, [searchQuery, categoryId, filters, page, performSearch]);

  // Remove the automatic search trigger
  useEffect(() => {
    // Only update URL, don't trigger search
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("category", categoryId.toString());
    } else {
      params.delete("category");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [categoryId, pathname, router, searchParams]);

  // Create a list of selected filters for display
  const selectedFilters = useMemo(() => {
    const selected = [];

    // Add category if selected
    if (categoryId) {
      const category = filterOptions.categories.find((c) => c.id === categoryId);
      if (category) {
        selected.push({
          key: "category",
          value: categoryId.toString(),
          label: `Category: ${category.name}`,
        });
      }
    }

    // Add static filters
    if (filters.city) {
      const cityOption = filterOptions.static.city.find((c) => c.id === filters.city);
      if (cityOption) {
        selected.push({
          key: "city",
          value: filters.city,
          label: `City: ${cityOption.name}`,
        });
      }
    }

    // Add price range if set
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      const priceLabel = `Price: ${filters.priceMin || 0} - ${filters.priceMax || "max"}`;
      selected.push({
        key: "price",
        value: "price-range",
        label: priceLabel,
      });
    }

    // Add dynamic filters based on category
    if (categoryId && filters.details) {
      const categoryFilters = filterOptions.dynamic[categoryId];
      if (categoryFilters) {
        for (const [key, value] of Object.entries(filters.details)) {
          if (categoryFilters[key]) {
            // Handle array-type filters (like rooms, brand, etc.)
            if (Array.isArray(categoryFilters[key])) {
              const option = categoryFilters[key].find((opt) => opt.id === value);
              if (option) {
                selected.push({
                  key: `details.${key}`,
                  value: value,
                  label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${option.name}`,
                });
              }
            }
            // Handle range-type filters (like area, mileage, etc.)
            else if (typeof categoryFilters[key] === "object") {
              selected.push({
                key: `details.${key}`,
                value: value,
                label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
              });
            }
          }
        }
      }
    }

    return selected;
  }, [categoryId, filters]);

  // Set a filter value
  const setFilter = (key, value) => {
    setFilters((prev) => {
      // Handle nested details filters
      if (key.startsWith("details.")) {
        const detailKey = key.split(".")[1];
        return {
          ...prev,
          details: {
            ...(prev.details || {}),
            [detailKey]: value,
          },
        };
      }
      // Handle regular filters
      return { ...prev, [key]: value };
    });

    // Reset to first page when filters change
    setPage(1);
  };

  // Remove a filter
  const removeFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // Handle nested details filters
      if (key.startsWith("details.")) {
        const detailKey = key.split(".")[1];
        if (newFilters.details) {
          const newDetails = { ...newFilters.details };
          delete newDetails[detailKey];
          newFilters.details = Object.keys(newDetails).length > 0 ? newDetails : undefined;
        }
      }
      // Handle special case for category
      else if (key === "category") {
        setCategoryId(null);
      }
      // Handle regular filters
      else {
        delete newFilters[key];
      }

      return newFilters;
    });

    // Reset to first page when filters change
    setPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setCategoryId(null);
    setPage(1);
  };

  // Load more results (pagination)
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // Update available filters when category changes
  useEffect(() => {
    // If we have a category selected, we can show its specific filters
    if (categoryId) {
      setAvailableFilters({
        ...filterOptions,
        currentCategory: filterOptions.categories.find((c) => c.id === categoryId),
        currentDynamicFilters: filterOptions.dynamic[categoryId],
      });
    } else {
      setAvailableFilters(filterOptions);
    }

    // Clear details filters when category changes
    setFilters((prev) => ({
      ...prev,
      details: undefined,
    }));
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
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}