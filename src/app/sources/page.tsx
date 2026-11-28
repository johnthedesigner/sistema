import type { Metadata } from 'next'
import Link from 'next/link'
import { catalog, fileHref, guideHref } from '@/lib/content/site'
import { SOURCE_KIND_LABELS, TIER_LABELS } from '@/lib/content/render-reference'
import { SOURCE_KINDS } from '@/lib/content/schema'
import { DocPage, DocSection } from '@/components/site/DocPage'
import { CountLabel } from '@/components/site/icons'

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

  const kinds = SOURCE_KINDS.map(kind => ({ kind, items: c.sources.filter(s => s.kind === kind).sort((a, b) => a.name.localeCompare(b.name)) })).filter(k => k.items.length)
  return (
    <DocPage
      crumbs={[{ label: 'Reference', href: '/reference' }, { label: 'Sources' }]}
      raw="/raw/sources"
      eyebrow={<CountLabel kind="source" count={c.sources.length} label="sources" />}
      title="Sistema learns from these sources and credits each one"
      lead={<>Sistema&apos;s guides are its own synthesis across many sources. Each guide ends with a &ldquo;Draws on&rdquo; list naming the pages it used. The site doesn&apos;t publish copies of these sources.</>}
      toc={kinds.map(({ kind, items }) => ({ id: kind, text: SOURCE_KIND_LABELS[kind], count: items.length, children: items.map(s => ({ id: s.id, text: s.name })) }))}
    >
      {kinds.map(({ kind, items }) => (
        <DocSection key={kind} id={kind} title={SOURCE_KIND_LABELS[kind]}>
          <ul className="list-none m-0 p-0 rounded-radius-lg bg-surface-raised divide-y divide-border">
            {items.map(s => {
              const uses = usedBy(s.id)
              return (
                <li key={s.id} id={s.id} className="p-5 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-3 scroll-mt-24">
                  <div className="min-w-0">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-label text-on-surface no-underline hover:text-link">{s.name}</a>
                    <p className="text-body-sm text-on-surface-muted m-0 mt-0.5">{s.publisher}</p>
                    <p className="text-body-sm text-on-surface-muted m-0 mt-2"><span className="text-on-surface">License:</span> {s.license}</p>
                    <p className="text-caption text-on-surface-faint m-0 mt-1">{TIER_LABELS[s.tier]}</p>
                    {s.note && <p className="text-caption text-on-surface-faint m-0 mt-1">{s.note}</p>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-caption text-on-surface-faint m-0 mb-1">Used in</p>
                    {uses.length ? (
                      <ul className="m-0 p-0 list-none text-body-sm grid gap-1">
                        {uses.map(u => (
                          <li key={u.href}><Link href={u.href} className="text-link">{u.title}</Link></li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-sm text-on-surface-muted m-0">Background reading; no guide cites it directly yet.</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </DocSection>
      ))}
      <p className="text-body-sm text-on-surface-muted max-w-[70ch]">
        If you think a Sistema page follows a source too closely, or misrepresents one, please{' '}
        <a href="https://github.com/johnthedesigner/sistema/issues" target="_blank" rel="noopener noreferrer" className="text-link">open an issue</a>.
      </p>
    </DocPage>
  )
}

