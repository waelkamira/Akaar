'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '@/features/auth/inputs-context';
import { usePathname } from 'next/navigation.js';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { FaDharmachakra } from 'react-icons/fa6';

export default function CategoryComponent({ check }) {
  const { dispatch } = useContext(inputsContext);
  const [category, setCategory] = useState('');
  const path = usePathname();
  const [minHeight, setMinHeight] = useState('20px');

  const options = [
    { value: 'بيع', label: 'بيع' },
    { value: 'أجار', label: 'أجار' },
  ];

  // كائن يحتوي على القيم وأسماء النماذج المرتبطة بها
  const modelMapping = {
    بيع: 'بيع',
    أجار: 'أجار',
  };

  useEffect(() => {
    const updateSize = () => {
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px'); // sm: 640px
    };

    updateSize(); // استدعاء أولي عند التحميل
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto',
      backgroundColor: '#242A28',
      '&:hover': {
        borderColor: '#FF8500',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: minHeight,
      padding: '0 1rem',
      display: 'flex',
      alignItems: 'center',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      minHeight: minHeight,
    }),
  };
  return (
    <div className="flex flex-col w-full justify-start items-center text-ak-cream ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className={`flex text-right text-md select-none text-nowrap `}>
            <span className="text-primary-500 text-lg xl:text-2xl ml-2">
              {!category && check ? '❌' : <FaDharmachakra />}
            </span>
            بيع/أجار :
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
          styles={customStyles}
          className="w-full text-md text-start text-ak-cream z-[11]"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-primary-500' : 'border-ak-line'
              } sm:h-12 h-9 w-full`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>
    </div>
  );
}
