'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';

export default function CitiesSelectComponent() {
  const { dispatch } = useContext(inputsContext);
  const [propertyCity, setpropertyCity] = useState('');
  const options = [
    { value: 'دمشق', label: 'دمشق' },
    { value: 'ريف دمشق', label: 'ريف دمشق' },
    { value: 'القنيطرة', label: 'القنيطرة' },
    { value: 'درعا', label: 'درعا' },
    { value: 'السويداء', label: 'السويداء' },
    { value: 'حمص', label: 'حمص' },
    { value: 'طرطوس', label: 'طرطوس' },
    { value: 'اللاذقية', label: 'اللاذقية' },
    { value: 'حماة', label: 'حماة' },
    { value: 'إدلب', label: 'إدلب' },
    { value: 'حلب', label: 'حلب' },
    { value: 'الرقة', label: 'الرقة' },
    { value: 'دير الزور', label: 'دير الزور' },
    { value: 'الحسكة', label: 'الحسكة' },
  ];

  // كائن يحتوي على القيم وأسماء النماذج المرتبطة بها
  const modelMapping = {
    دمشق: 'دمشق',
    'ريف دمشق': 'ريف دمشق',
    القنيطرة: 'القنيطرة',
    درعا: 'درعا',
    السويداء: 'السويداء',
    حمص: 'حمص',
    طرطوس: 'طرطوس',
    اللاذقية: 'اللاذقية',
    حماة: 'حماة',
    إدلب: 'إدلب',
    حلب: 'حلب',
    الرقة: 'الرقة',
    'دير الزور': 'دير الزور',
    الحسكة: 'الحسكة',
  };

  useEffect(() => {
    if (propertyCity?.value) {
      const modelName = modelMapping[propertyCity.value]; // جلب اسم النموذج من الكائن
      if (modelName) {
        dispatch({
          type: 'PROPERTY_CITY',
          payload: { propertyCity: propertyCity, modelName: modelName },
        });
      }
    }
  }, [propertyCity, dispatch]);

  function customTheme(theme) {
    return {
      ...theme,
      borderRadius: 8,
      colors: {
        ...theme.colors,
        primary: '#22C55E',
        primary25: '#00ff5e',
      },
    };
  }

  return (
    <Select
      defaultValue={propertyCity}
      onChange={setpropertyCity}
      placeholder="المدينة"
      isClearable
      isSearchable
      options={options}
      theme={customTheme}
      className="w-full text-xl sm:text-2xl text-start placeholder:text-sm placeholder:sm:text-lg"
    >
      Select
    </Select>
  );
}
