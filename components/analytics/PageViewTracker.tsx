'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastRecordedPath = useRef('');

  useEffect(() => {
    if (!pathname || pathname === lastRecordedPath.current) return;
    lastRecordedPath.current = pathname;
    void fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch((error: unknown) => {
      console.error('Unable to submit aggregate page view:', error);
    });
  }, [pathname]);

  return null;
}
