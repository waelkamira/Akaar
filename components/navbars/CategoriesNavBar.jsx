'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import categories from '../Categories/categories';

const CategoriesNavBar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showArrow, setShowArrow] = useState(false); // حالة لإظهار السهم

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

      // // إظهار السهم
      // setShowArrow(true);
    }
  };
  useEffect(() => {
    setShowArrow(true);
  }, []);
  // إخفاء السهم بعد 5 ثوانٍ
  setTimeout(() => {
    setShowArrow(false);
  }, 50000);
  return (
    <div className="relative w-28 h-[27px] bg-white border rounded shadow-md text-black">
      {/* قائمة Select */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className=" w-28 h-full bg-transparent text-sm rounded cursor-pointer focus:outline-none"
      >
        <option value="">اختر الفئة أولاً</option>
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
      {/* السهم */}
      {/* {showArrow && (
        <div
          className="absolute -bottom-5 left-1/2 transform -translate-x-1/2"
          style={{
            position: 'absolute',
            bottom: '-20px', // يتم وضعه أسفل القائمة
            left: '50%', // توسيط أفقي
            transform: 'translateX(-50%)', // توسيط أفقي
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-one bg-red-600"
          >
            <path d="M12 2a1 1 0 011 1v16.586l5.293-5.293a1 1 0 011.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L11 19.586V3a1 1 0 011-1z" />
          </svg>
        </div>
      )} */}
    </div>
  );
};

export default CategoriesNavBar;
