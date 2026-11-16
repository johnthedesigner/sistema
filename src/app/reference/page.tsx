import type { Metadata } from 'next'
import { catalog } from '@/lib/content/site'
import { AgentNote, ArrowRight, CardLink, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Reference',
  description: "Sistema's opinions, rules, workflows, and tools, for looking things up.",
}

export default function ReferencePage() {
  const c = catalog()
  const items = [
    { href: '/reference/opinions', title: 'Opinions', meta: `${c.opinions.length} defaults`, desc: 'What Sistema holds by default, why, and when you would choose otherwise.' },
    { href: '/reference/rules', title: 'Rules', meta: `${c.rules.length} rules`, desc: 'The checkable requirements plays apply, with values for each accessibility standard.' },
    { href: '/workflows', title: 'Workflows', meta: `${c.workflows.length} workflows`, desc: 'Each workflow in full: its plays in order and where you approve.' },
    { href: '/plays', title: 'Plays', meta: `${c.plays.length} plays`, desc: 'Every step, with what it needs, what it produces, and what it shows.' },
    { href: '/reference/tools', title: 'Tool APIs', meta: '2 APIs', desc: 'How agents call the palette and contrast tools.' },
    { href: '/sources', title: 'Sources', meta: 'credits', desc: 'The design systems, standards, and research Sistema learned from.' },
  ]
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader eyebrow="Reference" title="Look things up" lead="Everything Sistema decides, checks, and runs, in one place." />
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {items.map(i => (
            <CardLink key={i.href} href={i.href}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11.5px] text-on-surface-subtle">{i.meta}</span>
                <ArrowRight size={13} />
              </div>
              <p className="text-[15px] font-semibold text-on-surface m-0 mb-1.5">{i.title}</p>
              <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.5]">{i.desc}</p>
            </CardLink>
          ))}
        </div>
      </Container>
    </main>
  )
}
