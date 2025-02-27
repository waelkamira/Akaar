'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { id: 1, name: 'العقارات', path: '/categories/1' },
  { id: 2, name: 'السيارات', path: '/categories/2' },
  { id: 3, name: 'الهواتف', path: '/categories/3' },
  // يمكنك إضافة المزيد من الفئات هنا
];

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center gap-4 items-center h-14 py-2 w-full bg-three text-white">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => router.push(category.path)}
          className="flex items-center justify-center gap-2 border-one hover:border-t-4 shadow-one hover:shadow-lg rounded-[5px] hover:scale-105 hover:cursor-pointer px-2 lg:px-4 h-10 transition-all duration-300"
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
