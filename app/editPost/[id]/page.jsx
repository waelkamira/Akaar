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
    postName: editedPost?.postName,
    ingredients: editedPost?.ingredients,
    theWay: editedPost?.theWay,
    advise: editedPost?.advise,
    link: editedPost?.link,
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
      console.log('json', json);
      setEditedPost(json);
    }
  };

  async function handleeditPost() {
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
          message={'تم تعديل هذا البوست بنجاح'}
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
        <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 text-white">
            يجب عليك تسجيل الدخول أولا لرؤية هذه الوصفة
          </h1>
          <Link href={'/login'}>
            {' '}
            <Button title={'تسجيل الدخول'} />
          </Link>{' '}
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="relative flex flex-col items-start w-full bg-four h-full p-2 lg:p-8 rounded-lg">
          <div className="hidden xl:block relative w-full h-24 sm:h-[200px] rounded-lg overflow-hidden shadow-lg shadow-one">
            <Image
              priority
              src={'/photo (20).png'}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          </div>
          <BackButton />
          <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
            <TfiMenuAlt
              className=" p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
          </div>
          <div className="relative w-full h-52 overflow-hidden my-4 xl:mt-8">
            <Image
              priority
              src={'/photo (28).png'}
              layout="fill"
              objectFit="contain"
              alt="photo"
            />
          </div>
          <div className="flex justify-between items-center w-full gap-4 sm:my-8">
            <h1 className="grow text-lg lg:text-3xl w-full text-white select-none">
              الوصفة:
            </h1>
          </div>
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full 2xl:w-2/3 border  rounded-lg p-2 sm:p-8 mt-8 bg-white">
              <div className="flex justify-start items-center gap-2 w-full mb-4">
                <div className="relative size-14 overflow-hidden rounded-xl">
                  {!editedPost?.userImage && <LoadingPhoto />}
                  {editedPost?.userImage && (
                    <Image
                      priority
                      src={editedPost?.userImage}
                      fill
                      alt={editedPost?.postName}
                    />
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <h6 className="text-[13px] sm:text-[18px] text-eight select-none">
                    {editedPost?.userName}
                  </h6>
                  <h1
                    className="text-[8px] sm:text-[12px] text-gray-400 select-none text-end"
                    dir="ltr"
                  >
                    {formatDate(editedPost?.createdAt)}
                  </h1>
                </div>
              </div>

              <div className=" flex flex-col sm:flex-row-reverse justify-between items-center gap-1 sm:gap-4">
                <h1
                  className="relative grow text-one my-4 sm:my-8 text-3xl sm:text-4xl lg:text-5xl text-center select-none  rounded-lg p-2 sm:p-4"
                  autoFocus="true"
                  contentEditable="true"
                  onInput={(e) =>
                    setInputs({
                      ...inputs,
                      postName: e.currentTarget.textContent,
                    })
                  }
                >
                  {inputs?.postName || editedPost?.postName}
                  {/* //? هذا السبان لابقاء الفوكس */}
                  <span
                    contentEditable="false"
                    className={
                      inputs?.postName && editedPost?.postName
                        ? 'hidden'
                        : 'text-white'
                    }
                  >
                    &#13;&#10;
                  </span>

                  <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                </h1>

                <button
                  onClick={() => handleeditPost()}
                  className="bg-five mb-2 w-full sm:w-fit hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
                >
                  حفظ التعديلات
                </button>
              </div>
              <UploadingAndDisplayingImage img={editedPost?.image} />
              <button
                onClick={() => handleeditPost()}
                className="bg-five mb-2 w-full sm:w-fit mt-4 hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
              >
                حفظ التعديلات
              </button>

              <div className="bg-white rounded-lg mt-4 sm:mt-16">
                <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible">
                  <h1 className="text-white  text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      #
                    </span>
                    المقادير
                  </h1>
                  <div className="relative size-28 md:size-44 xl:size-48 overflow-hidden rounded-lg grow">
                    <Image
                      priority
                      src={'/photo (24).png'}
                      layout="fill"
                      objectFit="contain"
                      alt={editedPost?.postName}
                    />
                  </div>
                </div>
                <pre
                  className="relative text-md lg:text-lg xl:text-xl w-full select-none "
                  contentEditable="true"
                  onInput={(e) =>
                    setInputs({
                      ...inputs,
                      ingredients: e.currentTarget.textContent,
                    })
                  }
                >
                  {editedPost?.ingredients}
                  {/* //? هذا السبان لابقاء الفوكس */}
                  <span
                    contentEditable="false"
                    className={
                      inputs?.postName && editedPost?.postName
                        ? 'hidden'
                        : 'text-white'
                    }
                  >
                    &#13;&#10;
                  </span>
                  <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                </pre>
                <button
                  onClick={() => handleeditPost()}
                  className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
                >
                  حفظ التعديلات
                </button>
                <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible">
                  <h1 className="text-white  text-xl sm:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      #
                    </span>
                    الطريقة
                  </h1>
                  <div className="relative size-20 md:size-32 xl:size-48  overflow-hidden rounded-lg rotate-45">
                    <Image
                      priority
                      src={'/photo (25).png'}
                      layout="fill"
                      objectFit="contain"
                      alt={editedPost?.postName}
                    />
                  </div>
                </div>
                <pre
                  className="relative text-md lg:text-lg xl:text-xl w-full select-none "
                  contentEditable="true"
                  onInput={(e) =>
                    setInputs({
                      ...inputs,
                      theWay: e.currentTarget.textContent,
                    })
                  }
                >
                  {editedPost?.theWay}
                  {/* //? هذا السبان لابقاء الفوكس */}
                  <span
                    contentEditable="false"
                    className={
                      inputs?.postName && editedPost?.postName
                        ? 'hidden'
                        : 'text-white'
                    }
                  >
                    &#13;&#10;
                  </span>
                  <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                </pre>
                <button
                  onClick={() => handleeditPost()}
                  className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
                >
                  حفظ التعديلات
                </button>
                {editedPost?.advise && (
                  <>
                    <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible mb-16">
                      <h1 className="text-white  text-xl sm:text-3xl w-full my-2 select-none">
                        <span className="text-one  text-2xl mx-2 select-none">
                          #
                        </span>
                        نصائح
                      </h1>
                      <div className="relative size-20 md:size-32 xl:size-44 overflow-hidden rounded-lg">
                        <Image
                          priority
                          src={'/photo (27).png'}
                          layout="fill"
                          objectFit="contain"
                          alt={editedPost?.postName}
                        />
                      </div>
                    </div>
                    <pre
                      className="relative text-md lg:text-lg xl:text-xl w-full select-none "
                      contentEditable="true"
                      onInput={(e) =>
                        setInputs({
                          ...inputs,
                          advise: e.currentTarget.textContent,
                        })
                      }
                    >
                      {editedPost?.advise}
                      {/* //? هذا السبان لابقاء الفوكس */}
                      <span
                        contentEditable="false"
                        className={
                          inputs?.postName && editedPost?.postName
                            ? 'hidden'
                            : 'text-white'
                        }
                      >
                        &#13;&#10;
                      </span>
                      <MdEdit className="absolute top-0 -right-6 animate-pulse text-2xl text-one" />
                    </pre>{' '}
                    <button
                      onClick={() => handleeditPost()}
                      className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
                    >
                      حفظ التعديلات
                    </button>
                  </>
                )}
                <div className="flex justify-between items-center my-4 sm:my-8 lg:my-16 bg-four h-10 sm:h-16 rounded-lg w-full overflow-visible">
                  <h1 className="text-white  text-2xl lg:text-3xl w-full my-2 select-none">
                    <span className="text-one  text-2xl mx-2 select-none">
                      #
                    </span>
                    فيديو
                  </h1>
                  <div className="relative size-20 md:size-32 xl:size-44 overflow-hidden rounded-lg rotate-20">
                    <Image
                      priority
                      src={'/photo (26).png'}
                      layout="fill"
                      objectFit="contain"
                      alt={editedPost?.postName}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="الصق رابط الفيديو الجديد هنا ..."
                  value={url}
                  onChange={handleInputChange}
                  className="text-right w-full p-2 rounded-lg text-lg outline-2 focus:outline-one h-10 border"
                />
                <button
                  onClick={() => handleeditPost()}
                  className="bg-five mb-2 w-full mt-4 sm:w-fit hover:bg-one text-white hover:scale-105 border text-center select-none  rounded-lg p-2"
                >
                  حفظ التعديلات
                </button>
                <div className="flex justify-center items-center w-full mt-16">
                  {!inputs?.link && (
                    <iframe
                      src={iframeSrc || editedPost?.link}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                      className="rounded-lg w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
                    />
                  )}
                  {inputs?.link && (
                    <iframe
                      src={inputs?.link}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
                      className="rounded-lg w-full h-44 sm:h-96 lg:h-[470px] xl:h-[500px] 2xl:h-[560px]"
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
