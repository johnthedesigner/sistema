import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { catalog } from '@/lib/content/site'
import { AgentNote, Container, LinkList, LinkListItem, PageHeader } from '@/components/site/ui'
import { CountLabel, KindLabel } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Reference',
  description: "Sistema's opinions, rules, workflows, file formats, tools, and sources, for looking things up.",
}

export default function ReferencePage() {
  const c = catalog()
  const items: Array<{ href: string; title: string; meta: ReactNode; desc: string }> = [
    { href: '/reference/opinions', title: 'Opinions', meta: <CountLabel kind="opinion" count={c.opinions.length} label="opinions" />, desc: 'What Sistema holds by default, why, and when you would choose otherwise.' },
    { href: '/reference/rules', title: 'Rules', meta: <CountLabel kind="rule" count={c.rules.length} label="rules" />, desc: 'The checkable requirements plays apply, with values for each accessibility standard.' },
    { href: '/workflows', title: 'Workflows', meta: <CountLabel kind="workflow" count={c.workflows.length} label="workflows" />, desc: 'Each workflow in full: its plays in order and where you approve.' },
    ...c.files.map(f => ({ href: `/reference/files/${f.name}`, title: f.title, meta: <KindLabel kind="file" label="File format" />, desc: f.description })),
    { href: '/reference/tools', title: 'Tool APIs', meta: <CountLabel kind="tool" count={6} label="tools" />, desc: 'How agents call each of Sistema’s tools, exactly as the plays give it.' },
    { href: '/sources', title: 'Sources', meta: <CountLabel kind="source" count={c.sources.length} label="sources" />, desc: 'The design systems, standards, and research Sistema learned from, and how each is licensed.' },
  ]
  items.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }))
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader eyebrow="Reference" title="Look things up" lead="Everything Sistema decides, checks, and writes, in one place. Plays and guides have their own sections in the navigation." />
        <div className="max-w-[880px] pb-8">
          <LinkList>
            {items.map(i => (
              <LinkListItem key={i.href} href={i.href} title={i.title} description={i.desc} meta={<span className="text-caption text-on-surface-faint">{i.meta}</span>} />
            ))}
          </LinkList>
        </div>
      </Container>
    </main>
  )
}
