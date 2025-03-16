/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'build',
  compress: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // السماح بجميع النطاقات
      },
      {
        protocol: 'https',
        hostname: 'scontent-ord5-1.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-lga3-1.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-hou1-1.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-ord5-2.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-msp1-1.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent-lga3-2.xx.fbcdn.net',
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
