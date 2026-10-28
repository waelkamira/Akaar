'use client';

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { inputsContext } from '@/features/auth/inputs-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import Pagination from '../../components/ReusableComponents/Pagination';
import Loading from '../../components/ReusableComponents/Loading';
import PostActions from './PostActions';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaPlus, FaLayerGroup } from 'react-icons/fa';

// بيانات وهمية للاختبار (كما في الكود الأصلي)
const fakeData = [
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title: 'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع مصعد طاقة مساحة 110متر',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 1,
    categoryName: 'عقارات',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: 'https://i.imgur.com/vGpGUAj.png',
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    city: 'دمشق',
    town: 'الميدان',
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: {},
    description: 'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: '2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  // ... يمكن إضافة المزيد من البيانات الوهمية هنا
];

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

const PostsContent = () => {
  const { dispatch } = useContext(inputsContext);
  const [page, setPage] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const session = useSession();
  const [posts, setPosts] = useState(fakeData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة محسنة لجلب الإعلانات مع التخزين المؤقت
  const fetchPosts = useCallback(
    async (userId) => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/posts?page=${page}&userId=${userId}&limit=8`, {
          next: { revalidate: 1800 },
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const json = await response.json();
        setHasMore(json?.hasMore || false);
        setPosts(json?.data || []);
        setUserPostsCount(json?.count || 0);
        dispatch({ type: 'MY_POSTS', payload: json });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    },
    [page, dispatch]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('CurrentUser'));
      const userId = data?.id;
      fetchPosts(userId);
    }
  }, [fetchPosts, session]);

  const handleDelete = () => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('CurrentUser'));
      fetchPosts(data?.id);
    }
  };

  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }

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
          MY ADS
        </h1>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 mb-8 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FaLayerGroup className="text-2xl text-ak-cream" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ak-cream">إعلاناتي</h1>
              <p className="text-neutral-400 text-sm mt-1">
                إجمالي الإعلانات المنشورة: <span className="text-orange-400 font-bold text-lg">{userPostsCount}</span>
              </p>
            </div>
          </div>
          
          <Link
            href="/new-post"
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-ak-cream font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FaPlus className="text-sm" />
            إنشاء إعلان جديد
          </Link>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl"
          >
            <Loading myMessage="جاري تحميل إعلاناتك..." />
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800 rounded-3xl"
          >
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <FaBoxOpen className="text-4xl text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold text-ak-cream mb-2">لا توجد إعلانات بعد</h3>
            <p className="text-neutral-400 mb-8 text-center max-w-md">
              ابدأ بإضافة إعلانك الأول ليظهر هنا ويتمكن الآخرون من رؤيته.
            </p>
            <Link
              href="/new-post"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-ak-cream font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-600/20"
            >
              <FaPlus className="text-sm" />
              إنشاء أول إعلان
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {posts.map((post) => (
              <motion.div 
                key={post.id} 
                variants={itemVariants}
                className="relative group"
              >
                {/* Post Actions (Edit/Delete) - Positioned absolutely over the card */}
                <div className="absolute top-2 right-2 z-20">
                  <PostActions
                    post={post}
                    session={session}
                    onDelete={handleDelete}
                  />
                </div>
                
                {/* SmallCard handles its own click navigation and hover effects */}
                <SmallCard 
                  item={post} 
                  category={{ name: post.categoryName }} 
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <Pagination hasMore={hasMore} setPage={setPage} page={page} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PostsContent;