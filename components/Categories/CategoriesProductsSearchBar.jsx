'use client';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import CitySelector from '../Selectors/CitySelector';
import SmallItem from '../ReusableComponents/SmallItem';
import { MdOutlinePriceCheck } from 'react-icons/md';
import Button from '../Button';
import { inputsContext } from '../Context';
import { ImSearch } from 'react-icons/im';
import CarsBrandSelector from '../Cars/CarsBrandSelector';
import CarsUsedNewSelector from '../Cars/CarsUsedNewSelector';
import FirstNavBar from '../navbars/FirstNavBar';
import CarsSideBar from '../Cars/CarsSideBar';
import NavegationPages from '../ReusableComponents/NavegationPages';
import categoryFields from '../lists/categoryFields';

export default function CategoriesProductsSearchBar({ adCategory }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [categoryAds, setCategoryAds] = useState([]);
  const { data, brand, usedNew } = useContext(inputsContext);
  const [category, setCategory] = useState('');
  // State واحد لتخزين جميع بيانات البحث
  const [searchData, setSearchData] = useState({
    // معاملان اساسيان حسب الفئة
    adCategory: adCategory,
    category: category,
    // معاملات ثانوية يختار منها المستخدم
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    usedNew: usedNew || '',
    brand: brand?.label || '',
    minPrice: '',
    maxPrice: '',
  });

  // تخزين البيانات في الكاش لتجنب الطلبات المتكررة
  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const categoryNumber = JSON.parse(localStorage.getItem('category'));
      console.log('categoryNumber', categoryNumber);
      setCategory(categoryNumber);
    }
    fetchCategoryAds();
  }, [pageNumber, searchData]);

  const fetchCategoryAds = async () => {
    const cacheKey = JSON.stringify({ pageNumber, ...searchData });
    if (cache.has(cacheKey)) {
      setCategoryAds(cache.get(cacheKey));
      return;
    }

    try {
      const response = await fetch('/api/products/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 5,
          page: pageNumber,
          ...searchData,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setCategoryAds(json);
        cache.set(cacheKey, json); // حفظ البيانات في الكاش
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setCategoryAds([]);
    }
  };

  const handleSearch = () => {
    setPageNumber(1); // إعادة التصفح إلى الصفحة الأولى عند البحث
    fetchCategoryAds();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (value.trim()) {
      setEmptyFields((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleDetailsChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));

    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (value.trim()) {
      setEmptyFields((prev) => prev.filter((item) => item !== field));
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full rounded-b text-black">
      <FirstNavBar />
      <CarsSideBar Button={true} />
      <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 py-2">
        <div className="relative text-center w-full xl:w-1/5 px-2">
          <ImSearch className="hidden xl:block p-1 text-3xl text-one text-center w-full" />
          <Button style={'border'} onClick={handleSearch} title={'بحث'} />
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2 text-white">
            <CitySelector />
            <div className="w-full relative">
              <MdOutlinePriceCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-one xl:text-xl" />
              <input
                type="number"
                id="minPrice"
                placeholder="أدنى سعر"
                value={searchData.minPrice}
                onChange={handleInputChange}
                className="w-full text-sm sm:text-lg rounded text-start text-black h-9 sm:h-12 px-10 border border-gray-300 focus:outline-one"
              />
            </div>

            <div className="w-full relative">
              <MdOutlinePriceCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-one xl:text-xl" />
              <input
                type="number"
                id="maxPrice"
                placeholder="أعلى سعر"
                value={searchData.maxPrice}
                onChange={handleInputChange}
                className="w-full text-sm sm:text-lg rounded text-start text-black h-9 sm:h-12 px-10 border border-gray-300 focus:outline-one"
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2">
            {category &&
              categoryFields[category]?.map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col xl:flex-row justify-center items-center w-full"
                >
                  {/* الحقل مع الأيقونة والعنوان */}
                  <div className="flex items-center w-full border rounded focus:outline-2 focus:outline-one  bg-white text-nowrap">
                    {/* الأيقونة */}
                    <span className="text-one xl:text-xl">{field?.icon}</span>
                    {/* العنوان */}
                    <span className="text-black">{field?.name}</span>
                    {/* الحقل (input أو select أو مكون مخصص) */}
                    {field?.options ? (
                      <select
                        className="w-full bg-transparent focus:outline-none text-gray-500"
                        onChange={(e) =>
                          handleDetailsChange(field?.name, e.target.value)
                        }
                      >
                        {Object.entries(field?.options).map(([key, value]) => (
                          <option
                            key={value}
                            value={value}
                            className="text-black h-full"
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : field?.component ? (
                      // عرض المكون المخصص إذا كان موجودًا
                      field.component
                    ) : (
                      <input
                        placeholder={field?.placeholder}
                        className="w-full bg-transparent focus:outline-none sm:h-12 h-8 "
                        onChange={(e) =>
                          handleDetailsChange(field?.name, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col w-full mt-4 rounded-[5px] flex-grow xl:w-[90%] 2xl:w-[70%] h-[1370px] px-2 pt-2 overflow-y-auto border rounded-b z-[0]">
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {categoryAds?.length > 0 ? (
            <div className="flex flex-col justify-start w-full overflow-y-auto my-2 z-[0]">
              {categoryAds.map((post, index) => (
                <SmallItem key={index} post={post} />
              ))}
              <NavegationPages
                array={categoryAds}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full my-4">
              <h1 className="text-md sm:text-xl mb-8">
                لم يتم العثور على نتائج مطابقة للبحث
              </h1>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
