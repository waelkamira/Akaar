'use client';

import { useSearch } from '../../contexts/SearchContext';
import { useCallback } from 'react';
import DynamicField from './DynamicField';

export default function DynamicFilters() {
  const { category, filters, setFilter, dynamicFilters, loading } = useSearch();

  // Handle field value changes
  const handleFieldChange = useCallback(
    (fieldName, value) => {
      setFilter(`details.${fieldName}`, value);
    },
    [setFilter]
  );

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
              value={filters.details?.[field.name] || ''}
              onChange={handleFieldChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
