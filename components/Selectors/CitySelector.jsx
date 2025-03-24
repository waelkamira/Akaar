'use client';
import React, { useState, useEffect, useContext } from 'react';
import { cities } from '../lists/Cities';
import { inputsContext } from '../authContext/Context';

export default function CitySelector({ check }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const { dispatch } = useContext(inputsContext);

  useEffect(() => {
    if (selectedCity) {
      dispatch({
        type: 'PROPERTY_CITY',
        payload: { propertyCity: selectedCity },
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedTown) {
      dispatch({
        type: 'PROPERTY_TOWN',
        payload: { propertyTown: selectedTown },
      });
    }
  }, [selectedTown]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedTown(''); // إعادة تعيين المنطقة عند تغيير المدينة
  };

  const handleTownChange = (e) => {
    setSelectedTown(e.target.value);
  };

  const selectedCityData = cities.find((city) => city.name === selectedCity);

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full justify-start items-center text-sm">
      {/* قائمة المدن */}
      <div className="w-full sm:w-28">
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full sm:w-28 border rounded focus:outline-2 focus:outline-primary-500 bg-white text-black h-9 sm:h-[27px] px-2"
        >
          <option value="" disabled>
            المدينة
          </option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* قائمة المناطق */}
      <div className="w-full sm:w-28">
        <select
          value={selectedTown}
          onChange={handleTownChange}
          className="w-full sm:w-28 border rounded focus:outline-2 focus:outline-primary-500 bg-white text-black h-9 sm:h-[27px] px-2"
        >
          <option value="" disabled>
            المنطقة
          </option>
          {selectedCityData?.towns.map((town) => (
            <option key={town.name} value={town.name}>
              {town.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
