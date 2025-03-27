"use client"

import { useState } from "react"
import { useSearch } from "../../contexts/SearchContext"
import { Slider } from "../../components/ui/slider"

export default function StaticFilters() {
  const { filters, setFilter, availableFilters } = useSearch()
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || availableFilters.static.priceRange.min,
    filters.priceMax || availableFilters.static.priceRange.max,
  ])

  // Handle city filter change
  const handleCityChange = (cityId: string) => {
    setFilter("city", cityId === filters.city ? undefined : cityId)
  }

  // Handle price range change
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  // Apply price range filter when slider stops
  const handlePriceChangeEnd = () => {
    setFilter("priceMin", priceRange[0])
    setFilter("priceMax", priceRange[1])
  }

  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">City</h3>
        <div className="space-y-2">
          {availableFilters.static.city.map((city: any) => (
            <div key={city.id} className="flex items-center">
              <input
                id={`city-${city.id}`}
                type="checkbox"
                checked={filters.city === city.id}
                onChange={() => handleCityChange(city.id)}
                className="h-4 w-4 text-one border-gray-300 rounded focus:ring-one"
              />
              <label htmlFor={`city-${city.id}`} className="ml-2 text-sm text-gray-700">
                {city.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            min={availableFilters.static.priceRange.min}
            max={availableFilters.static.priceRange.max}
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
  )
}

