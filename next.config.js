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
        hostname: 'res.cloudinary.com',
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
