'use client';
import React, { useEffect, useState } from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { ImSearch } from 'react-icons/im';
import { TfiMenuAlt } from 'react-icons/tfi';
import SideBarMenu from '../SideBarMenu';
import SmallItem from '../ReusableComponents/SmallItem';
import Link from 'next/link';
import CategoriesNavBar from './CategoriesNavBar';
import FirstNavBar from './FirstNavBar';

export default function MainNavbar() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [searshedKeyWord, setSearshedKeyWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // حالة جديدة لتتبع الضغط على زر البحث

  async function handleSearch(newPage = 1) {
    if (!searshedKeyWord.trim()) {
      setSearchResults([]);
      setTotalCount(0);
      setIsSearchTriggered(false); // إعادة تعيين الحالة إذا كانت الكلمة فارغة
      return;
    }

    setIsLoading(true);
    setIsSearchTriggered(true); // تم الضغط على زر البحث

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searshedKeyWord, page: newPage }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('json', json);

        if (Array.isArray(json?.data)) {
          if (newPage === 1) {
            setSearchResults(json?.data);
            setTotalCount(json?.totalCount);
          } else {
            setSearchResults((prevResults) =>
              [...prevResults, ...json?.data].slice(-6)
            );
          }
          setHasMore(json?.hasMore);
        } else {
          console.error(
            'Expected json?.data to be an array, but got:',
            json?.data
          );
        }
      } else {
        console.error('Failed to fetch search results');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearSearch = () => {
    setPageNumber(1);
    setSearchResults([]);
    setSearshedKeyWord('');
    setTotalCount(0);
    setIsSearchTriggered(false); // إعادة تعيين الحالة عند إغلاق البحث
  };

  return (
    <div className="flex-1 w-full fixed top-0 left-0 z-[1000]">
      {/* شريط التنقل العلوي */}
      <FirstNavBar />

      {/* شريط البحث والفئات */}
      <div className="flex flex-col lg:flex-row justify-start items-center gap-2 w-full bg-three py-2">
        {/* شريط البحث */}
        <div className="flex justify-center items-center gap-2 w-full h-12 sm:h-14 p-2 bg-one lg:bg-transparent">
          {/* زر القائمة الجانبية للشاشات الصغيرة */}
          <div className="relative xl:hidden">
            <TfiMenuAlt
              className="text-[32px] sm:text-[40px] xl:text-[48px] text-white cursor-pointer hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
              <div className="absolute top-14 right-0 z-50">
                <SideBarMenu setIsOpen={setIsOpen} />
              </div>
            )}
          </div>

          {/* زر البحث أو إغلاق البحث */}
          <button
            className={`${
              searchResults?.length > 0 ||
              totalCount > 0 ||
              (isSearchTriggered &&
                searchResults?.length === 0 &&
                totalCount === 0)
                ? 'bg-[#EC2D20]'
                : 'bg-one'
            } flex justify-center items-center sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[56px] xl:w-[15%] p-2 hover:scale-[101%] transition-transform shadow-md border border-white hover:shadow-lg`}
            onClick={() => {
              if (
                searchResults?.length > 0 ||
                totalCount > 0 ||
                (isSearchTriggered &&
                  searchResults?.length === 0 &&
                  totalCount === 0)
              ) {
                handleClearSearch();
              } else {
                handleSearch();
              }
            }}
            disabled={isLoading}
          >
            {searchResults?.length > 0 ||
            totalCount > 0 ||
            (isSearchTriggered &&
              searchResults?.length === 0 &&
              totalCount === 0) ? (
              <span className="flex justify-center items-center gap-1 h-full">
                إغلاق البحث
              </span>
            ) : (
              <span className="flex justify-center items-center gap-1 h-full cursor-pointer">
                <ImSearch className="mr-2" /> بحث
              </span>
            )}
          </button>

          {/* حقل الإدخال */}
          <input
            type="search"
            id="main_search"
            value={searshedKeyWord}
            onChange={(e) => {
              setSearshedKeyWord(e.target.value);
              if (e.target.value.length === 0) {
                handleClearSearch();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
                setPageNumber(1);
              }
            }}
            autoFocus
            placeholder="ابحث عن عقار .. سيارة ..."
            className="flex-grow sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[56px] text-[10px] sm:text-[15px] xl:text-[22px] bg-[#5B6069] backdrop-blur-lg border focus:outline-none border-white transition-all shadow-md hover:shadow-lg placeholder:pr-2 placeholder:text-md pr-2"
          />
        </div>

        {/* شريط الفئات */}
        <div className="hidden xl:block w-full lg:w-[30%]">
          <CategoriesNavBar />
        </div>
      </div>

      {/* عرض نتائج البحث */}
      {isLoading ? (
        <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-gray-900/70 backdrop-blur-lg">
          <div className="mt-8 p-4">
            <h1 className="sm:text-lg font-semibold text-center">
              جاري البحث...
            </h1>
          </div>
        </div>
      ) : searchResults?.length > 0 ? (
        <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-gray-900/70 backdrop-blur-lg">
          <div className="mt-8 p-4">
            <h1 className="sm:text-lg font-semibold">
              نتائج البحث المطابقة:{' '}
              <span className="px-2 text-one font-bold">{totalCount}</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 mt-6">
              {searchResults.map((post, index) => (
                <div
                  key={index}
                  className="relative flex flex-col border-2 border-gray-700 items-start justify-start bg-gray-800 hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                >
                  <SmallItem post={post} index={index} show={false} />
                </div>
              ))}
            </div>
          </div>

          {/* أزرار التنقل بين الصفحات */}
          <div className="flex items-center justify-around my-16">
            {pageNumber > 1 && (
              <button
                className="flex items-center justify-center gap-2 py-2 px-6 bg-gray-700/50 text-white rounded-[5px] hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <MdKeyboardDoubleArrowLeft className="text-xl" />
                الصفحة السابقة
              </button>
            )}
            {hasMore && (
              <button
                className="flex items-center justify-center gap-2 py-2 px-6 bg-gray-700/50 text-white rounded-[5px] hover:bg-gray-600 transition-colors shadow-md hover:shadow-lg"
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                الصفحة التالية
                <MdKeyboardDoubleArrowRight className="text-xl" />
              </button>
            )}
          </div>
        </div>
      ) : (
        isSearchTriggered &&
        searchResults?.length === 0 &&
        totalCount === 0 && (
          <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-gray-900/70 backdrop-blur-lg">
            <div className="mt-8 p-4">
              <h1 className="sm:text-lg font-semibold text-center">
                لم يتم العثور على نتائج مطابقة للبحث.
              </h1>
            </div>
          </div>
        )
      )}
    </div>
  );
}
