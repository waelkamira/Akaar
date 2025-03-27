'use client';

import { useSearch } from '../../contexts/SearchContext';
import { X } from 'lucide-react';

export default function SelectedFilters() {
  const { selectedFilters, removeFilter, clearFilters } = useSearch();

  if (selectedFilters.length === 0) {
    return null;
  }
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        {selectedFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-white hover:text-gray-700 bg-primary-500 px-2 mx-2 rounded-full"
          >
            حذف
          </button>
        )}{' '}
        <h3 className="text-sm font-medium text-gray-700">
          الفلاتر المختارة ({selectedFilters.length})
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedFilters.map((filter) => (
          <div
            key={`${filter.key}-${filter.value}`}
            className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => removeFilter(filter.key)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
