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
  },
};

module.exports = nextConfig;
