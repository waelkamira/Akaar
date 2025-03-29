'use client';

import { useSearch } from '../../contexts/SearchContext';
import { useEffect, useState } from 'react';

export default function DynamicFilters() {
  const { categoryId, filters, setFilter, availableFilters } = useSearch();
  const [categoryFields, setCategoryFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // console.log('categoryId', categoryId);
  useEffect(() => {
    if (!categoryId) {
      setCategoryFields([]);
      return;
    }

    // العثور على الفئة المحددة للحصول على اسمها
    const selectedCategory = availableFilters.categories.find(
      (cat) => cat.id.toString() === categoryId
    );

    if (!selectedCategory) {
      setCategoryFields([]);
      return;
    }

    setLoading(true);
    setError(null);

    // تحميل الفلاتر الديناميكية باستخدام اسم الفئة
    import(`../../components/categoryFields/${selectedCategory.name}.jsx`)
      .then((module) => {
        setCategoryFields(module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load fields:', err);
        setError('فشل في تحميل الفلاتر');
        setLoading(false);
        setCategoryFields([]);
      });
  }, [categoryId, availableFilters.categories]);

  if (!categoryId || loading || error) {
    return null;
  }

  return (
    <div className="space-y-6">
      {categoryFields.map((field) => {
        const currentValue = filters.details?.[field.name];

        return (
          <div key={field.name}>
            <div className="flex items-center gap-2 mb-2">
              {field.icon && <span>{field.icon}</span>}
              <h3 className="text-sm font-medium text-gray-700">
                {field.label || field.name}
              </h3>
            </div>
            <div className="space-y-2">
              {field.options ? (
                // إذا كان للحقل خيارات، نستخدم قائمة منسدلة
                <select
                  value={currentValue || ''}
                  onChange={(e) =>
                    setFilter(
                      `details.${field.name}`,
                      e.target.value || undefined
                    )
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-one focus:border-one"
                >
                  <option value="">{field.placeholder || 'اختر...'}</option>
                  {Object.entries(field.options).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                // إذا لم يكن للحقل خيارات، نستخدم حقل إدخال
                <input
                  type="text"
                  value={currentValue || ''}
                  onChange={(e) =>
                    setFilter(
                      `details.${field.name}`,
                      e.target.value || undefined
                    )
                  }
                  placeholder={field.placeholder}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-one focus:border-one"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
