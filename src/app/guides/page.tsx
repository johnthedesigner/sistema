import type { Metadata } from 'next'
import { activeTopics, guidesForTopic, TOPIC_LABELS } from '@/lib/content/site'
import { AgentNote, ArrowRight, CardLink, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Guides',
  description: "Sistema's take on each foundation of a design system, with the reasons behind it.",
}

export default function GuidesPage() {
  const topics = activeTopics('guides')
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow="Guides"
          title="How each foundation works, and why"
          lead="Guides explain the thinking behind each part of a design system. Plays cite their sections, so your agent reads the same reasoning you do."
        />
        <div className="flex flex-col gap-10">
          {topics.map(topic => (
            <section key={topic} id={topic}>
              <div className="flex items-center gap-3.5 mb-3">
                <h2 className="text-[15px] font-semibold text-on-surface m-0">{TOPIC_LABELS[topic]}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {guidesForTopic(topic).map(g => (
                  <CardLink key={g.id} href={`/guides/${g.topic}/${g.id.split('.')[2]}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-[14px] font-semibold leading-[1.25] text-on-surface m-0">{g.title}</p>
                      <ArrowRight size={13} />
                    </div>
                    <p className="text-[12px] text-on-surface-muted m-0 leading-[1.45]">{g.description}</p>
                  </CardLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
