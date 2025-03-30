'use client';

import { useSearch } from '../../contexts/SearchContext';
import { X } from 'lucide-react';

export default function SelectedFilters() {
  const {
    filters,
    category,
    removeFilter,
    clearFilters,
    staticFilters,
    dynamicFilters,
  } = useSearch();

  // Get all selected filters
  const getSelectedFilters = () => {
    const selected = [];

    // Add category if selected
    if (category) {
      selected.push({
        key: 'category',
        label: `الفئة: ${category.name}`,
      });
    }

    // Add city if selected
    if (filters.city) {
      selected.push({
        key: 'city',
        label: `المدينة: ${filters.city}`,
      });
    }

    // Add town if selected
    if (filters.town) {
      selected.push({
        key: 'town',
        label: `المنطقة: ${filters.town}`,
      });
    }

    // Add price range if selected
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      selected.push({
        key: 'price',
        label: `السعر: ${filters.priceMin || 0} - ${
          filters.priceMax || 'الأعلى'
        }`,
      });
    }

    // Add ad type if selected
    if (filters.adType) {
      const adType = staticFilters.adTypes.find(
        (type) => type.id === filters.adType
      );
      if (adType) {
        selected.push({
          key: 'adType',
          label: `نوع الإعلان: ${adType.name}`,
        });
      }
    }

    // Add dynamic filters if any
    if (filters.details && dynamicFilters) {
      Object.entries(filters.details).forEach(([key, value]) => {
        const field = dynamicFilters.find((f) => f.name === key);
        if (field) {
          let displayValue = value;

          // Handle options type fields
          if (field.type === 'select' && field.options) {
            const option = field.options.find((opt) => opt.value === value);
            if (option) {
              displayValue = option.label;
            }
          }

          selected.push({
            key: `details.${key}`,
            label: `${field.label}: ${displayValue}`,
          });
        }
      });
    }

    return selected;
  };

  const selectedFilters = getSelectedFilters();

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          الفلاتر المختارة
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          <X size={16} />
          <span>حذف الكل</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedFilters.map((filter) => (
          <div
            key={filter.key}
            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors duration-200 group"
          >
            <span>{filter.label}</span>
            <button
              onClick={() => removeFilter(filter.key)}
              className="mr-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
