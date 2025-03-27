'use client';

import { useSearch } from '../../contexts/SearchContext';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';

export default function SearchResults() {
  const { results, loading, error, totalCount, hasMore, loadMore } =
    useSearch();

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
          <SmallCard item={product} category={product.category} />
          // <div
          //   key={product.id}
          //   className="bg-white rounded-lg shadow-md overflow-hidden"
          // >
          //   <div className="relative h-48">
          //     {product.image1 ? (
          //       <Image
          //         src={product.image1 || '/placeholder.svg'}
          //         alt={product.title}
          //         fill
          //         className="object-cover"
          //       />
          //     ) : (
          //       <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          //         <span className="text-gray-400">لا يوجد صورة</span>
          //       </div>
          //     )}
          //   </div>

          //   <div className="p-4">
          //     <h3 className="font-medium text-lg mb-1">{product.title}</h3>
          //     <p className="text-one font-bold mb-2">${product.basePrice}</p>
          //     <div className="flex justify-between text-sm text-gray-500">
          //       <span>{product.categoryName}</span>
          //       <span>{product.city}</span>
          //     </div>
          //     <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          //       {product.description}
          //     </p>
          //   </div>
          // </div>
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
