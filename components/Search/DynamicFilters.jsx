'use client';
import { useSearch } from '../../contexts/SearchContext';
import { useCallback, useState, useEffect } from 'react';
import DynamicField from './DynamicField';
import { ImSpinner8 } from 'react-icons/im';
import { motion } from 'framer-motion';

export default function DynamicFilters() {
  const { category, filters, setFilter, dynamicFilters, loading } = useSearch();
  const [localValues, setLocalValues] = useState({});

  useEffect(() => {
    if (filters.details) {
      setLocalValues(filters.details);
    }
  }, [filters.details]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const handleFieldBlur = useCallback(
    (fieldName, value) => {
      if (
        value === '' ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        const newDetails = { ...filters.details };
        delete newDetails[fieldName];
        setFilter('details', newDetails);
      } else {
        const currentDetails = filters.details || {};
        setFilter('details', {
          ...currentDetails,
          [fieldName]: value,
        });
      }
    },
    [filters.details, setFilter]
  );

  if (!category) {
    return null;
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-4"
      >
        <div className="flex justify-center items-center py-4 space-x-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <ImSpinner8 className="text-primary-500 text-xl" />
          </motion.div>
          <span className="text-gray-600">جاري تحميل الخصائص...</span>
        </div>
      </motion.div>
    );
  }

  if (!dynamicFilters || dynamicFilters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-4"
      >
        <div className="text-gray-500 text-center py-4 flex flex-col items-center">
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
          <p>لا توجد خصائص متاحة لهذه الفئة</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm p-4 space-y-6 border border-gray-100 rounded-lg"
    >
      <div className="flex items-center justify-between">
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
          خصائص {category.name}
        </motion.h3>
      </div>

      <div className="space-y-6">
        {dynamicFilters.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <DynamicField
              field={field}
              value={localValues[field.name] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
