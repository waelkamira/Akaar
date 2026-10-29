'use client';

import { useSearch } from '@/features/search/search-context';
import {
  X,
  Filter,
  Tag,
  MapPin,
  DollarSign,
  Star,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inputsContext } from '@/features/auth/inputs-context';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

export default function SelectedFilters() {
  const {
    filters,
    category,
    removeFilter,
    clearFilters,
    staticFilters,
    dynamicFilters,
  } = useSearch();
  const { dispatch } = useContext(inputsContext);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const selectedFilters = useMemo(() => {
    const selected = [];

    // دالة مساعدة لتحديد نوع الفلتر ولونه
    const getFilterType = (key) => {
      if (key === 'category') return { type: 'category', color: 'purple' };
      if (['city', 'town'].includes(key))
        return { type: 'location', color: 'blue' };
      if (['priceMin', 'priceMax'].includes(key))
        return { type: 'price', color: 'green' };
      if (['rating'].includes(key)) return { type: 'rating', color: 'yellow' };
      if (['brand', 'subCategory', 'vendorId', 'adType'].includes(key))
        return { type: 'product', color: 'orange' };
      return { type: 'other', color: 'gray' };
    };

    if (category) {
      const { type, color } = getFilterType('category');
      selected.push({
        key: 'category',
        label: `الفئة: ${category.name}`,
        type,
        color,
      });
    }
    if (filters.city) {
      const { type, color } = getFilterType('city');
      selected.push({
        key: 'city',
        label: `المدينة: ${filters.city}`,
        type,
        color,
      });
    }
    if (filters.town) {
      const { type, color } = getFilterType('town');
      selected.push({
        key: 'town',
        label: `المنطقة: ${filters.town}`,
        type,
        color,
      });
    }
    if (filters.brand) {
      const { type, color } = getFilterType('brand');
      selected.push({
        key: 'brand',
        label: `الماركة: ${filters.brand}`,
        type,
        color,
      });
    }
    if (filters.subCategory) {
      const { type, color } = getFilterType('subCategory');
      selected.push({
        key: 'subCategory',
        label: `الفئة الفرعية: ${filters.subCategory}`,
        type,
        color,
      });
    }
    if (filters.vendorId) {
      const { type, color } = getFilterType('vendorId');
      selected.push({ key: 'vendorId', label: 'البائع المحدد', type, color });
    }
    if (filters.rating) {
      const { type, color } = getFilterType('rating');
      selected.push({
        key: 'rating',
        label: `${filters.rating} نجوم فأكثر`,
        type,
        color,
      });
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      if (filters.priceMin !== undefined) {
        const { type, color } = getFilterType('priceMin');
        selected.push({
          key: 'priceMin',
          label: `أقل سعر: ${filters.priceMin}`,
          type,
          color,
        });
      }
      if (filters.priceMax !== undefined) {
        const { type, color } = getFilterType('priceMax');
        selected.push({
          key: 'priceMax',
          label: `أعلى سعر: ${filters.priceMax}`,
          type,
          color,
        });
      }
    }

    if (filters.adType) {
      const adType = staticFilters.adTypes.find(
        (type) => type.id === filters.adType,
      );
      if (adType) {
        const { type, color } = getFilterType('adType');
        selected.push({
          key: 'adType',
          label: `نوع الإعلان: ${adType.name}`,
          type,
          color,
        });
      }
    }

    if (filters.details && dynamicFilters) {
      Object.entries(filters.details).forEach(([key, value]) => {
        const field = dynamicFilters.find((f) => f.name === key);
        if (field) {
          let displayValue = value;
          if (field.options) {
            displayValue = field.options[value] || value;
          }
          selected.push({
            key: `details.${key}`,
            label: `${field.label}: ${displayValue}`,
            type: 'other',
            color: 'gray',
          });
        }
      });
    }

    return selected;
  }, [category, filters, staticFilters.adTypes, dynamicFilters]);

  const selected = useCallback(async () => {
    dispatch({
      type: 'SELECTED',
      payload: selectedFilters,
    });
  }, [selectedFilters, dispatch]);

  useEffect(() => {
    selected();
  }, [selected]);

  // دالة للحصول على أيقونة الفلتر حسب نوعه
  const getFilterIcon = (type) => {
    switch (type) {
      case 'category':
        return <Package className="w-3.5 h-3.5" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5" />;
      case 'price':
        return <DollarSign className="w-3.5 h-3.5" />;
      case 'rating':
        return <Star className="w-3.5 h-3.5" />;
      case 'product':
        return <Tag className="w-3.5 h-3.5" />;
      default:
        return <Filter className="w-3.5 h-3.5" />;
    }
  };

  // دالة للحصول على ألوان الفلتر
  const getFilterColors = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        hover: 'hover:bg-purple-100',
        icon: 'bg-purple-100',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        hover: 'hover:bg-ak-brand-soft',
        icon: 'bg-blue-100',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        hover: 'hover:bg-green-100',
        icon: 'bg-green-100',
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        hover: 'hover:bg-yellow-100',
        icon: 'bg-yellow-100',
      },
      orange: {
        bg: 'bg-ak-amber/10',
        border: 'border-ak-amber/20',
        text: 'text-ak-honey',
        hover: 'hover:bg-ak-amber/15',
        icon: 'bg-orange-100',
      },
      gray: {
        bg: 'bg-stone-100',
        border: 'border-stone-200',
        text: 'text-stone-300',
        hover: 'hover:bg-stone-200',
        icon: 'bg-stone-200',
      },
    };
    return colors[color] || colors.gray;
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearFilters();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // إخفاء رسالة التأكيد بعد 3 ثوانٍ
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-ak-surface/90 backdrop-blur-xl border border-ak-line rounded-2xl p-5 shadow-xl shadow-black/20"
      dir="rtl"
    >
      {/* ==================== رأس القسم ==================== */}
      <div className="flex items-center justify-between mb-4 border-b border-ak-line pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-stone-800">
            <div className="relative">
              <Filter className="w-5 h-5 text-ak-amber" />
              {/* شارة عدد الفلاتر */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-ak-amber text-ak-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
              >
                {selectedFilters.length}
              </motion.span>
            </div>
            <span className="text-sm font-bold text-white">
              الفلاتر النشطة
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: showClearConfirm ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            showClearConfirm
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md'
              : 'text-stone-400 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-100'
          }`}
        >
          <X size={14} strokeWidth={2.5} />
          <span>{showClearConfirm ? 'تأكيد الحذف' : 'مسح الكل'}</span>
        </motion.button>
      </div>

      {/* ==================== قائمة الفلاتر ==================== */}
      <motion.div
        className="flex flex-wrap gap-2.5"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        <AnimatePresence mode="popLayout">
          {selectedFilters.map((filter) => {
            const colors = getFilterColors(filter.color);

            return (
              <motion.div
                key={filter.key}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                layout
                className={`group relative flex items-center gap-2 ${colors.bg} ${colors.hover} border ${colors.border} rounded-xl px-3 py-2 text-sm ${colors.text} transition-all duration-300 shadow-sm hover:shadow-md`}
                title={filter.label}
              >
                {/* أيقونة الفلتر */}
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-lg ${colors.icon} ${colors.text}`}
                >
                  {getFilterIcon(filter.type)}
                </div>

                {/* نص الفلتر */}
                <span className="font-medium truncate max-w-[200px]" dir="auto">
                  {filter.label}
                </span>

                {/* زر الإزالة */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFilter(filter.key)}
                  className={`flex items-center justify-center w-5 h-5 rounded-full ${colors.icon} ${colors.text} opacity-0 group-hover:opacity-100 transition-all duration-200`}
                  aria-label={`إزالة فلتر ${filter.label}`}
                >
                  <X size={12} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ==================== معلومات إضافية ==================== */}
      {selectedFilters.length > 3 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-ak-line"
        >
          <p className="text-xs text-stone-400 text-center">
            يتم عرض {selectedFilters.length} فلتر نشط. انقر على أي فلتر لإزالته.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
