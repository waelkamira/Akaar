'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { FaTag, FaDollarSign, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { toInteger } from 'lodash';
import { inputsContext } from '../../../components/authContext/Context';
import { useParams, useRouter } from 'next/navigation';
import PostForm from './PostForm';
import UploadingAndDisplayingImage from '../../../components/photos/UploadingAndDisplayingImage';
import UserNameAndPhoto from '../../../components/ReusableComponents/userNameAndPhoto';

export default function EditePost() {
  const [post, setPost] = useState({});
  const [categoryFields, setCategoryFields] = useState([]);
  const [error, setError] = useState(null);
  const { addImages, dispatch, location } = useContext(inputsContext);
  const router = useRouter();
  const session = useSession();
  const { id } = useParams();
  // الحقول
  const [fields, setFields] = useState({
    title: '',
    description: '',
    basePrice: 0,
    city: '',
    town: '',
    phoneNumber: '',
    lng: location?.[1] || 36.2765,
    lat: location?.[0] || 33.5138,
    details: {},
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
  });

  useEffect(() => {
    getPost();
  }, []);

  // دالة جلب البوست
  async function getPost() {
    const response = await fetch(`/api/showPostById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      const json = await response.json();
      // console.log('json', json);
      setPost(json);
    } else {
      setError(response.statusText);
    }
  }

  // تم دمج الصور الموجودة مع الصور التي سوف تتم اضافتها في مصفوفة واحدة والتحقق من الصور
  useEffect(() => {
    // دالة للتحقق من صحة الصورة
    const isValidImage = (imageUrl) => {
      if (!imageUrl) return false; // إذا كانت الصورة فارغة أو null
      return imageUrl.startsWith('http') || imageUrl.startsWith('https'); // التحقق من أن الرابط صالح
    };

    // تصفية الصور الفارغة أو null أو غير الصحيحة
    const validImages = [
      post?.image1,
      post?.image2,
      post?.image3,
      post?.image4,
      post?.image5,
    ].filter((image) => image && isValidImage(image)); // التحقق من صحة الصورة

    // إرسال الصور الصالحة إلى addImages
    dispatch({
      type: 'ADD_IMAGE',
      payload: validImages,
    });
  }, [post]);

  // دالة وضع القيم الاولية في حقولها المناسبة
  useEffect(() => {
    setFields((prev) => ({
      ...prev,
      title: post?.title || '',
      image1: addImages[0] || null,
      image2: addImages[1] || null,
      image3: addImages[2] || null,
      image4: addImages[3] || null,
      image5: addImages[4] || null,
      description: post?.description || '',
      basePrice: post?.basePrice || 0, // السعر
      city: post?.city || '',
      town: post?.town || '', // المنطقة
      phoneNumber: post?.phoneNumber || '',

      details: post?.details || {},
    }));
  }, [addImages, post]);
  console.log('location', location);

  // تم فصل تحديث الموقع عن التحديث الأخر حتى لايقوم بحذف قيم الحالة الاخرى
  useEffect(() => {
    if (post) {
      setFields((prev) => ({
        ...prev,
        // تحديث القيم الموجودة مسبقًا فقط دون حذف القيم الأخرى
        lng: location?.[1] || 36.2765,
        lat: location?.[0] || 33.5138,
      }));
    }
  }, [location, post]);

  //جلب الحقول حسب الفئة
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

  //الحقول المشتركة
  const commonFields = useMemo(
    () => [
      {
        name: 'title',
        label: 'العنوان',
        icon: <FaTag className="text-primary-500 text-lg sm:text-xl" />,
        value: fields?.title,
      },
      {
        name: 'basePrice',
        label: 'السعر',
        icon: <FaDollarSign className="text-primary-500 text-lg sm:text-xl" />,
        value: toInteger(fields?.basePrice) || 0,
      },
      {
        name: 'city',
        label: 'المدينة',
        icon: (
          <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
        ),
        value: fields?.city,
      },
      {
        name: 'town',
        label: 'المنطقة',
        icon: (
          <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
        ),
        value: fields?.town,
      },
      {
        name: 'phoneNumber',
        label: 'رقم الهاتف',
        icon: <FaPhone className="text-primary-500 text-lg sm:text-xl" />,
        value: fields?.phoneNumber,
      },
    ],
    [fields, post?.createdAt]
  );

  // دالة تحديث الحقول
  const handleFieldChange = (fieldName, value) => {
    if (fieldName in fields) {
      setFields((prev) => ({ ...prev, [fieldName]: value }));
    } else {
      setFields((prev) => ({
        ...prev,
        details: { ...prev.details, [fieldName]: value },
      }));
    }
  };

  // دالة إرسال البيانات بعد التعديل
  const handleSave = async () => {
    if (post?.id) {
      const updatedPost = {
        id: post?.id,
        ...fields,
      };

      console.log('updatedPost:', updatedPost);

      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedPost,
          basePrice: toInteger(updatedPost.basePrice),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success('تم تحديث الإعلان بنجاح');
        if (typeof window !== 'undefined') {
          localStorage.setItem('item', JSON.stringify(updatedPost));
        }
        router.push('/posts');
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
            <div className="flex flex-col justify-center items-center w-full h-full sm:px-16 pt-8 overflow-y-auto z-10 px-2 border">
              <UserNameAndPhoto post={post} />
              <UploadingAndDisplayingImage />

              <PostForm
                post={post}
                fields={fields}
                handleFieldChange={handleFieldChange}
                commonFields={commonFields}
                categoryFields={categoryFields}
                handleSave={handleSave}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
