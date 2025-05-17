/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep image optimization but with domain configuration
  images: {
    domains: ['localhost'],
    // Add any other domains your images might come from
  },
};

module.exports = nextConfig;
