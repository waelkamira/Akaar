'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import Loading from '../../../components/ReusableComponents/Loading';
import dynamic from 'next/dynamic';

import {
  FaTag,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { toInteger } from 'lodash';
import UploadingAndDisplayingImage from '../../../components/photos/UploadingAndDisplayingImage';
import { inputsContext } from '../../../components/authContext/Context';

const OnClickMap = dynamic(() => import('../../../components/map/OnClickMap'), {
  loading: () => <Loading />,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => <Loading />,
  }
);

export default function EditePost() {
  const [post, setPost] = useState({});
  const [iframeSrc, setIframeSrc] = useState(null);
  const session = useSession();
  const [categoryFields, setCategoryFields] = useState([]);
  const [error, setError] = useState(null);
  const { addImages, dispatch, location } = useContext(inputsContext);

  // حالة واحدة لتخزين جميع الحقول الأساسية والفرعية
  const [fields, setFields] = useState({
    title: '',
    description: '',
    basePrice: 0, // السعر
    city: '',
    town: '', // المنطقة
    phoneNumber: '',
    lng: location?.[1] || 36.2765,
    lat: location?.[0] || 33.5138,
    details: {}, // الحقول الفرعية
    image1: addImages[0] || '',
    image2: addImages[1] || '',
    image3: addImages[2] || '',
    image4: addImages[3] || '',
    image5: addImages[4] || '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = JSON.parse(localStorage.getItem('item'));
      setPost(item);

      // دالة للتحقق من صحة الصورة
      const isValidImage = (imageUrl) => {
        if (!imageUrl) return false; // إذا كانت الصورة فارغة أو null
        return imageUrl.startsWith('http') || imageUrl.startsWith('https'); // التحقق من أن الرابط صالح
      };

      // تصفية الصور الفارغة أو null أو غير الصحيحة
      const validImages = [
        item?.image1,
        item?.image2,
        item?.image3,
        item?.image4,
        item?.image5,
      ].filter((image) => image && isValidImage(image)); // التحقق من صحة الصورة

      // إرسال الصور الصالحة إلى addImages
      dispatch({
        type: 'ADD_IMAGE',
        payload: validImages,
      });

      if (item) {
        // تحديث الحالة الأولية للحقول
        setFields((prev) => ({
          ...prev,
          title: item?.title || '',
          description: item?.description || '',
          basePrice: item?.basePrice || 0, // السعر
          city: item?.city || '',
          town: item?.town || '', // المنطقة
          phoneNumber: item?.phoneNumber || '',
          lng: item?.lng || location?.[1] || 36.2765,
          lat: item?.lat || location?.[0] || 33.5138,
          details: item?.details || {},
        }));
      }
    }
  }, [location]);
  // جلب الحقول حسب اسم الفئة
  useEffect(() => {
    if (post?.categoryName) {
      import(`../../../components/categoryFields/${post?.categoryName}.jsx`)
        .then((module) => {
          setCategoryFields(module.default);
        })
        .catch((err) => {
          console.error('Failed to load fields:', err);
          setError('فشل في تحميل الحقول');
        });
    }
  }, [post?.categoryName]);

  const commonFields = useMemo(
    () => [
      {
        name: 'title', // اسم الحقل
        label: 'العنوان',
        icon: <FaTag className="text-one text-lg sm:text-xl" />,
        value: fields.title,
      },
      {
        name: 'createdAt', // اسم الحقل
        label: 'تاريخ الإعلان',
        icon: <FaClock className="text-one text-lg sm:text-xl" />,
        value: post?.createdAt,
      },
      {
        name: 'basePrice', // اسم الحقل
        label: 'السعر',
        icon: <FaDollarSign className="text-one text-lg sm:text-xl" />,
        value: toInteger(fields.basePrice) || 0,
      },
      {
        name: 'city', // اسم الحقل
        label: 'المدينة',
        icon: <FaMapMarkerAlt className="text-one text-lg sm:text-xl" />,
        value: fields.city,
      },
      {
        name: 'town', // اسم الحقل
        label: 'المنطقة',
        icon: <FaMapMarkerAlt className="text-one text-lg sm:text-xl" />,
        value: fields.town,
      },
      {
        name: 'phoneNumber', // اسم الحقل
        label: 'رقم الهاتف',
        icon: <FaPhone className="text-one text-lg sm:text-xl" />,
        value: fields.phoneNumber,
      },
    ],
    [fields, post?.createdAt]
  );

  // دمج الحقول الأساسية مع الحقول الفرعية من details
  const allFields = useMemo(() => {
    return [
      ...commonFields,
      ...categoryFields.map((field) => ({
        ...field,
        value: fields.details?.[field.name] || '', // الحصول على القيم من details
      })),
    ];
  }, [commonFields, categoryFields, fields.details]);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (post?.link) {
        const embedUrl = await getEmbedUrl(post?.link);
        setIframeSrc(embedUrl);
      }
    };
    fetchEmbedUrl();
  }, [post?.link]);

  const getEmbedUrl = async (url) => {
    if (!url) return null;

    // رابط يوتيوب
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (videoId && videoId[1]) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }

    // رابط تيك توك
    if (url.includes('tiktok.com')) {
      const videoId = url.match(/\/video\/(\d+)/);
      if (videoId && videoId[1]) {
        const embedUrl = `https://www.tiktok.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }

    return null; // إذا لم يكن الرابط يوتيوب أو تيك توك صالح
  };

  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('رابط غير صالح:', error);
      return false;
    }
  };

  const handleFieldChange = (fieldName, value) => {
    if (fieldName in fields) {
      // تحديث الحقول الأساسية
      setFields((prev) => ({ ...prev, [fieldName]: value }));
    } else {
      // تحديث الحقول الفرعية في details
      setFields((prev) => ({
        ...prev,
        details: { ...prev.details, [fieldName]: value },
      }));
    }
  };
  const handleSave = async () => {
    console.log('addImages قبل الإرسال:', addImages); // تحقق من محتوى addImages

    if (post?.id && addImages?.length !== 0) {
      // إنشاء كائن يحتوي على الصور بالشكل المطلوب
      const imagesObject = {
        image1: addImages[0] || null,
        image2: addImages[1] || null,
        image3: addImages[2] || null,
        image4: addImages[3] || null,
        image5: addImages[4] || null,
      };

      // إنشاء الكائن النهائي للإرسال
      const updatedPost = {
        id: post?.id,
        ...imagesObject, // إضافة الصور
        ...fields, // إضافة الحقول الأخرى
      };

      console.log('بيانات التحديث قبل الإرسال:', updatedPost); // طباعة البيانات قبل الإرسال

      // إرسال البيانات إلى الخادم
      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedPost,
          basePrice: toInteger(updatedPost.basePrice),
        }),
      });

      const responseData = await response.json();
      console.log('استجابة الخادم:', responseData); // طباعة استجابة الخادم

      if (response.ok) {
        toast.success('تم تحديث الإعلان بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تحديث الإعلان');
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full bg-five mt-16 text-black">
      {post && (
        <div className="w-full xl:w-[80%] 2xl:w-[70%] p-3 bg-gray-100">
          {session?.status === 'authenticated' && (
            <div className="flex flex-col justify-center items-center w-full h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
              <div className="flex justify-center w-full">
                <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white border-t-[10px] border-one rounded-t-lg">
                  <UserNameAndPhoto
                    post={{
                      createdAt: post?.createdAt,
                    }}
                  />

                  {/* العنوان */}
                  <input
                    type="text"
                    value={fields.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="العنوان"
                    className="p-2 border border-gray-300 rounded my-4"
                  />

                  {/* الصور */}
                  <div className="flex flex-col gap-4">
                    <UploadingAndDisplayingImage />
                  </div>

                  {/* الحقول الأساسية */}
                  <div className="flex flex-col gap-4 mt-4">
                    {allFields.map((field, index) => {
                      return (
                        <div key={index} className="flex flex-col gap-2">
                          <label className="text-gray-700">
                            {field?.label || field?.name}
                          </label>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) =>
                              handleFieldChange(field.name, e.target.value)
                            }
                            className="p-2 border border-gray-300 rounded"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* وصف الإعلان */}
                  <textarea
                    value={fields.description}
                    onChange={(e) =>
                      handleFieldChange('description', e.target.value)
                    }
                    placeholder="وصف الإعلان"
                    className="p-2 border border-gray-300 rounded my-4"
                  />

                  {/* الخريطة */}
                  <OnClickMap />

                  {/* زر الحفظ */}
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white p-2 rounded mt-4"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
