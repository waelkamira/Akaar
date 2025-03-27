"use client"

import { useSearch } from "../../contexts/SearchContext"

export default function CategoryFilter() {
  const { categoryId, setCategoryId, availableFilters } = useSearch()

  const handleCategoryChange = (id: number) => {
    setCategoryId(id === categoryId ? null : id)
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="category-all"
            type="radio"
            checked={categoryId === null}
            onChange={() => setCategoryId(null)}
            className="h-4 w-4 text-one border-gray-300 focus:ring-one"
          />
          <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
            All categories
          </label>
        </div>

        {availableFilters.categories.map((category: any) => (
          <div key={category.id} className="flex items-center">
            <input
              id={`category-${category.id}`}
              type="radio"
              checked={categoryId === category.id}
              onChange={() => handleCategoryChange(category.id)}
              className="h-4 w-4 text-one border-gray-300 focus:ring-one"
            />
            <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

