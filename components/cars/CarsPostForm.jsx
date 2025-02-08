'use client';

import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { inputsContext } from '../Context';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { FaHouseDamage } from 'react-icons/fa';
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { RxVideo } from 'react-icons/rx';
import { useRouter } from 'next/navigation';

const CarsBrandSelector = dynamic(() => import('./CarsBrandSelector'));
const CurrentUser = dynamic(() => import('../CurrentUser'));
const CustomToast = dynamic(() => import('../CustomToast'));
const Confetti = dynamic(() =>
  import('../SuccessComponent').then((mod) => mod.Confetti)
);
const OnClickMap = dynamic(() => import('../map/onClickMap'));
const CategoryComponent = dynamic(() => import('../CategoryComponent'));
const CitySelector = dynamic(() => import('../map/CitySelector'));
const CarsUsedNewSelector = dynamic(() => import('./CarsUsedNewSelector'));

import { getVideoIdAndPlatform } from '../youtubeUtils';

export default function CarsPostForm({ setIsVisible, cancel = true }) {
  const [url, setUrl] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const session = useSession();
  const router = useRouter();
  const userName = CurrentUser()?.name || session?.data?.user?.name;
  const userImage = CurrentUser()?.image || session?.data?.user?.image;
  const createdBy = CurrentUser()?.email || session?.data?.user?.email;
  const {
    data,
    dispatch,
    addImages,
    location,
    category,
    cityLocation,
    propertyTownLocation,
    usedNew,
    brand,
  } = useContext(inputsContext);

  // console.log('location 111111111111111111', location);

  const [errors, setErrors] = useState({
    adType: false,
    adTypeErrorMessage: 'هذا الحقل مطلوب',

    propertyName: false,
    propertyNameErrorMessage: 'هذا الحقل مطلوب',

    propertyArea: false,
    propertyAreaErrorMessage: 'حقل الموديل مطلوب',

    usedNew: false,
    usedNewErrorMessage: 'اختيار نوع الإعلان مطلوب',

    brand: false,
    brandErrorMessage: 'الماركة مطلوبة',

    price: false,
    priceErrorMessage: 'حقل السعر مطلوب',

    city: false,
    cityErrorMessage: 'حقل المدينة مطلوب',

    propertyTown: false,
    propertyTownErrorMessage: 'حقل البلدة مطلوب',

    description: false,
    descriptionErrorMessage: 'حقل الوصف مطلوب',

    contactPhoneNumber: false,
    contactPhoneNumberErrorMessage: 'حقل السعر مطلوب',
  });

  const [inputs, setInputs] = useState({
    id: uuidv4(),
    image: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    adType: '',
    propertyName: '',
    usedNew: '',
    brand: '',
    price: '',
    propertyArea: '',
    city: '',
    propertyTown: '',
    contactPhoneNumber: '',
    description: '',
    lat: '',
    lng: '',
    link: '',
    hearts: 0,
  });

  useEffect(() => {
    if (!location && typeof window !== 'undefined') {
      console.error('Location is undefined');
      return;
    }

    setInputs({
      ...inputs,
      usedNew: usedNew?.label || '',
      brand: brand?.label || '',
      city: data?.city || '',
      propertyTown: data?.propertyTown || '',
      adType: category?.label || '',
      image: addImages?.[0] || '',
      image1: addImages?.[1] || '',
      image2: addImages?.[2] || '',
      image3: addImages?.[3] || '',
      image4: addImages?.[4] || '',
      lat: location[0] || 33.5138,
      lng: location[1] || 36.2765,
    });
    handleGenerateEmbed();
  }, [
    url,
    usedNew,
    brand,
    data?.city,
    data?.propertyTown,
    addImages[0],
    addImages[1],
    addImages[2],
    addImages[3],
    addImages[4],
    location,
    category?.label,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      addImages?.length > 0 &&
      inputs?.adType &&
      inputs?.propertyName &&
      inputs?.usedNew &&
      inputs?.price &&
      inputs?.propertyArea &&
      inputs?.city &&
      inputs?.propertyTown &&
      inputs?.contactPhoneNumber &&
      inputs?.description &&
      userImage &&
      userName &&
      createdBy
    ) {
      try {
        const response = await fetch('/api/allPosts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...inputs,
            userName,
            userImage,
            createdBy,
          }),
        });

        if (response.ok) {
          dispatch({ type: 'New_RECIPE', payload: inputs });
          dispatch({ type: 'ADD_IMAGE', payload: [] });
          dispatch({ type: 'PROPERTY_TYPE', payload: '' });
          dispatch({ type: 'PROPERTY_ROOMS_NUMBER', payload: '' });
          dispatch({ type: 'PROPERTY_CITY', payload: '' });
          dispatch({ type: 'PROPERTY_TOWN', payload: '' });
          dispatch({ type: 'LOCATION', payload: [] });
          setIsVisible(false);
          setInputs({
            image: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            propertyName: '',
            adType: '',
            usedNew: '',
            brand: '',
            price: 0,
            city: '',
            propertyTown: '',
            propertyArea: '',
            contactPhoneNumber: '',
            lat: '',
            lng: '',
            link: '',
            location: [],
            hearts: 0,
          });

          toast.custom((t) => (
            <CustomToast
              t={t}
              message={'تم إنشاء منشور جديد'}
              greenEmoji={'✔'}
            />
          ));
          setErrors({
            propertyName: false,
            adType: false,
            usedNew: false,
            brand: false,
            price: false,
            propertyArea: false,
            city: false,
            propertyTown: false,
            contactPhoneNumber: false,
            description: false,
          });
          router.push('/');
          handleClick();
        } else {
          console.log('something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // تعيين جميع الأخطاء إلى false
      setErrors({
        adType: false,
        propertyName: false,
        usedNew: false,
        brand: false,
        price: false,
        propertyArea: false,
        city: false,
        propertyTown: false,
        contactPhoneNumber: false,
        description: false,
        image: false,
      });

      // console.log('inputs', inputs);

      // التحقق من الحقل المطلوب وضبط الخطأ المناسب
      if (!inputs.image) {
        setErrors((prevErrors) => ({ ...prevErrors, image: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'صورة السيارة مطلوبة 😐'} />
        ));
        dispatch({
          type: 'IMAGE_ERROR',
          payload: { imageError: true, message: 'صورة السيارة مطلوبة' },
        });
      } else if (!inputs.adType) {
        setErrors((prevErrors) => ({ ...prevErrors, adType: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'تصنيف الإعلان مطلوب 😐'} />
        ));
      } else if (!inputs.propertyName) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyName: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'عنوان الإعلان مطلوب 😐'} />
        ));
      } else if (!inputs.usedNew) {
        setErrors((prevErrors) => ({ ...prevErrors, usedNew: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'اختيار نوع السيارة مطلوب 😐'} />
        ));
      } else if (!inputs.brand) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          brand: true,
        }));
        toast.custom((t) => (
          <CustomToast t={t} message={'اختيار عدد الغرف مطلوب 😐'} />
        ));
      } else if (!inputs.price) {
        setErrors((prevErrors) => ({ ...prevErrors, price: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'سعر السيارة مطلوب 😐'} />
        ));
      } else if (!inputs.propertyArea) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyArea: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل موديل السيارة مطلوب 😐'} />
        ));
      } else if (!inputs.city) {
        setErrors((prevErrors) => ({ ...prevErrors, city: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل المدينة مطلوب 😐'} />
        ));
      } else if (!inputs.propertyTown) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyTown: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل البلدة مطلوب 😐'} />
        ));
      } else if (!inputs.contactPhoneNumber) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          contactPhoneNumber: true,
        }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل رقم الهاتف مطلوب 😐'} />
        ));
      } else if (!inputs.description) {
        setErrors((prevErrors) => ({ ...prevErrors, description: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل الوصف مطلوب 😐'} />
        ));
      }
    }
  }

  //? هذه دالة يتم تفعيلها عند نجاح انشاء منشور للاحتفال
  const handleClick = () => {
    const end = Date.now() + 4 * 1000; // 3 seconds
    const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

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
      setInputs({ ...inputs, link: embedLink });
    } else {
      setEmbedLink('');
    }
  };

  return (
    <>
      <div className="w-full p-2 sm:p-8 h-fit ">
        <form
          className="flex flex-col justify-center items-start h-fit w-full mt-4 "
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <div className="flex flex-col gap-2 xl:gap-8 md:flex-row w-full ">
              <div className="w-full">
                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.adType && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      التصنيف مطلوبة
                    </h1>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                    <CategoryComponent />
                    <CarsUsedNewSelector />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.brand && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      اختيار ماركة السيارة مطلوب
                    </h1>
                  )}

                  <CarsBrandSelector />
                </div>
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyArea && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      موديل السيارة مطلوب
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        {' '}
                        <RxSpaceEvenlyHorizontally />
                      </span>
                      السنة:
                    </h1>
                  </div>

                  <input
                    value={inputs?.propertyArea}
                    onChange={(e) =>
                      setInputs({ ...inputs, propertyArea: e.target.value })
                    }
                    type="number"
                    id="السنة"
                    name="السنة"
                    placeholder="2021"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.brand && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      موديل السيارة{' '}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        {' '}
                        <FaHouseDamage />
                      </span>
                      موديل السيارة:
                    </h1>
                  </div>
                  {/* <RoomsNumberSelector /> */}
                  <input
                    value={inputs?.propertyName}
                    autoFocus
                    onChange={(e) =>
                      setInputs({ ...inputs, propertyName: e.target.value })
                    }
                    type="text"
                    id="موديل السيارة"
                    name="موديل السيارة"
                    placeholder="land cruiser"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyName && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      هذا الحقل مطلوب{' '}
                    </h1>
                  )}

                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        {' '}
                        <FaHouseDamage />
                      </span>
                      اسم مناسب للإعلان:
                    </h1>
                  </div>
                  <input
                    value={inputs?.propertyName}
                    autoFocus
                    onChange={(e) =>
                      setInputs({ ...inputs, propertyName: e.target.value })
                    }
                    type="text"
                    id="اسم السيارة"
                    name="اسم السيارة"
                    placeholder="تويوتا كورولا موديل 2021"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.city && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      حقل المدينة مطلوب
                    </h1>
                  )}

                  <CitySelector />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.contactPhoneNumber && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      رقم الهاتف مطلوب{' '}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        <GiRotaryPhone />
                      </span>
                      رقم الهاتف:
                    </h1>
                  </div>

                  <input
                    value={inputs?.contactPhoneNumber}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        contactPhoneNumber: e.target.value,
                      })
                    }
                    type="number"
                    id="رقم الهاتف"
                    name="رقم الهاتف"
                    placeholder="+963 11 3391 4444"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.price && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      سعر السيارة مطلوب
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1
                      className={`flex text-right text-md select-none text-nowrap `}
                    >
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        <MdOutlinePriceCheck />
                      </span>
                      {category?.label === 'بيع'
                        ? ' سعر السيارة:'
                        : 'أجرة السيارة شهرياً:'}
                    </h1>
                  </div>

                  <input
                    value={inputs?.price}
                    onChange={(e) =>
                      setInputs({ ...inputs, price: e.target.value })
                    }
                    type="number"
                    id="سعر السيارة"
                    name="سعر السيارة"
                    placeholder="$ 00.0"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {errors.description && (
              <h1 className="text-one text-2xl text-start w-full animate-bounce">
                حقل الوصف مطلوب
              </h1>
            )}
            <div className="flex items-center gap-2 w-full justify-start my-2">
              {' '}
              <h1 className="flex text-right text-lg ">
                <span className="text-one text-lg xl:text-2xl ml-2">
                  <MdOutlineFeaturedPlayList />
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
              placeholder="اكتب مواصفات سيارتك هنا ..."
              className="scrollBar flex text-right w-full p-2 border border-gray-300 text-xl placeholder:text-sm lg:placeholder:text-lg h-36 outline-2 focus:outline-one rounded"
            ></textarea>
          </div>
          <OnClickMap
            chosenCity={data?.city}
            chosentown={data?.propertyTown}
            cityLocation={cityLocation}
            propertyTownLocation={propertyTownLocation}
          />
          <div className="w-full">
            <div className="flex items-center gap-2 w-full justify-start my-2 ">
              {' '}
              <h1 className="flex text-right text-sm sm:text-lg select-none ">
                <span className="text-one text-lg xl:text-2xl ml-2">
                  <RxVideo />
                </span>
                أضف فيديو للسيارة من يوتيوب أو تيك توك:
              </h1>
            </div>

            <input
              type="text"
              placeholder="... ضع رابط الفيديو هنا"
              value={url}
              onChange={handleInputChange}
              className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-slate-300 focus:outline-one"
            />
            {inputs?.link && (
              <div>
                <iframe
                  width="560"
                  height="315"
                  src={inputs?.link}
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
              className="btn bg-five rounded text-white hover:text-four shadow-lg hover:outline outline-one text-xl hover py-2 px-16 w-full"
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
                    image: '',
                    image1: '',
                    image2: '',
                    image3: '',
                    image4: '',
                    propertyName: '',
                    usedNew: '',
                    brand: '',
                    price: 0,
                    propertyArea: '',
                    city: '',
                    contactPhoneNumber: '',
                    description: '',
                    lng: '',
                    lat: '',
                    link: '',
                    hearts: 0,
                  });
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
