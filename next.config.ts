import path from 'path'
import type { NextConfig } from 'next'
import { resolveSiteUrl } from './src/lib/site-url'

const nextConfig: NextConfig = {
  // `npm run build:check` builds into .next-check, so a check build never
  // overwrites the files a running `next dev` serves from .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // One origin per build, inlined for server and client alike. Prompt text is
  // resolved against it on the server (src/lib/placeholders.ts).
  env: {
    NEXT_PUBLIC_SITE_URL: resolveSiteUrl(process.env),
    // Tags analytics events so dashboards can keep to production (docs/v2/analytics.md).
    NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV ?? 'development',
  },
  // Pin the workspace root to this repo. Without this, a package-lock.json in a
  // parent folder makes Next infer the wrong root and `next start` serves 404s.
  outputFileTracingRoot: path.join(__dirname),
  // The tool APIs read required values from the rules registry at request time.
  outputFileTracingIncludes: {
    '/api/contrast': ['./content/rules/color.yaml'],
    '/api/type-scale': ['./content/rules/color.yaml', './content/rules/typography.yaml'],
    // The validator and dark mode tools read the color, token, typography, and spacing rules at request time.
    '/api/validate': ['./content/rules/*.yaml'],
    '/api/dark-mode': ['./content/rules/color.yaml'],
    // /raw with a visit ID renders at request time, so it needs the content files.
    '/raw-with-id/**': ['./content/**/*'],
    // The MCP server reads content and the palette library at request time.
    '/mcp': ['./content/**/*', './public/palettes/library.json'],
  },
}

export default nextConfig
