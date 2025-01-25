'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
import { usePathname } from 'next/navigation.js';
import { MdOutlineBedroomParent } from 'react-icons/md';

export default function CitiesSelectComponent() {
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
        primary: '#22C55E',
        primary25: '#00ff5e',
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
              <MdOutlineBedroomParent />
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
          styles={customStyles} // تطبيق الأنماط المخصصة
          className="w-full text-md  text-start z-40 "
        />
      </div>
    </div>
  );
}
