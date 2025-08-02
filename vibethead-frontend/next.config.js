/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output for development to fix chunk loading issues
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure webpack for better chunk handling
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ensure optimization object exists
      if (!config.optimization) {
        config.optimization = {};
      }
      
      // Ensure splitChunks object exists
      if (!config.optimization.splitChunks) {
        config.optimization.splitChunks = {};
      }
      
      // Ensure cacheGroups object exists
      if (!config.optimization.splitChunks.cacheGroups) {
        config.optimization.splitChunks.cacheGroups = {};
      }
      
      // Fix chunk loading issues in development
      config.optimization.splitChunks.cacheGroups.default = {
        ...(config.optimization.splitChunks.cacheGroups.default || {}),
        enforce: true,
      };
    }
    return config;
  },
  
  // Configure asset prefix for proper chunk loading
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : undefined,
  
  // Ensure proper public path for chunks
  publicRuntimeConfig: {
    basePath: '',
  },
  
  // Keep image optimization but with domain configuration
  images: {
    domains: ['localhost'],
    // Add any other domains your images might come from
  },
  
  // Configure experimental features for better stability
  experimental: {
    // Disable SWC minify which can cause chunk issues
    swcMinify: false,
  },
};

module.exports = nextConfig;