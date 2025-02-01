'use client';
import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { cities } from '../../components/map/Cities';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';
import { inputsContext } from '../Context';
import { usePathname } from 'next/navigation';

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const { dispatch } = useContext(inputsContext);
  const path = usePathname();

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
        primary: '#ffa500',
        primary25: '#fadfae',
      },
    };
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-start items-center">
      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? 'text-white' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              <GiModernCity />
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
          className="w-full text-sm sm:text-md text-start z-[7] text-nowrap"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-orange-500' : 'border-gray-300'
              } sm:h-12 h-8 w-full`, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>

      <div className="w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1
            className={`flex text-right text-md select-none text-nowrap ${
              path.includes('newPost') ? 'text-white' : ''
            }`}
          >
            <span className="text-one text-lg xl:text-2xl ml-2">
              <FaTreeCity />
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
          className="w-full text-sm sm:text-md text-start z-[6] text-nowrap"
          classNamePrefix="select"
          classNames={{
            control: (state) =>
              `${
                state.isFocused ? 'border-orange-500' : 'border-gray-300'
              } sm:h-12 h-8 w-full `, // ارتفاع مختلف بناءً على عرض النافذة
          }}
        />
      </div>
    </div>
  );
}
