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
import CategoriesNavBar from '../navbars/CategoriesNavBar';
import FirstNavBar from '../navbars/FirstNavBar';
import { usePathname, useRouter } from 'next/navigation';
import NavegationPages from '../ReusableComponents/NavegationPages';
import CategoriesProductsSearchBar from './CategoriesProductsSearchBar';
export default function SearchBar() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [searshedKeyWord, setSearshedKeyWord] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // حالة جديدة لتتبع الضغط على زر البحث
  const [showSearch, setShowSearch] = useState(false);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    handleSearch(pageNumber);
  }, [pageNumber, isSearchTriggered]);

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
    <div className="relative w-full">
      <div className="flex-1 w-full">
        {/* شريط البحث والفئات */}
        <div className="flex flex-col lg:flex-row justify-start items-center gap-2 w-full bg-three xl:py-2">
          {/* شريط البحث */}
          <div className="flex justify-center items-center gap-2 w-full h-12 sm:h-14 p-2 bg-one xl:bg-transparent">
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
              } flex justify-center items-center sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[50px] xl:w-[10%] p-2 hover:scale-[101%] transition-transform shadow-md border border-white hover:shadow-lg`}
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
                <span className="flex justify-center items-center gap-1 h-full cursor-pointer">
                  <ImSearch className="mr-2" /> إغلاق
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
              className="flex-grow sm:text-lg text-sm text-white text-nowrap select-none rounded-[5px] h-[32px] sm:h-[40px] xl:h-[50px] text-[10px] sm:text-[15px] xl:text-[22px] bg-[#5B6069] backdrop-blur-lg border focus:outline-none border-white transition-all shadow-md hover:shadow-lg placeholder:pr-2 placeholder:text-md pr-2"
            />
          </div>
        </div>
        {/* زر فلاتر البحث */}
        <div className={path === '/' ? 'hidden' : `p-2 bg-three`}>
          <button
            className="flex justify-center items-center rounded-[5px] sm:text-lg text-sm bg-one text-white h-12 w-full transition-transform"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? 'إخفاء فلاتر البحث' : 'عرض فلاتر البحث'}
          </button>
        </div>
        {showSearch && <CategoriesProductsSearchBar />}
        {/* عرض نتائج البحث */}
        {isLoading ? (
          <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-white backdrop-blur-lg">
            <div className="mt-8 p-4">
              <h1 className="sm:text-lg font-semibold text-center">
                جاري البحث...
              </h1>
            </div>
          </div>
        ) : searchResults?.length > 0 ? (
          <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-white backdrop-blur-lg">
            <div className="mt-8 p-4">
              <h1 className="sm:text-lg font-semibold text-three">
                نتائج البحث المطابقة:{' '}
                <span className="px-2 text-one font-bold">{totalCount}</span>
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-4 2xl:grid-cols-6 gap-6 mt-6 w-full">
                {searchResults.map((post, index) => (
                  <div
                    onClick={() => {
                      setSearchResults('');
                      setSearshedKeyWord('');
                      setIsSearchTriggered(false);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('item', JSON.stringify(post));
                      }
                      router.push(`/post/${post?.id}`);
                    }}
                    key={index}
                    className="relative flex flex-col border w-full border-three items-start justify-start bg-three hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <SmallItem post={post} index={index} show={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* أزرار التنقل بين الصفحات */}
            <NavegationPages
              hasMore={hasMore}
              setPageNumber={setPageNumber}
              pageNumber={pageNumber}
            />
          </div>
        ) : (
          isSearchTriggered &&
          searchResults?.length === 0 &&
          totalCount === 0 && (
            <div className="w-full text-white pb-32 h-screen overflow-y-auto bg-white backdrop-blur-lg">
              <div className="mt-8 p-4">
                <h1 className="sm:text-lg font-semibold text-center text-black">
                  لم يتم العثور على نتائج مطابقة للبحث.
                </h1>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
