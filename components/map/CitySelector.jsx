'use client';
import { useState, useEffect } from 'react';
import { cities } from '../../components/map/Cities';

export default function CitySelector({ onSelectCity, onSelectTown }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);

  const handleCityChange = (e) => {
    const city = cities.find((c) => c.name === e.target.value);
    setSelectedCity(city);
    setSelectedTown(null);
    onSelectCity(city); // إرسال البيانات إلى المكون الأب
  };

  const handleTownChange = (e) => {
    const town = selectedCity.towns.find((t) => t.name === e.target.value);
    setSelectedTown(town);
    onSelectTown(town); // إرسال البيانات إلى المكون الأب
  };

  return (
    <div className="flex flex-col sm:flex-row justify-start items-center gap-4 px-4 text-white">
      <div className="mb-4 w-full">
        <label className="block font-medium mb-2">اختر المحافظة:</label>
        <select
          className="border p-2 rounded w-full text-black"
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

      <div className="mb-4 w-full">
        <label className="block font-medium mb-2">اختر البلدة:</label>
        <select
          disabled={!selectedCity}
          className="border p-2 rounded w-full text-black"
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
