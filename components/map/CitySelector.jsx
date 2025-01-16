'use client';
import { useState, useEffect, useContext } from 'react';
import { cities } from '../../components/map/Cities';
import { GiModernCity } from 'react-icons/gi';
import { FaTreeCity } from 'react-icons/fa6';
import { inputsContext } from '../Context';

export default function CitySelector() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const { dispatch } = useContext(inputsContext);

  useEffect(() => {
    if (selectedCity) {
      dispatch({
        type: 'PROPERTY_CITY',
        payload: {
          propertyCity: selectedCity.name,
          propertyCityLocation: selectedCity.latlng,
        },
      });
    }
    if (selectedTown) {
      dispatch({
        type: 'PROPERTY_TOWN',
        payload: {
          propertyTown: selectedTown.name,
          propertyTownLocation: selectedTown.latlng,
        },
      });
    }
  }, [selectedCity, selectedTown]);

  const handleCityChange = (e) => {
    const city = cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
    setSelectedTown(null); // إعادة تعيين البلدة عند تغيير المدينة
  };

  const handleTownChange = (e) => {
    const town = selectedCity.towns.find((t) => t.name === e.target.value);
    setSelectedTown(town);
  };

  return (
    <div className="flex flex-col w-full justify-start items-center">
      <div className="mb-2 w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className="flex text-right text-md sm:text-xl text-white ">
            <span className="text-one text-2xl ml-2">
              <GiModernCity />
            </span>
            المدينة:
          </h1>
        </div>

        <select
          className="flex text-right w-full p-2  text-xl sm:text-2xl outline-2 focus:outline-one placeholder:text-md placeholder:sm:text-xl"
          onChange={handleCityChange}
          value={selectedCity?.name || ''}
        >
          <option value="">-- اختر المحافظة --</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2 w-full">
        <div className="flex items-center gap-2 w-full justify-start my-2">
          <h1 className="flex text-right text-md sm:text-xl text-white ">
            <span className="text-one text-2xl ml-2">
              <FaTreeCity />
            </span>
            البلدة أو الحي:
          </h1>
        </div>

        <select
          disabled={!selectedCity}
          className="flex text-right w-full p-2  text-xl sm:text-2xl outline-2 focus:outline-one placeholder:text-md placeholder:sm:text-xl"
          onChange={handleTownChange}
          value={selectedTown?.name || ''}
        >
          <option value="">-- اختر البلدة --</option>
          {selectedCity?.towns.map((town) => (
            <option key={town.name} value={town.name}>
              {town.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
