'use client';

import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SelectComponent from './SelectComponent';
import { inputsContext } from './Context';
import { useSession } from 'next-auth/react';
import CurrentUser from './CurrentUser';
import CustomToast from './CustomToast';
import { Confetti } from './SuccessComponent';
import { getVideoIdAndPlatform } from './youtubeUtils';
import { v4 as uuidv4 } from 'uuid';
import SelectCitiesComponent from './selectCitiesComponent';
import { FaHouseDamage } from 'react-icons/fa';
import { RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { GiModernCity } from 'react-icons/gi';
import { MdOutlinePriceCheck } from 'react-icons/md';
import { GiRotaryPhone } from 'react-icons/gi';
import { MdOutlineFeaturedPlayList } from 'react-icons/md';
import { RxVideo } from 'react-icons/rx';
import SyriaMap from './map/SyriaMap';
import OnClickMap from './map/onClickMap';
import { useRouter } from 'next/navigation';

export default function PostForm({ setIsVisible, isVisible, cancel = true }) {
  const [url, setUrl] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const session = useSession();
  const router = useRouter();
  const userName = CurrentUser()?.name;
  const userImage = CurrentUser()?.image || session?.data?.user?.image;
  const createdBy = CurrentUser()?.email;
  const { data, dispatch, addImages, location } = useContext(inputsContext);
  // console.log('addImages ************************', addImages);

  const [errors, setErrors] = useState({
    propertyName: false,
    propertyNameErrorMessage: 'هذا الحقل مطلوب',

    propertyArea: false,
    propertyAreaErrorMessage: 'حقل المساحة مطلوب',

    propertyType: false,
    propertyTypeErrorMessage: 'اختيار نوع العقار مطلوب',

    propertyPrice: false,
    propertyPriceErrorMessage: 'حقل السعر مطلوب',

    propertyCity: false,
    propertyCityErrorMessage: 'حقل المدينة مطلوب',

    description: false,
    descriptionErrorMessage: 'حقل الوصف مطلوب',

    contactPhoneNumber: false,
    contactPhoneNumberErrorMessage: 'حقل السعر مطلوب',
  });

  const [inputs, setInputs] = useState({
    id: uuidv4(),
    image: addImages[0] || '',
    image1: addImages[1] || '',
    image2: addImages[2] || '',
    image3: addImages[3] || '',
    image4: addImages[4] || '',
    propertyName: '',
    propertyType: '',
    propertyPrice: '',
    propertyArea: '',
    propertyCity: '',
    contactPhoneNumber: '',
    description: '',
    lat: '',
    lng: '',
    link: '',
    hearts: 0,
  });
  console.log('inputs ************************', inputs);

  useEffect(() => {
    setInputs({
      ...inputs,
      propertyType: data?.propertyType?.label || '',
      propertyCity: data?.propertyCity?.label || '',
      image: addImages?.[0] || '',
      image1: addImages?.[1] || '',
      image2: addImages?.[2] || '',
      image3: addImages?.[3] || '',
      image4: addImages?.[4] || '',
      lat: location?.[0] || '',
      lng: location?.[1] || '',
    });
    handleGenerateEmbed();
  }, [
    url,
    data?.propertyType,
    data?.propertyCity,
    addImages[0],
    addImages[1],
    addImages[2],
    addImages[3],
    addImages[4],
    location,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({
      propertyName: false,
      propertyType: false,
      propertyPrice: false,
      propertyArea: false,
      propertyCity: false,
      contactPhoneNumber: false,
      description: false,
    });

    if (
      addImages?.length > 0 &&
      inputs?.propertyName &&
      inputs?.propertyType &&
      inputs?.propertyPrice &&
      inputs?.propertyArea &&
      inputs?.propertyCity &&
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
          dispatch({ type: 'PROPERTY_CITY', payload: '' });
          dispatch({ type: 'LOCATION', payload: [] });
          setIsVisible(false);
          setInputs({
            image: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            propertyName: '',
            propertyType: '',
            propertyPrice: '',
            propertyCity: '',
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
              emoji={'🧀'}
              message={'تم إنشاء منشور جديد'}
              greenEmoji={'✔'}
            />
          ));
          setErrors({
            propertyName: false,
            propertyType: false,
            propertyPrice: false,
            propertyArea: false,
            propertyCity: false,
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
      console.log('inputs', inputs);
      if (!inputs.image) {
        setErrors({ ...errors, image: true });

        toast.custom((t) => (
          <CustomToast t={t} message={'صورة العقار مطلوبة 😐'} />
        ));
        dispatch({
          type: 'IMAGE_ERROR',
          payload: { imageError: true, message: 'صورة العقار مطلوبة' },
        });
      } else if (!inputs.propertyName) {
        setErrors({ ...errors, propertyName: true });

        toast.custom((t) => (
          <CustomToast t={t} message={' عنوان الإعلان مطلوب 😐'} />
        ));
      } else if (!inputs.propertyType) {
        console.log('propertyType');
        setErrors({ ...errors, propertyType: true });
        toast.custom((t) => (
          <CustomToast t={t} message={'اختيار نوع العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyPrice) {
        setErrors({ ...errors, propertyPrice: true });

        toast.custom((t) => (
          <CustomToast t={t} message={'سعر العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyArea) {
        setErrors({ ...errors, propertyArea: true });
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل مساحة العقار مطلوب 😐'} />
        ));
      } else if (!inputs.propertyCity) {
        setErrors({ ...errors, propertyCity: true });
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل المدينة مطلوب 😐'} />
        ));
      } else if (!inputs.contactPhoneNumber) {
        setErrors({ ...errors, contactPhoneNumber: true });
        toast.custom((t) => (
          <CustomToast t={t} message={'حقل رقم الهاتف مطلوب 😐'} />
        ));
      } else if (!inputs.description) {
        setErrors({ ...errors, description: true });
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
            <div className="flex flex-col gap-8 md:flex-row w-full ">
              <div className="w-full">
                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.propertyName && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      هذا الحقل مطلوب{' '}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white">
                      <span className="text-one text-2xl ml-2">
                        <FaHouseDamage />
                      </span>
                      اسم مناسب للإعلان: (إجباري)
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
                    className="flex text-right w-full p-2 rounded-lg text-xl sm:text-2xl outline-2 focus:outline-one h-12 placeholder:text-md placeholder:sm:text-xl"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full ">
                  {errors.propertyType && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      اختيار نوع العقار مطلوب
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white">
                      <span className="text-one text-2xl ml-2">
                        <VscUngroupByRefType />
                      </span>
                      نوع العقار: (إجباري)
                    </h1>
                  </div>

                  <SelectComponent />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.propertyPrice && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      سعر العقار مطلوب
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white ">
                      <span className="text-one text-2xl ml-2">
                        <MdOutlinePriceCheck />
                      </span>
                      سعر العقار: (إجباري)
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
                    placeholder="000.0"
                    className="flex text-right w-full p-2 rounded-lg text-xl sm:text-2xl outline-2 focus:outline-one h-12 placeholder:text-md placeholder:sm:text-xl"
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.propertyArea && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      مساحة العقار مطلوبة
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white ">
                      <span className="text-one text-2xl ml-2">
                        {' '}
                        <RxSpaceEvenlyHorizontally />
                      </span>
                      مساحة العقار: (إجباري)
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
                    placeholder="300 متر2"
                    className="flex text-right w-full p-2 rounded-lg text-xl sm:text-2xl outline-2 focus:outline-one h-12 placeholder:text-md placeholder:sm:text-xl"
                  />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.propertyCity && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      حقل المدينة مطلوب
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white ">
                      <span className="text-one text-2xl ml-2">
                        <GiModernCity />
                      </span>
                      المدينة: (إجباري)
                    </h1>
                  </div>

                  <SelectCitiesComponent />
                </div>

                <div className="flex flex-col items-center justify-center my-4 w-full">
                  {errors.contactPhoneNumber && (
                    <h1 className="text-one text-2xl text-start w-full animate-bounce">
                      رقم الهاتف مطلوب{' '}
                    </h1>
                  )}
                  <div className="flex items-center gap-2 w-full justify-start my-2">
                    <h1 className="flex text-right text-md sm:text-xl text-white ">
                      <span className="text-one text-2xl ml-2">
                        <GiRotaryPhone />
                      </span>
                      رقم الهاتف: (إجباري)
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
                    placeholder="12323456789"
                    className="flex text-right w-full p-2 rounded-lg text-xl sm:text-2xl outline-2 focus:outline-one h-12 placeholder:text-md placeholder:sm:text-xl"
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
              <h1 className="flex text-right text-md sm:text-xl text-white">
                <span className="text-one text-2xl ml-2">
                  <MdOutlineFeaturedPlayList />
                </span>
                الوصف: (إجباري)
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
              className="scrollBar flex text-right w-full p-2 rounded-lg text-xl placeholder:text-md placeholder:sm:text-xl h-36 outline-2 focus:outline-one"
            ></textarea>
          </div>
          {/* <SyriaMap /> */}
          <OnClickMap />
          <div className="w-full">
            <div className="flex items-center gap-2 w-full justify-start my-2 ">
              {' '}
              <h1 className="flex text-right text-md sm:text-xl text-white">
                <span className="text-one text-2xl ml-2">
                  <RxVideo />
                </span>
                أضف رابط العقار من يوتيوب أو تيك توك
              </h1>
            </div>

            <input
              type="text"
              placeholder="... ضع رابط الفيديو هنا"
              value={url}
              onChange={handleInputChange}
              className="flex text-right mt-4 mb-8 w-full p-2 rounded-lg text-xl sm:text-2xl outline-2 focus:outline-one h-12 placeholder:text-md placeholder:sm:text-xl"
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
                  className="rounded-lg w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-around items-center gap-8 w-full my-12">
            <button
              type="submit"
              className="btn bg-five rounded-lg text-white shadow-lg hover:outline outline-one text-xl hover py-2 px-16 w-full"
            >
              نشر
            </button>
            {cancel && (
              <button
                type="text"
                className="btn bg-five rounded-lg text-white shadow-lg hover:outline  outline-one text-xl hover py-2 px-16 w-full"
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
                    propertyPrice: '',
                    propertyArea: '',
                    propertyCity: '',
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
