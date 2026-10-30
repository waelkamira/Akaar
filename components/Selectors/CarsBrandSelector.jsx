import React, { useContext, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { inputsContext } from '@/features/auth/inputs-context';
import { FaCar } from 'react-icons/fa';
import { usePathname } from 'next/navigation.js';
import { carsBrandsList } from '../lists/CarsBrandsList.jsx';

export default function CarsBrandSelector({ check }) {
  const { dispatch } = useContext(inputsContext);
  const [brand, setBrand] = useState(null);
  const path = usePathname();
  const options = carsBrandsList;
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
      borderColor: state.isFocused ? '#FF8500' : '#53605C',
      '&:hover': {
        borderColor: '#FF8500',
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
        <div className="flex items-center gap-2 text-ak-cream">
          <FaCar className="text-primary-500 text-lg sm:text-xl" />
          <span>الماركة تويوتا</span>
        </div>
      </components.Placeholder>
    );
  };

  return (
    <div className="flex flex-col w-full justify-start items-center text-ak-cream">
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
              `${state.isFocused ? 'border-primary-500' : 'border-ak-line'} `,
          }}
          components={{ Placeholder: CustomPlaceholder }}
        />
      </div>
    </div>
  );
}
