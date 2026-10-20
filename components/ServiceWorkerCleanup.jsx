'use client';

import { useEffect } from 'react';

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let active = true;
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (!active) return;
      registrations.forEach((registration) => registration.unregister());
    });

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.filter((key) => key.includes('workbox') || key.includes('next')).forEach((key) => caches.delete(key));
      });
    }

    return () => {
      active = false;
    };
  }, []);

  return null;
}
