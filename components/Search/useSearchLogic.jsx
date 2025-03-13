// import { useState, useEffect, useRef, useContext } from 'react';
// import { useParams } from 'next/navigation';
// import { inputsContext } from '../authContext/Context';
// import { useCallback } from 'react';

// export const useSearchLogic = () => {
//   const [searchResults, setSearchResults] = useState([]);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSearchTriggered, setIsSearchTriggered] = useState(false);
//   const [totalCount, setTotalCount] = useState(0);
//   const [hasMore, setHasMore] = useState(false);
//   const [rerender, setRerender] = useState(false);
//   const { data, dispatch } = useContext(inputsContext);
//   const { id } = useParams();
//   const searchDataRef = useRef();

//   const [searchData, setSearchData] = useState({
//     categoryId: '',
//     searchedKeyword: '',
//     city: data?.propertyCity || '',
//     town: data?.propertyTown || '',
//     minPrice: '',
//     maxPrice: '',
//     details: {},
//   });

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const category = JSON?.parse(localStorage.getItem('category'));
//       setRerender(true);
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

//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       const hasFilters =
//         Object.keys(searchDataRef.current.details).length > 0 ||
//         searchDataRef.current.city ||
//         searchDataRef.current.town ||
//         searchDataRef.current.minPrice ||
//         searchDataRef.current.maxPrice;

//       if (hasFilters && searchDataRef.current.searchedKeyword === '') {
//         setIsSearchTriggered(true);
//         setPageNumber(1);
//       }
//     }, 500);

//     return () => clearTimeout(delaySearch);
//   }, [
//     searchData.city,
//     searchData.town,
//     searchData.minPrice,
//     searchData.maxPrice,
//     searchData.details,
//   ]);

//   useEffect(() => {
//     if (isSearchTriggered || pageNumber > 0) {
//       handleSearch();
//     }
//   }, [id, isSearchTriggered, pageNumber]);

//   const handleSearch = useCallback(async () => {
//     if (!isSearchTriggered && pageNumber === 0) return;

//     setIsLoading(true);
//     setSearchResults([]);

//     try {
//       const response = await fetch('/api/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...searchDataRef.current,
//           page: pageNumber,
//         }),
//       });

//       const json = await response.json();

//       if (response.ok) {
//         setSearchResults(json.data);
//         setTotalCount(json.totalCount);
//         setHasMore(json.hasMore);
//       }
//     } catch (error) {
//       console.error('حدث خطأ:', error);
//     } finally {
//       setIsLoading(false);
//       setIsSearchTriggered(false);
//     }
//   }, [isSearchTriggered, pageNumber]);

//   const handleSearchButtonClick = () => {
//     setIsSearchTriggered(true);
//     setPageNumber(1);
//   };

//   const resetFilters = () => {
//     setSearchData({
//       categoryId: '',
//       searchedKeyword: '',
//       city: '',
//       town: '',
//       minPrice: '',
//       maxPrice: '',
//       details: {},
//     });
//     setPageNumber(0);
//     setSearchResults([]);
//     setIsSearchTriggered(false);
//     dispatch({ type: 'PROPERTY_CITY', payload: { propertyCity: '' } });
//     dispatch({ type: 'PROPERTY_TOWN', payload: { propertyTown: '' } });
//   };

//   return {
//     searchData,
//     setSearchData,
//     searchResults,
//     isLoading,
//     isSearchTriggered,
//     totalCount,
//     hasMore,
//     pageNumber,
//     setPageNumber,
//     handleSearchButtonClick,
//     resetFilters,
//     rerender,
//   };
// };
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { inputsContext } from '../authContext/Context';

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
      const category = JSON.parse(localStorage.getItem('category') || '{}');
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
