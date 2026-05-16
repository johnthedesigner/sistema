import { track } from '@vercel/analytics'

// Matches any resolved /raw/ URL in prompt text, stopping at whitespace or common
// markdown delimiters. Handles backtick-wrapped, plain, and parenthesised forms.
const RAW_URL_RE = /(https?:\/\/[^/\s]+\/raw\/[\w\-./@]+)/g

/**
 * Rewrites all /raw/ URLs in prompt text to append play and session identifiers.
 * Called at copy time so every agent fetch is attributable to a specific run.
 */
export function instrumentRawUrls(text: string, playSlug: string): string {
  const sid = crypto.randomUUID()
  return text.replace(RAW_URL_RE, (url) => `${url}?play=${playSlug}&sid=${sid}`)
}

export function trackCopy(playSlug: string, context: { campaign?: string; step?: number } = {}) {
  track('prompt_copy', { play: playSlug, ...context })
}
