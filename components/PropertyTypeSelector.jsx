'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { usePathname } from 'next/navigation.js';
export default function PropertyTypeSelector() {
  const { dispatch } = useContext(inputsContext);
  const [propertyType, setpropertyType] = useState('');
  const path = usePathname();

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
        primary: '#ffa500',
        primary25: '#fadfae',
      },
    };
  }
  // أنماط مخصصة لتعديل ارتفاع المكون
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '3rem', // تعيين الارتفاع الأدنى إلى 4rem (يعادل h-16 في Tailwind CSS)
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '3rem', // تعيين ارتفاع الحاوية الداخلية
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '3rem', // تعيين ارتفاع حاوية المؤشرات
    }),
  };

  return (
    <div className="flex flex-col w-full justify-start items-center ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap '
              ${path.includes('newPost') ? 'text-white' : ''}`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
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
          styles={customStyles}
          className="w-full text-md  rounded-[5px] text-start z-30 h-12 select-none"
        ></Select>
      </div>
    </div>
  );
}
