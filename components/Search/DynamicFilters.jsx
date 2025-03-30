'use client';

import { useSearch } from '../../contexts/SearchContext';
import { useCallback, useState, useEffect } from 'react';
import DynamicField from './DynamicField';
import { ImSearch } from 'react-icons/im';

export default function DynamicFilters() {
  const {
    category,
    filters,
    setFilter,
    dynamicFilters,
    loading,
    performSearch,
  } = useSearch();

  // Local state for field values
  const [localValues, setLocalValues] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  // Initialize local values from filters
  useEffect(() => {
    if (filters.details) {
      setLocalValues(filters.details);
    }
  }, [filters.details]);

  // Handle field value changes (updates local state only)
  const handleFieldChange = useCallback((fieldName, value) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  // Apply filter when user finishes typing/selecting
  const handleFieldBlur = useCallback(
    (fieldName, value) => {
      // If value is empty string or null, remove the filter
      if (value === '' || value === null) {
        const newDetails = { ...filters.details };
        delete newDetails[fieldName];
        setFilter('details', newDetails);
      } else {
        setFilter('details', {
          ...filters.details,
          [fieldName]: value,
        });
      }
    },
    [filters.details, setFilter]
  );

  // Handle search button click
  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      await performSearch();
    } finally {
      setIsSearching(false);
    }
  }, [performSearch]);

  // Early return if no category
  if (!category) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="mr-2">جاري تحميل الخصائص...</span>
        </div>
      </div>
    );
  }

  // Show empty state if no fields available
  if (!dynamicFilters || dynamicFilters.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="text-gray-500 text-center py-4">
          لا توجد خصائص متاحة لهذه الفئة
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="font-medium text-lg mb-3">خصائص {category.name}</h3>

      <div className="space-y-4">
        {dynamicFilters.map((field) => (
          <div key={field.name} className="mb-4">
            <DynamicField
              field={field}
              value={localValues[field.name] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </div>
        ))}

        {/* Search Button */}
        <div className="pt-4">
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            <ImSearch className={isSearching ? 'animate-spin' : ''} />
            <span>{isSearching ? 'جاري البحث...' : 'بحث'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
