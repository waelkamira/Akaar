'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '../authContext/Context.jsx';
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
        primary: '#FF7C34',
        primary25: '#fadfae',
      },
    };
  }
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      height: 'auto',
      backgroundColor: 'white',
      // // borderColor: state.isFocused ? '#FF7C34' : '#A1A5AD',
      '&:hover': {
        borderColor: '#FF7C34',
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
    <div className="flex flex-col w-full justify-start items-center text-black ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className={`flex text-right text-md select-none text-nowrap `}>
            <span className="text-one text-lg xl:text-2xl ml-2">
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
          className="w-full text-md text-start text-black z-[11]"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-one' : 'border-gray-300'
              } sm:h-12 h-9 w-full`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>
    </div>
  );
}
