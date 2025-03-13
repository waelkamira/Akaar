'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { inputsContext } from '../authContext/Context';
// import { years } from '../lists/Years';
import { FaCalendarAlt } from 'react-icons/fa';

export default function YearsSelector() {
  const { dispatch } = useContext(inputsContext);
  const [year, setYear] = useState(null);
  const options = Array.from({ length: 2026 - 1950 + 1 }, (_, i) => {
    const year = 2026 - i;
    return { value: year.toString(), label: year.toString() };
  });
  const [minHeight, setMinHeight] = useState('20px');

  useEffect(() => {
    const updateSize = () => {
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px');
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (year?.value) {
      dispatch({
        type: 'YEAR',
        payload: year,
      });
    }
  }, [year]);

  function handleYearChange(selectedOption) {
    setYear(selectedOption);
  }

  function customTheme(theme) {
    return {
      ...theme,
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
      display: 'flex',
      alignItems: 'center',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      minHeight: minHeight,
    }),
  };

  // مكون مخصص للـ Placeholder لإضافة الأيقونة
  const CustomPlaceholder = (props) => {
    return (
      <components.Placeholder {...props}>
        <div className="flex items-center gap-2 text-gray-400">
          <FaCalendarAlt className="text-one text-lg sm:text-xl" />
          <span>السنة</span>
        </div>
      </components.Placeholder>
    );
  };

  return (
    <div className="flex flex-col w-full justify-start items-center text-black">
      <div className="w-full">
        <Select
          value={year}
          onChange={handleYearChange}
          isClearable
          isSearchable
          options={options}
          theme={customTheme}
          styles={customStyles}
          className="w-full text-md rounded text-start z-[9] select-none"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${state.isFocused ? 'border-one' : 'border-gray-300'} `,
          }}
          components={{ Placeholder: CustomPlaceholder }}
        />
      </div>
    </div>
  );
}
