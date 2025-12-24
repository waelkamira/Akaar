'use client';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { inputsContext } from '../../components/authContext/Context';
import { useParams, useRouter } from 'next/navigation';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import Pagination from '../../components/ReusableComponents/Pagination';
import Loading from '../../components/ReusableComponents/Loading';
import PostActions from './PostActions';
import LoginButton from '../../components/Buttons/LoginButton';
const fakeData = [
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: 'https://i.imgur.com/vGpGUAj.png',
    image3: 'https://i.imgur.com/vGpGUAj.png',
    image4: 'https://i.imgur.com/vGpGUAj.png',
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
  {
    id: '96a5b419-2513-4a13-ac15-4663f81e295c',
    title:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة مم',
    userId: 'b2a4f3fa-2bb7-4f97-95db-4fa53c581bb4',
    categoryId: 20,
    categoryName: 'زراعة',
    image1: 'https://i.imgur.com/vGpGUAj.png',
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    basePrice: 0,
    adCategory: null,
    city: 'دمشق',
    town: null,
    phoneNumber: '0938089837',
    lng: null,
    lat: null,
    link: '',
    details: [Object],
    description:
      'للبيع منزل في دمشق حي الميدان تنظيم شرقي الميدان طابق سابع  مصعد طاقة مساحة 110متر طابو اخضر كسوة ممتازة اتجاه قبلي كامل مشمس اطلالات مفتوحة. للسعر والصور واتس 0938089837',
    stockQuantity: 1,
    isDeleted: false,
    deletedAt: null,
    createdAt: ' 2025-03-11T09:27:23.000Z',
    updatedAt: '2025-08-01T11:51:08.335Z',
  },
];
const PostsContent = () => {
  const { dispatch } = useContext(inputsContext);
  const [page, setPage] = useState(1);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const session = useSession();
  const [posts, setposts] = useState(fakeData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // دالة محسنة لجلب الإعلانات مع التخزين المؤقت
  const fetchposts = useCallback(
    async (userId) => {
      if (!userId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/posts?page=${page}&userId=${userId}&limit=8`,
          {
            next: { revalidate: 1800 }, // إعادة التحقق بعد 30 دقيقة
          }
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const json = await response.json();

        setHasMore(json?.hasMore);
        setposts(json?.data || []);
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
      fetchposts(userId);
    }
  }, [fetchposts, session]);

  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }
  return (
    <div className="flex flex-col justify-center items-center w-full p-4 mt-16 sm:mt-0">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] h-fit px-2 sm:px-16 overflow-y-auto z-10 border-2 rounded-lg my-4">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center lg:items-start w-full gap-4 py-4 sm:mt-16">
            <h1 className=" text-lg lg:text-2xl w-fit p-2 rounded-lg shadow-md">
              <span className="text-primary-500 text-2xl ml-2">#</span>
              إعلاناتي{' '}
              <span className="text-primary-500"> {userPostsCount}</span>
            </h1>
          </div>

          {loading ? (
            <Loading />
          ) : posts.length === 0 ? (
            <Loading
              myMessage={'😉 لا يوجد نتائج لعرضها ,لم تقم بإنشاء أي إعلان بعد'}
            />
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-start items-start w-full">
                {posts.map((post) => (
                  <div
                    className="relative flex flex-col border-2 items-start h-full justify-start hover:scale-[101%] transition-transform duration-300 ease-in-out cursor-pointer overflow-hidden"
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
                        fetchposts(userId);
                      }}
                    />
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

export default PostsContent;
