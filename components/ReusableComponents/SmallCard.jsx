'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LoadingPhoto from '../photos/LoadingPhoto';
import FormatDate from './FormatDate';
import { TbHeartFilled } from 'react-icons/tb'; // أيقونة القلب
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SmallCard({ item, category }) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false); // حالة المفضلة
  const [categoryFields, setCategoryFields] = useState([]);
  const [userId, setUserId] = useState(null);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]); // قائمة المفضلات
  const session = useSession();

  // دالة لتحويل القيم إلى النصوص المقابلة
  const getFieldValue = (field, value) => {
    if (field?.options && field.options[value]) {
      return field.options[value]; // إرجاع النص المقابل للقيمة
    }
    return value; // إذا لم يكن هناك خيارات، إرجاع القيمة كما هي
  };

  // جلب الحقول بناءً على الفئة
  useEffect(() => {
    if (item?.categoryName) {
      import(`../categoryFields/${item?.categoryName}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
        });
    }
  }, [item]);

  // جلب معرف المستخدم
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('CurrentUser'));
      setUserId(user?.id);
    }
  }, []);

  // جلب قائمة المفضلات
  useEffect(() => {
    checkFavoriteStatus();
  }, [userId]);

  // التحقق مما إذا كان المنتج مضافًا إلى المفضلة
  async function checkFavoriteStatus() {
    if (userId) {
      const response = await fetch(`/api/favorite/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const json = await response.json();
        console.log('المفضلات:', json); // تسجيل البيانات للتحقق
        setFavoriteProductIds(json?.favoriteProductIds || []); // تخزين قائمة المفضلات
      } else {
        console.error('حدث خطأ أثناء التحقق من المفضلة:', json?.error);
      }
    }
  }

  // تحديث حالة المفضلة بناءً على قائمة المفضلات
  useEffect(() => {
    if (item?.id && favoriteProductIds.includes(String(item?.id))) {
      setIsFavorited(true);
    } else {
      setIsFavorited(false);
    }
  }, [item?.id, favoriteProductIds]);

  // إضافة أو إزالة المنتج من المفضلة
  const handleFavorite = async () => {
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
        setIsFavorited(data.favorited); // تحديث حالة المفضلة بناءً على الاستجابة

        // تحديث قائمة المفضلات محليًا
        if (data.favorited) {
          setFavoriteProductIds((prev) => [...prev, String(item.id)]); // إضافة المنتج إلى القائمة
        } else {
          setFavoriteProductIds((prev) =>
            prev.filter((id) => id !== String(item.id))
          ); // إزالة المنتج من القائمة
        }

        toast.success(data.message);
      } else {
        toast.error('حدث خطأ أثناء إضافته إلى المفضلة');
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  return (
    <>
      {item && (
        <div
          className="flex flex-col justify-center items-center w-full cursor-pointer bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out rounded-lg overflow-hidden relative group"
          key={item?.id}
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('item', JSON.stringify(item));
              console.log('category', category);
              localStorage.setItem('category', JSON.stringify(category));
            }
            router.push(`/post/${item?.id}`);
          }}
        >
          {/* الصورة مع طبقة هوفر برتقالية */}
          <div className="relative w-full h-48">
            {!item?.image1 && <LoadingPhoto />}
            {item?.image1 && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={item?.image1}
                  fill
                  alt="item_photo"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            {/* الطبقة البرتقالية عند الهوفر */}
            <div className="absolute inset-0 bg-one/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="flex flex-col justify-between gap-2 w-full p-4 bg-white text-black rounded-b-lg">
            {item?.title && (
              <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {item?.title?.split(' ').slice(0, 5).join(' ')}
              </h1>
            )}

            <div className="flex justify-between items-center">
              {item?.city && (
                <h1 className="text-sm text-gray-600">{item?.city}</h1>
              )}
              {item?.description && (
                <h1 className="text-sm line-clamp-2">{item?.description}</h1>
              )}
            </div>

            {item?.createdAt && (
              <div className="absolute top-2 left-2 z-0 flex justify-center items-center bg-white/80 rounded-full px-2 py-1 shadow-sm text-xs text-gray-700">
                <FormatDate dateString={item?.createdAt} />
              </div>
            )}
          </div>

          {/* الحقول الإضافية */}
          <div className="w-full p-4 bg-gray-50 border-t border-gray-200">
            {categoryFields
              ?.slice(0, 2) // أخذ أول حقلين فقط
              ?.map((field, index) => {
                const value = item.details[field.name];
                const displayValue = getFieldValue(field, value);

                return (
                  <div
                    key={index} // مفتاح فريد لكل عنصر
                    className="flex items-center gap-2 mb-2 text-sm text-gray-700"
                  >
                    {field?.icon}{' '}
                    <h3>
                      <span className="text-gray-500">
                        {field?.label || field.name}
                      </span>
                      :{' '}
                      <span className="font-bold">
                        {' '}
                        {displayValue || 'غير محدد'}
                      </span>
                    </h3>
                  </div>
                );
              })}
          </div>

          {/* أيقونة المفضلة */}
          <div
            className="absolute top-0 right-0 z-10 size-10 p-2"
            onClick={(e) => {
              e.stopPropagation(); // منع انتشار الحدث إلى البطاقة الرئيسية
              handleFavorite(); // إضافة/إزالة من المفضلة
            }}
          >
            <div
              className={`bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md shadow-gray-500 transition-all duration-300 hover:scale-110 cursor-pointer`}
            >
              <TbHeartFilled
                className={`size-4 ${
                  isFavorited
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500 '
                } transition-colors duration-300`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
