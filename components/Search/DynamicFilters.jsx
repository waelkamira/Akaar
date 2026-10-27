'use client';

import { useState, useCallback } from 'react';
import { useSearch } from '@/features/search/search-context';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSortAmountDown,
  FaStar,
  FaTag,
  FaLayerGroup,
  FaStore,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUndo,
  FaChevronDown,
} from 'react-icons/fa';

export default function StaticFilters() {
  const { filters, setFilter, staticFilters, getTownsByCity } = useSearch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      setFilter('city', e.target.value || null);
    },
    [setFilter],
  );

  const handleTownChange = useCallback(
    (e) => {
      setFilter('town', e.target.value || null);
    },
    [setFilter],
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

  const handlePriceInputBlur = useCallback(
    () => applyPriceFilter(),
    [applyPriceFilter],
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') applyPriceFilter();
  };

  const handleReset = () => {
    setFilter('sortBy', 'newest');
    setFilter('rating', '');
    setFilter('brand', '');
    setFilter('subCategory', '');
    setFilter('vendorId', '');
    setFilter('city', null);
    setFilter('town', null);
    setFilter('priceMin', null);
    setFilter('priceMax', null);
    setInputValues({ min: null, max: null });
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#171512] px-4 py-2.5 text-sm text-[#F5F0E9] placeholder-stone-400 focus:border-[#C99B70] focus:ring-2 focus:ring-[#C99B70]/20 focus:bg-[#171512] transition-all duration-300 outline-none';
  const labelClass =
    'flex items-center gap-2 text-sm font-semibold text-stone-300 mb-2';

  const renderFiltersContent = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="search-sort" className={labelClass}>
          <FaSortAmountDown className="text-[#C99B70]" /> ترتيب النتائج
        </label>
        <select
          id="search-sort"
          value={filters.sortBy || 'newest'}
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className={inputClass}
        >
          <option value="newest">الأحدث</option>
          <option value="cheapest">الأقل سعرًا</option>
          <option value="best_sellers">الأكثر طلباً</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <label htmlFor="search-rating" className={labelClass}>
          <FaStar className="text-[#C99B70]" /> متوسط التقييم الأدنى
        </label>
        <select
          id="search-rating"
          value={filters.rating || ''}
          onChange={(e) => setFilter('rating', e.target.value)}
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

      <div className="border-t border-white/10/60 my-4" />

      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label htmlFor="search-brand" className={labelClass}>
            <FaTag className="text-[#C99B70]" /> الماركة
          </label>
          <input
            id="search-brand"
            type="search"
            value={filters.brand || ''}
            onChange={(e) => setFilter('brand', e.target.value)}
            className={inputClass}
            placeholder="ابحث باسم الماركة"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <label htmlFor="search-subcategory" className={labelClass}>
            <FaLayerGroup className="text-[#C99B70]" /> الفئة الفرعية
          </label>
          <input
            id="search-subcategory"
            type="search"
            value={filters.subCategory || ''}
            onChange={(e) => setFilter('subCategory', e.target.value)}
            className={inputClass}
            placeholder="ابحث بالفئة الفرعية"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="search-vendor" className={labelClass}>
            <FaStore className="text-[#C99B70]" /> معرّف البائع
          </label>
          <input
            id="search-vendor"
            type="search"
            value={filters.vendorId || ''}
            onChange={(e) => setFilter('vendorId', e.target.value)}
            className={inputClass}
            placeholder="معرّف حساب البائع"
          />
        </motion.div>
      </div>

      <div className="border-t border-stone-200/60 my-4" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <label className={labelClass}>
          <FaMapMarkerAlt className="text-[#C99B70]" /> المدينة
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

      <AnimatePresence>
        {filters.city && availableTowns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <label className={labelClass}>
              <FaMapMarkerAlt className="text-[#C99B70]/70" /> المنطقة
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
      </AnimatePresence>

      <div className="border-t border-stone-200/60 my-4" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <label className={labelClass}>
          <FaMoneyBillWave className="text-[#C99B70]" /> نطاق السعر
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-stone-400 mb-1.5 block font-medium">
              أدنى سعر
            </label>
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
            <label className="text-xs text-stone-500 mb-1.5 block font-medium">
              أعلى سعر
            </label>
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

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleReset}
        className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-[#29251F] py-3 text-sm font-semibold text-stone-300 transition-colors hover:bg-[#C99B70]/10 hover:border-[#C99B70]/30 hover:text-[#E5C5A5]"
      >
        <FaUndo className="text-xs" />
        إعادة تعيين جميع الفلاتر
      </motion.button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#211F1B]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl shadow-black/20"
      dir="rtl"
    >
      {/* عرض الموبايل (قابل للطي) */}
      <div className="sm:hidden">
        <div className="p-5 flex items-center justify-between border-b border-stone-100">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FaLayerGroup className="text-[#C99B70]" />
            تصفية النتائج
          </h3>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-[#C99B70]/10 hover:text-[#C99B70] transition-colors"
            aria-label="تبديل عرض الفلاتر"
          >
            <FaChevronDown
              className={`transition-transform duration-300 ${isMobileOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5">
                {renderFiltersContent()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* عرض الديسكتوب (ثابت ومفتوح دائماً) */}
      <div className="hidden sm:block p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FaLayerGroup className="text-[#C99B70]" />
            تصفية النتائج
          </h3>
          <button
            onClick={handleReset}
            className="text-xs font-medium text-stone-500 hover:text-[#C99B70] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#C99B70]/10"
          >
            <FaUndo /> إعادة تعيين
          </button>
        </div>
        {renderFiltersContent()}
      </div>
    </motion.div>
  );
}