'use client';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react'; // استيراد الأدوات المطلوبة
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';
import { TbHeartFilled } from 'react-icons/tb'; // أيقونة القلب المملوء
import toast from 'react-hot-toast';
import { FaRegHeart } from 'react-icons/fa6'; // أيقونة القلب الفارغ
import { IoLocationOutline } from 'react-icons/io5'; // أيقونة الموقع

// استخدام React.memo لتجنب إعادة التصيير غير الضروري
const SmallCard = React.memo(function SmallCard({ item, category }) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false); // حالة المفضلة
  const [categoryFields, setCategoryFields] = useState([]); // الحقول الخاصة بالفئة
  const [userId, setUserId] = useState(null); // معرف المستخدم
  const [favoriteIds, setFavoriteIds] = useState([]); // قائمة معرفات المفضلة
  const isMounted = useRef(false); // استخدام useRef لتتبع حالة المونت

  // دالة لتحويل القيم إلى النصوص المقابلة
  const getFieldValue = useCallback((field, value) => {
    if (field?.options && field.options[value]) {
      return field.options[value]; // إرجاع النص المقابل للقيمة
    }
    return value; // إذا لم يكن هناك خيارات، إرجاع القيمة كما هي
  }, []);

  // جلب الحقول بناءً على الفئة
  useEffect(() => {
    console.log('جلب الحقول بناءً على الفئة');

    if (item?.categoryName) {
      import(`../categoryFields/${item?.categoryName}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
        });
    }
  }, [item?.categoryName]); // الاعتماد على item?.categoryName فقط

  // جلب معرف المستخدم من localStorage
  useEffect(() => {
    console.log('جلب معرف المستخدم من localStorage');

    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user?.id); // تعيين معرف المستخدم
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }
  }, []);

  // جلب قائمة معرفات المفضلة
  const fetchAndStoreUserFavoriteIds = useCallback(async (userId) => {
    console.log(' جلب قائمة معرفات المفضلة');

    if (!userId) return;

    try {
      const response = await fetch(`/api/favorite/ids?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const productIds = json?.productIds || [];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteIds', JSON.stringify(productIds));
        setFavoriteIds(productIds); // تحديث الحالة المحلية
      }
    } catch (error) {
      console.error('Failed to fetch or store favorites data:', error);
      toast.error('فشل في جلب بيانات المفضلة');
    }
  }, []);

  // جلب المفضلات عند تغيير userId
  useEffect(() => {
    if (userId) {
      fetchAndStoreUserFavoriteIds(userId);
    }
  }, [userId, fetchAndStoreUserFavoriteIds]);

  // دالة التحقق من حالة المفضلة
  const checkFavoriteStatus = useCallback(() => {
    console.log('دالة التحقق من حالة المفضلة');

    if (item?.id && Array.isArray(favoriteIds)) {
      const favorited = favoriteIds.includes(item?.id);
      setIsFavorited(favorited);
    } else {
      setIsFavorited(false);
    }
  }, [item?.id, favoriteIds]);

  // تحديث حالة المفضلة عند تغيير item?.id أو favoriteIds
  useEffect(() => {
    if (isMounted.current) {
      checkFavoriteStatus();
    } else {
      isMounted.current = true; // تجنب التشغيل الأولي
    }
  }, [checkFavoriteStatus]);

  // إضافة أو إزالة المنتج من المفضلة
  const handleFavorite = useCallback(async () => {
    console.log('إضافة أو إزالة المنتج من المفضلة');

    if (!item?.id || !userId) return;

    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFavorited(data?.favorited);
        fetchAndStoreUserFavoriteIds(userId); // تحديث قائمة المفضلات
        toast.success(data?.message);
      } else {
        toast.error('حدث خطأ أثناء إضافته إلى المفضلة');
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      toast.error('حدث خطأ أثناء إضافته إلى المفضلة');
    }
  }, [item?.id, userId, fetchAndStoreUserFavoriteIds]);

  // استخدام useMemo لحساب القيم المعروضة
  const displayValues = useMemo(() => {
    console.log(' استخدام useMemo لحساب القيم المعروضة');

    return categoryFields?.slice(0, 3)?.map((field, index) => {
      const value = item.details[field.name];
      return getFieldValue(field, value);
    });
  }, [categoryFields, item.details, getFieldValue]);

  return (
    <>
      {item && (
        <div
          className="flex flex-col justify-center items-center w-full cursor-pointer bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden relative group"
          key={item?.id}
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('item', JSON.stringify(item));
              localStorage.setItem('category', JSON.stringify(category));
            }
            router.push(`/post/${item?.id}`);
          }}
        >
          {/* الصورة مع طبقة هوفر برتقالية */}
          <div className="relative w-full h-48 bg-gray-300">
            {!item?.image1 && <LoadingPhoto />}
            {item?.image1 && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={item?.image1}
                  fill
                  priority
                  objectFit="cover"
                  alt="item_photo"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item?.createdAt && (
                  <div className="absolute bottom-2 right-2 z-0 flex justify-center items-center bg-white rounded-full px-2 py-1 shadow-sm text-xs text-black">
                    <FormatDate dateString={item?.createdAt} />
                  </div>
                )}
                {item?.details?.propertyType && (
                  <div className="absolute top-2 right-2 z-0 flex justify-center items-center bg-one rounded-full px-3 py-1 shadow-sm text-xs text-white">
                    {item?.details?.propertyType === '1' ? 'بيع' : 'إجار'}
                  </div>
                )}
              </div>
            )}
            {/* الطبقة البرتقالية عند الهوفر */}
            <div className="absolute inset-0 bg-one/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
            <h5 className="flex items-center justify-start gap-1 font-thin text-sm text-gray-700">
              <IoLocationOutline className="text-one" />
              {item?.city || 'غير محدد'}
            </h5>

            {item?.title && (
              <h1 className="text-lg text-gray-800 line-clamp-1 font-serif font-medium">
                {item?.title?.split(' ').slice(0, 5).join(' ')}
              </h1>
            )}

            <div className="flex flex-col justify-between items-start">
              {item?.description && (
                <h1 className="text-sm line-clamp-2 font-thin text-gray-700">
                  {item?.description}
                </h1>
              )}
            </div>
          </div>

          {/* الحقول الإضافية */}
          <div className="flex justify-start items-center gap-1 w-full p-4 border-t border-gray-200 font-serif">
            {displayValues?.map((displayValue, index) => (
              <div
                key={index}
                className="flex items-center gap-2 mb-2 text-sm text-gray-700"
              >
                <h6 className="flex items-center gap-1 font-thin">
                  <span className="text-gray-500 text-nowrap">
                    {categoryFields[index]?.label ||
                      categoryFields[index]?.name}
                  </span>
                  : <span className="font-bold"> {displayValue || '?'}</span>
                </h6>
              </div>
            ))}
          </div>
          <h1 className="flex justify-between items-center text-start w-full text-md font-bold text-one p-4">
            <span className="text-one"> {item?.basePrice} $</span>
            <button className="bg-one text-white p-2 rounded-full text-sm font-thin">
              عرض التفاصيل
            </button>
          </h1>

          {/* أيقونة المفضلة */}
          <div
            className="absolute top-0 left-2 z-10 size-10 p-2"
            onClick={(e) => {
              e.stopPropagation();
              handleFavorite();
            }}
          >
            <div
              className={`bg-white backdrop-blur-sm rounded-full size-8 p-2 shadow-md shadow-gray-500 transition-all duration-300 hover:scale-110 cursor-pointer`}
            >
              {isFavorited ? (
                <TbHeartFilled className="size-4 text-red-500 transition-colors duration-300" />
              ) : (
                <FaRegHeart className="size-4 text-gray-400 hover:text-red-500 transition-colors duration-300" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default SmallCard;
