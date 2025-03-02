'use client';

import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { inputsContext } from '../Context';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { RxVideo } from 'react-icons/rx';
import { useRouter } from 'next/navigation';
import { getVideoIdAndPlatform } from '../youtubeUtils';
import { GiModernCity, GiPathDistance, GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineSubtitles } from 'react-icons/md';

const PropertyTypeSelector = dynamic(() => import('../PropertyTypeSelector'));
const Confetti = dynamic(() =>
  import('../ReusableComponents/SuccessComponent').then((mod) => mod.Confetti)
);
const OnClickMap = dynamic(() => import('../map/onClickMap'));
const CategoryComponent = dynamic(() =>
  import('../Selectors/CategoryComponent')
);
const CitySelector = dynamic(() => import('../Selectors/CitySelector'));
const RoomsNumberSelector = dynamic(() => import('./RoomsNumberSelector'));

export default function RealEstatePostForm({ setIsVisible, cancel = true }) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const [check, setCheck] = useState(false);
  const {
    data,
    dispatch,
    addImages,
    location,
    category,
    cityLocation,
    townLocation,
  } = useContext(inputsContext);

  const [inputs, setInputs] = useState({
    id: uuidv4(),
    userId: '',
    title: '',
    images: addImages || [],
    adCategory: category?.label || '',
    city: data?.propertyCity || '',
    town: data?.propertyTown || '',
    basePrice: '',
    phoneNumber: '',
    description: '',
    lng: location[1] || 36.2765,
    lat: location[0] || 33.5138,
    details: {
      propertyType: data?.propertyType?.label || '',
      roomsNumber: data?.propertyRoomsNumber?.label || '',
      link: '',
      area: '',
    },
  });

  useEffect(() => {
    if (!location && typeof window !== 'undefined') {
      console.error('Location is undefined');
      return;
    }
    const user = JSON.parse(localStorage.getItem('CurrentUser'));
    const userId = user?.id;
    setInputs((prevInputs) => ({
      ...prevInputs,
      userId: userId,
      images: addImages || [],
      adCategory: category?.label || '',
      city: data?.propertyCity || '',
      town: data?.propertyTown || '',
      lng: location[1] || 36.2765,
      lat: location[0] || 33.5138,
      details: {
        ...prevInputs.details, // الحفاظ على القيم الحالية داخل details
        propertyType: data?.propertyType?.label || '',
        roomsNumber: data?.propertyRoomsNumber?.label || '',
      },
    }));
  }, [category, data, location, addImages]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      inputs?.title &&
      inputs?.userId &&
      inputs?.adCategory &&
      inputs?.city &&
      inputs?.town &&
      inputs?.basePrice &&
      inputs?.phoneNumber &&
      inputs?.description &&
      inputs?.details?.roomsNumber &&
      inputs?.details?.propertyType &&
      inputs?.details?.area &&
      inputs?.images?.length > 0
    ) {
      try {
        const response = await fetch('/api/RealEstate/allPosts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputs,
          }),
        });

        if (response.ok) {
          dispatch({ type: 'New_POST', payload: inputs });
          dispatch({ type: 'ADD_IMAGE', payload: [] });
          dispatch({ type: 'CATEGORY', payload: '' });
          dispatch({ type: 'CITY_LOCATION', payload: '' });
          dispatch({ type: 'TOWN_LOCATION', payload: '' });
          dispatch({ type: 'LOCATION', payload: [] });
          // setIsVisible(false);
          toast.success('تم إنشاء الإعلان بنجاح');
          router.push('/myPosts');
          setInputs({
            userId: '',
            title: '',
            images: addImages || [],
            adCategory: category?.label || '',
            city: data?.propertyCity || '',
            town: data?.propertyTown || '',
            basePrice: '',
            phoneNumber: '',
            description: '',
            lng: location[1] || 36.2765,
            lat: location[0] || 33.5138,
            details: {
              propertyType: propertyType?.label || '',
              propertyRoomsNumber: propertyRoomsNumber?.label || '',
              link: '',
              area: '',
            },
          });
        } else {
          console.log('Something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setCheck(true);
      toast.error('يرجى ملء جميع الحقول');
    }
  }

  //? embed link هاتان الدالاتان للتعامل مع رابط اليويتوب الذي يقوم المستخدم بنسخه لتحويله الى
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUrl(inputValue);
    handleGenerateEmbed(inputValue); // Pass inputValue to generate embed link
  };

  const handleGenerateEmbed = (inputValue) => {
    const { videoId, platform } = getVideoIdAndPlatform(inputValue);

    if (videoId) {
      let embedLink = '';
      if (platform === 'youtube') {
        embedLink = `https://www.youtube.com/embed/${videoId}`;
      } else if (platform === 'tiktok') {
        embedLink = `https://www.tiktok.com/embed/${videoId}`;
      } else if (platform === 'facebook') {
        embedLink = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${videoId}&show_text=0&width=560`;
      }

      setEmbedLink(embedLink);
      setInputs((prevInputs) => ({
        ...prevInputs,
        details: {
          ...prevInputs.details,
          link: embedLink,
        },
      }));
    } else {
      setEmbedLink('');
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-start h-fit w-full mt-4 text-black"
      onSubmit={handleSubmit}
    >
      <div className="w-full">
        <div className="flex flex-col gap-2 xl:gap-4 md:flex-row w-full ">
          <div className="w-full p-2 xl:p-4 ">
            {/* عنوان الإعلان */}
            <div className="relative flex flex-col my-2 sm:my-4 items-center justify-center w-full ">
              <div className="flex items-center gap-2 w-full justify-start my-2">
                <h1 className="flex text-right text-md select-none text-nowrap ">
                  <span className={`text-one text-lg xl:text-2xl ml-2`}>
                    {!inputs?.title && check ? '❌' : <MdOutlineSubtitles />}
                  </span>
                  عنوان مناسب للإعلان:
                </h1>
              </div>
              <input
                autoFocus
                value={inputs?.title}
                onChange={(e) =>
                  setInputs({ ...inputs, title: e.target.value })
                }
                type="text"
                id="اسم العقار"
                name="اسم العقار"
                placeholder="شقة في المزة"
                className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
              />
            </div>
            <div className="relative flex flex-col my-2 sm:my-4 items-center justify-center w-full">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                {/* نوع الإعلان */}
                <div className="w-full">
                  <CategoryComponent check={check} />
                </div>
                {/*   نوع العقار */}
                <div className="w-full">
                  <PropertyTypeSelector check={check} />
                </div>
              </div>
            </div>
            <div className="relative flex flex-col my-2 sm:my-4 sm:flex-row gap-4 items-center justify-center w-full ">
              {/*  عدد الغرف */}
              <div className="w-full">
                <RoomsNumberSelector check={check} />
              </div>
              {/* <div className="w-full">
                <div className="flex items-center gap-2 w-full justify-start my-2">
                  <h1 className="flex text-right text-md select-none text-nowrap ">
                    <span className={` text-one text-lg xl:text-2xl ml-2`}>
                      {!inputs?.details?.model && check ? '❌' : <FaCarrot />}
                    </span>
                    موديل العقار:
                  </h1>
                </div>
                <input
                  value={inputs?.details?.model}
                  onChange={(e) =>
                    setInputs((prevInputs) => ({
                      ...prevInputs,
                      details: {
                        ...prevInputs.details, // نسخ القيم الحالية للحقول الأخرى داخل details
                        model: e.target.value, // تحديث قيمة year داخل details
                      },
                    }))
                  }
                  type="text"
                  id="موديل العقار"
                  name="موديل العقار"
                  placeholder="land cruiser"
                  className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
                />
              </div> */}
            </div>
          </div>

          <div className="w-full p-2 xl:p-4 ">
            {/* المدينة والمنطقة*/}
            <div className="relative flex flex-col my-2 sm:my-4 items-center justify-center w-full">
              <CitySelector check={check} />
            </div>
            {/* السنة */}
            <div className="relative flex flex-col my-2 sm:my-4 sm:flex-row gap-4 items-center justify-center w-full ">
              {/* <div className="w-full">
                <div className="flex items-center gap-2 w-full justify-start my-2">
                  <h1 className="flex text-right text-md select-none text-nowrap ">
                    <span className={` text-one text-lg xl:text-2xl ml-2`}>
                      {!inputs?.details?.year && check ? (
                        '❌'
                      ) : (
                        <IoCalendarNumber />
                      )}
                    </span>
                    السنة:
                  </h1>
                </div>
                <input
                  value={inputs?.details?.year}
                  onChange={(e) =>
                    setInputs((prevInputs) => ({
                      ...prevInputs,
                      details: {
                        ...prevInputs.details, // نسخ القيم الحالية للحقول الأخرى داخل details
                        year: e.target.value, // تحديث قيمة year داخل details
                      },
                    }))
                  }
                  type="number"
                  id="السنة"
                  name="السنة"
                  placeholder="2021"
                  className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
                />
              </div> */}
              <div className="w-full">
                <div className="flex items-center gap-2 w-full justify-start my-2">
                  <h1 className="flex text-right text-md select-none text-nowrap ">
                    <span className={` text-one text-lg xl:text-2xl ml-2`}>
                      {!inputs?.details?.area && check ? (
                        '❌'
                      ) : (
                        <GiPathDistance />
                      )}
                    </span>
                    مساحة العقار:
                  </h1>
                </div>

                <input
                  value={inputs?.details?.area}
                  onChange={(e) =>
                    setInputs((prevInputs) => ({
                      ...prevInputs,
                      details: {
                        ...prevInputs.details, // نسخ القيم الحالية للحقول الأخرى داخل details
                        area: e.target.value, // تحديث قيمة year داخل details
                      },
                    }))
                  }
                  type="number"
                  id="المسافة"
                  name="المسافة"
                  placeholder="400 م2"
                  className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
                />
              </div>
            </div>
            {/* رقم الهاتف */}
            <div className="relative flex flex-col my-2 sm:my-4 sm:flex-row gap-4 items-center justify-center w-full ">
              <div className="w-full">
                <div className="flex items-center gap-2 w-full justify-start my-2">
                  <h1 className="flex text-right text-md select-none text-nowrap ">
                    <span className={` text-one text-lg xl:text-2xl ml-2`}>
                      {!inputs?.phoneNumber && check ? '❌' : <GiRotaryPhone />}
                    </span>
                    رقم الهاتف:
                  </h1>
                </div>

                <input
                  value={inputs?.phoneNumber}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      phoneNumber: e.target.value,
                    })
                  }
                  type="number"
                  id="رقم الهاتف"
                  name="رقم الهاتف"
                  placeholder="+963 11 3391 4444"
                  className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
                />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 w-full justify-start my-2">
                  <h1
                    className={`flex text-right text-md select-none text-nowrap `}
                  >
                    <span className={` text-one text-lg xl:text-2xl ml-2`}>
                      {!inputs?.basePrice && check ? (
                        '❌'
                      ) : (
                        <MdOutlinePriceCheck />
                      )}
                    </span>
                    {category?.label === 'بيع'
                      ? ' سعر العقار:'
                      : 'أجرة العقار شهرياً:'}
                  </h1>
                </div>
                <input
                  value={inputs?.basePrice}
                  onChange={(e) =>
                    setInputs({ ...inputs, basePrice: e.target.value })
                  }
                  type="number"
                  id="سعر العقار"
                  name="سعر العقار"
                  placeholder="$ 00.0"
                  className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        {/* الوصف */}
        <div className="w-full">
          <div className="flex items-center gap-2 w-full justify-start my-2">
            <h1 className="flex text-right text-lg ">
              <span className={` text-one text-lg xl:text-2xl ml-2`}>
                {!inputs?.description && check ? (
                  '❌'
                ) : (
                  <MdOutlineFeaturedPlayList />
                )}
              </span>
              الوصف:
            </h1>
          </div>

          <textarea
            value={inputs?.description}
            onChange={(e) =>
              setInputs({ ...inputs, description: e.target.value })
            }
            dir="rtl"
            rows={'6'}
            name="الوصف"
            id="الوصف"
            placeholder="اكتب مواصفات عقارك هنا ..."
            className="scrollBar flex text-right w-full p-2 border border-gray-300 text-xl placeholder:text-sm lg:placeholder:text-lg h-36 outline-2 focus:outline-one rounded"
          ></textarea>
        </div>
        <OnClickMap
          chosenCity={data?.city}
          chosentown={data?.town}
          cityLocation={cityLocation}
          townLocation={townLocation}
        />
        <div className="w-full">
          <div className="flex items-center gap-2 w-full justify-start my-2 ">
            <h1 className="flex text-right text-sm sm:text-lg select-none ">
              <span className={` text-one text-lg xl:text-2xl ml-2`}>
                <RxVideo />{' '}
              </span>
              أضف فيديو للعقار من يوتيوب أو تيك توك:
            </h1>
          </div>

          <input
            type="text"
            placeholder="ضع رابط الفيديو هنا"
            value={url}
            onChange={handleInputChange}
            className={` w-full text-sm sm:text-lg rounded text-start text-black  h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-one`}
          />
          {inputs?.details?.link && (
            <div>
              <iframe
                width="560"
                height="315"
                src={inputs?.details?.link}
                frameBorder="0"
                allowFullScreen
                title="Embedded YouTube Video"
                className=" w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-around items-center gap-8 w-full my-12">
          <button
            type="submit"
            className="btn bg-five rounded text-white hover:text-two shadow-lg hover:outline outline-one text-xl hover py-2 px-16 w-full"
          >
            نشر
          </button>
          {cancel && (
            <button
              type="text"
              className="btn bg-five   shadow-sm shadow-gray-300 text-white hover:outline  outline-one text-xl hover py-2 px-16 w-full"
              onClick={() => {
                setIsVisible(false);
                setInputs({
                  userId: '',
                  title: '',
                  images: addImages || [],
                  adCategory: category?.label || '',
                  city: data?.propertyCity || '',
                  town: data?.propertyTown || '',
                  basePrice: '',
                  phoneNumber: '',
                  description: '',
                  lng: location[1] || 36.2765,
                  lat: location[0] || 33.5138,
                  details: {
                    propertyType: data?.propertyType?.label || '',
                    roomsNumber: data?.propertyRoomsNumber?.label || '',
                    link: '',
                    area: '',
                  },
                });
              }}
            >
              إلغاء
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
