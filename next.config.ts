import path from 'path'
import type { NextConfig } from 'next'
import { resolveSiteUrl } from './src/lib/site-url'

const nextConfig: NextConfig = {
  // One origin per build, inlined for server and client alike. Prompt text is
  // resolved against it on the server (src/lib/placeholders.ts).
  env: {
    NEXT_PUBLIC_SITE_URL: resolveSiteUrl(process.env),
  },
  // Pin the workspace root to this repo. Without this, a package-lock.json in a
  // parent folder makes Next infer the wrong root and `next start` serves 404s.
  outputFileTracingRoot: path.join(__dirname),
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
