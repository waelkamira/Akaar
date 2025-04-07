/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true, // جرب تشغيل هذه الميزة
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
    ],
    formats: ['image/avif', 'image/webp'], // تحسين الصور
    minimumCacheTTL: 60, // وقت التخزين المؤقت للصور (بالثواني)
  },
  productionBrowserSourceMaps: false, // تعطيل source maps في الإنتاج لتحسين الأداء
  staticPageGenerationTimeout: 120, // زيادة مهلة إنشاء الصفحات الثابتة (بالثواني)
};

module.exports = nextConfig;
