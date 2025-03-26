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
    // تحسين الصور
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // وقت التخزين المؤقت للصور (بالثواني)
  },
  // تحسين الأداء
  productionBrowserSourceMaps: false, // تعطيل source maps في الإنتاج لتحسين الأداء
  // تكوين إعدادات الخادم
  experimental: {
    serverActions: true,
    serverMinification: true, // تقليل حجم كود الخادم
    optimizeFonts: true, // تحسين الخطوط
    optimizeCss: true, // تحسين CSS
    serverComponentsExternalPackages: [], // تقليل حجم الحزم الخارجية
  },
  // تكوين وقت التخزين المؤقت للصفحات الثابتة
  staticPageGenerationTimeout: 120, // زيادة مهلة إنشاء الصفحات الثابتة (بالثواني)
};

module.exports = nextConfig;
