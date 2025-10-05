/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Cloudflare Pages optimization
  experimental: {
    esmExternals: false
  },
  // Disable middleware for static export
  middleware: undefined
}

module.exports = nextConfig
