'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { inputsContext } from '@/features/auth/inputs-context';

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

  const CustomPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <div className="flex items-center gap-2 text-ak-cream">
          {icon}
          <span>{placeholder}</span>
        </div>
      </components.Placeholder>
    );
  };

  return (
    <div className="flex flex-col w-full justify-start items-center text-ak-cream z-50">
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
          className="w-full text-md rounded text-start text-ak-cream z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-primary-500' : 'border-ak-line'
              } sm:h-12 h-8`,
          }}
          components={{ Placeholder: CustomPlaceholder }}
        />
      </div>
    </div>
  );
}
