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
  const [searshedKeyWord, setSearshedKeyWord] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true); // إضافة حالة جديدة لـ hasMore

  useEffect(() => {
    handleSearch(pageNumber);
  }, [pageNumber]);

  async function handleSearch(newPage = 1) {
    console.log('handleSearch');
    if (searshedKeyWord) {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searshedKeyWord, page: newPage }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('json', json);

        // التحقق من أن json?.data هو مصفوفة
        if (Array.isArray(json?.data)) {
          if (newPage === 1) {
            setSearchResults(json?.data); // الصفحة الأولى، استبدل البيانات
            setTotalCount(json?.totalCount);
          } else {
            setSearchResults((prevResults) =>
              [...prevResults, ...json?.data].slice(-6)
            ); // أضف المزيد من النتائج
          }
          setHasMore(json?.hasMore); // تحديث حالة hasMore
        } else {
          console.error(
            'Expected json?.data to be an array, but got:',
            json?.data
          );
        }
      }
    } else {
      setSearchResults([]);
    }
  }

  return (
    <div className="flex-1 w-full fixed top-0 left-0 z-[1000]">
      <FirstNavBar />
      <div className="flex flex-col-reverse sm:flex-row-reverse justify-start items-center gap-1 sm:gap-4 w-full bg-three">
        <CategoriesNavBar />

        <div className="flex flex-col justify-center items-start w-full ">
          <div className="flex justify-between items-center gap-2 sm:gap-4 w-full px-2">
            <div className="flex justify-center items-center gap-2 sm:gap-4 w-full">
              <div className="relative xl:hidden">
                <TfiMenuAlt
                  className="text-[30px] sm:text-5xl text-white cursor-pointer"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                />
                <div className="absolute top-14 lg:top-20 right-0 z-50">
                  {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 w-full my-2 h-8 sm:h-12 ">
                <div className="sm:text-lg text-sm p-2 xl:w-1/2 lg:p-3 bg-one flex justify-center items-center my-2 text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:scale-[101%]">
                  {searchResults?.length > 0 ? (
                    <button
                      className="btn text-sm sm:text-lg text-white text-nowrap select-none rounded-[5px] w-full h-full hover:scale-[101%]"
                      style={{
                        '--btn-background': '#F50610',
                        // '--btn-hover-background': '#F50610',
                      }}
                      onClick={() => {
                        setPageNumber(1); // إعادة تعيين رقم الصفحة إلى 1
                        setSearchResults([]); // مسح النتائج
                        setSearshedKeyWord(''); // مسح الكلمة المفتاحية
                      }}
                    >
                      إغلاق البحث
                    </button>
                  ) : (
                    <button
                      className="flex justify-center items-center sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] w-full h-6 hover:scale-[101%]"
                      onClick={() => handleSearch()}
                    >
                      <span className="px-1">
                        <ImSearch />
                      </span>
                      بحث{' '}
                    </button>
                  )}
                </div>
                <input
                  type="search"
                  id="main_search"
                  value={searshedKeyWord}
                  onChange={(e) => {
                    setSearshedKeyWord(e?.target?.value);
                    if (searshedKeyWord?.length === 0) {
                      setSearchResults([]);
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
                  className="flex justify-center items-center sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] w-full px-2 sm:h-12 h-8"
                />
              </div>
            </div>
          </div>
          {searchResults?.length > 0 && (
            <div
              className={`w-full text-white ${
                searchResults?.length > 0
                  ? 'pb-16 h-screen overflow-y-auto'
                  : ''
              } `}
            >
              <div className="mt-4 sm:mt-8 p-2 sm:p-4">
                <h1 className="sm:text-lg">
                  نتائج البحث المطابقة:
                  <span className="px-2 text-one">{totalCount}</span>
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 justify-start items-start w-full py-4 sm:py-8 lg:py-16">
                  {searchResults.map((post, index) => (
                    <div
                      className="relative flex flex-col border-2 items-start h-full justify-start bg-one hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                      key={index}
                    >
                      <SmallItem post={post} index={index} show={false} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-around  my-4 ">
                {/* عرض الأزرار بناءً على hasMore */}
                {pageNumber > 1 && (
                  <Link href={'#post1'}>
                    <div
                      className="flex items-center justify-around cursor-pointer py-4"
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      <MdKeyboardDoubleArrowLeft className="text-2xl text-one select-none" />
                      <h1>الصفحة السابقة</h1>
                    </div>
                  </Link>
                )}
                {hasMore && (
                  <Link href={'#post1'}>
                    <div
                      className="flex items-center justify-around cursor-pointer py-4"
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      <MdKeyboardDoubleArrowRight className="text-2xl text-one select-none" />
                      <h1>الصفحة التالية</h1>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
