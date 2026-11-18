/**
 * Server-side usage events (docs/v2/analytics.md section 3), sent straight to
 * PostHog's capture endpoint. Anonymous: no person profiles, no IP address.
 * Location comes from Vercel's request headers, so PostHog's own IP lookup
 * (which would see Vercel's servers) is turned off per event.
 */
import { agentFamily, isInternalId, validVisitId } from './ids'

export const DEPLOY_ENV = process.env.VERCEL_ENV ?? 'development'

interface HeaderSource {
  get(name: string): string | null
}

export interface UsageEvent {
  event: string
  /** The visit ID (`c`), when the request carried a valid one. */
  visitId?: string | null
  properties?: Record<string, unknown>
}

function geo(headers: HeaderSource): Record<string, unknown> {
  const h = (n: string) => headers.get(n) ?? undefined
  const city = h('x-vercel-ip-city')
  const out: Record<string, unknown> = {
    $geoip_disable: true,
    $geoip_country_code: h('x-vercel-ip-country'),
    $geoip_subdivision_1_code: h('x-vercel-ip-country-region'),
    $geoip_city_name: city ? decodeURIComponent(city) : undefined,
    $geoip_latitude: h('x-vercel-ip-latitude') ? Number(h('x-vercel-ip-latitude')) : undefined,
    $geoip_longitude: h('x-vercel-ip-longitude') ? Number(h('x-vercel-ip-longitude')) : undefined,
  }
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined))
}

/** The JSON body for PostHog's capture endpoint. Exported for tests. */
export function buildPayload(ev: UsageEvent, headers: HeaderSource, apiKey: string) {
  const visitId = validVisitId(ev.visitId)
  const ua = headers.get('user-agent')
  return {
    api_key: apiKey,
    event: ev.event,
    distinct_id: visitId ?? crypto.randomUUID(),
    properties: {
      ...ev.properties,
      c: visitId ?? undefined,
      has_visit_id: !!visitId,
      agent: agentFamily(ua),
      user_agent: ua ?? undefined,
      env: DEPLOY_ENV,
      internal: isInternalId(visitId),
      source: 'server',
      $process_person_profile: false,
      ...geo(headers),
    },
  }
}

/**
 * Send one event. Never throws and never delays the response for long: callers
 * schedule it with `after()` (route handlers) or `waitUntil` (middleware).
 * Does nothing without a PostHog key, or in local development unless
 * ANALYTICS_SEND_IN_DEV=1.
 */
export async function capture(ev: UsageEvent, headers: HeaderSource): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  if (DEPLOY_ENV === 'development' && process.env.ANALYTICS_SEND_IN_DEV !== '1') return
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com').replace(/\/$/, '')
  try {
    await fetch(`${host}/i/v0/e/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(ev, headers, key)),
      signal: AbortSignal.timeout(3000),
    })
  } catch {
    // Analytics must never break a tool or a page.
  }
}
