'use client';

import { useSearch } from '../../contexts/SearchContext';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (filters.priceMin !== undefined) {
        selected.push({
          key: 'priceMin',
          label: `السعر الأدنى: ${filters.priceMin}`,
        });
      }
      if (filters.priceMax !== undefined) {
        selected.push({
          key: 'priceMax',
          label: `السعر الأقصى: ${filters.priceMax}`,
        });
      }
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

          // Handle fields with options
          if (field.options) {
            // Get the label from the options object
            displayValue = field.options[value] || value;
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
    >
      <div className="flex justify-between items-center mb-4">
        <motion.h3
          whileHover={{ scale: 1.02 }}
          className="text-lg font-semibold text-gray-900 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          الفلاتر المختارة
        </motion.h3>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
        >
          <X size={16} />
          <span>حذف الكل</span>
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {selectedFilters.map((filter) => (
            <motion.div
              key={filter.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 transition-all duration-300 shadow-sm group"
            >
              <span className="font-medium">{filter.label}</span>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFilter(filter.key)}
                className="mr-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X size={14} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {selectedFilters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-4 text-center text-gray-500 flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>لا توجد فلاتر مختارة</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
