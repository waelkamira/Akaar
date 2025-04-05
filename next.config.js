/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true, // تمكين minification باستخدام SWC
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
  // تحسين التخزين المؤقت للصفحات الثابتة
  staticPageGenerationTimeout: 120, // زيادة مهلة إنشاء الصفحات الثابتة (بالثواني)
};

module.exports = nextConfig;
