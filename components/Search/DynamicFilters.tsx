"use client"

import { useSearch } from "../../contexts/SearchContext"

export default function DynamicFilters() {
  const { categoryId, filters, setFilter, availableFilters } = useSearch()

  // If no category is selected or no dynamic filters are available, don't render anything
  if (!categoryId || !availableFilters.currentDynamicFilters) {
    return null
  }

  const dynamicFilters = availableFilters.currentDynamicFilters

  // Handle checkbox filter change
  const handleFilterChange = (key: string, value: string) => {
    const currentValue = filters.details?.[key]
    setFilter(`details.${key}`, currentValue === value ? undefined : value)
  }

  return (
    <div className="space-y-6">
      {Object.entries(dynamicFilters).map(([key, options]: [string, any]) => {
        // Skip non-array options (like range filters)
        if (!Array.isArray(options)) {
          return null
        }

        // Format the filter name for display
        const filterName = key.charAt(0).toUpperCase() + key.slice(1)

        return (
          <div key={key}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{filterName}</h3>
            <div className="space-y-2">
              {options.map((option: any) => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={`${key}-${option.id}`}
                    type="checkbox"
                    checked={filters.details?.[key] === option.id}
                    onChange={() => handleFilterChange(key, option.id)}
                    className="h-4 w-4 text-one border-gray-300 rounded focus:ring-one"
                  />
                  <label htmlFor={`${key}-${option.id}`} className="ml-2 text-sm text-gray-700">
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

