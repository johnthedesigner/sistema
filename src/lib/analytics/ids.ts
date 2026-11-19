/**
 * Usage analytics helpers shared by the browser and the server (docs/v2/analytics.md).
 * Pure functions: no network, no storage.
 */

/** IDs for test traffic: the V5 harness and slice runs use test-, the owner's own runs internal-. */
export const isInternalId = (id: string | null | undefined) => !!id && /^(test|internal)-/.test(id)

/** A `c` value we accept: a UUID, optionally prefixed with test- or internal-. */
export const VISIT_ID_RE = /^(?:(?:test|internal)-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const validVisitId = (id: string | null | undefined): string | null => (id && VISIT_ID_RE.test(id) ? id : null)

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Add `c=<id>` to every Sistema /raw and /api URL in a text, so an agent passes the
 * visit ID on without being asked. Anchors stay at the end; existing queries are kept;
 * URLs that already carry `c` are left alone. Parentheses inside a URL (as in
 * `oklch(0.55 0.01 260)`) stay part of it; an unbalanced closing parenthesis and
 * trailing punctuation belong to the surrounding text.
 */
export function withVisitId(text: string, id: string, base: string): string {
  const origin = base.replace(/\/$/, '')
  const re = new RegExp(`${escape(origin)}/(?:raw|api)(?=[/?#\\s\`'"()\\],.;:!]|$)[^\\s\`'"\\]]*`, 'g')
  return text.replace(re, (match: string) => {
    let url = match
    let tail = ''
    // Trim what belongs to the sentence: trailing punctuation and unbalanced ')'.
    for (;;) {
      const last = url.slice(-1)
      const opens = (url.match(/\(/g) ?? []).length
      const closes = (url.match(/\)/g) ?? []).length
      if (/[.,;:!]/.test(last) || (last === ')' && closes > opens)) {
        tail = last + tail
        url = url.slice(0, -1)
      } else break
    }
    const hashAt = url.indexOf('#')
    const hash = hashAt >= 0 ? url.slice(hashAt) : ''
    const beforeHash = hashAt >= 0 ? url.slice(0, hashAt) : url
    if (/[?&]c=/.test(beforeHash)) return match
    const joined = beforeHash.includes('?') ? `${beforeHash}&c=${id}` : `${beforeHash}?c=${id}`
    return `${joined}${hash}${tail}`
  })
}

/** The agent family from a user agent, for aggregate counts. */
export function agentFamily(ua: string | null | undefined): string {
  const u = (ua ?? '').toLowerCase()
  if (!u) return 'unknown'
  if (/claude|anthropic/.test(u)) return 'claude'
  if (/cursor/.test(u)) return 'cursor'
  if (/chatgpt|openai|gptbot/.test(u)) return 'openai'
  if (/gemini|google-extended|googleother/.test(u)) return 'google'
  if (/copilot|github/.test(u)) return 'github'
  if (/perplexity/.test(u)) return 'perplexity'
  if (/windsurf|codeium/.test(u)) return 'windsurf'
  if (/curl|wget|python|node|undici|axios|go-http|httpx|got\b|okhttp|java\//.test(u)) return 'script'
  if (/bot|crawl|spider/.test(u)) return 'crawler'
  if (/mozilla/.test(u)) return 'browser'
  return 'other'
}

/** What a /raw path is, for the agent_fetch event. */
export function rawKind(pathname: string): { kind: string; id?: string } {
  const p = pathname.replace(/^\/raw-with-id/, '/raw').replace(/\/$/, '')
  let m: RegExpMatchArray | null
  if ((m = p.match(/^\/raw\/workflows\/([^/]+)\/full$/))) return { kind: 'workflow_full', id: `workflow.${m[1]}` }
  if ((m = p.match(/^\/raw\/workflows\/([^/]+)$/))) return { kind: 'workflow', id: `workflow.${m[1]}` }
  if ((m = p.match(/^\/raw\/plays\/([^/]+)$/))) return { kind: 'play', id: m[1] }
  if ((m = p.match(/^\/raw\/guides\/([^/]+)\/([^/]+)$/))) return { kind: 'guide', id: `guide.${m[1]}.${m[2]}` }
  if ((m = p.match(/^\/raw\/files\/([^/]+)$/))) return { kind: 'file', id: `file.${m[1]}` }
  if ((m = p.match(/^\/raw\/(opinions|rules|sources|agents)$/))) return { kind: m[1] }
  if (p === '/raw/schema/sistema.json') return { kind: 'schema' }
  return { kind: 'other' }
}
