// AdditionalFields.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

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
    <div className="flex justify-start items-center gap-1 w-full p-4 border-t border-gray-200 font-serif">
      {displayValues?.map((displayValue, index) => (
        <div
          key={index}
          className="flex items-center gap-2 mb-2 text-sm text-gray-700"
        >
          <h6 className="flex items-center gap-1 font-thin">
            <span className="text-gray-500 text-nowrap">
              {categoryFields[index]?.label || categoryFields[index]?.name}
            </span>
            : <span className="font-bold"> {displayValue || '?'}</span>
          </h6>
        </div>
      ))}
    </div>
  );
}

export default AdditionalFields;
