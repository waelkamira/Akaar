'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import Loading from '../../components/ReusableComponents/Loading';
import SmallCard from '../../components/ReusableComponents/SmallCard/SmallCard';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
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
export default function Favorites() {
  const [myFavorites, setMyFavorites] = useState(fakeData);
  const [userId, setUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const session = useSession();

  // جلب معرف المستخدم
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('CurrentUser'));
      setUserId(user?.id);
    }
  }, []);

  // دالة محسنة لجلب المفضلة مع التخزين المؤقت
  const fetchMyFavorites = useCallback(async () => {
    try {
      if (!userId) return;

      setLoading(true);
      const response = await fetch(
        `/api/favorite?userId=${userId}&page=${pageNumber}&limit=8`,
        {
          next: { revalidate: 1800 }, // إعادة التحقق بعد 30 دقيقة
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
        <CustomToast t={t} message={'حدث خطأ أثناء جلب المفضلة 😐'} />
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
  if (session?.status === 'unauthenticated') {
    // return <LoginButton />;
  }
  return (
    <div className="flex flex-col justify-center items-center w-full sm:my-8">
      <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[80%] px-2 sm:px-16 pt-2 overflow-y-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-[5px] shadow-sm my-8">
          <h2 className="text-lg font-medium select-none">
            عدد الإعلانات التي أعجبت بها:
            <span className="text-green-600 font-bold mx-2">{totalCount}</span>
          </h2>
        </div>

        {/* {initialLoad ? (
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
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
          {fakeData?.map((favorite, index) => (
            <div
              key={`${favorite.id}-${index}`}
              className="relative flex flex-col border border-gray-200 items-start h-full justify-start bg-white hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden"
            >
              <SmallCard item={favorite} />
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
}
