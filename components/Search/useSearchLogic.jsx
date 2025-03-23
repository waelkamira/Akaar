'use client';
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { inputsContext } from '../authContext/Context';
import { BsFillHouseFill } from 'react-icons/bs';

export const useSearchLogic = () => {
  const initialSearchState = {
    categoryId: '',
    searchedKeyword: '',
    city: '',
    town: '',
    minPrice: '',
    maxPrice: '',
    details: {},
  };

  const [searchState, setSearchState] = useState({
    results: [],
    pageNumber: 0,
    isLoading: false,
    isSearchTriggered: false,
    totalCount: 0,
    hasMore: false,
  });

  const [searchData, setSearchData] = useState(initialSearchState);
  const searchDataRef = useRef(searchData);
  const { data, dispatch } = useContext(inputsContext);
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // استرجاع القيمة من local storage
      const storedCategory = localStorage.getItem('category');

      // تحديد القيمة الافتراضية هنا
      const defaultValue = {
        id: 1,
        name: 'عقارات',
        path: '/categories/1?category=عقارات',
        icon: <BsFillHouseFill className="text-2xl" />,
      };

      let category;
      if (storedCategory) {
        try {
          category = JSON.parse(storedCategory);
        } catch (error) {
          console.error('Failed to parse category from localStorage', error);
          category = defaultValue; // استخدم القيمة الافتراضية في حالة حدوث خطأ
        }
      } else {
        category = defaultValue; // استخدم القيمة الافتراضية إذا كانت القيمة فارغة
      }

      setSearchData((prev) => ({
        ...prev,
        categoryId: category?.id || '',
        city: data?.propertyCity || '',
        town: data?.propertyTown || '',
      }));
    }
  }, [id, data]);

  useEffect(() => {
    searchDataRef.current = searchData;
  }, [searchData]);

  const checkFilters = useCallback(() => {
    const { details, city, town, minPrice, maxPrice } = searchDataRef.current;
    return (
      Object.keys(details).length > 0 || city || town || minPrice || maxPrice
    );
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (checkFilters() && !searchDataRef.current.searchedKeyword) {
        setSearchState((prev) => ({
          ...prev,
          isSearchTriggered: true,
          pageNumber: 1,
        }));
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchData, checkFilters]);

  const handleSearch = useCallback(async () => {
    if (!searchState.isSearchTriggered && searchState.pageNumber === 0) return;

    setSearchState((prev) => ({ ...prev, isLoading: true, results: [] }));

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchDataRef.current,
          page: searchState.pageNumber,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setSearchState((prev) => ({
          ...prev,
          results: json.data,
          totalCount: json.totalCount,
          hasMore: json.hasMore,
        }));
      }
    } catch (error) {
      console.error('خطأ في البحث:', error);
    } finally {
      setSearchState((prev) => ({
        ...prev,
        isLoading: false,
        isSearchTriggered: false,
      }));
    }
  }, [searchState.isSearchTriggered, searchState.pageNumber]);

  useEffect(() => {
    if (searchState.isSearchTriggered || searchState.pageNumber > 0) {
      handleSearch();
    }
  }, [id, searchState.isSearchTriggered, searchState.pageNumber, handleSearch]);

  const handleSearchButtonClick = () => {
    setSearchState((prev) => ({
      ...prev,
      isSearchTriggered: true,
      pageNumber: 1,
    }));
  };

  const resetFilters = () => {
    setSearchData(initialSearchState);
    setSearchState((prev) => ({
      ...prev,
      pageNumber: 0,
      results: [],
      isSearchTriggered: false,
    }));
    dispatch({ type: 'PROPERTY_CITY', payload: { propertyCity: '' } });
    dispatch({ type: 'PROPERTY_TOWN', payload: { propertyTown: '' } });
  };

  return {
    searchData,
    setSearchData,
    searchResults: searchState.results,
    isLoading: searchState.isLoading,
    isSearchTriggered: searchState.isSearchTriggered,
    totalCount: searchState.totalCount,
    hasMore: searchState.hasMore,
    pageNumber: searchState.pageNumber,
    setPageNumber: (page) =>
      setSearchState((prev) => ({ ...prev, pageNumber: page })),
    handleSearchButtonClick,
    resetFilters,
  };
};
useSearchLogic.js;
useSearchLogic.js;

// 'use client';
// import { useState, useEffect, useRef, useContext, useCallback } from 'react';
// import { useParams } from 'next/navigation';
// import { inputsContext } from '../authContext/Context';
// import { BsFillHouseFill } from 'react-icons/bs';

// export const useSearchLogic = () => {
//   const initialSearchState = {
//     categoryId: '',
//     searchedKeyword: '',
//     city: '',
//     town: '',
//     minPrice: '',
//     maxPrice: '',
//     details: {},
//   };

//   const [searchState, setSearchState] = useState({
//     results: [],
//     pageNumber: 0,
//     isLoading: false,
//     isSearchTriggered: false,
//     totalCount: 0,
//     hasMore: false,
//   });

//   const [searchData, setSearchData] = useState(initialSearchState);
//   const searchDataRef = useRef(searchData);
//   const { data, dispatch } = useContext(inputsContext);
//   const { id } = useParams();

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // استرجاع القيمة من local storage
//       const storedCategory = localStorage.getItem('category');

//       // تحديد القيمة الافتراضية هنا
//       const defaultValue = {
//         id: 1,
//         name: 'عقارات',
//         path: '/categories/1?category=عقارات',
//         icon: <BsFillHouseFill className="text-2xl" />,
//       };

//       let category;
//       if (storedCategory) {
//         try {
//           category = JSON.parse(storedCategory);
//         } catch (error) {
//           console.error('Failed to parse category from localStorage', error);
//           category = defaultValue; // استخدم القيمة الافتراضية في حالة حدوث خطأ
//         }
//       } else {
//         category = defaultValue; // استخدم القيمة الافتراضية إذا كانت القيمة فارغة
//       }

//       setSearchData((prev) => ({
//         ...prev,
//         categoryId: category?.id || '',
//         city: data?.propertyCity || '',
//         town: data?.propertyTown || '',
//       }));
//     }
//   }, [id, data]);

//   useEffect(() => {
//     searchDataRef.current = searchData;
//   }, [searchData]);

//   const checkFilters = useCallback(() => {
//     const { details, city, town, minPrice, maxPrice } = searchDataRef.current;
//     return (
//       Object.keys(details).length > 0 || city || town || minPrice || maxPrice
//     );
//   }, []);

//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (checkFilters() && !searchDataRef.current.searchedKeyword) {
//         setSearchState((prev) => ({
//           ...prev,
//           isSearchTriggered: true,
//           pageNumber: 1,
//         }));
//       }
//     }, 500);

//     return () => clearTimeout(delaySearch);
//   }, [searchData, checkFilters]);

//   const handleSearch = useCallback(async () => {
//     if (!searchState.isSearchTriggered && searchState.pageNumber === 0) return;

//     setSearchState((prev) => ({ ...prev, isLoading: true, results: [] }));

//     try {
//       const response = await fetch('/api/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...searchDataRef.current,
//           page: searchState.pageNumber,
//         }),
//       });

//       const json = await response.json();

//       if (response.ok) {
//         setSearchState((prev) => ({
//           ...prev,
//           results: json.data,
//           totalCount: json.totalCount,
//           hasMore: json.hasMore,
//         }));
//       }
//     } catch (error) {
//       console.error('خطأ في البحث:', error);
//     } finally {
//       setSearchState((prev) => ({
//         ...prev,
//         isLoading: false,
//         isSearchTriggered: false,
//       }));
//     }
//   }, [searchState.isSearchTriggered, searchState.pageNumber]);

//   useEffect(() => {
//     if (searchState.isSearchTriggered || searchState.pageNumber > 0) {
//       handleSearch();
//     }
//   }, [id, searchState.isSearchTriggered, searchState.pageNumber, handleSearch]);

//   const handleSearchButtonClick = () => {
//     setSearchState((prev) => ({
//       ...prev,
//       isSearchTriggered: true,
//       pageNumber: 1,
//     }));
//   };

//   const resetFilters = useCallback(() => {
//     // استرجاع القيمة من local storage
//     if (typeof window !== 'undefined') {
//       const storedCategory = localStorage.getItem('category');

//       // تحديد القيمة الافتراضية هنا
//       const defaultValue = {
//         id: 1,
//         name: 'عقارات',
//         path: '/categories/1?category=عقارات',
//         icon: <BsFillHouseFill className="text-2xl" />,
//       };

//       let category;
//       if (storedCategory) {
//         try {
//           category = JSON.parse(storedCategory);
//         } catch (error) {
//           console.error('Failed to parse category from localStorage', error);
//           category = defaultValue; // استخدم القيمة الافتراضية في حالة حدوث خطأ
//         }
//       } else {
//         category = defaultValue; // استخدم القيمة الافتراضية إذا كانت القيمة فارغة
//       }

//       setSearchData({
//         ...initialSearchState,
//         categoryId: category?.id || '',
//       });
//     }
//   }, [initialSearchState]);

//   useEffect(() => {
//     setSearchState((prev) => ({
//       ...prev,
//       pageNumber: 0,
//       results: [],
//       isSearchTriggered: false,
//     }));

//     dispatch({ type: 'PROPERTY_CITY', payload: { propertyCity: '' } });
//     dispatch({ type: 'PROPERTY_TOWN', payload: { propertyTown: '' } });
//   }, [dispatch, initialSearchState]);

//   return {
//     searchData,
//     setSearchData,
//     searchResults: searchState.results,
//     isLoading: searchState.isLoading,
//     isSearchTriggered: searchState.isSearchTriggered,
//     totalCount: searchState.totalCount,
//     hasMore: searchState.hasMore,
//     pageNumber: searchState.pageNumber,
//     setPageNumber: (page) =>
//       setSearchState((prev) => ({ ...prev, pageNumber: page })),
//     handleSearchButtonClick,
//     resetFilters,
//   };
// };
