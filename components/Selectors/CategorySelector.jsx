'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from '../authContext/Context.jsx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import categories from '../Categories/categories.jsx';

export default function CategorySelector({ check }) {
  const { dispatch } = useContext(inputsContext);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (category?.id !== '' && category?.id !== undefined) {
      dispatch({
        type: 'CATEGORY_TYPE',
        payload: category,
      });
    }
  }, [category]);

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
    <div className="flex flex-col w-full justify-start items-center text-black z-50">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className={`flex text-right text-md select-none text-nowrap `}>
            <span className="text-primary-500 text-lg xl:text-2xl ml-2">
              {!category && check ? '❌' : <VscUngroupByRefType />}
            </span>
            الصنف:
          </h1>
        </div>
        <Select
          value={categories.find((c) => c.id === category?.id) || null}
          onChange={(selectedOption) => setCategory(selectedOption || '')}
          placeholder="الإلكترونيات"
          isClearable
          isSearchable
          options={categories.map((c) => ({ id: c.id, name: c.name }))}
          getOptionLabel={(e) => e.name} // تحديد كيفية عرض الخيارات
          getOptionValue={(e) => e.id} // تحديد كيفية اختيار القيم
          theme={customTheme}
          className="w-full text-md rounded text-start text-black z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-primary-500' : 'border-gray-300'
              } sm:h-12 h-8`,
          }}
        />
      </div>
    </div>
  );
}
