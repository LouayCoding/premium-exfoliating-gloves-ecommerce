/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove console.logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Optimize bundle
  swcMinify: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  }
}

module.exports = nextConfig
