'use client';

import { useSearch } from '../../contexts/SearchContext';

export default function CategoryFilter() {
  const { categoryId, setCategoryId, availableFilters } = useSearch();

  const handleCategoryChange = (id: string) => {
    setCategoryId(id === categoryId ? null : id);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">الفئات</h3>
      <div className="space-y-2 h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
        <div className="flex items-center">
          <input
            id="category-all"
            type="radio"
            checked={categoryId === null}
            onChange={() => setCategoryId(null)}
            className="h-4 w-4 text-one border-gray-300 focus:ring-one"
          />
          <label htmlFor="category-all" className="mr-2 text-sm text-gray-700">
            كل الفئات
          </label>
        </div>

        {availableFilters.categories.map((category: any) => (
          <div key={category.id} className="flex items-center">
            <input
              id={`category-${category.id}`}
              type="radio"
              checked={categoryId === category.id.toString()}
              onChange={() => handleCategoryChange(category.id.toString())}
              className="h-4 w-4 text-one border-gray-300 focus:ring-one"
            />
            <label
              htmlFor={`category-${category.id}`}
              className="mr-2 text-sm text-gray-700"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
