/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para Docker
  images: {
    domains: ['localhost', 'portfolio.sergioja.com', 'api.sergioja.com'],
    formats: ['image/avif', 'image/webp'],
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

module.exports = nextConfig;
