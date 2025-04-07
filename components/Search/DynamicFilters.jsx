'use client';
import { useSearch } from '../../contexts/SearchContext';
import { useCallback, useState, useEffect } from 'react';
import DynamicField from './DynamicField';
// استورد FiX بجانب ImSearch و ImSpinner8
import { ImSearch, ImSpinner8 } from 'react-icons/im';
import { FiX } from 'react-icons/fi'; // <--- إضافة استيراد FiX
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';

// أضف isMobile كـ prop إذا أردت التحكم في إظهار/إخفاء الزر العلوي
export default function DynamicFilters({ onShowFilters }) {
  const {
    category,
    filters,
    setFilter,
    dynamicFilters,
    loading,
    performSearch,
  } = useSearch();
  const [localValues, setLocalValues] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false); // حالة لتتبع عرض الموبايل

  // كشف عرض الموبايل داخل المكون (بديل لتمريرها كـ prop)
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 1024); // استخدم نفس نقطة التوقف مثل المكون الأب
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (filters.details) {
      setLocalValues(filters.details);
    }
  }, [filters.details]);

  const handleFieldChange = useCallback((fieldName, value) => {
    setLocalValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  const handleFieldBlur = useCallback(
    (fieldName, value) => {
      if (
        value === '' ||
        value === null ||
        (Array.isArray(value) && value.length === 0)
      ) {
        const newDetails = { ...filters.details };
        delete newDetails[fieldName];
        setFilter('details', newDetails);
      } else {
        const currentDetails = filters.details || {};
        setFilter('details', {
          ...currentDetails,
          [fieldName]: value,
        });
      }
    },
    [filters.details, setFilter]
  );

  const handleSearchAndClose = async () => {
    onShowFilters(false); // أغلق الفلاتر أولاً
    // هذه الدالة ستُستخدم للزر السفلي في الموبايل
    setIsSearching(true);
    try {
      await performSearch();
    } finally {
      setIsSearching(false);
    }
  };

  if (!category) {
    return null;
  }

  // ... (كود التحميل وعدم وجود فلاتر يبقى كما هو)
  if (loading) {
    // ... كود التحميل
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-4"
      >
        <div className="flex justify-center items-center py-4 space-x-2 space-x-reverse">
          {' '}
          {/* Added space-x-reverse for RTL */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <ImSpinner8 className="text-primary-500 text-xl" />
          </motion.div>
          <span className="text-gray-600">جاري تحميل الخصائص...</span>
        </div>
      </motion.div>
    );
  }

  if (!dynamicFilters || dynamicFilters.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4"
      >
        <div className="text-gray-500 text-center py-4 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-300 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>لا توجد خصائص متاحة لهذه الفئة</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-4 space-y-6 border border-gray-100"
    >
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        {' '}
        {/* Added border */}
        <motion.h3
          whileHover={{ scale: 1.02 }}
          className="text-lg font-semibold text-gray-900 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary" // Assuming primary is defined in Tailwind config
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          خصائص {category.name}
        </motion.h3>
      </div>

      <div className="space-y-6">
        {dynamicFilters.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <DynamicField
              field={field}
              value={localValues[field.name] || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </motion.div>
        ))}
      </div>

      {/* --- زر البحث/الإغلاق السفلي --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        // استخدم الدالة الجديدة التي تغلق الفلاتر أيضاً
        onClick={handleSearchAndClose}
        disabled={isSearching}
        // تعديل الـ className ليشمل التدرج اللوني والخصائص الأخرى
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all w-full font-medium" // Adjusted styles to match floating button/common mobile patterns
      >
        {isSearching ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <ImSpinner8 className="text-white" />
            </motion.div>
            <span>جاري العرض...</span>
          </>
        ) : (
          <>
            {/* استخدم أيقونة FiX هنا */}
            <SearchIcon className="w-5 h-5 text-white" />
            {/* تغيير النص ليعكس الإجراء */}
            <span> بحث</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
