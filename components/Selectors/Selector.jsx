'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { inputsContext } from '../Context.jsx';

export default function Selector({
  check,
  list,
  placeholder,
  contextType,
  icon,
}) {
  const { dispatch } = useContext(inputsContext);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (category?.id !== '' && category?.id !== undefined) {
      dispatch({
        type: contextType,
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

  const CustomPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <div className="flex items-center gap-2 text-gray-400">
          {icon}
          <span>{placeholder}</span>
        </div>
      </components.Placeholder>
    );
  };

  return (
    <div className="flex flex-col w-full justify-start items-center text-black z-50">
      <div className="w-full">
        <Select
          value={list?.find((c) => c.id === category?.id) || null}
          onChange={(selectedOption) => setCategory(selectedOption || '')}
          placeholder={placeholder}
          isClearable
          isSearchable
          options={list?.map((c) => ({ id: c.id, name: c.name }))}
          getOptionLabel={(e) => e.name} // تحديد كيفية عرض الخيارات
          getOptionValue={(e) => e.id} // تحديد كيفية اختيار القيم
          theme={customTheme}
          className="w-full text-md rounded text-start text-black z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-one' : 'border-gray-300'
              } sm:h-12 h-8`,
          }}
          components={{ Placeholder: CustomPlaceholder }}
        />
      </div>
    </div>
  );
}
