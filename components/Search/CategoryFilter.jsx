'use client';

import { useSearch } from '../../contexts/SearchContext';
import { useEffect } from 'react';
import categories from '../Categories/categories';
import { ChevronLeft } from 'lucide-react';

export default function CategoryFilter() {
  const { category, setCategory, performSearch } = useSearch();

  // Handle category selection
  const handleCategoryChange = (selectedCategory) => {
    // If clicking the already selected category, deselect it
    if (category && selectedCategory && category.id === selectedCategory?.id) {
      setCategory(null);
      localStorage.removeItem('category');
    } else {
      // Update category in context with the full category object
      setCategory(selectedCategory);

      // Save to localStorage for persistence
      if (selectedCategory) {
        localStorage.setItem('category', JSON.stringify(selectedCategory));
      } else {
        localStorage.removeItem('category');
      }
    }
    // Remove automatic search trigger
    // performSearch();
  };

  // Load category from localStorage on mount
  useEffect(() => {
    const storedCategory = localStorage.getItem('category');
    if (storedCategory && !category) {
      try {
        const parsedCategory = JSON.parse(storedCategory);
        setCategory(parsedCategory);
      } catch (error) {
        console.error('Error parsing stored category:', error);
        localStorage.removeItem('category');
      }
    }
  }, [category, setCategory]);

  // The selected category is directly from the context
  const selectedCategory = category;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h2 className="font-medium text-lg mb-3">الفئات</h2>

      <div className="space-y-2">
        {/* Always show the "All Categories" option */}
        <div className="flex items-center">
          <input
            id="category-all"
            type="radio"
            checked={!category}
            onChange={() => handleCategoryChange(null)}
            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
          />
          <label htmlFor="category-all" className="mr-2 text-sm">
            كل الفئات
          </label>
        </div>

        {/* Show only the selected category if one is selected */}
        {selectedCategory ? (
          <div className="flex items-center">
            <input
              id={`category-${selectedCategory?.id}`}
              type="radio"
              checked={true}
              onChange={() => {}} // No need to handle change here
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
            />
            <label
              htmlFor={`category-${selectedCategory?.id}`}
              className="mr-2 text-sm flex items-center"
            >
              <span className="mr-1">{selectedCategory?.icon}</span>
              {selectedCategory?.name}
            </label>
          </div>
        ) : (
          // If no category is selected, show all categories
          categories?.map((cat) => (
            <div key={cat?.id} className="flex items-center text-2xl">
              <input
                id={`category-${cat?.id}`}
                type="radio"
                checked={category && category.id === cat?.id}
                onChange={() => handleCategoryChange(cat)}
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
              />
              <label
                htmlFor={`category-${cat?.id}`}
                className="mr-2 text-xl flex items-center"
              >
                <span className="mx-1 text-primary-400">{cat?.icon}</span>
                {cat?.name}
              </label>
            </div>
          ))
        )}

        {/* If a category is selected, show a button to view all categories */}
        {selectedCategory && (
          <button
            onClick={() => handleCategoryChange(null)}
            className="text-sm text-primary-500 hover:text-blue-800 flex items-center mt-2"
          >
            <ChevronLeft size={16} className="mr-1" />
            عرض جميع الفئات
          </button>
        )}
      </div>
    </div>
  );
}
