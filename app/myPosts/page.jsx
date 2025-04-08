'use client';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { inputsContext } from '../../components/authContext/Context';
import { useRouter } from 'next/navigation';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import NavegationPages from '../../components/ReusableComponents/NavegationPages';
// استبدل Loading بمكونات تحميل هيكلية (Skeleton) إذا أمكن
import Loading from '../../components/ReusableComponents/Loading';
import PostActions from './PostActions';
import LoginButton from '../../components/Buttons/LoginButton';
import { AlertTriangle, FileText } from 'lucide-react'; // مثال لاستخدام أيقونات

// مكون بسيط للتحميل الهيكلي (يمكنك تخصيصه أو استخدام مكتبة)
const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-2xl p-4 animate-pulse">
    <div className="h-40 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const MyPostsContent = () => {
  const { dispatch } = useContext(inputsContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { data: session, status } = useSession(); // استخدام status و data مباشرة
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // حالة لتخزين الأخطاء
  const router = useRouter();

  // دالة محسنة لجلب الإعلانات
  const fetchMyPosts = useCallback(
    async (userId) => {
      if (!userId || status !== 'authenticated') {
        // لا تقم بالجلب إذا لم يكن هناك ID أو المستخدم غير مسجل الدخول
        setLoading(false);
        setMyPosts([]);
        setUserPostsCount(0);
        return;
      }

      setLoading(true);
      setError(null); // إعادة تعيين الخطأ عند بدء الجلب
      try {
        const response = await fetch(
          `/api/myPosts?page=${pageNumber}&userId=${userId}&limit=8`
          // لا تحتاج لإعادة التحقق هنا، هذا خاص بـ fetch في مكونات السيرفر أو API Routes
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        setHasMore(json.hasMore);
        setMyPosts(json?.data || []);
        setUserPostsCount(json?.count || 0);
        // لا أعتقد أنك بحاجة لتحديث الـ context هنا بكل البيانات، ربما فقط العدد؟
        // dispatch({ type: 'MY_POSTS', payload: { count: json?.count } });
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('حدث خطأ أثناء جلب الإعلانات. الرجاء المحاولة مرة أخرى.'); // تعيين رسالة خطأ للمستخدم
        setMyPosts([]); // مسح البيانات القديمة عند حدوث خطأ
        setUserPostsCount(0);
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, dispatch, status] // أضف status كـ dependency
  );

  // التأثير لجلب البيانات عند تغير رقم الصفحة أو حالة الجلسة
  useEffect(() => {
    // استخدم ID المستخدم مباشرة من الجلسة إذا كانت متاحة
    const userId = session?.user?.id;
    if (status === 'authenticated' && userId) {
      fetchMyPosts(userId);
    } else if (status === 'unauthenticated') {
      // إذا كان المستخدم غير مسجل، قم بمسح البيانات وإيقاف التحميل
      setLoading(false);
      setMyPosts([]);
      setUserPostsCount(0);
      setError(null);
    }
    // لا نعتمد على LocalStorage هنا لزيادة الموثوقية
  }, [fetchMyPosts, session, status, pageNumber]); // أضف pageNumber هنا أيضاً

  // ==================
  // طرق العرض الفرعية لتحسين القراءة
  // ==================

  // عرض حالة التحميل
  const renderLoading = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6 w-full">
      {/* عرض عدد مناسب من هياكل التحميل */}
      {[...Array(4)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );

  // عرض رسالة الخطأ
  const renderError = () => (
    <div className="flex flex-col items-center justify-center text-center text-red-600 bg-red-100 p-6 rounded-lg border border-red-300 my-8">
      <AlertTriangle className="w-12 h-12 mb-4" />
      <p className="text-lg font-semibold">حدث خطأ!</p>
      <p>{error}</p>
    </div>
  );

  // عرض رسالة عدم وجود إعلانات
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 p-8 rounded-lg border border-gray-200 my-8">
      <FileText className="w-16 h-16 mb-4 text-gray-400" />
      <p className="text-xl font-semibold mb-2">لا توجد إعلانات لعرضها</p>
      <p>لم تقم بإنشاء أي إعلان بعد. ابدأ الآن!</p>
    </div>
  );

  // عرض قائمة الإعلانات
  const renderPosts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 w-full">
      {myPosts.map((post) => (
        <div
          className="relative flex flex-col items-start h-full bg-gray-100 w-full justify-start group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-in-out"
          key={post.id}
          onClick={(e) => {
            // تأكد من أن النقر لم يكن على زر الإجراءات
            if (e.target.closest('.post-actions-container')) return;
            localStorage.setItem('item', JSON.stringify(post));
            router.push(`/post/${post.id}`);
          }}
        >
          {/* إضافة حاوية للإجراءات لمنع التضارب */}
          <div className="post-actions-container w-full">
            <PostActions post={post} />
          </div>
          {/* تأكد أن SmallCard لا يأخذ العرض/الارتفاع الكامل بنفسه إذا كان هذا غير مرغوب */}
          <SmallCard item={post} category={post?.categoryName} />
        </div>
      ))}
    </div>
  );

  // ==================
  // العرض الرئيسي للمكون
  // ==================
  return (
    // استخدام max-w-* للتحكم في العرض الأقصى وتحسين التجاوب
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {status === 'authenticated' && (
        <div className="flex flex-col w-full">
          {/* تعديل العنوان */}
          <div className="mb-6 md:mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <span className="text-primary-500">#</span>
              إعلاناتي
              <span className="text-sm font-medium bg-primary-100 text-primary-700 rounded-full px-2.5 py-0.5 ml-2">
                {/* عرض العدد فقط إذا لم يكن هناك تحميل أو خطأ */}
                {!loading && !error ? userPostsCount : '-'}
              </span>
            </h1>
          </div>

          {/* منطق العرض بناءً على الحالات */}
          {
            loading
              ? renderLoading() // عرض هياكل التحميل
              : error
              ? renderError() // عرض رسالة الخطأ
              : myPosts.length === 0
              ? renderEmptyState() // عرض رسالة عدم وجود نتائج
              : renderPosts() // عرض الإعلانات
          }

          {/* عرض التنقل بين الصفحات فقط إذا كان هناك بيانات ولم يكن هناك خطأ */}
          {!loading && !error && userPostsCount > 0 && (
            <div className="mt-8 md:mt-12">
              <NavegationPages
                hasMore={hasMore}
                setPageNumber={setPageNumber}
                pageNumber={pageNumber}
                // يمكنك إضافة العدد الإجمالي للصفحات إذا كان متاحاً
              />
            </div>
          )}
        </div>
      )}

      {/* عرض زر تسجيل الدخول إذا لم يكن المستخدم مسجلاً */}
      {status === 'unauthenticated' && (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-xl font-semibold mb-4">
            يجب تسجيل الدخول لعرض إعلاناتك
          </h2>
          <LoginButton />
        </div>
      )}

      {/* يمكنك عرض رسالة إذا كانت الجلسة قيد التحقق */}
      {status === 'loading' && (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default MyPostsContent;
