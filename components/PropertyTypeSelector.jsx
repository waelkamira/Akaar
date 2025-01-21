'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
import { VscUngroupByRefType } from 'react-icons/vsc';
export default function PropertyTypeSelector() {
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
      borderRadius: 5,
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
    <div className="flex flex-col w-full justify-start items-center">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className="flex text-right text-md text-nowrap select-none">
            <span className="text-one xl:text-xl ml-2">
              <VscUngroupByRefType />
            </span>
            نوع العقار:
          </h1>
        </div>
        <Select
          defaultValue={propertyType}
          onChange={setpropertyType}
          placeholder="بيت"
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          className="w-full text-lg  text-start z-30 h-12 select-none"
        ></Select>
      </div>
    </div>
  );
}
