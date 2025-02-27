import React from 'react';

export default function FormatDate({ dateString }) {
  const date = new Date(dateString);
  if (isNaN(date)) return 'تاريخ غير صالح';

  const diffInMs = Date.now() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // حساب الدقائق
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // حساب الساعات
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // حساب الأيام

  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقيقة'}`;
  } else if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعة'}`;
  } else {
    return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'يوم'}`;
  }
}
