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

const PropertyTypeSelector = dynamic(() => import('../PropertyTypeSelector'));
const CurrentUser = dynamic(() => import('../CurrentUser'));
const CustomToast = dynamic(() => import('../CustomToast'));
const Confetti = dynamic(() =>
  import('../SuccessComponent').then((mod) => mod.Confetti)
);
const OnClickMap = dynamic(() => import('../map/onClickMap'));
const CategoryComponent = dynamic(() => import('../CategoryComponent'));
const CitySelector = dynamic(() => import('../map/CitySelector'));
const RoomsNumberSelector = dynamic(() => import('../roomsNumberSelector'));

import { getVideoIdAndPlatform } from '../youtubeUtils';

export default function PostForm({ setIsVisible, cancel = true }) {
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
    propertyCityLocation,
    propertyTownLocation,
  } = useContext(inputsContext);

  console.log('location 111111111111111111', location);

  const [errors, setErrors] = useState({
    propertyCategory: false,
    propertyCategoryErrorMessage: 'هذا الحقل مطلوب',

    propertyName: false,
    propertyNameErrorMessage: 'هذا الحقل مطلوب',

    propertyArea: false,
    propertyAreaErrorMessage: 'حقل المساحة مطلوب',

    propertyType: false,
    propertyTypeErrorMessage: 'اختيار نوع العقار مطلوب',

    propertyRoomsNumber: false,
    propertyRoomsNumberErrorMessage: 'اختيار عدد الغرف مطلوب',

    propertyPrice: false,
    propertyPriceErrorMessage: 'حقل السعر مطلوب',

    propertyCity: false,
    propertyCityErrorMessage: 'حقل المدينة مطلوب',

    propertyTown: false,
    propertyTownErrorMessage: 'حقل البلدة مطلوب',

    description: false,
    descriptionErrorMessage: 'حقل الوصف مطلوب',

    phoneNumber: false,
    contactPhoneNumberErrorMessage: 'حقل السعر مطلوب',
  });

  const [inputs, setInputs] = useState({
    id: uuidv4(),
    image: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    propertyCategory: '',
    propertyName: '',
    propertyType: '',
    propertyRoomsNumber: '',
    propertyPrice: '',
    propertyArea: '',
    propertyCity: '',
    propertyTown: '',
    phoneNumber: '',
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
      propertyType: data?.propertyType?.label || '',
      propertyRoomsNumber: data?.propertyRoomsNumber?.label || '0',
      propertyCity: data?.propertyCity || '',
      propertyTown: data?.propertyTown || '',
      propertyCategory: category?.label || '',
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
    data?.propertyType,
    data?.propertyCity,
    data?.propertyTown,
    data?.propertyRoomsNumber,
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
      (addImages?.length > 0 &&
        inputs?.propertyCategory &&
        inputs?.propertyName &&
        inputs?.propertyType &&
        inputs?.propertyPrice &&
        inputs?.propertyArea &&
        inputs?.propertyCity &&
        inputs?.propertyTown &&
        inputs?.phoneNumber &&
        inputs?.description &&
        userImage &&
        userName &&
        createdBy &&
        !['بيت', 'شقة', 'فيلا'].includes(inputs?.propertyType)) ||
      inputs?.propertyRoomsNumber
    ) {
      try {
        const response = await fetch('/api/RealEstate/allPosts', {
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
          dispatch({ type: 'New_POST', payload: inputs });
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
            propertyCategory: '',
            propertyType: '',
            propertyRoomsNumber: '',
            propertyPrice: 0,
            propertyCity: '',
            propertyTown: '',
            propertyArea: '',
            phoneNumber: '',
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
            propertyCategory: false,
            propertyType: false,
            propertyRoomsNumber: false,
            propertyPrice: false,
            propertyArea: false,
            propertyCity: false,
            propertyTown: false,
            phoneNumber: false,
            description: false,
          });
          router.push('/myPosts');
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
        propertyCategory: false,
        propertyName: false,
        propertyType: false,
        propertyRoomsNumber: false,
        propertyPrice: false,
        propertyArea: false,
        propertyCity: false,
        propertyTown: false,
        phoneNumber: false,
        description: false,
        image: false,
      });

      // console.log('inputs', inputs);

      // التحقق من الحقل المطلوب وضبط الخطأ المناسب
      if (!inputs.image) {
        setErrors((prevErrors) => ({ ...prevErrors, image: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'صورة العقار مطلوبة 😐'} />
        ));
        dispatch({
          type: 'IMAGE_ERROR',
          payload: { imageError: true, message: 'صورة العقار مطلوبة' },
        });
      } else if (!inputs.propertyCategory) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyCategory: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'تصنيف الإعلان مطلوب 😐'} />
        ));
      } else if (!inputs.propertyName) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyName: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'عنوان الإعلان مطلوب 😐'} />
        ));
      } else if (!inputs.propertyType) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyType: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'اختيار نوع العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyRoomsNumber) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          propertyRoomsNumber: true,
        }));
        toast.custom((t) => (
          <CustomToast t={t} message={'اختيار عدد الغرف مطلوب 😐'} />
        ));
      } else if (!inputs.propertyPrice) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyPrice: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'سعر العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyArea) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyArea: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل مساحة العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyCity) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyCity: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل المدينة مطلوب 😐'} />
        ));
      } else if (!inputs.propertyTown) {
        setErrors((prevErrors) => ({ ...prevErrors, propertyTown: true }));
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل البلدة مطلوب 😐'} />
        ));
      } else if (!inputs.phoneNumber) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: true,
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
                  {errors.propertyCategory && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      التصنيف مطلوبة
                    </h1>
                  )}

                  <CategoryComponent />
                </div>
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyType && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      اختيار نوع العقار مطلوب
                    </h1>
                  )}

                  <PropertyTypeSelector />
                </div>
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyArea && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      مساحة العقار مطلوبة
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
                        <RxSpaceEvenlyHorizontally />
                      </span>
                      مساحة العقار:
                    </h1>
                  </div>

                  <input
                    value={inputs?.propertyArea}
                    onChange={(e) =>
                      setInputs({ ...inputs, propertyArea: e.target.value })
                    }
                    type="number"
                    id="مساحة العقار"
                    name="مساحة العقار"
                    placeholder="300 م2"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyRoomsNumber && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      اختيار عدد الغرف مطلوب
                    </h1>
                  )}

                  <RoomsNumberSelector />
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyName && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      هذا الحقل مطلوب
                    </h1>
                  )}

                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md select-none text-nowrap ">
                      <span className="text-one text-lg xl:text-2xl ml-2">
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
                    id="اسم العقار"
                    name="اسم العقار"
                    placeholder=" بيت بداريا _ أرض بدوما .."
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.propertyCity && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      حقل المدينة مطلوب
                    </h1>
                  )}

                  <CitySelector />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.phoneNumber && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      رقم الهاتف مطلوب
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
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyPrice && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      سعر العقار مطلوب
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
                        ? ' سعر العقار:'
                        : 'أجرة العقار شهرياً:'}
                    </h1>
                  </div>

                  <input
                    value={inputs?.propertyPrice}
                    onChange={(e) =>
                      setInputs({ ...inputs, propertyPrice: e.target.value })
                    }
                    type="number"
                    id="سعر العقار"
                    name="سعر العقار"
                    placeholder="$ 00.0"
                    className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
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
              placeholder="اكتب مواصفات عقارك هنا ..."
              className="scrollBar flex text-right w-full p-2 border border-three/30 text-xl placeholder:text-sm lg:placeholder:text-lg h-36 outline-2 focus:outline-one rounded"
            ></textarea>
          </div>
          <OnClickMap
            chosenCity={data?.propertyCity}
            chosentown={data?.propertyTown}
            propertyCityLocation={propertyCityLocation}
            propertyTownLocation={propertyTownLocation}
          />
          <div className="w-full">
            <div className="flex items-center gap-2 w-full justify-start my-2 ">
              <h1 className="flex text-right text-sm sm:text-lg select-none ">
                <span className="text-one text-lg xl:text-2xl ml-2">
                  <RxVideo />
                </span>
                أضف فيديو للعقار من يوتيوب أو تيك توك:
              </h1>
            </div>

            <input
              type="text"
              placeholder="ضع رابط الفيديو هنا"
              value={url}
              onChange={handleInputChange}
              className="w-full text-sm sm:text-lg rounded text-start  h-9 sm:h-12 text-nowrap px-2 border border-four focus:outline-one"
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
                    image: '',
                    image1: '',
                    image2: '',
                    image3: '',
                    image4: '',
                    propertyName: '',
                    propertyType: '',
                    propertyRoomsNumber: '',
                    propertyPrice: 0,
                    propertyArea: '',
                    propertyCity: '',
                    phoneNumber: '',
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
