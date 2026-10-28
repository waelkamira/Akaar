'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DemoProductCard from '../../../components/Store/DemoProductCard';
import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
import { useCommerce } from '@/features/cart/commerce-context';
import { motion } from 'framer-motion';
import { FaHeart, FaBoxOpen, FaStore } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// متغيرات الحركة لحركة انسيابية فاخرة
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FavoritesPage() {
  const { favoriteItems } = useCommerce();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [serverFavorites, setServerFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/favorite?userId=${encodeURIComponent(userId)}&page=${page}&limit=8`,
      );
      if (!response.ok) {
        throw new Error(`Unable to load favorites (${response.status}).`);
      }

      const result = await response.json();
      const products = Array.isArray(result.favorites)
        ? result.favorites.map((favorite) => favorite.product || favorite)
        : [];

      setServerFavorites((current) =>
        page === 1 ? products : [...current, ...products],
      );
      setTotalCount(Number(result.totalCount) || 0);
      setHasMore(Boolean(result.hasMore));
    } catch (error) {
      console.error('Failed to load favorites:', error);
      toast.error('حدث خطأ أثناء جلب المفضلة');
    } finally {
      setLoading(false);
    }
  }, [userId, page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const hasFavorites = favoriteItems.length > 0 || serverFavorites.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden " dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          FAVORITES
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 mb-8 shadow-xl"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <FaHeart className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة المفضلة</h1>
            <p className="text-neutral-400 text-sm mt-1">
              إجمالي العناصر المحفوظة: <span className="text-orange-400 font-bold text-lg">{favoriteItems.length + totalCount}</span>
            </p>
          </div>
        </motion.div>

        {/* Empty State */}
        {!hasFavorites && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl"
          >
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-4xl text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">قائمة المفضلة فارغة</h3>
            <p className="text-neutral-400 mb-8 text-center max-w-md">
              لم تضف أي منتج أو إعلان إلى المفضلة بعد. استخدم رمز القلب لحفظ ما يعجبك.
            </p>
            <Link
              href="/#demo-products"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaStore className="text-sm" />
              تصفح المنتجات
            </Link>
          </motion.div>
        )}

        {/* Content Sections */}
        {hasFavorites && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
            
            {/* Demo Products Section */}
            {favoriteItems.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaBoxOpen className="text-orange-500" />
                    المنتجات التجريبية المحفوظة
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteItems.map((product) => (
                    <DemoProductCard key={product.id} product={product} />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Server Favorites Section */}
            {serverFavorites.length > 0 && (
              <motion.section variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-yellow-500 rounded-full" />
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaHeart className="text-amber-500" />
                    الإعلانات المحفوظة
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {serverFavorites.map((product, index) => (
                    // تمت إزالة bg-white و border من هنا لأن SmallCard يحتوي بالفعل على التصميم الداكن المناسب
                    <SmallCard
                      key={`${product.id}-${index}`}
                      item={product}
                      category={{
                        id: product.categoryId,
                        name: product.categoryName,
                      }}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Load More Button */}
            {hasMore && (
              <motion.div variants={itemVariants} className="flex justify-center pt-8">
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-orange-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جارٍ التحميل...
                    </>
                  ) : (
                    'عرض المزيد'
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}