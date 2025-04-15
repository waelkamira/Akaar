'use client';

// AdditionalFields.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

function AdditionalFields({ item }) {
  const [categoryFields, setCategoryFields] = useState([]);

  const getFieldValue = useCallback((field, value) => {
    if (field?.options && field.options[value]) {
      return field.options[value];
    }
    return value;
  }, []);
  useEffect(() => {
    if (item?.categoryName) {
      import(`../../categoryFields/${item?.categoryName}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
        });
    }
  }, [item?.categoryName]);

  const displayValues = useMemo(() => {
    return categoryFields?.slice(0, 3)?.map((field, index) => {
      const value = item.details[field.name];
      return getFieldValue(field, value);
    });
  }, [categoryFields, item.details, getFieldValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center gap-3 w-full border-t border-gray-100/75 font-serif"
    >
      {displayValues?.map((displayValue, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center gap-2 text-sm"
        >
          <div className="flex items-center gap-2 transition-all">
            <span className="text-gray-500 whitespace-nowrap">
              {categoryFields[index]?.label || categoryFields[index]?.name}
            </span>
            <span className="text-gray-900 font-medium font-serif">
              {displayValue || '—'}
            </span>
          </div>

          {/* فاصل عمودي */}
          {/* {index < displayValues.length - 1 && (
            <div className="w-1 h-1 rounded-full bg-gray-300" />
          )} */}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AdditionalFields;
