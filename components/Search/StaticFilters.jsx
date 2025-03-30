'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { Slider } from '../ui/slider';

export default function StaticFilters() {
  const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();

  // Set price range defaults
  const priceRangeDefault = {
    min: 0,
    max: 150000,
  };

  // State for price slider
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || priceRangeDefault.min,
    filters.priceMax || priceRangeDefault.max,
  ]);

  // Update price range when filters change
  useEffect(() => {
    setPriceRange([
      filters.priceMin || priceRangeDefault.min,
      filters.priceMax || priceRangeDefault.max,
    ]);
  }, [filters.priceMin, filters.priceMax]);

  // Get towns for selected city
  const availableTowns = getTownsByCity(filters.city || null);

  // Handle city selection
  const handleCityChange = useCallback(
    (e) => {
      const cityName = e.target.value;
      setFilter('city', cityName || null);
    },
    [setFilter]
  );

  // Handle town selection
  const handleTownChange = useCallback(
    (e) => {
      const townName = e.target.value;
      setFilter('town', townName || null);
    },
    [setFilter]
  );

  // Handle price slider change
  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  // Apply price filter when slider is released
  const handlePriceChangeEnd = () => {
    setFilter('priceMin', priceRange[0]);
    setFilter('priceMax', priceRange[1]);
  };

  // Handle ad type selection
  const handleAdTypeChange = useCallback(
    (e) => {
      const adTypeId = Number(e.target.value);
      setFilter('adType', adTypeId || null);
    },
    [setFilter]
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h3 className="font-medium text-lg mb-3">الفلاتر الثابتة</h3>

      <div className="space-y-4">
        {/* City Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المدينة
          </label>
          <select
            value={filters.city || ''}
            onChange={handleCityChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">اختر المدينة</option>
            {staticFilters.cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Town Filter - Only show if city is selected */}
        {filters.city && availableTowns.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المنطقة
            </label>
            <select
              value={filters.town || ''}
              onChange={handleTownChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">اختر المنطقة</option>
              {availableTowns.map((town) => (
                <option key={town.name} value={town.name}>
                  {town.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نطاق السعر
          </label>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              min={priceRangeDefault.min}
              max={priceRangeDefault.max}
              value={priceRange[0]}
              onChange={(e) => {
                const value =
                  Number.parseInt(e.target.value) || priceRangeDefault.min;
                setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
              }}
              onBlur={handlePriceChangeEnd}
              className="w-24 p-1 text-center border border-gray-300 rounded"
            />
            <span>-</span>
            <input
              type="number"
              min={priceRangeDefault.min}
              max={priceRangeDefault.max}
              value={priceRange[1]}
              onChange={(e) => {
                const value =
                  Number.parseInt(e.target.value) || priceRangeDefault.max;
                setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
              }}
              onBlur={handlePriceChangeEnd}
              className="w-24 p-1 text-center border border-gray-300 rounded"
            />
          </div>

          <Slider
            value={priceRange}
            min={priceRangeDefault.min}
            max={priceRangeDefault.max}
            step={100}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeEnd}
            className="my-4"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>

        {/* Ad Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            نوع الإعلان
          </label>
          <select
            value={filters.adType || ''}
            onChange={handleAdTypeChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">اختر نوع الإعلان</option>
            {staticFilters.adTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
