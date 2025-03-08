// 'use client';
// import React, { useState, useEffect, useContext } from 'react';
// import CitySelector from '../Selectors/CitySelector';
// import { inputsContext } from '../Context';
// import SearchControls from './SearchControls';
// import PriceInput from './PriceInput';
// import DynamicField from './DynamicField';
// import SearchResults from './SearchResults'; // استيراد مكون عرض النتائج
// import CategoriesNavBar from '../navbars/CategoriesNavBar';
// import { useParams, useSearchParams } from 'next/navigation';

// export default function CategoriesProductsSearchBar({
//   showSearch,
//   setShowSearch,
// }) {
//   const [pageNumber, setPageNumber] = useState(1);
//   const [categoryAds, setCategoryAds] = useState([]);
//   const { data, dispatch } = useContext(inputsContext);
//   const [fields, setFields] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalCount, setTotalCount] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [isSearchTriggered, setIsSearchTriggered] = useState(false); // حالة جديدة لتتبع الضغط على زر البحث
//   const searchParams = useSearchParams();
//   const category = searchParams.get('category'); // استخراج قيمة "category"
//   const id = searchParams.get('id'); // استخراج قيمة "category"
//   // console.log('category', category);
//   const [searchData, setSearchData] = useState({
//     category: id,
//     city: data?.propertyCity || '',
//     town: data?.propertyTown || '',
//     minPrice: '',
//     maxPrice: '',
//     details: {},
//   });

//   const [selectedValues, setSelectedValues] = useState({});

//   const handleChange = (name, value) => {
//     setSelectedValues((prev) => ({ ...prev, [name]: value }));
//     handleDetailsChange(name, value);
//   };

//   useEffect(() => {
//     setSearchData((prev) => ({
//       ...prev,
//       category: id,
//       city: data?.propertyCity || '',
//       town: data?.propertyTown || '',
//     }));
//   }, [category, data]);

//   useEffect(() => {
//     if (category) {
//       setLoading(true);
//       setError(null);

//       import(`../categoryFields/${category}.jsx`)
//         .then((module) => {
//           setFields(module.default);
//           setLoading(false);
//         })
//         .catch((err) => {
//           console.error('Failed to load fields:', err);
//           setError('فشل في تحميل الحقول');
//           setLoading(false);
//         });
//     }
//   }, [category]);

//   useEffect(() => {
//     if (isSearchTriggered) {
//       fetchCategoryAds();
//     }
//   }, [pageNumber, isSearchTriggered]);

//   const fetchCategoryAds = async () => {
//     try {
//       const response = await fetch('/api/products/search', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ page: pageNumber, ...searchData }),
//       });

//       if (response.ok) {
//         const json = await response.json();
//         setTotalCount(json?.totalCount);
//         console.log('totalCount', totalCount);
//         console.log('hasMore', hasMore);
//         setCategoryAds((prevResults) => [...prevResults, ...json?.data]);
//         setHasMore(json?.hasMore);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       setCategoryAds([]);
//     }
//   };

//   const handleSearch = () => {
//     setPageNumber(1);
//     setIsSearchTriggered(true);
//     setCategoryAds([]); // إعادة تعيين النتائج قبل إجراء البحث الجديد
//     fetchCategoryAds();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDetailsChange = (field, value) => {
//     setSearchData((prev) => ({
//       ...prev,
//       details: { ...prev.details, [field]: value },
//     }));
//   };

//   const resetFilters = () => {
//     dispatch({
//       type: 'PROPERTY_CITY',
//       payload: {
//         propertyCity: '',
//       },
//     });
//     dispatch({
//       type: 'PROPERTY_TOWN',
//       payload: {
//         propertyTown: '',
//       },
//     });

//     setSearchData({
//       category: id,
//       city: '',
//       town: '',
//       minPrice: '',
//       maxPrice: '',
//       details: {},
//     });
//     setSelectedValues({});
//     setCategoryAds([]); // إعادة تعيين نتائج البحث
//     setIsSearchTriggered(false); // إعادة تعيين حالة البحث
//   };

//   return (
//     <>
//       {' '}
//       {/* زر فلاتر البحث */}
//       <div className={`p-2 bg-three`}>
//         <button
//           className="hidden xl:flex justify-center items-center rounded-[5px] sm:text-lg text-sm bg-one text-white h-12 w-full transition-transform"
//           onClick={() => setShowSearch(!showSearch)}
//         >
//           {showSearch ? 'إخفاء فلاتر البحث' : 'عرض فلاتر البحث'}
//         </button>
//       </div>
//       {showSearch && (
//         <div className="flex flex-col justify-center items-center w-full rounded-b text-black z-0">
//           {/* الحقول والازرار */}
//           <div className="flex flex-col-reverse xl:flex-row justify-center items-center w-full bg-three shadow-sm shadow-gray-300 py-2 pt-0">
//             <SearchControls onSearch={handleSearch} onReset={resetFilters} />
//             <div className="flex flex-col justify-center items-center gap-2 w-full">
//               <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2 text-white">
//                 <CategoriesNavBar />
//                 <CitySelector />

//                 <PriceInput
//                   label="أدنى سعر"
//                   name="minPrice"
//                   value={searchData.minPrice}
//                   onChange={handleInputChange}
//                 />
//                 <PriceInput
//                   label="أعلى سعر"
//                   name="maxPrice"
//                   value={searchData.maxPrice}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="flex flex-col xl:flex-row items-center justify-center gap-2 w-full px-2">
//                 {loading && <p>جاري التحميل...</p>}
//                 {error && <p className="text-red-500">{error}</p>}
//                 {!loading &&
//                   !error &&
//                   fields?.map((field, index) => (
//                     <DynamicField
//                       key={index}
//                       field={field}
//                       value={selectedValues[field.name]}
//                       onChange={handleChange}
//                     />
//                   ))}
//               </div>
//             </div>
//           </div>

//           {/* عرض نتائج البحث */}
//           <SearchResults
//             results={categoryAds}
//             hasMore={hasMore}
//             isSearchTriggered={isSearchTriggered}
//             totalCount={totalCount}
//             setPageNumber={setPageNumber}
//             pageNumber={pageNumber}
//           />
//         </div>
//       )}
//     </>
//   );
// }
