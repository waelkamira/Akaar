'use client';
import React, { useContext, useEffect, useState } from 'react';
import SearchInput from './SearchInput';
import Filters from './Filters';
import SearchResults from './SearchResults';
import { useParams } from 'next/navigation';
import { inputsContext } from '../Context';
export default function ParentComponent() {
  const [searchResults, setSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [rerender, setRerender] = useState(false);
  const { data, dispatch } = useContext(inputsContext);
  const { id } = useParams();
  console.log('params', id);
  const [searchData, setSearchData] = useState({
    category: id,
    searchedKeyword: '',
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    minPrice: '',
    maxPrice: '',
    details: {},
  });

  useEffect(() => {
    setSearchData((prev) => ({
      ...prev,
      category: id,
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [id, data]);

  useEffect(() => {
    if (isSearchTriggered) {
      console.log('تم اعادة التصيير');
      handleSearch();
    }
  }, [pageNumber, isSearchTriggered]);

  // دالة البحث العامة
  const handleSearch = async () => {
    setIsLoading(true);
    setIsSearchTriggered(true);

    // إعادة تعيين النتائج إذا كانت هذه هي الصفحة الأولى حتى يتم عرض النتائج الجديدة في كل مرة يتم فيها الضغط على بحث
    if (pageNumber === 1) {
      setSearchResults([]);
    }

    try {
      console.log('searchData قبل الإرسال:', searchData);

      const response = await fetch('/api/searchOne', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...searchData, page: pageNumber }),
      });

      const json = await response.json();

      if (response.ok) {
        if (pageNumber === 1) {
          setSearchResults(json?.data); // تعيين النتائج الجديدة
        } else {
          setSearchResults((prevResults) => [...prevResults, ...json?.data]); // إضافة النتائج الجديدة إلى النتائج الحالية
        }

        setTotalCount(json.totalCount);
        setHasMore(json.hasMore);
        console.log('json', json);
      }
    } catch (error) {
      console.error('حدث خطأ أثناء الإرسال:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة إعادة تعيين الفلاتر
  const resetFilters = () => {
    setRerender(!rerender);

    setSearchData({
      category: id,
      searchedKeyword: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      details: {},
    });
    setPageNumber(1);
    setSearchResults([]);
    setIsSearchTriggered(false);
    dispatch({
      type: 'PROPERTY_CITY',
      payload: {
        propertyCity: '',
      },
    });
    dispatch({
      type: 'PROPERTY_TOWN',
      payload: {
        propertyTown: '',
      },
    });
  };

  return (
    <div className="w-full">
      {/* شريط البحث */}
      <SearchInput
        searchData={searchData}
        setSearchData={setSearchData}
        onSearch={handleSearch}
      />

      {/* الفلاتر */}
      <Filters
        searchData={searchData}
        setSearchData={setSearchData}
        onSearch={handleSearch}
        onReset={resetFilters}
        rerender={rerender}
      />

      {/* نتائج البحث */}
      <SearchResults
        results={searchResults}
        isLoading={isLoading}
        isSearchTriggered={isSearchTriggered}
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={() => handleSearch(2)} // مثال لتحميل المزيد
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        resetFilters={resetFilters}
      />
    </div>
  );
}
