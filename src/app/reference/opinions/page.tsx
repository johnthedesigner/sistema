import type { Metadata } from 'next'
import Link from 'next/link'
import { OPINION_GROUPS } from '@/lib/content/schema'
import { catalog, OPINION_GROUP_LABELS, ruleHref } from '@/lib/content/site'
import { Markdown } from '@/components/site/Markdown'
import { Inline } from '@/components/site/ui'
import { DocPage, DocSection } from '@/components/site/DocPage'
import { CountLabel } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Opinions',
  description: 'The defaults Sistema holds about process, structure, and the quality floor, with reasons and when to choose otherwise.',
}

export default function OpinionsPage() {
  const { opinions } = catalog()
  // Groups keep their narrative order; opinions within a group are an undifferentiated list, so alphabetical.
  const groups = OPINION_GROUPS.map(group => ({ group, items: opinions.filter(o => o.group === group).sort((a, b) => a.title.localeCompare(b.title)) })).filter(g => g.items.length)
  return (
    <DocPage
      crumbs={[{ label: 'Reference', href: '/reference' }, { label: 'Opinions' }]}
      raw="/raw/opinions"
      eyebrow={<CountLabel kind="opinion" count={opinions.length} label="opinions" />}
      title="What Sistema holds by default"
      lead="Sistema has opinions about process, structure, and the quality floor. It doesn't decide what your product looks like. Overriding a default is normal: record it in DECISIONS.md like any other decision, and name the opinion it overrides."
      toc={groups.map(({ group, items }) => ({ id: group, text: OPINION_GROUP_LABELS[group].title, count: items.length }))}
    >
      {groups.map(({ group, items }) => (
        <DocSection key={group} id={group} title={OPINION_GROUP_LABELS[group].title} intro={OPINION_GROUP_LABELS[group].intro}>
          <div className="rounded-radius-lg bg-surface-raised divide-y divide-border">
            {items.map(o => (
              <details key={o.id} id={o.id} className="group scroll-mt-24">
                <summary className="cursor-pointer list-none px-5 py-4 flex items-start gap-3 hover:bg-surface-hover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus">
                  <span className="min-w-0 flex-1">
                    <span className="block text-label text-on-surface">{o.title}</span>
                    <span className="block text-body-sm text-on-surface-muted mt-1 max-w-[75ch]"><Inline text={o.default} /></span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-1 shrink-0 text-on-surface-faint transition-transform motion-reduce:transition-none group-open:rotate-180">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-1">
                  <Markdown>{o.body}</Markdown>
                  {o.rules.length > 0 && (
                    <p className="text-body-sm text-on-surface-muted mt-3 m-0">
                      Rules:{' '}
                      {o.rules.map((r, i) => (
                        <span key={r}>
                          {i > 0 && ', '}
                          <Link href={ruleHref(r)} className="font-mono text-caption text-link">{r}</Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </DocSection>
      ))}
    </DocPage>
  )
}
