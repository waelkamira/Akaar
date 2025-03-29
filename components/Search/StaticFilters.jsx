// components/StaticFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { Slider } from '../ui/slider';
import { X } from 'lucide-react';

export default function StaticFilters() {
  const {
    filters,
    setFilter,
    availableFilters,
    getTownsByCity,
    performSearch,
  } = useSearch();

  const priceRangeDefault = availableFilters?.static?.priceRange || {
    min: 0,
    max: 150000,
  };
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || priceRangeDefault.min,
    filters.priceMax || priceRangeDefault.max,
  ]);

  // الحصول على المناطق المتاحة للمدينة المختارة
  const availableTowns = getTownsByCity(filters.city || null);

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handle city select change event. When the user selects a different city,
   * reset the town filter and perform a search.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  /******  23381023-67ad-4f09-a827-3efd1776fbaa  *******/
  const handleCityChange = (e) => {
    const cityId = e.target.value || null;
    setFilter('city', cityId);
    // Reset town when city changes
    setFilter('town', null);
    // تنفيذ البحث مباشرة عند اختيار المدينة
    performSearch();
  };

  const handleTownChange = (e) => {
    const townId = e.target.value || null;
    setFilter('town', townId);
    // تنفيذ البحث مباشرة عند اختيار المنطقة
    performSearch();
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
  };

  const handlePriceChangeEnd = () => {
    setFilter('priceMin', priceRange[0]);
    setFilter('priceMax', priceRange[1]);
    // تنفيذ البحث عند تغيير السعر
    performSearch();
  };

  const handlePriceFilterClose = () => {
    // إعادة تعيين قيم السعر
    setFilter('priceMin', undefined);
    setFilter('priceMax', undefined);
    setPriceRange([priceRangeDefault.min, priceRangeDefault.max]);
    performSearch();
  };

  return (
    <div className="space-y-6">
      {/* فلتر المدينة */}
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          المدينة
        </label>
        <select
          id="city"
          value={filters.city || ''}
          onChange={handleCityChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-one focus:border-one"
        >
          <option value="">اختر المدينة...</option>
          {availableFilters?.static?.cities?.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* فلتر المنطقة (يظهر فقط عند اختيار مدينة) */}
      {filters.city && (
        <div>
          <label
            htmlFor="town"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            المنطقة
          </label>
          <select
            id="town"
            value={filters.town || ''}
            onChange={handleTownChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-one focus:border-one"
          >
            <option value="">اختر المنطقة...</option>
            {availableTowns.map((town) => (
              <option key={town.name} value={town.name}>
                {town.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* فلتر مدى السعر */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">مدى السعر</h3>
          {(filters.priceMin !== undefined ||
            filters.priceMax !== undefined) && (
            <button
              onClick={handlePriceFilterClose}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="حذف فلتر السعر"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        <div className="px-2">
          {/* حقول إدخال السعر */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">من</span>
            <input
              type="number"
              min="0"
              value={filters.priceMin || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFilter('priceMin', value ? Number(value) : undefined);
                // تحديث شريط التمرير
                setPriceRange([
                  value ? Number(value) : priceRangeDefault.min,
                  priceRange[1],
                ]);
              }}
              className="w-28 p-2 rounded-lg border border-gray-300 focus:ring-one focus:border-one text-center"
              placeholder="0"
            />
            <span className="text-sm text-gray-600">إلى</span>
            <input
              type="number"
              min="0"
              value={filters.priceMax || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFilter('priceMax', value ? Number(value) : undefined);
                // تحديث شريط التمرير
                setPriceRange([
                  priceRange[0],
                  value ? Number(value) : priceRangeDefault.max,
                ]);
              }}
              className="w-28 p-2 rounded-lg border border-gray-300 focus:ring-one focus:border-one text-center"
              placeholder="100000"
            />
          </div>

          <Slider
            defaultValue={priceRange}
            min={priceRangeDefault.min}
            max={priceRangeDefault.max}
            step={100}
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceChangeEnd}
            className="my-6"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
