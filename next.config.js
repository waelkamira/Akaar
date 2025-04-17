/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // trailingSlash: true, // جرب تشغيل هذه الميزة
  compress: true,
  typescript: {
    ignoreBuildErrors: true, // تجاهل أخطاء TypeScript أثناء البناء
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // السماح بجميع النطاقات
      },
      {
        protocol: 'https',
        hostname: 'scontent-lga3-2.xx.fbcdn.net',
        // You can optionally specify port and pathname if needed, but often not required
        // port: '',
        // pathname: '/v/**', // Example if paths always start with /v/
      },
      // --- IMPORTANT ---
      // Consider adding a more general pattern if you expect images
      // from other Facebook CDN subdomains:
      {
        protocol: 'https',
        hostname: '**.fbcdn.net', // Allows any subdomain of fbcdn.net
      },
      {
        protocol: 'https',
        hostname: '**.xx.fbcdn.net', // Allows subdomains like xx.fbcdn.net
      },
    ],
    formats: ['image/avif', 'image/webp'], // تحسين الصور
    minimumCacheTTL: 60, // وقت التخزين المؤقت للصور (بالثواني)
  },
  productionBrowserSourceMaps: false, // تعطيل source maps في الإنتاج لتحسين الأداء
  staticPageGenerationTimeout: 120, // زيادة مهلة إنشاء الصفحات الثابتة (بالثواني)
};

module.exports = nextConfig;
