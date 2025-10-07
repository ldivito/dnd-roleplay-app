/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 15
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Properly optimize lucide-react imports to prevent barrel optimization issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
