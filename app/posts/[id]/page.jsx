'use client';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { inputsContext } from '@/features/auth/inputs-context';
import { useParams, useRouter } from 'next/navigation';
import SmallCard from '../../../components/ReusableComponents/SmallCard/SmallCard';
import Pagination from '../../../components/ReusableComponents/Pagination';
import Loading from '../../../components/ReusableComponents/Loading';
import PostActions from '../PostActions';

const SellerPosts = () => {
  const { dispatch } = useContext(inputsContext);
  const [page, setPage] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const session = useSession();
  const { id } = useParams();
  console.log('id', id);

  useEffect(() => {
    fetchPosts();
  }, [id, page]);

  // دالة محسنة لجلب الإعلانات
  async function fetchPosts() {
    if (!id) return;

    setLoading(true);
    try {
      console.log('id من داخل الدالة', id);

      const response = await fetch(`/api/posts/${id}?page=${page}&limit=8`, {
        next: { revalidate: 1800 }, // إعادة التحقق بعد 30 دقيقة
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const json = await response.json();

      setHasMore(json?.hasMore);
      setPosts(json?.data || []);
      setUserPostsCount(json?.count || 0);
      dispatch({ type: 'MY_POSTS', payload: json });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }
  return (
    <div className="flex flex-col justify-center items-center w-full p-4">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] h-fit px-2 sm:px-4 overflow-y-auto z-10 border-2 rounded-lg my-4">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center lg:items-start w-full gap-4 py-4 sm:mt-8">
            {posts && (
              <h1 className=" text-lg lg:text-2xl w-fit p-2 rounded-lg shadow-md">
                <span className="text-primary-500 text-2xl ml-2">#</span>
                أحدث إعلانات{' '}
                <span className="text-primary-500"> {posts[0]?.userName}</span>
              </h1>
            )}
          </div>

          {loading ? (
            <Loading />
          ) : posts?.length === 0 ? (
            <Loading
              myMessage={'😉 لا يوجد نتائج لعرضها ,لم تقم بإنشاء أي إعلان بعد'}
            />
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-start items-start w-full">
                {posts?.map((post) => (
                  <div
                    className="relative flex flex-col items-start h-full justify-start hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer overflow-hidden"
                    key={post.id}
                    onClick={() => {
                      // localStorage.setItem('item', JSON.stringify(post));
                      // router.push(`/post/${post.id}`);
                    }}
                  >
                    <SmallCard item={post} category={post?.categoryName} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <Pagination hasMore={hasMore} setPage={setPage} page={page} />
        )}
      </div>
    </div>
  );
};

export default SellerPosts;
