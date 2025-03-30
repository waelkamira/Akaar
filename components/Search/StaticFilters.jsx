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

  // State for price slider and inputs
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || priceRangeDefault.min,
    filters.priceMax || priceRangeDefault.max,
  ]);

  // Separate state for input values to prevent immediate filtering
  const [inputValues, setInputValues] = useState({
    min: filters.priceMin || '',
    max: filters.priceMax || '',
  });

  // Update states when filters change externally
  useEffect(() => {
    setPriceRange([
      filters.priceMin || priceRangeDefault.min,
      filters.priceMax || priceRangeDefault.max,
    ]);
    setInputValues({
      min: filters.priceMin || '',
      max: filters.priceMax || '',
    });
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

  // Handle price input change
  const handlePriceInputChange = (type, value) => {
    // Update only the input value without filtering
    setInputValues((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Validate and apply price filter
  const applyPriceFilter = useCallback(() => {
    let minPrice = parseInt(inputValues.min) || priceRangeDefault.min;
    let maxPrice = parseInt(inputValues.max) || priceRangeDefault.max;

    // Ensure min is not greater than max
    if (minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    // Ensure values are within bounds
    minPrice = Math.max(
      priceRangeDefault.min,
      Math.min(minPrice, priceRangeDefault.max)
    );
    maxPrice = Math.max(
      priceRangeDefault.min,
      Math.min(maxPrice, priceRangeDefault.max)
    );

    // Update price range state
    setPriceRange([minPrice, maxPrice]);

    // Update input values with validated numbers
    setInputValues({
      min: minPrice.toString(),
      max: maxPrice.toString(),
    });

    // Apply filter
    setFilter('priceMin', minPrice);
    setFilter('priceMax', maxPrice);
  }, [inputValues, setFilter]);

  // Handle input blur (when user finishes typing)
  const handleInputBlur = () => {
    applyPriceFilter();
  };

  // Handle slider change
  const handleSliderChange = (values) => {
    setPriceRange(values);
    setInputValues({
      min: values[0].toString(),
      max: values[1].toString(),
    });
  };

  // Handle slider release
  const handleSliderCommit = (values) => {
    setFilter('priceMin', values[0]);
    setFilter('priceMax', values[1]);
  };

  // Handle ad type selection
  const handleAdTypeChange = useCallback(
    (adTypeId) => {
      setFilter('adType', adTypeId || null);
    },
    [setFilter]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">الفلاتر الثابتة</h3>

      <div className="space-y-6">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المدينة
          </label>
          <select
            value={filters.city || ''}
            onChange={handleCityChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المنطقة
            </label>
            <select
              value={filters.town || ''}
              onChange={handleTownChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            نطاق السعر
          </label>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="number"
              min={priceRangeDefault.min}
              max={priceRangeDefault.max}
              value={inputValues.min}
              onChange={(e) => handlePriceInputChange('min', e.target.value)}
              onBlur={handleInputBlur}
              placeholder="السعر الأدنى"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-center"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min={priceRangeDefault.min}
              max={priceRangeDefault.max}
              value={inputValues.max}
              onChange={(e) => handlePriceInputChange('max', e.target.value)}
              onBlur={handleInputBlur}
              placeholder="السعر الأعلى"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 text-center"
            />
          </div>

          <Slider
            value={priceRange}
            min={priceRangeDefault.min}
            max={priceRangeDefault.max}
            step={100}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            className="my-6"
          />

          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0].toLocaleString()} ريال</span>
            <span>{priceRange[1].toLocaleString()} ريال</span>
          </div>
        </div>

        {/* Ad Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع الإعلان
          </label>
          <div className="grid grid-cols-3 gap-2">
            {staticFilters.adTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleAdTypeChange(type.id)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    filters.adType === type.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
