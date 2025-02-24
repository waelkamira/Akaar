'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '../Context';
import { FaCar } from 'react-icons/fa'; // استبدلت VscUngroupByRefType برمز آخر
import { usePathname } from 'next/navigation.js';
import { carBrands } from './carBrands.jsx';

export default function CarsBrandSelector({ check }) {
  const { dispatch } = useContext(inputsContext);
  const [brand, setBrand] = useState(null);
  const path = usePathname();
  const options = carBrands;
  const [minHeight, setMinHeight] = useState('20px');

  useEffect(() => {
    const updateSize = () => {
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px'); // sm: 640px
    };
    updateSize(); // استدعاء أولي عند التحميل
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (brand?.value) {
      dispatch({
        type: 'BRAND',
        payload: brand,
      });
    }
  }, [brand]);

  function handleBrandChange(selectedOption) {
    setBrand(selectedOption);
  }

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
      borderColor: state.isFocused ? '#FF7C34' : '#A1A5AD',
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
    <div className="flex flex-col w-full justify-start items-center">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className={`flex text-right text-md select-none text-nowrap`}>
            <span className="text-one text-lg xl:text-2xl ml-2">
              {!brand?.value && check ? '❌' : <FaCar />}
            </span>
            الماركة :
          </h1>
        </div>
        <Select
          value={brand}
          onChange={handleBrandChange}
          placeholder="تويوتا"
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          styles={customStyles}
          className="w-full text-md rounded text-start text-black z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-one' : 'border-gray-300'
              } sm:h-12 h-8`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>
    </div>
  );
}
