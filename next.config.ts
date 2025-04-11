// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Needed if you use <Image> component
  },
  basePath: '/set-clone', // Important for GitHub Pages!
  assetPrefix: '/set-clone',
};

module.exports = nextConfig;