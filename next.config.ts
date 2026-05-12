import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect /systems/:slug to /kb/design-systems/:slug
      // The content page enforces .md on the last segment via its own redirect,
      // so we only need to handle the prefix change here.
      {
        source: '/systems/:path*',
        destination: '/kb/design-systems/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
