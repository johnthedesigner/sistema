import type { Metadata } from 'next'
import Link from 'next/link'
import { catalog, fileHref, guideHref } from '@/lib/content/site'
import { SOURCE_KIND_LABELS, TIER_LABELS } from '@/lib/content/render-reference'
import { SOURCE_KINDS } from '@/lib/content/schema'
import { AgentNote, Container, PageHeader, SectionTitle } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Sources',
  description: 'The design systems, standards, research, and agent skills Sistema draws on, how each is licensed, and which guides use it.',
}

export default function SourcesPage() {
  const c = catalog()
  const usedBy = (id: string) => [
    ...c.guides.filter(g => g.sources.some(s => s.source === id)).map(g => ({ href: guideHref(g.id), title: g.title })),
    ...c.files.filter(f => f.sources.some(s => s.source === id)).map(f => ({ href: fileHref(f.id), title: f.title })),
  ]

  return (
    <main>
      <Container>
        <AgentNote raw="/raw/sources" />
        <PageHeader
          eyebrow="Reference"
          title="Sistema learns from these sources and credits each one"
          lead={
            <>
              Sistema&apos;s guides are its own synthesis across many sources. Each guide ends with a &ldquo;Draws on&rdquo; list naming the pages it
              used. The site doesn&apos;t publish copies of these sources.
            </>
          }
        />

        {SOURCE_KINDS.map(kind => {
          const items = c.sources.filter(s => s.kind === kind)
          if (!items.length) return null
          return (
            <section key={kind} className="mb-12">
              <SectionTitle id={kind}>{SOURCE_KIND_LABELS[kind]}</SectionTitle>
              <div className="flex flex-col divide-y divide-border border-y border-border">
                {items.map(s => {
                  const uses = usedBy(s.id)
                  return (
                    <div key={s.id} id={s.id} className="py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-2 scroll-mt-24">
                      <div className="min-w-0">
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-on-surface no-underline hover:text-primary">
                          {s.name}
                        </a>
                        <p className="text-[12.5px] text-on-surface-muted m-0 mt-0.5">{s.publisher}</p>
                        <p className="text-[12.5px] text-on-surface-muted m-0 mt-2 leading-[1.5]">
                          <span className="text-on-surface">License:</span> {s.license}
                        </p>
                        <p className="text-[12px] text-on-surface-faint m-0 mt-1 leading-[1.5]">{TIER_LABELS[s.tier]}</p>
                        {s.note && <p className="text-[12px] text-on-surface-faint m-0 mt-1 leading-[1.5]">{s.note}</p>}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-on-surface-faint m-0 mb-1">Used in</p>
                        {uses.length ? (
                          <ul className="m-0 p-0 list-none text-[13px] leading-[1.7]">
                            {uses.map(u => (
                              <li key={u.href}>
                                <Link href={u.href} className="text-primary">{u.title}</Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[13px] text-on-surface-muted m-0">Background reading; no guide cites it directly yet.</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        <p className="text-[13px] text-on-surface-muted leading-[1.55] max-w-2xl">
          If you think a Sistema page follows a source too closely, or misrepresents one, please{' '}
          <a href="https://github.com/johnthedesigner/sistema/issues" target="_blank" rel="noopener noreferrer" className="text-primary">
            open an issue
          </a>
          .
        </p>
      </Container>
    </main>
  )
}
