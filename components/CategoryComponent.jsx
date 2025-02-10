'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
import { usePathname } from 'next/navigation.js';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FaDharmachakra } from 'react-icons/fa6';

export default function CategoryComponent() {
  const { dispatch } = useContext(inputsContext);
  const [category, setCategory] = useState('');
  const path = usePathname();

  const options = [
    { value: 'بيع', label: 'بيع' },
    // { value: 'شراء', label: 'شراء' },
    { value: 'أجار', label: 'أجار' },
  ];

  // كائن يحتوي على القيم وأسماء النماذج المرتبطة بها
  const modelMapping = {
    بيع: 'بيع',
    // شراء: 'شراء',
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
      borderRadius: 5,
      colors: {
        ...theme.colors,
        primary: '#ffa500',
        primary25: '#fadfae',
      },
    };
  }

  return (
    <div className="flex flex-col w-full justify-start items-center ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? '' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              <FaDharmachakra />
            </span>
            نوع الإعلان :
          </h1>
        </div>
        <Select
          defaultValue={category}
          onChange={setCategory}
          placeholder="بيع"
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          className="w-full text-md text-start z-[10]"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-orange-500' : 'border-gray-300'
              } sm:h-12 h-8 w-full`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>
    </div>
  );
}
