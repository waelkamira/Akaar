'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SmallCard from '../ReusableComponents/SmallCard/SmallCard';

export default function KeywordSearchResults({ keyword }) {
  const [results, setResults] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchResults = async (currentPage = 1) => {
    if (!keyword) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(
        'Fetching results for keyword:',
        keyword,
        'page:',
        currentPage
      );

      const response = await fetch('/api/keyword-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          page: currentPage,
          limit: 8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results');
      }

      const data = await response.json();
      console.log('Search results:', data);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      if (currentPage === 1) {
        setResults({ products: data.products });
      } else {
        setResults((prev) => ({
          products: [...prev.products, ...data.products],
        }));
      }

      setHasMore(data.hasMore);
      setTotalCount(data.totalCount);
      setPage(data.currentPage);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [keyword]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchResults(page + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto"></div>
        <p className="mt-6 text-lg text-gray-600">
          جاري البحث عن "{keyword}"...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-500 text-xl mb-2">حدث خطأ أثناء البحث</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-gray-500 text-xl mb-2">
            الرجاء إدخال كلمة بحث
          </div>
          <div className="text-gray-400">ابحث عن المنتجات التي تريدها</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          نتائج البحث عن "{keyword}"
        </h2>
        <p className="text-gray-600">
          تم العثور على {totalCount} نتائج{totalCount !== 1 ? 'ات' : ''}
        </p>
      </div>

      {/* Products Grid */}
      {results.products.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results?.products?.map((product) => (
              <SmallCard key={product.id} item={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-primary-500 text-white px-8 py-3 rounded-full hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    جاري تحميل المزيد...
                  </>
                ) : (
                  <>
                    <span className="ml-2">المزيد من النتائج</span>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-gray-500 text-xl mb-2">
              لم يتم العثور على نتائج
            </div>
            <div className="text-gray-400 mb-4">
              لم نجد أي منتجات تطابق "{keyword}"
            </div>
            <div className="text-sm text-gray-500">
              جرب استخدام كلمات بحث مختلفة أو تصفح الفئات المتاحة
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
