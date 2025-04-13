'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل إرسال الرسالة');
      }

      toast.success('تم إرسال رسالتك بنجاح!');
      reset();
    } catch (error) {
      toast.error(`حدث خطأ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      dir="rtl"
    >
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'هذا الحقل مطلوب' })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'هذا الحقل مطلوب',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'بريد إلكتروني غير صالح',
            },
          })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          الرسالة
        </label>
        <textarea
          id="message"
          rows="4"
          {...register('message', { required: 'هذا الحقل مطلوب' })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
      </button>
    </form>
  );
}
