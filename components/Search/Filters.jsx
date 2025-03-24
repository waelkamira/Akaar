// 'use client';
// import React, { useState, useEffect, useContext } from 'react';
// import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import CitySelector from '../Selectors/CitySelector';
// import { inputsContext } from '../authContext/Context';
// import SearchControls from './SearchControls';
// import PriceInput from './PriceInput';
// import DynamicField from './DynamicField';
// import CategoriesNavBar from '../Selectors/CategoriesSelector';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { FaArrowUp } from 'react-icons/fa6';

// export default function Filters({
//   searchData,
//   setSearchData,
//   onSearch,
//   onReset,
//   rerender,
// }) {
//   const { data } = useContext(inputsContext);
//   const [fields, setFields] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const searchParams = useSearchParams();
//   const category = searchParams.get('category'); // استخراج قيمة "category"
//   const id = searchParams.get('id'); // استخراج قيمة "category"
//   const [selectedValues, setSelectedValues] = useState({});
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const path = usePathname();
//   console.log('category تم تغيير الفئة', category);
//   const handleChange = (name, value) => {
//     setSelectedValues((prev) => ({ ...prev, [name]: value }));
//     handleDetailsChange(name, value);
//   };

//   useEffect(() => {
//     // console.log('تم اعادة الريندر من فلترز');
//     setSearchData((prev) => ({
//       ...prev,
//       category: id,
//       city: data?.propertyCity || '',
//       town: data?.propertyTown || '',
//     }));
//   }, [data]);

//   // جلب الحقول حسب اسم الفئة
//   useEffect(() => {
//     // console.log('تم اعادة الريندر من فلترز2 ');

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

//   const FilterContent = () => (
//     <div className="flex flex-col sm:flex-row items-start justify-start gap-2 w-full py-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-one scrollbar-track-three 2xl:mr-[203px]">
//       <div className="flex flex-col sm:flex-row justify-start items-start gap-2 w-full sm:w-fit">
//         <SearchControls
//           onSearch={onSearch}
//           onReset={onReset}
//           searchData={searchData}
//         />
//         <CategoriesNavBar />

//         <CitySelector />
//       </div>

//       <div className="flex flex-col sm:flex-row justify-end items-start gap-2 min-w-max w-full sm:w-fit">
//         {loading && <p>جاري التحميل...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading &&
//           !error &&
//           fields?.map((field, index) => (
//             <DynamicField
//               key={index}
//               field={field}
//               value={selectedValues[field.name]}
//               onChange={handleChange}
//             />
//           ))}
//       </div>

//       <div className="flex flex-col sm:flex-row gap-2 min-w-max w-full sm:w-fit">
//         <PriceInput
//           label="أدنى سعر"
//           name="minPrice"
//           value={searchData.minPrice}
//           onChange={handleInputChange}
//         />
//         <PriceInput
//           label="أعلى سعر"
//           name="maxPrice"
//           value={searchData.maxPrice}
//           onChange={handleInputChange}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Top Filter Icon */}
//       <div
//         className={
//           'sm:hidden flex justify-between items-center w-full p-4 bg-white'
//         }
//       >
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="bg-white rounded-full px-2 py-1 text-one flex items-center gap-2"
//         >
//           {isMenuOpen ? <FaTimes size={15} /> : <FaFilter size={15} />}
//           <span className="text-gray-400 text-sm">الفلاتر</span>
//         </button>
//       </div>

//       {/* Desktop View */}
//       <div
//         className={
//           path === '/' ? 'hidden' : '' + ' hidden sm:block sm:bg-one px-2'
//         }
//       >
//         <FilterContent />
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="fixed inset-0 bg-white z-40 sm:hidden overflow-y-auto p-4"
//           >
//             <FilterContent />
//             <div className="fixed bottom-4 left-4 right-4 flex gap-2">
//               <button
//                 onClick={() => {
//                   onSearch();
//                   setIsMenuOpen(false);
//                 }}
//                 className="flex-1 bg-one text-white py-2 rounded-[5px] flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <FaSearch size={20} />
//                 <span>بحث</span>
//               </button>
//               <button
//                 onClick={() => setIsMenuOpen(false)}
//                 className="flex-1 bg-one text-white py-2 rounded-[5px] flex items-center justify-center gap-2 shadow-lg"
//               >
//                 <FaTimes size={20} />
//                 <span>إغلاق</span>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

'use client';
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelector from '../Selectors/CitySelector';
import { inputsContext } from '../authContext/Context';
import SearchControls from './SearchControls';
import PriceInput from './PriceInput';
import DynamicField from './DynamicField';
import CategoriesNavBar from '../Selectors/CategoriesSelector';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaArrowUp } from 'react-icons/fa6';

// فصل منطق معالجة قيم الحقول الديناميكية
const useDynamicFields = (setSearchData) => {
  const [selectedValues, setSelectedValues] = useState({});

  const handleDetailsChange = useCallback(
    (field, value) => {
      setSearchData((prev) => ({
        ...prev,
        details: { ...prev.details, [field]: value },
      }));
    },
    [setSearchData]
  );

  const handleChange = useCallback(
    (name, value) => {
      setSelectedValues((prev) => ({ ...prev, [name]: value }));
      handleDetailsChange(name, value);
    },
    [handleDetailsChange]
  );

  return { selectedValues, handleChange };
};
// console.log('تم اعادة الريندر');
// فصل تحميل الحقول الديناميكية
const useCategoryFields = (category) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setFields([]);
      return;
    }

    setLoading(true);
    setError(null);

    import(`../categoryFields/${category}.jsx`)
      .then((module) => {
        setFields(module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load fields:', err);
        setError('فشل في تحميل الحقول');
        setLoading(false);
        setFields([]);
      });
  }, [category]);

  return { fields, loading, error };
};

// مكون لعرض محتوى الفلتر (الحقول، نطاق السعر، إلخ)
const FilterContent = React.memo(
  ({ onSearch, onReset, searchData, setSearchData, category }) => {
    const { fields, loading, error } = useCategoryFields(category);
    const { selectedValues, handleChange } = useDynamicFields(setSearchData);

    const handleInputChange = useCallback(
      (e) => {
        const { name, value } = e.target;
        setSearchData((prev) => ({ ...prev, [name]: value }));
      },
      [setSearchData]
    );

    return (
      <div className="flex flex-col sm:flex-row items-start justify-start gap-2 w-full py-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-one scrollbar-track-three 2xl:mr-[203px]">
        <div className="flex flex-col sm:flex-row justify-start items-start gap-2 w-full sm:w-fit">
          <SearchControls
            onSearch={onSearch}
            onReset={onReset}
            searchData={searchData}
          />
          <CategoriesNavBar />
          <CitySelector />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-start gap-2 min-w-max w-full sm:w-fit">
          {loading && <p>جاري التحميل...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading &&
            !error &&
            fields?.map((field, index) => (
              <DynamicField
                key={index}
                field={field}
                value={selectedValues[field.name]}
                onChange={handleChange}
              />
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 min-w-max w-full sm:w-fit">
          <PriceInput
            label="أدنى سعر"
            name="minPrice"
            value={searchData.minPrice}
            onChange={handleInputChange}
          />
          <PriceInput
            label="أعلى سعر"
            name="maxPrice"
            value={searchData.maxPrice}
            onChange={handleInputChange}
          />
        </div>
      </div>
    );
  }
);

FilterContent.displayName = 'FilterContent';

function Filters({ searchData, setSearchData, onSearch, onReset }) {
  const { data } = useContext(inputsContext);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const id = searchParams.get('id');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (!data) return;
    setSearchData((prev) => ({
      ...prev,
      category: id,
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
    }));
  }, [data, id, setSearchData]);

  return (
    <>
      <div
        className={
          'sm:hidden flex justify-between items-center w-full p-4 bg-white'
        }
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white rounded-full px-2 py-1 text-one flex items-center gap-2"
        >
          {isMenuOpen ? <FaTimes size={15} /> : <FaFilter size={15} />}
          <span className="text-gray-400 text-sm">الفلاتر</span>
        </button>
      </div>

      <div
        className={
          (path === '/' ? 'hidden' : '') + ' hidden sm:block sm:bg-one px-2'
        }
      >
        <FilterContent
          onSearch={onSearch}
          onReset={onReset}
          searchData={searchData}
          setSearchData={setSearchData}
          category={category}
        />
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-40 sm:hidden overflow-y-auto p-4"
          >
            <FilterContent
              onSearch={onSearch}
              onReset={onReset}
              searchData={searchData}
              setSearchData={setSearchData}
              category={category}
            />
            <div className="fixed bottom-4 left-4 right-4 flex gap-2">
              <button
                onClick={() => {
                  onSearch();
                  setIsMenuOpen(false);
                }}
                className="flex-1 bg-one text-white py-2 rounded-[5px] flex items-center justify-center gap-2 shadow-lg"
              >
                <FaSearch size={20} />
                <span>بحث</span>
              </button>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 bg-one text-white py-2 rounded-[5px] flex items-center justify-center gap-2 shadow-lg"
              >
                <FaTimes size={20} />
                <span>إغلاق</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

Filters.displayName = 'Filters';
export default Filters;
