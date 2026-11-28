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
      toc={groups.map(({ group, items }) => ({ id: group, text: OPINION_GROUP_LABELS[group].title, count: items.length, children: items.map(o => ({ id: o.id, text: o.title })) }))}
    >
      {groups.map(({ group, items }) => (
        <DocSection key={group} id={group} title={OPINION_GROUP_LABELS[group].title} intro={OPINION_GROUP_LABELS[group].intro}>
          <div className="grid gap-10">
            {items.map(o => (
              <article key={o.id} id={o.id} aria-labelledby={`h-${o.id}`} className="scroll-mt-24 max-w-[760px]">
                <h3 id={`h-${o.id}`} className="text-heading-sm font-serif text-on-surface m-0">{o.title}</h3>
                <p className="text-body-lg text-on-surface mt-2 mb-0"><Inline text={o.default} /></p>
                <Markdown compact>{o.body}</Markdown>
                {o.rules.length > 0 && (
                  <p className="text-body-sm text-on-surface-muted mt-4 mb-0">
                    Rules:{' '}
                    {o.rules.map((r, i) => (
                      <span key={r}>
                        {i > 0 && ', '}
                        <Link href={ruleHref(r)} className="font-mono text-caption text-link">{r}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </DocSection>
      ))}
    </DocPage>
  )
}
