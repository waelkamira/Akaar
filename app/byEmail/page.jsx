'use client';
import { useState } from 'react';
import { FiSend, FiUser, FiMail, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'حدث خطأ');

      toast.success('تم إرسال رسالتك بنجاح!');

      e.target.reset();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-2">
      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className=" w-full sm:w-3/4 lg:w-1/2 p-2 sm:p-6 bg-white rounded-xl shadow-lg my-24"
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          تواصل معنا
        </h2>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-medium">
            <FiUser className="inline ml-2 text-orange-500" />
            الاسم الكامل
          </label>
          <div className="relative">
            <input
              name="name"
              type="text"
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="أدخل اسمك الكامل"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-medium">
            <FiMail className="inline ml-2 text-orange-500" />
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">
            <FiMessageSquare className="inline ml-2 text-orange-500" />
            الرسالة
          </label>
          <textarea
            name="message"
            rows="5"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
            placeholder="اكتب رسالتك هنا..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              جاري الإرسال...
            </>
          ) : (
            <>
              <FiSend className="ml-2" />
              إرسال الرسالة
            </>
          )}
        </button>
      </form>
    </div>
  );
}
