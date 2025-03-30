"use client"

import { useSearch } from "../../contexts/SearchContext"
import { X } from "lucide-react"

export default function SelectedFilters() {
  const { selectedFilters, removeFilter, clearFilters } = useSearch()

  if (!selectedFilters || selectedFilters.length === 0) {
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium text-sm">الفلاتر المفعلة ({selectedFilters.length})</h2>

        {selectedFilters.length > 0 && (
          <button
            onClick={() => clearFilters()}
            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded-md"
          >
            مسح الكل
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedFilters.map((filter) => (
          <div
            key={`${filter.key}-${filter.value}`}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
          >
            <span className="truncate max-w-[150px]">{filter.label}</span>
            <button
              onClick={() => removeFilter(filter.key)}
              className="ml-1 text-gray-500 hover:text-gray-700"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

