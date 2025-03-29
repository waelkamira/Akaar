'use client';

import { useSearch } from '../../contexts/SearchContext';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';

export default function SearchResults() {
  const { results, loading, error, totalCount, hasMore, loadMore } =
    useSearch();
  console.log('results', results);
  console.log('totalCount from SearchResults', totalCount);
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (loading && results.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-one" />
        <span className="ml-2 text-gray-600">جاري البحث...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          لم يتم العثور على نتائج عدل الفلاتر للعثور على نتائج أفضل
        </p>
      </div>
    );
  }
  return (
    <div className="w-full bg-green-500">
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          معروض {results.length} من {totalCount} من النتائج
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((product) => (
          <SmallCard
            key={product.id}
            item={product}
            category={product.category}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-one"
          >
            {loading ? (
              <>
                <Loader2 className="inline-block h-4 w-4 animate-spin mr-2" />
                Loading...
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
