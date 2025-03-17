'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import categories from '../Categories/categories';
import { FaHome } from 'react-icons/fa';

const CategoriesNavBar = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // تحميل الفئة المحفوظة عند فتح الصفحة
  useEffect(() => {
    const savedCategory = localStorage.getItem('category');
    if (savedCategory) {
      setSelectedCategory(JSON.parse(savedCategory));
    }
  }, []);

  // عند اختيار فئة يتم حفظها في localStorage والانتقال إليها
  const handleCategoryClick = (category) => {
    if (category.path) {
      setSelectedCategory(category);
      localStorage.setItem('category', JSON.stringify(category));
      router.push(category.path);
    }
  };

  return (
    <div className="hidden sm:flex justify-center gap-4 p-4 rounded-lg shadow-md bg-white overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category)}
          className={`flex flex-col items-center justify-center bg-white text-gray-500 
            ${
              selectedCategory?.id === category.id
                ? 'bg-gradient-to-r from-one via-orange-300 to-one text-white'
                : 'hover:bg-gray-100 hover:text-gray-700'
            }
            p-3 rounded-lg shadow-md transition-all duration-300 w-20 h-20 transform hover:scale-105`}
        >
          <div className="text-2xl">{category.icon || <FaHome />}</div>
          <span className="text-xs font-bold mt-1">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoriesNavBar;
