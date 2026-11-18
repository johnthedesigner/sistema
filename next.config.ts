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
  // The contrast API reads its required values from the rules registry at request time.
  outputFileTracingIncludes: {
    '/api/contrast': ['./content/rules/color.yaml'],
  },
}

export default nextConfig
