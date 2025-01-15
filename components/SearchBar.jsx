'use client';
import React, { useState, useEffect } from 'react';
import { IoIosSearch } from 'react-icons/io';
import SmallItem from './SmallItem';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import { Suspense } from 'react';

// Function to normalize Arabic text
const normalizeArabic = (text) => {
  if (!text) return '';
  return text.replace(/[أ]/g, 'ا');
};

export default function SearchBar() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [searchByCategory, setSearchByCategory] = useState([]);
  const [searchedWord, setSearchedWord] = useState('');
  const [searchedValues, setSearchedValues] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false); // حالة جديدة لتعقب تفعيل البحث
  const searchCategory = useSearchParams();
  const searchedCategory = searchCategory.get('searchedCategory');
  const router = useRouter();

  // Function to perform search
  const search = async () => {
    setSearchTriggered(true); // تفعيل حالة البحث عند تشغيله
    const queryParams = new URLSearchParams({
      page: pageNumber.toString(),
      limit: '3',
    });

    const normalizedSearchedWord = normalizeArabic(searchedWord);
    const normalizedCategory = normalizeArabic(searchedCategory);

    if (normalizedSearchedWord) {
      queryParams.append('mealName', normalizedSearchedWord);
    }

    if (normalizedCategory) {
      queryParams.append('propertyType', normalizedCategory);
    }

    const res = await fetch(`/api/search?${queryParams.toString()}`);
    const json = await res?.json();

    if (!normalizedSearchedWord && !normalizedCategory) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    if (normalizedSearchedWord) {
      setSearchedValues(json);
      setSearchByCategory([]); // Clear category search results
    }

    if (normalizedCategory) {
      setSearchByCategory(json);
      setSearchedValues([]); // Clear text search results
    }
  };

  // useEffect to perform search when searchedCategory changes or pageNumber changes
  useEffect(() => {
    if (searchedCategory) {
      search();
    }
  }, [searchedCategory, pageNumber]); // Added pageNumber to dependencies to fetch new results when page changes

  const handleSearch = (e) => {
    e.preventDefault();
    search();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setSearchByCategory([]);
    setSearchedValues([]);
    setSearchedWord('');
    setSearchTriggered(false); // إعادة تعيين حالة البحث عند الإغلاق
    router.push('/');
  };

  return (
    <Suspense>
      <div
        className={
          (searchTriggered || searchedCategory
            ? 'absolute z-50 h-screen overflow-scroll'
            : '') +
          ' flex flex-col items-start justify-center w-full sm:w-1/2 lg:w-1/3 bg-four rounded-lg'
        }
      >
        <div className="flex flex-col justify-center items-center sm:flex-row gap-4 w-full px-2 sm:px-4 my-4">
          <div className="relative w-full sm:px-4 bg-four">
            <input
              value={searchedWord}
              onChange={(e) => setSearchedWord(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              type="text"
              id="search_meal"
              name="search_meal"
              placeholder="ابحث عن بيت أو أرض"
              className=" w-full rounded-md border text-sm sm:text-xl placeholder:text-sm sm:placeholder:text-lg py-2 pr-24 lg:pr-28 outline-2 placeholder:px-4 focus:outline-one text-right"
            />
            <div className="absolute flex items-center top-0 md:top-0 md:right-4 md:w-24 w-[80px] right-0 h-full bg-one rounded-r-md ">
              <button
                onClick={handleSearch}
                className="text-white size-5 sm:mr-4 mb-2 hover: px-2"
              >
                <div className="flex items-center gap-1">
                  <div className="text-white text-xl">
                    <IoIosSearch />
                  </div>
                  <span className="text-white text-lg"> ابحث</span>
                </div>
              </button>
            </div>
          </div>
          {/* <div className="flex gap-4 justify-between w-full">
            <select
              id="city"
              name="city"
              className="w-full sm:h-12 rounded-md p-2"
            >
              <option>اختر المحافظة</option>
              <option value="دمشق">دمشق</option>
              <option value="ريف دمشق">ريف دمشق</option>
              <option value="القنيطرة">القنيطرة</option>
              <option value="درعا">درعا</option>
              <option value="السويداء">السويداء</option>
              <option value="حمص">حمص</option>
              <option value="طرطوس">طرطوس</option>
              <option value="اللاذقية">اللاذقية</option>
              <option value="حماة">حماة</option>
              <option value="إدلب">إدلب</option>
              <option value="حلب">حلب</option>
              <option value="الرقة">الرقة</option>
              <option value="دير الزور">دير الزور</option>
              <option value="الحسكة">الحسكة</option>
            </select>
           <select
              id="عدد الغرف"
              name="عدد الغرف"
              className="w-full sm:h-12 rounded-md p-2"
            >
              <option>عدد الغرف</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+ </option>
            </select> 
          </div> */}
        </div>
        {isVisible && (
          <div className="sticky top-0 flex flex-row-reverse justify-between items-center mt-1 w-full z-50 bg-four p-4">
            <button
              onClick={handleClose}
              className="py-1 px-4 text-white bg-five w-24 rounded-xl sm:text-lg hover:bg-one hover:scale-55"
            >
              إغلاق
            </button>
            <h1 className="text-sm sm:text-2xl text-nowrap mx-2  text-white">
              نتائج البحث:
            </h1>
          </div>
        )}
        {isVisible && (
          <div className="relative w-full flex flex-col items-center justify-start p-2 overflow-y-auto h-screen bg-four rounded-lg content-center">
            {searchedWord &&
              searchedValues.length > 0 &&
              searchedValues.map((recipe, index) => (
                <div className="w-full 2xl:w-2/3 " key={index}>
                  <SmallItem recipe={recipe} index={index} />
                </div>
              ))}
            {searchedCategory &&
              searchByCategory.length > 0 &&
              searchByCategory.map((recipe, index) => (
                <div className="w-full 2xl:w-2/3" key={index}>
                  <SmallItem recipe={recipe} index={index} />
                </div>
              ))}
            <div className="flex items-center justify-around my-4 mt-8 w-full">
              {(searchByCategory.length >= 3 || searchedValues.length >= 3) && (
                <Link href="#post1">
                  <div
                    className="flex items-center justify-around cursor-pointer"
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    <h1 className="text-white ">الصفحة التالية</h1>
                    <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse text-green-500" />
                  </div>
                </Link>
              )}
              {pageNumber > 1 && (
                <Link href="#post1">
                  <div
                    className="flex items-center justify-around cursor-pointer"
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse text-green-500" />
                    <h1 className="text-white ">الصفحة السابقة</h1>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
