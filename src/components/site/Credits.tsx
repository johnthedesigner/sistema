import Link from 'next/link'
import type { Credit, SourceEntry } from '@/lib/content/schema'
import { sourceHref } from '@/lib/content/site'

/** A page URL shown without the protocol or a trailing slash. */
const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

/**
 * "Draws on": the sources a guide or format page used, one line per source,
 * with the pages it drew from. Sistema's synthesis is its own; this says where
 * it learned from.
 */
export function Credits({ credits, sources }: { credits: Credit[]; sources: Map<string, SourceEntry> }) {
  if (!credits.length) return null
  const bySource = new Map<string, string[]>()
  for (const c of credits) bySource.set(c.source, [...(bySource.get(c.source) ?? []), c.url])
  return (
    <section className="mt-10 pt-6 border-t border-border">
      <h2 className="font-serif font-medium m-0 mb-2" style={{ fontSize: 20 }}>Draws on</h2>
      <p className="text-[13px] text-on-surface-muted m-0 mb-3 leading-[1.55]" style={{ maxWidth: 640 }}>
        This page is Sistema&apos;s own synthesis. These are the sources it learned from. See{' '}
        <Link href="/sources" className="text-primary">Sources</Link> for how each is used and licensed.
      </p>
      <ul className="m-0 pl-4 list-disc text-[13.5px] leading-[1.7]">
        {[...bySource].map(([id, urls]) => {
          const s = sources.get(id)
          return (
            <li key={id}>
              <Link href={sourceHref(id)} className="font-medium text-on-surface">{s?.name ?? id}</Link>
              {s && <span className="text-on-surface-muted"> ({s.publisher})</span>}
              <span className="text-on-surface-muted">: </span>
              {urls.map((u, i) => (
                <span key={u}>
                  {i > 0 && <span className="text-on-surface-subtle">, </span>}
                  <a href={u} target="_blank" rel="noopener noreferrer" className="text-on-surface-muted underline underline-offset-2 break-all">{shortUrl(u)}</a>
                </span>
              ))}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
