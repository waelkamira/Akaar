'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '../Context';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { usePathname } from 'next/navigation.js';
import { carBrands } from './carBrands.jsx';

export default function CarsBrandSelector() {
  const { dispatch } = useContext(inputsContext);
  const [brand, setbrand] = useState('');
  const path = usePathname();

  const options = carBrands;

  useEffect(() => {
    if (brand?.value !== '' || brand?.value !== 'undefined') {
      dispatch({
        type: 'BRAND',
        payload: brand,
      });
    }
  }, [brand]);

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
              <VscUngroupByRefType />
            </span>
            الماركة :
          </h1>
        </div>
        <Select
          defaultValue={brand}
          onChange={setbrand}
          placeholder="تويوتا"
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          className="w-full text-md rounded text-start z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-orange-500' : 'border-gray-300'
              } sm:h-12 h-8`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        ></Select>
      </div>
    </div>
  );
}
