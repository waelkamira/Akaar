'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { id: 1, name: 'العقارات', path: '/categories/1' },
  { id: 2, name: 'السيارات', path: '/categories/2' },
  // يمكنك إضافة المزيد من الفئات هنا
];

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-semibold">المتجر الإلكتروني</div>
          <div className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => router.push(category.path)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition duration-300"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
