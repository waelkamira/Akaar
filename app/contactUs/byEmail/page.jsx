'use client';
import React, { useRef, useState, Suspense } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

function ContactUsForm() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    message: '',
  });
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const createPromise = new Promise(async (resolve, reject) => {
      try {
        await emailjs.sendForm(
          process.env.NEXT_PUBLIC_SERVES_ID,
          process.env.NEXT_PUBLIC_TEMPLATE_ID,
          form.current,
          {
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_ID,
          }
        );
        resolve();
        setUserInfo({ name: '', email: '', message: '' });
      } catch (error) {
        console.log('FAILED...', error.text);
        reject(error);
      }
    });

    toast.promise(createPromise, {
      loading: 'جاري الإرسال...',
      success: 'تم إرسال رسالتك بنجاح',
      error: 'حدث خطأ، يرجى المحاولة لاحقاً',
    });
  };

  return (
    <form
      className="flex flex-col items-center gap-4 mt-16 xl:mt-52 w-full xl:w-[70%] border border-gray-300 rounded-[5px] p-4 m-2 xl:p-16"
      ref={form}
      onSubmit={sendEmail}
    >
      <div className="w-full flex flex-col sm:flex-row justify-between items-center lg:gap-16 sm:gap-8">
        <div className="flex flex-col grow w-full my-2">
          <label className="text-sm sm:text-lg lg:text-xl text-primary-500 my-1">
            الإسم:
          </label>
          <input
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            required
            type="text"
            name="user_name"
            placeholder="اسمك"
            className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-primary-500"
          />
        </div>
        <div className="flex flex-col grow w-full my-2">
          <label className="text-sm sm:text-lg lg:text-xl text-primary-500 my-1">
            الإيميل:
          </label>
          <input
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            required
            type="email"
            name="user_email"
            placeholder="بريدك الإلكتروني"
            className="w-full text-sm sm:text-lg rounded text-start text-black z-40 h-9 sm:h-12 text-nowrap px-2 border border-gray-300 focus:outline-primary-500"
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-full my-2">
        <label className="text-sm sm:text-lg lg:text-xl text-primary-500 w-full text-start my-1">
          الرسالة:
        </label>
        <textarea
          value={userInfo.message}
          placeholder="رسالتك"
          onChange={(e) =>
            setUserInfo({ ...userInfo, message: e.target.value })
          }
          required
          name="message"
          className="w-full rounded-[5px] outline-none border border-gray-300 focus:border-primary-500 p-2 border-secondary text-sm sm:text-lg lg:text-xl min-h-[200px]"
        />
      </div>

      <button
        className="btn flex justify-center items-center my-2 sm:text-lg text-sm p-0.5 lg:p-3 text-white text-nowrap select-none rounded-[5px] w-full max-h-12 hover:scale-[101%]"
        type="submit"
      >
        ارسال
      </button>
    </form>
  );
}

export default function ContactUsByEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          جار التحميل...
        </div>
      }
    >
      <ContactUsForm />
    </Suspense>
  );
}
