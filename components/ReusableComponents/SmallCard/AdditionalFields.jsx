// AdditionalFields.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

function AdditionalFields({ item, category }) {
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
      className="flex flex-wrap items-center gap-3 w-full border-t border-gray-100/75 pt-4"
    >
      {displayValues?.map((displayValue, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center gap-2 text-sm"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50/80 hover:bg-gray-50 border border-gray-100 hover:border-primary/20 transition-all duration-200">
            <span className="text-gray-500 whitespace-nowrap">
              {categoryFields[index]?.label || categoryFields[index]?.name}
            </span>
            <span className="text-gray-900 font-medium">
              {displayValue || '—'}
            </span>
          </div>

          {/* فاصل عمودي */}
          {index < displayValues.length - 1 && (
            <div className="w-1 h-1 rounded-full bg-gray-300" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AdditionalFields;
