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

export default function EditPost() {
  const [url, setUrl] = useState('');
  const [embedLink, setEmbedLink] = useState('');
  const { data } = useContext(inputsContext);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const [editedPost, setEditedPost] = useState([]);
  const { id } = useParams();
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
    contactPhoneNumber: editedPost?.contactPhoneNumber,
    description: editedPost?.description,
    link: editedPost?.linkValue, // التعامل مع الحقل `link` بشكل صحيح
    hearts: editedPost?.hearts,
    userName: editedPost?.userName,
    userImage: editedPost?.userImage,
  });

  useEffect(() => {
    setInputs({
      ...inputs,
      image: data?.image,
    });
    fetchEditedPost();
  }, []);
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
    <>
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
        <div className="relative flex flex-col items-start w-full bg-four h-full p-2 lg:p-8 ">
          <BackButton />
          <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
            <TfiMenuAlt
              className=" p-1  text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>

          <div className="flex justify-between items-center w-full gap-4 sm:my-8">
            <h1 className="grow text-lg lg:text-3xl w-full text-white select-none mt-16">
              الإعلان:
            </h1>
          </div>
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full 2xl:w-2/3 border rounded-md p-2 sm:p-8 mt-8 bg-white">
              <div className="flex justify-start items-center gap-2 w-full mb-4">
                {/* صورة المستخدم */}
                <div className="relative size-14 overflow-hidden rounded-xl">
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
              <div className=" flex flex-col justify-start items-start gap-1 sm:gap-4">
                <h1>اسم الاعلان</h1>
                <h1
                  className="relative grow text-one p-2 text-2xl text-center select-none h-12 border rounded-md w-full focus:outline-one"
                  autoFocus="true"
                  contentEditable="true"
                  onInput={(e) =>
                    setInputs({
                      ...inputs,
                      propertyName: e.currentTarget.textContent,
                    })
                  }
                >
                  {inputs?.propertyName || editedPost?.propertyName}
                  {/* //? هذا السبان لابقاء الفوكس */}
                  <span
                    contentEditable="false"
                    className={
                      inputs?.propertyName && editedPost?.propertyName
                        ? 'hidden'
                        : ''
                    }
                  >
                    &#13;&#10;
                  </span>

                  <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                </h1>

                <button
                  onClick={() => handleEditPost()}
                  className="bg-five mb-2 w-full sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                >
                  حفظ التعديلات
                </button>
              </div>

              {/* الصورة */}
              <div>
                {/* <UploadingAndDisplayingImage
                  height={'h-96'}
                  images={[
                    editedPost?.image,
                    editedPost?.image1,
                    editedPost?.image2,
                    editedPost?.image3,
                    editedPost?.image4,
                  ]}
                /> */}
                <ImageSlider
                  image={editedPost?.image}
                  image1={editedPost?.image1}
                  image2={editedPost?.image2}
                  image3={editedPost?.image3}
                  image4={editedPost?.image4}
                />{' '}
                <button
                  onClick={() => handleEditPost()}
                  className="bg-five mb-2 w-full sm:w-fit mt-4 hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                >
                  حفظ التعديلات
                </button>
              </div>

              {/* العناصر */}
              <div className=" mt-4">
                {/* اسم المعلن */}
                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      اسم المعلن :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        propertyName: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.propertyName}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.propertyName && editedPost?.propertyName
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  نوع العقار */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      نوع العقار :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        propertyType: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.propertyType}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.propertyType && editedPost?.propertyType
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  المدينة */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      المدينة :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        propertyCity: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.propertyCity}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.propertyCity && editedPost?.propertyCity
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  المساحة */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      المساحة :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        propertyArea: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.propertyArea}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.propertyArea && editedPost?.propertyArea
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  السعر */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      السعر :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        propertyPrice: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.propertyPrice}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.propertyPrice && editedPost?.propertyPrice
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  رقم الهاتف */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="  text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      رقم الهاتف :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-12 border rounded-md w-full focus:outline-one"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        contactPhoneNumber: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.contactPhoneNumber}
                    {/* //? هذا السبان لابقاء الفوكس */}
                    <span
                      contentEditable="false"
                      className={
                        inputs?.contactPhoneNumber &&
                        editedPost?.contactPhoneNumber
                          ? 'hidden'
                          : ''
                      }
                    >
                      &#13;&#10;
                    </span>
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>
                {/*  الوصف */}

                <div>
                  <div className="flex justify-between items-center my-4 sm:my-8  w-full overflow-visible">
                    <h1 className="text-xl sm:text-2xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      الوصف :
                    </h1>
                  </div>
                  <pre
                    className="relative grow p-2 text-2xl text-start select-none h-44 border rounded-md w-full focus:outline-one overflow-y-auto"
                    contentEditable="true"
                    onInput={(e) =>
                      setInputs({
                        ...inputs,
                        description: e.currentTarget.textContent,
                      })
                    }
                  >
                    {editedPost?.description}
                    {/* //? هذا السبان لابقاء الفوكس */}
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
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                  </pre>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
                  >
                    حفظ التعديلات
                  </button>
                </div>

                {/* الفيديو */}
                <div>
                  <div className=" flex justify-between items-center my-4 h-10 sm:h-16 w-full overflow-visible">
                    <h1 className="  text-2xl lg:text-3xl w-full my-2 select-none">
                      <span className="text-one  text-2xl mx-2 select-none">
                        #
                      </span>
                      فيديو:
                    </h1>
                  </div>
                  <div className="relative">
                    <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                    <input
                      type="text"
                      placeholder="الصق رابط الفيديو الجديد هنا ..."
                      value={editedPost?.linkValue}
                      onChange={handleInputChange}
                      className="text-right w-full p-2  text-lg outline-2 focus:outline-one h-12 border rounded-md "
                    />
                  </div>
                  <button
                    onClick={() => handleEditPost()}
                    className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-five hover:scale-105 border rounded-md text-center select-none   p-2"
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
    </>
  );
}
