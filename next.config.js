/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Netlify optimization
  experimental: {
    esmExternals: false
  },
  // Disable middleware for static export
  middleware: undefined,
  // Netlify specific optimizations
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: '',
  distDir: '.next'
}

module.exports = nextConfig
