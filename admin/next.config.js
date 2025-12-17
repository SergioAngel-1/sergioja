/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts', 'date-fns'],
  },
  
  images: {
    domains: ['localhost', 'admin.sergioja.com', 'api.sergioja.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.admin.sergioja.com' }],
        destination: 'https://admin.sergioja.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'admin.sergioja.com' },
          { type: 'header', key: 'x-forwarded-proto', value: 'http' },
        ],
        destination: 'https://admin.sergioja.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
