import type { Metadata } from 'next'
import Link from 'next/link'
import { OPINION_GROUPS } from '@/lib/content/schema'
import { catalog, OPINION_GROUP_LABELS, ruleHref } from '@/lib/content/site'
import { Markdown } from '@/components/site/Markdown'
import { AgentNote, Container, Inline, PageHeader, SectionTitle } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Opinions',
  description: 'The defaults Sistema holds about process, structure, and the quality floor, with reasons and when to choose otherwise.',
}

export default function OpinionsPage() {
  const { opinions } = catalog()
  return (
    <main>
      <Container>
        <AgentNote raw="/raw/opinions" />
        <PageHeader
          eyebrow={`Reference · ${opinions.length} opinions`}
          title="What Sistema holds by default"
          lead="Sistema has opinions about process, structure, and the quality floor. It doesn't decide what your product looks like. Overriding a default is normal: record it in DECISIONS.md like any other decision, and name the opinion it overrides."
        />
        <div className="flex flex-col gap-12 max-w-[820px]">
          {OPINION_GROUPS.map(group => {
            const items = opinions.filter(o => o.group === group)
            if (!items.length) return null
            return (
              <section key={group}>
                <SectionTitle id={group}>{OPINION_GROUP_LABELS[group].title}</SectionTitle>
                <p className="text-[13.5px] text-on-surface-muted m-0 -mt-2 mb-4">{OPINION_GROUP_LABELS[group].intro}</p>
                <div className="flex flex-col gap-2">
                  {items.map(o => (
                    <details key={o.id} id={o.id} className="group border border-border rounded-radius-lg bg-surface scroll-mt-24">
                      <summary className="cursor-pointer list-none p-4">
                        <span className="block text-[15px] font-semibold text-on-surface">{o.title}</span>
                        <span className="block text-[13.5px] text-on-surface-muted mt-1 leading-[1.5]"><Inline text={o.default} /></span>
                      </summary>
                      <div className="px-4 pb-4 border-t border-border pt-3">
                        <Markdown>{o.body}</Markdown>
                        {o.rules.length > 0 && (
                          <p className="text-[12.5px] text-on-surface-muted mt-3 m-0">
                            Rules:{' '}
                            {o.rules.map((r, i) => (
                              <span key={r}>
                                {i > 0 && ', '}
                                <Link href={ruleHref(r)} className="font-mono text-primary">{r}</Link>
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
