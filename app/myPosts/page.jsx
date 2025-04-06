'use client';
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from 'react';
import { useSession } from 'next-auth/react';
import { inputsContext } from '../../components/authContext/Context';
import { useRouter } from 'next/navigation';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import NavegationPages from '../../components/ReusableComponents/NavegationPages';
import Loading from '../../components/ReusableComponents/Loading';
import PostActions from './PostActions';
import LoginButton from '../../components/Buttons/LoginButton';

const MyPostsContent = () => {
  const { dispatch } = useContext(inputsContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const session = useSession();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة محسنة لجلب الإعلانات مع التخزين المؤقت
  const fetchMyPosts = useCallback(
    async (userId) => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/myPosts?page=${pageNumber}&userId=${userId}&limit=8`,
          {
            next: { revalidate: 1800 }, // إعادة التحقق بعد 30 دقيقة
          }
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const json = await response.json();

        setHasMore(json.hasMore);
        setMyPosts(json?.data || []);
        setUserPostsCount(json?.count || 0);
        dispatch({ type: 'MY_POSTS', payload: json });
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, dispatch]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('CurrentUser'));
      const userId = data?.id;
      fetchMyPosts(userId);
    }
  }, [fetchMyPosts, session]);

  return (
    <Suspense className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] h-fit px-2 sm:px-16 overflow-y-auto z-10 border-2 my-4">
        {session?.status === 'authenticated' && (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-center items-center w-full gap-4 py-4 mt-16">
              <h1 className="grow text-lg lg:text-2xl w-full">
                <span className="text-primary-500 text-2xl ml-2">#</span>
                إعلاناتي{' '}
                <span className="text-primary-500"> {userPostsCount}</span>
              </h1>
            </div>

            {loading ? (
              <Loading />
            ) : myPosts.length === 0 ? (
              <Loading
                myMessage={
                  '😉 لا يوجد نتائج لعرضها ,لم تقم بإنشاء أي إعلان بعد'
                }
              />
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 justify-start items-start w-full">
                  {myPosts.map((post) => (
                    <div
                      className="relative flex flex-col border-2 items-start h-full justify-start bg-primary-500 hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer rounded-[10px] overflow-hidden"
                      key={post.id}
                      onClick={() => {
                        localStorage.setItem('item', JSON.stringify(post));
                        router.push(`/post/${post.id}`);
                      }}
                    >
                      <PostActions
                        post={post}
                        session={session}
                        onDelete={() => {
                          const userId = JSON.parse(
                            localStorage.getItem('CurrentUser')
                          )?.id;
                          fetchMyPosts(userId);
                        }}
                      />
                      <SmallCard item={post} category={post?.categoryName} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <NavegationPages
            hasMore={hasMore}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
          />
        )}
      </div>
      {session?.status === 'unauthenticated' && <LoginButton />}
    </Suspense>
  );
};

export default MyPostsContent;
