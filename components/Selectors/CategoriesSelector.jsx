'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import categories from '../Categories/categories';

const CategoriesNavBar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');

  // دالة لمعالجة تغيير الفئة
  const handleCategoryChange = (event) => {
    const selectedOption = event.target.selectedOptions[0];
    const categoryId = selectedOption.value;
    const categoryPath = selectedOption.getAttribute('data-path');

    if (categoryPath) {
      setSelectedCategory(categoryId);
      localStorage.setItem(
        'category',
        JSON.stringify({
          id: categoryId,
          name: selectedOption.textContent,
          path: categoryPath,
        })
      );
      router.push(categoryPath);
    }
  };

  return (
    <div className="relative w-full sm:h-[27px] bg-white border rounded text-black">
      {/* قائمة Select */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className=" w-full min-w-28 h-full bg-transparent text-sm rounded cursor-pointer focus:outline-none"
      >
        <option value="">اختر الفئة </option>
        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
            data-path={category.path}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoriesNavBar;
