'use client';

import { useEffect } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { Loader2 } from 'lucide-react';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';

export default function SearchResults() {
  const {
    results,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    category,
    filters,
  } = useSearch();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-2" />
        <span className="text-gray-600">جاري البحث...</span>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  // Show empty state
  if (!loading && results.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 mb-2">لم يتم العثور على نتائج</p>
        <p className="text-sm text-gray-400">
          جرب تعديل معايير البحث للحصول على نتائج أفضل
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count and category */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          تم العثور على {totalCount} نتيجة
          {category && <span className="mr-1">في {category.name}</span>}
        </p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product) => (
          <SmallCard key={product.id} item={product} />
        ))}
      </div>

      {/* Load more button */}
      {results.length >= 8 && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                جاري التحميل...
              </>
            ) : (
              'تحميل المزيد'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
