'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
export default function SelectComponent() {
  const { dispatch } = useContext(inputsContext);
  const [propertyType, setpropertyType] = useState('');
  const options = [
    { value: 'بيت', label: 'بيت' },
    { value: 'شقة', label: 'شقة' },
    { value: 'محل', label: 'محل' },
    { value: 'أرض', label: 'أرض' },
    { value: 'مستودع', label: 'مستودع' },
    { value: 'فيلا', label: 'فيلا' },
    { value: 'معمل', label: 'معمل' },
    { value: 'شيء أخر', label: 'شيء أخر' },
  ];

  useEffect(() => {
    //مختلفة لسرعة البحث والتصنيف models قمت بعمل جمل شرطية بغرض تصنيف الوجبات في
    if (propertyType?.value === 'أرض') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createSoup' },
      });
    } else if (propertyType?.value === 'شقة') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createPastries' },
      });
    } else if (propertyType?.value === 'بيت') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createMainMeal' },
      });
    } else if (propertyType?.value === 'مستودع') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createSalads' },
      });
    } else if (propertyType?.value === 'فيلا') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createJuice' },
      });
    } else if (propertyType?.value === 'معمل') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: {
          propertyType: propertyType,
          modelName: 'createAppetizers',
        },
      });
    } else if (propertyType?.value === 'محل') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createDessert' },
      });
    } else if (propertyType?.value === 'شيء أخر') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createJuice' },
      });
    }
  }, [propertyType]);

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
  // propertyType لتحديث قيمة ال setpropertyType مجرد بارامتر يمثل القيمة المختارة من قبل المستخدم نقوم بتمريره ل e
  // function handleChange(e) {
  //   setpropertyType(e);
  //   dispatch({ type: 'propertyType', payload: propertyType });
  // }

  return (
    <Select
      defaultValue={propertyType}
      onChange={setpropertyType}
      placeholder="بيت"
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
