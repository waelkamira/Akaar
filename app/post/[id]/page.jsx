'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useMemo } from 'react';
import Loading from '../../../components/ReusableComponents/Loading';
import dynamic from 'next/dynamic';
import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
import {
  FaTag,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// تحميل المكونات بشكل ديناميكي
const ImageSlider = dynamic(
  () => import('../../../components/photos/imageSlider'),
  {
    loading: () => <Loading />,
  }
);

const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
  loading: () => <Loading />,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => <Loading />,
  }
);

export default function Page() {
  const [post, setPost] = useState({});
  const [iframeSrc, setIframeSrc] = useState(null);
  const session = useSession();
  const [categoryFields, setCategoryFields] = useState([]);
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = JSON.parse(localStorage.getItem('item'));
      setPost(item);
      console.log('item', item);
    }
  }, []);

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

  const getFieldValue = (field, value) => {
    if (field.options && field.options[value]) {
      console.log('field.options[value]', field.options[value]);
      return field.options[value];
    }
    return value;
  };

  const commonFields = useMemo(
    () => [
      {
        name: 'العنوان',
        icon: <FaTag className="text-primary-500 text-lg sm:text-xl" />,
        value: post?.title,
      },
      {
        name: 'تاريخ الإعلان',
        icon: <FaClock className="text-primary-500 text-lg sm:text-xl" />,
        value: post?.createdAt,
      },
      {
        name: 'السعر',
        icon: <FaDollarSign className="text-primary-500 text-lg sm:text-xl" />,
        value: post?.basePrice,
      },
      {
        name: 'المدينة',
        icon: (
          <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
        ),
        value: post?.city,
      },
      {
        name: 'المنطقة',
        icon: (
          <FaMapMarkerAlt className="text-primary-500 text-lg sm:text-xl" />
        ),
        value: post?.town,
      },
      {
        name: 'رقم الهاتف',
        icon: <FaPhone className="text-primary-500 text-lg sm:text-xl" />,
        value: post?.phoneNumber,
      },
    ],
    [post]
  );

  const fields = useMemo(
    () => [...commonFields, ...categoryFields],
    [commonFields, categoryFields]
  );

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (post?.link) {
        const embedUrl = await getEmbedUrl(post?.link);
        setIframeSrc(embedUrl);
      }
    };
    fetchEmbedUrl();
  }, [post?.link]);

  if (error) {
    return <div>{error}</div>;
  }

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

  // دالة للتحقق من صلاحية الرابط
  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('رابط غير صالح:', error);
      return false;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gray-50 min-h-screen p-6 sm:p-12">
      {post && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full xl:w-[80%] 2xl:w-[70%] bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {session?.status === 'authenticated' && (
            <div className="flex flex-col justify-center items-center w-full h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
              <div className="flex justify-center w-full">
                <div className="flex flex-col w-full p-2 sm:p-8 my-2 bg-white">
                  <UserNameAndPhoto
                    post={{
                      createdAt: post?.createdAt,
                    }}
                  />

                  {/* عرض العنوان إذا كان موجودًا */}
                  {post?.title && (
                    <div className="flex justify-center w-full">
                      <h1 className="sm:my-4 text-xl sm:text-3xl text-primary-500 font-semibold select-none text-wrap line-clamp-1 max-w-[20ch] lg:max-w-[40ch] text-center">
                        {post?.title}
                      </h1>
                    </div>
                  )}

                  {/* عرض Loading إذا لم توجد صورة */}
                  {!post?.image1 && <Loading myMessage={'جاري تحميل الصورة'} />}

                  {/* عرض ImageSlider إذا كانت هناك صور */}
                  {(post?.image1 ||
                    post?.image2 ||
                    post?.image3 ||
                    post?.image4 ||
                    post?.image5) && (
                    <ImageSlider
                      image1={post?.image1}
                      image2={post?.image2}
                      image3={post?.image3}
                      image4={post?.image4}
                      image5={post?.image5}
                    />
                  )}

                  <div className="mt-4 sm:mt-16">
                    {/* عرض مواصفات الإعلان إذا كانت هناك تفاصيل */}
                    {post?.details && (
                      <div>
                        <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-primary-500 font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-primary-500 text-2xl mx-2 select-none">
                              #
                            </span>
                            مواصفات الإعلان:
                          </h1>
                        </div>

                        <div className="flex flex-col w-full">
                          <div className="flex flex-col sm:grid md:grid-cols-2 sm:gap-x-4 w-full">
                            {fields.map((field, index) => {
                              const value =
                                post?.details?.[field?.name] || field?.value;
                              const displayValue = getFieldValue(field, value);
                              // console.log('displayValue', displayValue);

                              // عرض الحقل فقط إذا كانت القيمة موجودة
                              return displayValue ? (
                                <ItemSmallItem
                                  key={index}
                                  icon={field?.icon}
                                  text={field?.label || field?.name}
                                  value={displayValue}
                                />
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* عرض وصف الإعلان إذا كان موجودًا */}
                    {post?.description && (
                      <div>
                        <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-primary-500 font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-primary-500 text-2xl mx-2 select-none">
                              #
                            </span>
                            وصف الإعلان:
                          </h1>
                        </div>

                        <div className="bg-gray-50 p-4 w-full rounded-lg">
                          <pre className="flex justify-start items-start bg-white rounded-lg h-72 overflow-y-auto text-md sm:text-xl w-full shadow-sm shadow-gray-300 min-h-20 my-2 p-2 select-none">
                            {post?.description}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* عرض الخريطة إذا كانت الإحداثيات موجودة */}
                    {post?.lng && post?.lat && (
                      <div>
                        <div className="flex justify-between items-center my-4 lg:my-8 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-primary-500 font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-primary-500 text-2xl mx-2 select-none">
                              #
                            </span>
                            الموقع على الخريطة:
                          </h1>
                        </div>
                        <div>
                          <SyriaMap lng={post?.lng} lat={post?.lat} />
                        </div>
                      </div>
                    )}

                    {/* عرض الفيديو إذا كان الرابط موجودًا */}
                    {post?.link && iframeSrc && (
                      <div>
                        <div className="flex justify-between items-center my-4 sm:my-4 h-10 sm:h-16 w-full overflow-visible">
                          <h1 className="text-primary-500 font-bold text-lg sm:text-xl w-full mb-2 select-none">
                            <span className="text-primary-500 text-2xl mx-2 select-none">
                              #
                            </span>
                            الفيديو :
                          </h1>
                        </div>
                        <div className="flex justify-center items-center w-full">
                          <div className="flex flex-col w-full">
                            {iframeSrc && (
                              <iframe
                                src={iframeSrc}
                                className="w-full h-44 sm:h-96"
                                title="Property Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
