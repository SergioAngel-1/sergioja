const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  scope: '/',
  reloadOnOnline: true,
  fallbacks: {
    document: '/offline',
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para Docker
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  
  images: {
    domains: ['localhost', 'portfolio.sergioja.com', 'api.sergioja.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  transpilePackages: ['three'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.portfolio.sergioja.com' }],
        destination: 'https://portfolio.sergioja.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'portfolio.sergioja.com' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: 'https://portfolio.sergioja.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
