const withMarkdoc = require('@markdoc/next.js')
const withFonts = require('next-fonts');

/** @type {import('next').NextConfig} */

const nextConfig = {
  optimizeFonts: false,
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  }
}

module.exports = withFonts(withMarkdoc()(nextConfig))
