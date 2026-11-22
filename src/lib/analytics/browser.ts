/**
 * Browser side of usage analytics (docs/v2/analytics.md). One visit ID per page
 * session, kept in memory only: nothing is written to cookies or storage, so a
 * visit is never linked to another. PostHog is started with this ID, and copied
 * prompts carry it as `c`. Open the site with `?internal` to mark your own visit.
 */
import posthog from 'posthog-js'
import { SITE_URL } from '@/lib/site-url'
import { withVisitId } from './ids'

let visitId: string | null = null

export function getVisitId(): string {
  if (!visitId) {
    const internal = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('internal')
    visitId = `${internal ? 'internal-' : ''}${crypto.randomUUID()}`
  }
  return visitId
}

export const DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV ?? 'development'

/** Whether browser events are sent: a key is set, and not local development unless asked. */
export function analyticsEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_POSTHOG_KEY && (DEPLOY_ENV !== 'development' || process.env.NEXT_PUBLIC_ANALYTICS_SEND_IN_DEV === '1')
}

function send(event: string, properties: Record<string, unknown>) {
  if (!analyticsEnabled() || !posthog.__loaded) return
  posthog.capture(event, properties)
}

/** Copy text with the visit ID added to its Sistema URLs, and record the copy. */
export function promptForCopy(body: string, id: string): string {
  const c = getVisitId()
  send('prompt_copied', { kind: id.startsWith('workflow.') ? 'workflow' : 'play', id, c })
  return withVisitId(body, c, SITE_URL)
}

/** A suggestion or route in the prompt box was chosen. */
export function trackPromptSelected(kind: string, id: string) {
  send('prompt_selected', { kind, id, c: getVisitId() })
}

const timers = new Map<string, ReturnType<typeof setTimeout>>()
const seen = new Set<string>()

/**
 * A tool page was used. The first call per tool (the page's initial render) is
 * skipped, so only real interaction counts. Debounced, so typing a color sends one event.
 */
export function trackToolPage(tool: string, properties: Record<string, unknown>) {
  if (!seen.has(tool)) {
    seen.add(tool)
    return
  }
  clearTimeout(timers.get(tool))
  timers.set(tool, setTimeout(() => send('tool_page_used', { tool, ...properties }), 1500))
}
