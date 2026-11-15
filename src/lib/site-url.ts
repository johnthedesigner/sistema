export const PRODUCTION_URL = 'https://sistema.johnthedesigner.com'

/**
 * Decide the site's public origin for a build. Used by next.config.ts, which
 * inlines the result as NEXT_PUBLIC_SITE_URL so server and client agree.
 *
 * 1. NEXT_PUBLIC_SITE_URL, when set (local tunnels, explicit overrides)
 * 2. The stable branch URL on Vercel preview builds
 * 3. The production domain
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')
  if (env.VERCEL_ENV === 'preview' && env.VERCEL_BRANCH_URL) return `https://${env.VERCEL_BRANCH_URL}`
  return PRODUCTION_URL
}

/** The site's public origin, with no trailing slash. Safe in server and client code. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL).replace(/\/+$/, '')
