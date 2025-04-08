/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains (consider restricting in production)
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
    formats: ['image/webp'], // Serve modern webp format
  },
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,
  
  // Enable SWC compiler for faster builds
  swcMinify: true,
  
  // Security headers (optional but recommended)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  
  // Webpack configuration (optional)
  webpack: (config) => {
    // Important: return the modified config
    return config
  }
}

module.exports = nextConfig