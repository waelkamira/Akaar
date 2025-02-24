'use client';
import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { cities } from '../../components/map/Cities';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';
import { inputsContext } from '../Context';
import { usePathname } from 'next/navigation';

export default function CitySelector({ check }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const { dispatch } = useContext(inputsContext);
  const path = usePathname();
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
    if (selectedCity?.value && selectedCity?.latlng) {
      dispatch({
        type: 'PROPERTY_CITY',
        payload: {
          propertyCity: selectedCity?.value,
        },
      });
    }

    if (selectedTown?.value && selectedTown?.latlng) {
      dispatch({
        type: 'PROPERTY_TOWN',
        payload: {
          propertyTown: selectedTown.value,
        },
      });
    }
  }, [selectedCity, selectedTown]);

  const cityOptions = cities.map((city) => ({
    value: city?.name,
    label: city?.name,
    latlng: city?.latlng || [0, 0],
    towns: (city?.towns || []).map((town) => ({
      value: town?.name,
      label: town?.name,
      latlng: town?.latlng || [0, 0],
    })),
  }));

  const handleCityChange = (selectedOption) => {
    console.log('selectedOption (City):', selectedOption);
    setSelectedCity(selectedOption);
    setSelectedTown(null);
  };

  const handleTownChange = (selectedOption) => {
    console.log('selectedOption (Town):', selectedOption);
    setSelectedTown(selectedOption);
  };

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
      // borderColor: state.isFocused ? '#FF7C34' : '#A1A5AD',
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
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-start items-center">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? '' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              {!selectedCity && check ? '❌' : <GiModernCity />}
            </span>
            المدينة:
          </h1>
        </div>

        <Select
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="دمشق"
          isClearable
          isSearchable
          theme={customTheme}
          styles={customStyles}
          className="w-full text-md text-start text-black rounded select-none "
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border border-one' : 'border border-gray-300'
              } sm:h-12 h-8 w-full`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? '' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              {!selectedTown && check ? '❌' : <FaTreeCity />}
            </span>
            المنطقة :
          </h1>
        </div>

        <Select
          value={selectedTown}
          onChange={handleTownChange}
          options={selectedCity?.towns || []}
          placeholder="المزة"
          isClearable
          isSearchable
          isDisabled={!selectedCity}
          theme={customTheme}
          styles={customStyles}
          className="w-full text-md text-start text-black rounded select-none "
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-one' : 'border-gray-300'
              } sm:h-12 h-8 w-full`,
          }}
        />
      </div>
    </div>
  );
}
