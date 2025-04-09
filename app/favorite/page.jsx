'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import Loading from '../../components/ReusableComponents/Loading';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import LoginButton from '../../components/Buttons/LoginButton';

function FavoritesContent() {
  const [myFavorites, setMyFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const session = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('CurrentUser'));
      setUserId(user?.id);
    }
  }, []);

  const fetchMyFavorites = useCallback(async () => {
    try {
      if (!userId) return;

      setLoading(true);
      const response = await fetch(
        `/api/favorite?userId=${userId}&page=${pageNumber}&limit=8`,
        {
          cache: 'no-store', // استخدام no-store بدلاً من revalidate
        }
      );

      if (!response.ok) throw new Error('Failed to fetch');

      const json = await response.json();

      if (json.favorites) {
        setMyFavorites((prev) =>
          pageNumber === 0 ? json.favorites : [...prev, ...json.favorites]
        );
        setTotalCount(json.totalCount);
        setHasMore(json.hasMore);
      }

      if (initialLoad) setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.custom((t) => (
        <CustomToast t={t} message={'حدث خطأ أثناء جلب المفضلة'} type="error" />
      ));
    } finally {
      setLoading(false);
    }
  }, [userId, pageNumber, initialLoad]);

  useEffect(() => {
    fetchMyFavorites();
  }, [fetchMyFavorites]);

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPageNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full sm:my-8">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] px-2 sm:px-16 pt-2 overflow-y-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-[5px] shadow-sm my-8">
          <h2 className="text-lg font-medium select-none">
            عدد الإعلانات التي أعجبت بها:
            <span className="text-green-600 font-bold mx-2">{totalCount}</span>
          </h2>
        </div>

        {session?.data?.user ? (
          <>
            {initialLoad ? (
              <Loading />
            ) : myFavorites.length === 0 ? (
              <Loading myMessage={'لم تقم بالإعجاب بأي إعلان بعد 😉'} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                {myFavorites.map((favorite, index) => (
                  <div
                    key={`${favorite.id}-${index}`}
                    className="relative flex flex-col border border-gray-200 items-start h-full justify-start bg-white hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden"
                  >
                    <SmallCard item={favorite} />
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-12 mb-8 flex justify-center">
                <button
                  className="group flex items-center gap-3 bg-three hover:bg-two px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={handleNextPage}
                  disabled={loading}
                >
                  <span>المزيد من النتائج</span>
                  <MdKeyboardDoubleArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="mb-4 text-lg">يجب تسجيل الدخول لعرض المفضلة</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Favorites() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      }
    >
      <FavoritesContent />
    </Suspense>
  );
}
