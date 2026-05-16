import { track } from '@vercel/analytics'
import posthog from 'posthog-js'

// Matches any resolved /raw/ URL in prompt text, stopping at whitespace or common
// markdown delimiters. Handles backtick-wrapped, plain, and parenthesised forms.
const RAW_URL_RE = /(https?:\/\/[^/\s]+\/raw\/[\w\-./@]*\w)/g

/**
 * Rewrites all /raw/ URLs in prompt text to append play and session identifiers,
 * then appends a context URL so the play/session is always visible in pasted text
 * and the agent fetch fires a server-side run event.
 */
export function instrumentRawUrls(text: string, playSlug: string, base: string): string {
  const sid = crypto.randomUUID()
  const instrumented = text.replace(RAW_URL_RE, (url) => `${url}?play=${playSlug}&sid=${sid}`)
  const contextUrl = `${base}/api/context?play=${playSlug}&sid=${sid}`
  return `${instrumented}\n\n[Sistema context: ${contextUrl}]`
}

export function trackCopy(playSlug: string, context: { campaign?: string; step?: number } = {}) {
  const props = { play: playSlug, ...context }
  track('prompt_copy', props)
  posthog.capture('prompt_copy', props)
}
