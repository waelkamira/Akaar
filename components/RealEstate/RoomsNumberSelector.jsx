'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '../Context.jsx';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { usePathname } from 'next/navigation.js';

export default function PropertyRoomsNumberSelector({ check }) {
  const { dispatch } = useContext(inputsContext);
  const [propertyRoomsNumber, setPropertyRoomsNumber] = useState('');
  const path = usePathname();

  const options = [
    { value: '1 + 1', label: '1 + 1' },
    { value: '2 + 1', label: '2 + 1' },
    { value: '3 + 1', label: '3 + 1' },
    { value: '4 + 1', label: '4 + 1' },
    { value: '5 + 1', label: '5 + 1' },
    { value: 'شيء أخر', label: 'شيء أخر' },
  ];

  useEffect(() => {
    if (
      propertyRoomsNumber?.value !== '' ||
      propertyRoomsNumber?.value !== 'undefined'
    ) {
      dispatch({
        type: 'PROPERTY_ROOMS_NUMBER',
        payload: {
          propertyRoomsNumber: propertyRoomsNumber,
          modelName: '',
        },
      });
    }
  }, [propertyRoomsNumber]);

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

  return (
    <div className="flex flex-col w-full justify-start items-center text-black ">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? '' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              {!propertyRoomsNumber && check ? (
                '❌'
              ) : (
                <MdOutlineBedroomParent />
              )}
            </span>
            عدد الغرف:
          </h1>
        </div>
        <Select
          defaultValue={propertyRoomsNumber}
          onChange={setPropertyRoomsNumber}
          placeholder="1 + 1"
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          className="w-full text-md text-start text-black z-[8] select-none"
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
