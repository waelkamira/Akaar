'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import SideBarMenu from '../../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useParams } from 'next/navigation';
import CustomToast from '../../../components/CustomToast';
import toast from 'react-hot-toast';
import { MdEdit } from 'react-icons/md';
import UploadingAndDisplayingImage from '../../../components/UploadingAndDisplayingImage';
import { inputsContext } from '../../../components/Context';
import { getVideoIdAndPlatform } from '../../../components/youtubeUtils';
import LoadingPhoto from '../../../components/LoadingPhoto';
import ImageSlider from '../../../components/imageSlider';
import { property } from 'lodash';
import PropertyRoomsNumberSelector from '../../../components/roomsNumberSelector';
import EditItem from '../../../components/editItem';
import OnClickMap from '../../../components/map/onClickMap';
export default function EditPost() {
  const [url, setUrl] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const { data } = useContext(inputsContext);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [editedPost, setEditedPost] = useState({});
  const { id } = useParams();
  const { location } = useContext(inputsContext);
  console.log('location', location);
  const [inputs, setInputs] = useState({
    image: editedPost?.image,
    image1: editedPost?.image1,
    image2: editedPost?.image2,
    image3: editedPost?.image3,
    image4: editedPost?.image4,
    propertyName: editedPost?.propertyName,
    propertyType: editedPost?.propertyType,
    propertyPrice: editedPost?.propertyPrice,
    propertyArea: editedPost?.propertyArea,
    propertyCity: editedPost?.propertyCity,
    propertyTown: editedPost?.propertyTown,
    propertyRoomsNumber: editedPost?.propertyRoomsNumber,
    contactPhoneNumber: editedPost?.contactPhoneNumber,
    lat: location[0] || editedPost?.lat,
    lng: location[1] || editedPost?.lng,
    description: editedPost?.description,
    link: editedPost?.linkValue, // التعامل مع الحقل `link` بشكل صحيح
    hearts: editedPost?.hearts,
    userName: editedPost?.userName,
    userImage: editedPost?.userImage,
  });
  console.log('inputs', inputs);

  useEffect(() => {
    fetchEditedPost();
  }, []);

  useEffect(() => {
    if (location) {
      setEditedPost({ ...editedPost, lat: location[0], lng: location[1] });
      setInputs({ ...inputs, lat: location[0], lng: location[1] });
    }
  }, [location]);

  let iframeSrc = null;

  if (typeof document !== 'undefined') {
    //? src نريد ان نستخرج منه قيمة ال string لكنه نص  ifram html الذي هو عبارة عن عنصر  link انشأنا ديف مؤقت لوضع ال
    let tempDiv = document?.createElement('div');
    tempDiv.innerHTML = editedPost?.link;

    //? داخل هذا الديف iframe بحثنا عن اول
    let iframeElement = tempDiv.querySelector('iframe');

    //? موجود ifram اذا كان عنصر ال src استخرجنا قيمة ال
    let iframeSrc = iframeElement ? iframeElement.getAttribute('src') : null;
  }
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  const fetchEditedPost = async () => {
    const res = await fetch(`/api/editPost?id=${id}`);
    const json = await res?.json();
    if (res.ok) {
      console.log('json from editedPost', json);
      setEditedPost(json);
      setInputs({
        image: json?.image,
        image1: json?.image1,
        image2: json?.image2,
        image3: json?.image3,
        image4: json?.image4,
        propertyName: json?.propertyName,
        propertyType: json?.propertyType,
        propertyPrice: json?.propertyPrice,
        propertyArea: json?.propertyArea,
        propertyCity: json?.propertyCity,
        propertyTown: json?.propertyTown,
        lat: location[0] || json?.lat,
        lng: location[1] || json?.lng,
        propertyRoomsNumber: json?.propertyRoomsNumber,
        contactPhoneNumber: json?.contactPhoneNumber,
        description: json?.description,
        link: json?.linkValue, // التعامل مع الحقل `link` بشكل صحيح
        hearts: json?.hearts,
        userName: json?.userName,
        userImage: json?.userImage,
      });
    }
  };

  async function handleEditPost() {
    // console.log('success');
    const response = await fetch(`/api/editPost?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...inputs,
        image: data?.image,
      }),
    });
    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم تعديل هذا الإعلان بنجاح'}
          greenEmoji={'✔'}
        />
      ));
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
      setInputs({ ...inputs, link: embedLink });
    } else {
      setEmbedLink('');
    }
  };
  return (
    <div className="flex flex-col justify-center items-center w-full bg-gradient-to-tr from-[#494949] to-four">
      {session?.status === 'unauthenticated' && (
        <div className="p-4 bg-four  m-2 md:m-8 border rounded-md rounded-md-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 ">
            يجب عليك تسجيل الدخول أولا لرؤية هذه الإعلان
          </h1>
          <Link href={'/login'}>
            {' '}
            <Button title={'تسجيل الدخول'} />
          </Link>{' '}
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="flex flex-col justify-center items-center w-full xl:w-[90%] 2xl:w-[70%] h-full sm:px-16 pt-2 overflow-y-auto z-10 px-2">
          <div className="relative flex justify-between items-center w-full gap-2 my-2 bg-one p-1 md:p-2 rounded-[5px]">
            <div>
              <TfiMenuAlt
                className="text-[30px] lg:text-5xl text-white cursor-pointer"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              />
              <div className="absolute top-14 lg:top-20 right-0 z-50">
                {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
              </div>
            </div>

            <BackButton />
          </div>

          <div className="flex flex-col justify-start items-center w-full gap-4 py-4">
            <h1 className="grow text-lg lg:text-2xl w-full text-white">
              <span className="text-one  text-2xl ml-2">#</span>
              الإعلان
            </h1>
          </div>
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full border rounded-md p-2 sm:p-8 mt-4 bg-white">
              <div className="flex justify-start items-center gap-2 w-full mb-4">
                {/* صورة المستخدم */}
                <div className="relative size-8 sm:size-10 lg:size-14 overflow-hidden rounded-[5px]">
                  {!editedPost?.userImage && <LoadingPhoto />}
                  {editedPost?.userImage && (
                    <Image
                      priority
                      src={editedPost?.userImage}
                      fill
                      alt={editedPost?.propertyName}
                    />
                  )}
                </div>

                {/* اسم المستخدم */}
                <div className="flex flex-col justify-center">
                  <h6 className="text-[13px] sm:text-[18px] text-eight select-none">
                    {editedPost?.userName}
                  </h6>
                  {/* تاريخ الانشاء */}
                  <h1
                    className="text-[8px] sm:text-[12px] text-gray-400 select-none text-end"
                    dir="ltr"
                  >
                    {formatDate(editedPost?.createdAt)}
                  </h1>
                </div>
              </div>

              {/* الاسم */}
              <EditItem
                inputs={inputs}
                setInputs={setInputs}
                title={'عنوان الإعلان :'}
                property={'propertyName'}
                handleEditPost={handleEditPost}
                editedPost={editedPost}
              />

              {/* الصورة */}
              <div className="w-full">
                <ImageSlider
                  image={editedPost?.image}
                  image1={editedPost?.image1}
                  image2={editedPost?.image2}
                  image3={editedPost?.image3}
                  image4={editedPost?.image4}
                />{' '}
                <button
                  onClick={() => handleEditPost()}
                  className="bg-gray-600 mb-2 w-full mt-4 sm:w-fit text-white duration-300 transition-colors ease-in-out hover:bg-one hover:scale-105 border rounded-md text-center select-none p-2"
                >
                  حفظ التعديلات
                </button>
              </div>

              {/* العناصر */}
              <div className=" mt-4">
                {/* اسم المعلن */}

                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'اسم المعلن :'}
                  property={'userName'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />
                {/*  نوع العقار */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'نوع العقار :'}
                  property={'propertyType'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  عدد الغرف */}

                {inputs?.propertyRoomsNumber !== '0' && (
                  <EditItem
                    inputs={inputs}
                    setInputs={setInputs}
                    title={'عدد الغرف :'}
                    property={'propertyRoomsNumber'}
                    handleEditPost={handleEditPost}
                    editedPost={editedPost}
                  />
                )}
                {/*  المدينة */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'المدينة :'}
                  property={'propertyCity'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  المنطقة */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'المنطقة :'}
                  property={'propertyTown'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  المساحة */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'المساحة :'}
                  property={'propertyArea'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  السعر */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'السعر :'}
                  property={'propertyPrice'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  رقم الهاتف */}
                <EditItem
                  inputs={inputs}
                  setInputs={setInputs}
                  title={'رقم الهاتف :'}
                  property={'contactPhoneNumber'}
                  handleEditPost={handleEditPost}
                  editedPost={editedPost}
                />

                {/*  الوصف */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-lg lg:text-xl xl:text-2xl w-full my-2 select-none">
                      <span className="text-one text-xl lg:text-2xl mx-2 select-none">
                        #
                      </span>
                      الوصف :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-lg lg:text-xl xl:text-2xl text-start select-none h-44 border rounded-md w-full focus:outline-one overflow-y-auto placeholder:text-sm"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        description: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.description}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.description && editedPost?.description
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute -top-4 right-0 text-2xl text-one z-50" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-gray-600 mb-2 w-full mt-4 sm:w-fit text-white  duration-300 transition-colors ease-in-out hover:bg-one hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>

                {/* الفيديو */}
                {/* الموقع على الخريطة */}
                <div className="flex flex-col justify-start items-center w-full gap-4 py-4">
                  <h1 className="grow text-lg lg:text-2xl w-full">
                    <span className="text-one  text-2xl ml-2">#</span>
                    الموقع:
                  </h1>
                </div>
                <OnClickMap lat={editedPost?.lat} lng={editedPost?.lng} />
                <div>
                  <div className=" flex justify-between items-center my-4 h-10 sm:h-16 w-full overflow-visible">
                    <h1 className="  text-lg lg:text-xl xl:text-2xl w-full my-2 select-none">
                      <span className="text-one text-xl lg:text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو:
                    </h1>
                  </div>
                  <div className="relative">
                    <MdEdit className="absolute -top-4 right-0 text-2xl text-one" />
                    <input
                      type="text"
                      placeholder="الصق رابط الفيديو الجديد هنا ..."
                      value={editedPost?.linkValue}
                      onChange={handleInputChange}
                      className="text-right w-full p-2  text-lg outline-2 focus:outline-one h-12 border rounded-md placeholder:text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-gray-600 mb-2 w-full mt-4 sm:w-fit text-white  duration-300 transition-colors ease-in-out hover:bg-one hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>

                {/* عرض الفيديو */}
                <div className="flex justify-center items-center w-full mt-16">
                  {!inputs?.link && (
                    <iframe
                      src={iframeSrc || editedPost?.link}
                      title="YouTube video player"
                      frameborder
                      rounded-md="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                      className=" w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
                    />
                  )}
                  {inputs?.link && (
                    <iframe
                      src={inputs?.link}
                      title="YouTube video player"
                      frameborder
                      rounded-md="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                      className=" w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
