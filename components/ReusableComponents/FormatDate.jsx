import React from 'react';

export default function FormatDate({ dateString }) {
  const date = new Date(dateString);
  if (isNaN(date)) return 'تاريخ غير صالح';

  const diffInMs = Date.now() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 24) {
    return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعة'}`;
  } else {
    return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'يوم'}`;
  }
}
