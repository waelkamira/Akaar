'use client';

import { Suspense } from 'react';
import Loading from './Loading';

export default function SearchParamsWrapper({ children }) {
  return (
    <Suspense fallback={<Loading message="جاري التحميل..." />}>
      {children}
    </Suspense>
  );
}
