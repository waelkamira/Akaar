'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';

export default function CitiesSelectComponent() {
  const { dispatch } = useContext(inputsContext);
  const [category, setCategory] = useState('');
  const options = [
    { value: 'بيع', label: 'بيع' },
    { value: 'شراء', label: 'شراء' },
    { value: 'أجار', label: 'أجار' },
  ];

  // كائن يحتوي على القيم وأسماء النماذج المرتبطة بها
  const modelMapping = {
    بيع: 'بيع',
    شراء: 'شراء',
    أجار: 'أجار',
  };

  useEffect(() => {
    if (category?.value) {
      const modelName = modelMapping[category.value]; // جلب اسم النموذج من الكائن
      if (modelName) {
        dispatch({
          type: 'CATEGORY',
          payload: category,
        });
      }
    }
  }, [category, dispatch]);

  function customTheme(theme) {
    return {
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary: '#22C55E',
        primary25: '#00ff5e',
      },
    };
  }

  return (
    <Select
      defaultValue={category}
      onChange={setCategory}
      placeholder="نوع الإعلان"
      isClearable
      isSearchable
      options={options}
      theme={customTheme}
      className="w-full text-xl sm:text-2xl text-start"
    >
      Select
    </Select>
  );
}
