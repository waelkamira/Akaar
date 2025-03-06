'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard';
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import CategoriesProductsSearchBar from '../../../components/Categories/CategoriesProductsSearchBar';
import Loading from '../../../components/ReusableComponents/Loading';

const CategoryPage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const { category } = useParams(); // الحصول على اسم الفئة من الرابط
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // جلب البيانات المرتبطة بالفئة
    if (category) {
      console.log('category', category);

      fetchCategoryProducts();
    }
  }, [category]);

  async function fetchCategoryProducts() {
    const response = await fetch(`/api/categories/${category}`);
    if (response.ok) {
      const json = await response.json();
      setProducts(json);
    }
  }
  return (
    <div className="relative flex flex-col justify-center items-center z-40 w-full bg-five mt-8 xl:mt-10">
      <div className="w-full">
        <div className="p-2 bg-three">
          <button
            className="flex justify-center items-center rounded-[5px] sm:text-lg text-sm bg-one text-white text-nowrap h-12 select-none w-full hover:scale-[101%]"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'إخفاء فلاتر البحث' : 'عرض فلاتر البحث'}
          </button>
        </div>
        {showSearch && <CategoriesProductsSearchBar category={category} />}
        <div className="relative w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="w-full text-center sm:text-lg my-4">أحدث الإعلانات</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full xl:w-[70%]">
            {!products && <Loading />}
            {products?.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg shadow-md">
                <SmallCard item={item} />
              </div>
            ))}
          </div>

          {/* أزرار التنقل بين الصفحات */}
          <div className="flex items-center justify-around my-16">
            {pageNumber > 1 && (
              <button
                className="flex items-center justify-center gap-2 py-2 px-6 bg-three text-white rounded-[5px] hover:bg-two transition-colors shadow-md hover:shadow-lg"
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <MdKeyboardDoubleArrowLeft className="text-xl" />
                الصفحة السابقة
              </button>
            )}
            {hasMore && (
              <button
                className="flex items-center justify-center gap-2 py-2 px-6 bg-three text-white rounded-[5px] hover:bg-two transition-colors shadow-md hover:shadow-lg"
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                الصفحة التالية
                <MdKeyboardDoubleArrowRight className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
