import { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'next/navigation';
import { inputsContext } from '../Context';

export const useSearchLogic = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { data, dispatch } = useContext(inputsContext);
  const { id } = useParams();
  const searchDataRef = useRef();

  const [searchData, setSearchData] = useState({
    category: id || '',
    searchedKeyword: '',
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    minPrice: '',
    maxPrice: '',
    details: {},
  });

  useEffect(() => {
    searchDataRef.current = searchData;
  }, [searchData]);

  useEffect(() => {
    setSearchData((prev) => ({
      ...prev,
      category: id || '',
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [id, data]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      const hasFilters =
        Object.keys(searchDataRef.current.details).length > 0 ||
        searchDataRef.current.city ||
        searchDataRef.current.town ||
        searchDataRef.current.minPrice ||
        searchDataRef.current.maxPrice;

      if (hasFilters && searchDataRef.current.searchedKeyword === '') {
        setIsSearchTriggered(true);
        setPageNumber(1);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [
    searchData.city,
    searchData.town,
    searchData.minPrice,
    searchData.maxPrice,
    searchData.details,
  ]);

  useEffect(() => {
    if (isSearchTriggered || pageNumber) {
      handleSearch();
    }
  }, [isSearchTriggered, pageNumber]);

  const handleSearch = async () => {
    setIsLoading(true);
    console.log('تم استدعاء الدالة');
    try {
      const response = await fetch('/api/searchOne', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...searchDataRef.current,
          page: pageNumber,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setSearchResults(json.data);
        setTotalCount(json.totalCount);
        setHasMore(json.hasMore);
      }
    } catch (error) {
      console.error('حدث خطأ:', error);
    } finally {
      setIsLoading(false);
      setIsSearchTriggered(false);
    }
  };

  const handleSearchButtonClick = () => {
    setIsSearchTriggered(true);
    setPageNumber(1);
  };

  const resetFilters = () => {
    setSearchData({
      category: id || '',
      searchedKeyword: '',
      city: '',
      town: '',
      minPrice: '',
      maxPrice: '',
      details: {},
    });
    setPageNumber(0);
    setSearchResults([]);
    setIsSearchTriggered(false);
    dispatch({ type: 'PROPERTY_CITY', payload: { propertyCity: '' } });
    dispatch({ type: 'PROPERTY_TOWN', payload: { propertyTown: '' } });
  };

  return {
    searchData,
    setSearchData,
    searchResults,
    isLoading,
    isSearchTriggered,
    totalCount,
    hasMore,
    pageNumber,
    setPageNumber,
    handleSearchButtonClick,
    resetFilters,
  };
};
