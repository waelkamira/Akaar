'use client';
import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { cities } from '../../components/map/Cities';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';
import { inputsContext } from '../Context';

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const { dispatch } = useContext(inputsContext);

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
    latlng: city?.latlng || [0, 0], // Default to [0, 0] if missing
    towns: (city?.towns || []).map((town) => ({
      value: town?.name,
      label: town?.name,
      latlng: town?.latlng || [0, 0], // Default to [0, 0] if missing
    })),
  }));

  const handleCityChange = (selectedOption) => {
    console.log('selectedOption (City):', selectedOption);
    setSelectedCity(selectedOption);
    setSelectedTown(null); // إعادة تعيين المنطقة عند تغيير المدينة
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
        primary: '#22C55E',
        primary25: '#00ff5e',
      },
    };
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 w-full justify-start items-center">
      <div className="mb-2 w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className="flex text-right text-md select-none">
            <span className="text-one xl:text-xl ml-2">
              <GiModernCity />
            </span>
            المدينة:
          </h1>
        </div>

        <Select
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="اختر المدينة"
          isClearable
          isSearchable
          theme={customTheme}
          className="w-full text-lg  text-start z-50 h-12 text-nowrap"
        />
      </div>

      <div className="mb-2 w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className="flex text-right text-md select-none">
            <span className="text-one xl:text-xl ml-2">
              <FaTreeCity />
            </span>
            المنطقة :
          </h1>
        </div>

        <Select
          value={selectedTown}
          onChange={handleTownChange}
          options={selectedCity?.towns || []}
          placeholder="اختر المنطقة"
          isClearable
          isSearchable
          isDisabled={!selectedCity}
          theme={customTheme}
          className="w-full text-lg  text-start z-40 h-12 text-nowrap"
        />
      </div>
    </div>
  );
}
