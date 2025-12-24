// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { useSearch } from '../../contexts/SearchContext';
// import { Slider } from '../ui/slider';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function StaticFilters() {
//   const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();

//   const priceRangeDefault = {
//     min: 0,
//     max: 1000,
//   };

//   const [priceRange, setPriceRange] = useState([
//     filters.priceMin || priceRangeDefault.min,
//     filters.priceMax || priceRangeDefault.max,
//   ]);

//   const [inputValues, setInputValues] = useState({
//     min: filters.priceMin || '',
//     max: filters.priceMax || '',
//   });

//   useEffect(() => {
//     setPriceRange([
//       filters.priceMin || priceRangeDefault.min,
//       filters.priceMax || priceRangeDefault.max,
//     ]);
//     setInputValues({
//       min: filters.priceMin || '',
//       max: filters.priceMax || '',
//     });
//   }, [filters.priceMin, filters.priceMax]);

//   const availableTowns = getTownsByCity(filters.city || null);

//   const handleCityChange = useCallback(
//     (e) => {
//       const cityName = e.target.value;
//       setFilter('city', cityName || null);
//     },
//     [setFilter]
//   );

//   const handleTownChange = useCallback(
//     (e) => {
//       const townName = e.target.value;
//       setFilter('town', townName || null);
//     },
//     [setFilter]
//   );

//   const handlePriceInputChange = (type, value) => {
//     setInputValues((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   const applyPriceFilter = useCallback(() => {
//     let minPrice = parseInt(inputValues.min) || priceRangeDefault.min;
//     let maxPrice = parseInt(inputValues.max) || priceRangeDefault.max;

//     if (minPrice > maxPrice) {
//       [minPrice, maxPrice] = [maxPrice, minPrice];
//     }

//     minPrice = Math.max(
//       priceRangeDefault.min,
//       Math.min(minPrice, priceRangeDefault.max)
//     );
//     maxPrice = Math.max(
//       priceRangeDefault.min,
//       Math.min(maxPrice, priceRangeDefault.max)
//     );

//     setPriceRange([minPrice, maxPrice]);
//     setInputValues({
//       min: minPrice.toString(),
//       max: maxPrice.toString(),
//     });

//     setFilter('priceMin', minPrice);
//     setFilter('priceMax', maxPrice);
//   }, [inputValues, setFilter]);

//   const handleInputBlur = () => {
//     applyPriceFilter();
//   };

//   const handlePriceRangeChange = useCallback(
//     (values) => {
//       setPriceRange(values);
//       setInputValues({
//         min: values[0].toString(),
//         max: values[1].toString(),
//       });
//       setFilter('priceMin', values[0]);
//       setFilter('priceMax', values[1]);
//     },
//     [setFilter]
//   );

//   const handlePriceInputBlur = useCallback(() => {
//     const min = parseInt(inputValues.min) || priceRangeDefault.min;
//     const max = parseInt(inputValues.max) || priceRangeDefault.max;

//     setPriceRange([min, max]);
//     setFilter('priceMin', min);
//     setFilter('priceMax', max);
//   }, [inputValues, setFilter]);

//   const handleAdTypeChange = useCallback(
//     (e) => {
//       const value = parseInt(e.target.value) || null;
//       setFilter('adType', value);
//     },
//     [setFilter]
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-white shadow-sm p-4 space-y-6 border border-gray-100 rounded-lg"
//     >
//       <div className="space-y-6">
//         {/* City Filter */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//         >
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             <span className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-primary"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               المدينة
//             </span>
//           </label>
//           <select
//             value={filters.city || ''}
//             onChange={handleCityChange}
//             className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100"
//           >
//             <option value="">اختر المدينة</option>
//             {staticFilters.cities.map((city) => (
//               <option key={city.name} value={city.name}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//         </motion.div>

//         {/* Town Filter */}
//         <AnimatePresence>
//           {filters.city && availableTowns.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <span className="flex items-center gap-1">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 text-primary"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   المنطقة
//                 </span>
//               </label>
//               <select
//                 value={filters.town || ''}
//                 onChange={handleTownChange}
//                 className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100"
//               >
//                 <option value="">اختر المنطقة</option>
//                 {availableTowns.map((town) => (
//                   <option key={town.name} value={town.name}>
//                     {town.name}
//                   </option>
//                 ))}
//               </select>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Price Range Filter */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.2 }}
//         >
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             <span className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4 text-primary"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               نطاق السعر
//             </span>
//           </label>

//           <div className="flex flex-col items-center gap-1 mb-4 w-full">
//             <motion.div whileHover={{ scale: 1.02 }} className="flex-1 w-full">
//               <input
//                 type="number"
//                 min={priceRangeDefault.min}
//                 max={priceRangeDefault.max}
//                 value={inputValues.min}
//                 onChange={(e) => handlePriceInputChange('min', e.target.value)}
//                 onBlur={handleInputBlur}
//                 placeholder="أقل سعر"
//                 className="w-full rounded-lg border-gray-200 placeholder:text-sm shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-center"
//               />
//             </motion.div>

//             <span className="text-gray-400">-</span>

//             <motion.div whileHover={{ scale: 1.02 }} className="flex-1 w-full">
//               <input
//                 type="number"
//                 min={priceRangeDefault.min}
//                 max={priceRangeDefault.max}
//                 value={inputValues.max}
//                 onChange={(e) => handlePriceInputChange('max', e.target.value)}
//                 onBlur={handleInputBlur}
//                 placeholder="أعلى سعر"
//                 className="w-full rounded-lg border-gray-200 placeholder:text-sm shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-center"
//               />
//             </motion.div>
//           </div>

//           {/* <div className="px-2 mb-1">
//             <Slider
//               value={priceRange}
//               min={priceRangeDefault.min}
//               max={priceRangeDefault.max}
//               step={100}
//               onValueChange={handlePriceRangeChange}
//               onValueCommit={handlePriceInputBlur}
//               className="relative flex items-center h-8 w-full"
//               thumbClassName="
//     absolute w-6 h-6
//     bg-white border-3 border-primary-500
//     rounded-full shadow-lg
//     focus:outline-none focus:ring-2 focus:ring-primary-300
//     hover:scale-110 transition-transform duration-150
//     cursor-pointer
//     z-10
//   "
//               trackClassName="
//     absolute h-2.5 w-full
//     bg-gray-200 rounded-full
//     overflow-hidden
//   "
//               rangeClassName="
//     absolute h-full

//   "
//             />
//           </div> */}
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { motion } from 'framer-motion';

export default function StaticFilters() {
  const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();

  // حالة محلية للتعامل مع hydration
  const [isMounted, setIsMounted] = useState(false);
  const [inputValues, setInputValues] = useState({
    min: '',
    max: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تهيئة القيم بعد التأكد من mounting (حل مشكلة hydration)
  useEffect(() => {
    if (isMounted) {
      setInputValues({
        min:
          filters.priceMin !== null && filters.priceMin !== undefined
            ? filters.priceMin.toString()
            : '',
        max:
          filters.priceMax !== null && filters.priceMax !== undefined
            ? filters.priceMax.toString()
            : '',
      });
    }
  }, [filters.priceMin, filters.priceMax, isMounted]);

  const availableTowns = getTownsByCity(filters.city || null);

  const handleCityChange = useCallback(
    (e) => {
      const cityName = e.target.value;
      setFilter('city', cityName || null);
    },
    [setFilter]
  );

  const handleTownChange = useCallback(
    (e) => {
      const townName = e.target.value;
      setFilter('town', townName || null);
    },
    [setFilter]
  );

  const handlePriceInputChange = (type, value) => {
    // السماح بأي قيمة رقمية أو فارغة
    if (value === '' || /^\d*$/.test(value)) {
      setInputValues((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const applyPriceFilter = useCallback(() => {
    let minPrice = inputValues.min === '' ? null : parseInt(inputValues.min);
    let maxPrice = inputValues.max === '' ? null : parseInt(inputValues.max);

    // التحقق من صحة الأرقام
    if (minPrice !== null && isNaN(minPrice)) minPrice = null;
    if (maxPrice !== null && isNaN(maxPrice)) maxPrice = null;

    // التأكد من أن الحد الأدنى لا يتجاوز الحد الأقصى إذا كان كلاهما موجودين
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    setFilter('priceMin', minPrice);
    setFilter('priceMax', maxPrice);

    // تحديث حقول الإدخال بالقيم المصححة
    setInputValues({
      min: minPrice !== null ? minPrice.toString() : '',
      max: maxPrice !== null ? maxPrice.toString() : '',
    });
  }, [inputValues, setFilter]);

  const handlePriceInputBlur = useCallback(() => {
    applyPriceFilter();
  }, [applyPriceFilter]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyPriceFilter();
    }
  };

  // تجنب عرض المحتوى حتى يتم mounting لتجنب hydration errors
  if (!isMounted) {
    return (
      <div className="bg-white shadow-sm p-4 space-y-6 border border-gray-100 rounded-lg">
        <div className="space-y-6">
          {/* عناصر تحميل مؤقتة */}
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm p-4 space-y-6 border border-gray-100 rounded-lg"
    >
      <div className="space-y-6">
        {/* City Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              المدينة
            </span>
          </label>
          <select
            value={filters.city || ''}
            onChange={handleCityChange}
            className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100"
          >
            <option value="">اختر المدينة</option>
            {staticFilters.cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Town Filter */}
        {filters.city && availableTowns.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                المنطقة
              </span>
            </label>
            <select
              value={filters.town || ''}
              onChange={handleTownChange}
              className="w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-gray-50 hover:bg-gray-100"
            >
              <option value="">اختر المنطقة</option>
              {availableTowns.map((town) => (
                <option key={town.name} value={town.name}>
                  {town.name}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Price Filter - بدون range */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              نطاق السعر
            </span>
          </label>

          {/* Price Inputs فقط - بدون slider */}
          <div className="flex flex-col gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                أدنى سعر
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputValues.min}
                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                onBlur={handlePriceInputBlur}
                onKeyPress={handleKeyPress}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">
                أعلى سعر
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={inputValues.max}
                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                onBlur={handlePriceInputBlur}
                onKeyPress={handleKeyPress}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                placeholder="0"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
