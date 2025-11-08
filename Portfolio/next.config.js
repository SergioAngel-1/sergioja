/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para Docker
  images: {
    domains: ['localhost', 'portfolio.sergioja.com', 'api.portfolio.sergioja.com'],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  transpilePackages: ['three'],
};

module.exports = nextConfig;
