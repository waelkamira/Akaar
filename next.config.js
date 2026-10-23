/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  turbopack: {}, // 🟢 تم إضافة هذا السطر هنا لمنع تعارض Next-PWA مع محرّك البناء
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  productionBrowserSourceMaps: false,
  staticPageGenerationTimeout: 120,
});

module.exports = nextConfig;
