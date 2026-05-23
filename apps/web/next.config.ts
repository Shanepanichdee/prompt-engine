import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: '.next',
  transpilePackages: ['@prompt-engine/core'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' cdn.cookiehub.eu www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' cdn.cookiehub.eu",
              "img-src 'self' data: https: www.google-analytics.com cdn.cookiehub.eu",
              "font-src 'self' data: cdn.cookiehub.eu",
              "connect-src 'self' *.cookiehub.eu api.cookiehub.eu www.google-analytics.com analytics.google.com *.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
