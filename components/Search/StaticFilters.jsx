
// 'use client';
// import { useState, useCallback } from 'react';
// import { useSearch } from '@/features/search/search-context';
// import { motion } from 'framer-motion';

// export default function StaticFilters() {
//   const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();

//   const [inputValues, setInputValues] = useState({
//     min: null,
//     max: null,
//   });

//   const committedMin = filters.priceMin?.toString() ?? '';
//   const committedMax = filters.priceMax?.toString() ?? '';
//   const minInput =
//     inputValues.min?.committed === committedMin
//       ? inputValues.min.value
//       : committedMin;
//   const maxInput =
//     inputValues.max?.committed === committedMax
//       ? inputValues.max.value
//       : committedMax;

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
//     // السماح بأي قيمة رقمية أو فارغة
//     if (value === '' || /^\d*$/.test(value)) {
//       setInputValues((prev) => ({
//         ...prev,
//         [type]: {
//           value,
//           committed: type === 'min' ? committedMin : committedMax,
//         },
//       }));
//     }
//   };

//   const applyPriceFilter = useCallback(() => {
//     let minPrice = minInput === '' ? null : Number.parseInt(minInput, 10);
//     let maxPrice = maxInput === '' ? null : Number.parseInt(maxInput, 10);

//     // التحقق من صحة الأرقام
//     if (minPrice !== null && isNaN(minPrice)) minPrice = null;
//     if (maxPrice !== null && isNaN(maxPrice)) maxPrice = null;

//     // التأكد من أن الحد الأدنى لا يتجاوز الحد الأقصى إذا كان كلاهما موجودين
//     if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
//       [minPrice, maxPrice] = [maxPrice, minPrice];
//     }

//     setFilter('priceMin', minPrice);
//     setFilter('priceMax', maxPrice);

//     // تحديث حقول الإدخال بالقيم المصححة
//     setInputValues({
//       min: {
//         value: minPrice !== null ? minPrice.toString() : '',
//         committed: minPrice !== null ? minPrice.toString() : '',
//       },
//       max: {
//         value: maxPrice !== null ? maxPrice.toString() : '',
//         committed: maxPrice !== null ? maxPrice.toString() : '',
//       },
//     });
//   }, [minInput, maxInput, setFilter]);

//   const handlePriceInputBlur = useCallback(() => {
//     applyPriceFilter();
//   }, [applyPriceFilter]);

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       applyPriceFilter();
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-ak-surface shadow-sm p-4 space-y-6 border border-ak-line rounded-lg"
//     >
//       <div className="space-y-6">
//         <div>
//           <label
//             htmlFor="search-sort"
//             className="mb-2 block text-sm font-medium text-ak-cream"
//           >
//             ترتيب النتائج
//           </label>
//           <select
//             id="search-sort"
//             value={filters.sortBy || 'newest'}
//             onChange={(event) => setFilter('sortBy', event.target.value)}
//             className="w-full rounded-lg border-ak-line bg-ak-canvas px-3 py-2 shadow-sm"
//           >
//             <option value="newest">الأحدث</option>
//             <option value="cheapest">الأقل سعرًا</option>
//             <option value="best_sellers">الأكثر طلبًا</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="search-rating"
//             className="mb-2 block text-sm font-medium text-ak-cream"
//           >
//             متوسط التقييم الأدنى
//           </label>
//           <select
//             id="search-rating"
//             value={filters.rating || ''}
//             onChange={(event) => setFilter('rating', event.target.value)}
//             className="w-full rounded-lg border-ak-line bg-ak-canvas px-3 py-2 shadow-sm"
//           >
//             <option value="">كل التقييمات</option>
//             {[5, 4, 3, 2, 1].map((rating) => (
//               <option key={rating} value={rating}>
//                 {rating} نجوم فأكثر
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="search-brand"
//             className="mb-2 block text-sm font-medium text-ak-cream"
//           >
//             الماركة
//           </label>
//           <input
//             id="search-brand"
//             type="search"
//             value={filters.brand || ''}
//             onChange={(event) => setFilter('brand', event.target.value)}
//             className="w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm"
//             placeholder="ابحث باسم الماركة"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="search-subcategory"
//             className="mb-2 block text-sm font-medium text-ak-cream"
//           >
//             الفئة الفرعية
//           </label>
//           <input
//             id="search-subcategory"
//             type="search"
//             value={filters.subCategory || ''}
//             onChange={(event) => setFilter('subCategory', event.target.value)}
//             className="w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm"
//             placeholder="ابحث بالفئة الفرعية"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="search-vendor"
//             className="mb-2 block text-sm font-medium text-ak-cream"
//           >
//             معرّف البائع
//           </label>
//           <input
//             id="search-vendor"
//             type="search"
//             value={filters.vendorId || ''}
//             onChange={(event) => setFilter('vendorId', event.target.value)}
//             className="w-full rounded-lg border border-ak-line bg-ak-canvas px-3 py-2 text-sm"
//             placeholder="معرّف حساب البائع"
//           />
//         </div>

//         {/* City Filter */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//         >
//           <label className="block text-sm font-medium text-ak-cream mb-2">
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
//             className="w-full rounded-lg border-ak-line shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-ak-canvas hover:bg-ak-brand-soft"
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
//         {filters.city && availableTowns.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//           >
//             <label className="block text-sm font-medium text-ak-cream mb-2">
//               <span className="flex items-center gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-4 w-4 text-primary"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 المنطقة
//               </span>
//             </label>
//             <select
//               value={filters.town || ''}
//               onChange={handleTownChange}
//               className="w-full rounded-lg border-ak-line shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 py-2 px-3 bg-ak-canvas hover:bg-ak-brand-soft"
//             >
//               <option value="">اختر المنطقة</option>
//               {availableTowns.map((town) => (
//                 <option key={town.name} value={town.name}>
//                   {town.name}
//                 </option>
//               ))}
//             </select>
//           </motion.div>
//         )}

//         {/* Price Filter - بدون range */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3, delay: 0.3 }}
//         >
//           <label className="block text-sm font-medium text-ak-cream mb-3">
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

//           {/* Price Inputs فقط - بدون slider */}
//           <div className="flex flex-col gap-3">
//             <div className="flex-1">
//               <label className="text-xs text-ak-muted mb-1 block">
//                 أدنى سعر
//               </label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 value={minInput}
//                 onChange={(e) => handlePriceInputChange('min', e.target.value)}
//                 onBlur={handlePriceInputBlur}
//                 onKeyPress={handleKeyPress}
//                 className="w-full rounded-lg border border-ak-line px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
//                 placeholder="0"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-ak-muted mb-1 block">
//                 أعلى سعر
//               </label>
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 value={maxInput}
//                 onChange={(e) => handlePriceInputChange('max', e.target.value)}
//                 onBlur={handlePriceInputBlur}
//                 onKeyPress={handleKeyPress}
//                 className="w-full rounded-lg border border-ak-line px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
//                 placeholder="0"
//               />
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// }
'use client';

import { useState, useCallback } from 'react';
import { useSearch } from '@/features/search/search-context';
import { motion } from 'framer-motion';
import { 
  FaSortAmountDown, 
  FaStar, 
  FaTag, 
  FaLayerGroup, 
  FaStore, 
  FaMapMarkerAlt, 
  FaMoneyBillWave 
} from 'react-icons/fa';

export default function StaticFilters() {
  const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();

  const [inputValues, setInputValues] = useState({
    min: null,
    max: null,
  });

  const committedMin = filters.priceMin?.toString() ?? '';
  const committedMax = filters.priceMax?.toString() ?? '';
  
  const minInput =
    inputValues.min?.committed === committedMin
      ? inputValues.min.value
      : committedMin;
      
  const maxInput =
    inputValues.max?.committed === committedMax
      ? inputValues.max.value
      : committedMax;

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
    if (value === '' || /^\d*$/.test(value)) {
      setInputValues((prev) => ({
        ...prev,
        [type]: {
          value,
          committed: type === 'min' ? committedMin : committedMax,
        },
      }));
    }
  };

  const applyPriceFilter = useCallback(() => {
    let minPrice = minInput === '' ? null : Number.parseInt(minInput, 10);
    let maxPrice = maxInput === '' ? null : Number.parseInt(maxInput, 10);

    if (minPrice !== null && isNaN(minPrice)) minPrice = null;
    if (maxPrice !== null && isNaN(maxPrice)) maxPrice = null;

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    setFilter('priceMin', minPrice);
    setFilter('priceMax', maxPrice);

    setInputValues({
      min: {
        value: minPrice !== null ? minPrice.toString() : '',
        committed: minPrice !== null ? minPrice.toString() : '',
      },
      max: {
        value: maxPrice !== null ? maxPrice.toString() : '',
        committed: maxPrice !== null ? maxPrice.toString() : '',
      },
    });
  }, [minInput, maxInput, setFilter]);

  const handlePriceInputBlur = useCallback(() => {
    applyPriceFilter();
  }, [applyPriceFilter]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyPriceFilter();
    }
  };

  // ✅ فئة موحدة لحقول الإدخال والقوائم لضمان التناسق
  const inputClass = "w-full rounded-xl border border-ak-line bg-ak-canvas px-4 py-2.5 text-sm text-ak-cream placeholder-stone-400 focus:border-ak-amber focus:ring-2 focus:ring-ak-amber/20 focus:bg-ak-canvas transition-all duration-300 outline-none";
  const labelClass = "flex items-center gap-2 text-sm font-medium text-stone-300 mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-ak-surface/90 backdrop-blur-xl border border-ak-line rounded-3xl p-6 shadow-xl shadow-black/20"
      dir="rtl"
    >
      <div className="space-y-6">
        
        {/* ==================== ترتيب النتائج ==================== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <label htmlFor="search-sort" className={labelClass}>
            <FaSortAmountDown className="text-ak-amber" />
            ترتيب النتائج
          </label>
          <select
            id="search-sort"
            value={filters.sortBy || 'newest'}
            onChange={(event) => setFilter('sortBy', event.target.value)}
            className={inputClass}
          >
            <option value="newest">الأحدث</option>
            <option value="cheapest">الأقل سعرًا</option>
            <option value="best_sellers">الأكثر طلباً</option>
          </select>
        </motion.div>

        {/* ==================== التقييم ==================== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <label htmlFor="search-rating" className={labelClass}>
            <FaStar className="text-ak-amber" />
            متوسط التقييم الأدنى
          </label>
          <select
            id="search-rating"
            value={filters.rating || ''}
            onChange={(event) => setFilter('rating', event.target.value)}
            className={inputClass}
          >
            <option value="">كل التقييمات</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} نجوم فأكثر
              </option>
            ))}
          </select>
        </motion.div>

        {/* ==================== الماركة والفئة والبائع ==================== */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label htmlFor="search-brand" className={labelClass}>
              <FaTag className="text-ak-amber" />
              الماركة
            </label>
            <input
              id="search-brand"
              type="search"
              value={filters.brand || ''}
              onChange={(event) => setFilter('brand', event.target.value)}
              className={inputClass}
              placeholder="ابحث باسم الماركة"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <label htmlFor="search-subcategory" className={labelClass}>
              <FaLayerGroup className="text-ak-amber" />
              الفئة الفرعية
            </label>
            <input
              id="search-subcategory"
              type="search"
              value={filters.subCategory || ''}
              onChange={(event) => setFilter('subCategory', event.target.value)}
              className={inputClass}
              placeholder="ابحث بالفئة الفرعية"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label htmlFor="search-vendor" className={labelClass}>
              <FaStore className="text-ak-amber" />
              معرّف البائع
            </label>
            <input
              id="search-vendor"
              type="search"
              value={filters.vendorId || ''}
              onChange={(event) => setFilter('vendorId', event.target.value)}
              className={inputClass}
              placeholder="معرّف حساب البائع"
            />
          </motion.div>
        </div>

        <div className="border-t border-ak-line/60 my-2" />

        {/* ==================== الموقع (المدينة والمنطقة) ==================== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <label className={labelClass}>
            <FaMapMarkerAlt className="text-ak-amber" />
            المدينة
          </label>
          <select
            value={filters.city || ''}
            onChange={handleCityChange}
            className={inputClass}
          >
            <option value="">اختر المدينة</option>
            {staticFilters.cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </motion.div>

        {filters.city && availableTowns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className={labelClass}>
              <FaMapMarkerAlt className="text-ak-amber/70" />
              المنطقة
            </label>
            <select
              value={filters.town || ''}
              onChange={handleTownChange}
              className={inputClass}
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

        <div className="border-t border-stone-200/60 my-2" />

        {/* ==================== نطاق السعر ==================== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <label className={labelClass}>
            <FaMoneyBillWave className="text-ak-amber" />
            نطاق السعر
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 mb-1.5 block font-medium">أدنى سعر</label>
              <input
                type="text"
                inputMode="numeric"
                value={minInput}
                onChange={(e) => handlePriceInputChange('min', e.target.value)}
                onBlur={handlePriceInputBlur}
                onKeyPress={handleKeyPress}
                className={inputClass}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1.5 block font-medium">أعلى سعر</label>
              <input
                type="text"
                inputMode="numeric"
                value={maxInput}
                onChange={(e) => handlePriceInputChange('max', e.target.value)}
                onBlur={handlePriceInputBlur}
                onKeyPress={handleKeyPress}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}