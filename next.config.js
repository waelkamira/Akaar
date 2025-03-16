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
      {
        protocol: 'https',
        hostname: '**.fbcdn.net', // السماح بجميع النطاقات الفرعية لـ fbcdn.net
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
      },
      {
        protocol: 'https',
        hostname: 'kitchen.sayidaty.net',
      },
      {
        protocol: 'https',
        hostname: 'cooking-ways.com',
      },
      {
        protocol: 'https',
        hostname: 'v-genius.fatafeat.com',
      },
    ],
  },
};

module.exports = nextConfig;
