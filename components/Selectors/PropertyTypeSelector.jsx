'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '@/features/auth/inputs-context';
import { VscUngroupByRefType } from 'react-icons/vsc';

export default function PropertyTypeSelector({ check }) {
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
    if (propertyType?.value !== '' || propertyType?.value !== 'undefined') {
      dispatch({
        type: 'PROPERTY_TYPE',
        payload: { propertyType: propertyType, modelName: 'createSoup' },
      });
    }
  }, [propertyType]);

  function customTheme(theme) {
    return {
      ...theme,
      borderRadius: 5,
      colors: {
        ...theme.colors,
        primary: '#FF8500',
        primary25: '#4C321A',
        neutral0: '#242A28',
        neutral5: '#303936',
        neutral10: '#414B48',
        neutral20: '#53605C',
        neutral30: '#73817D',
        neutral80: '#F4F4EF',
      },
    };
  }

  return (
    <div className="flex flex-col w-full justify-start items-center text-ak-cream ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className={`flex text-right text-md select-none text-nowrap `}>
            <span className="text-primary-500 text-lg xl:text-2xl ml-2">
              {!propertyType && check ? '❌' : <VscUngroupByRefType />}
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
          className="w-full text-md rounded text-start text-ak-cream z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-primary-500' : 'border-ak-line'
              } sm:h-12 h-8`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        ></Select>
      </div>
    </div>
  );
}
