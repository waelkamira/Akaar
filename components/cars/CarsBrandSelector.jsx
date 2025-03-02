import React, { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { inputsContext } from '../Context';
import { FaCar } from 'react-icons/fa';
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
      setMinHeight(window.innerWidth >= 640 ? '48px' : '20px');
    };
    updateSize();
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
          <FaCar className="text-one text-lg sm:text-xl" />
          <span>الماركة تويوتا</span>
        </div>
      </components.Placeholder>
    );
  };

  return (
    <div className="flex flex-col w-full justify-start items-center text-black">
      <div className="w-full">
        <Select
          value={brand}
          onChange={handleBrandChange}
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
