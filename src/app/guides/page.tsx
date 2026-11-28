import type { Metadata } from 'next'
import { activeTopics, guidesForTopic, TOPIC_LABELS } from '@/lib/content/site'
import { AgentNote, Container, LinkList, LinkListItem, PageHeader } from '@/components/site/ui'
import { CountLabel, IconBadge, TOPIC_ICONS } from '@/components/site/icons'
import { catalog } from '@/lib/content/site'

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
          eyebrow={<CountLabel kind="guide" count={catalog().guides.length} label="guides" />}
          title="How each foundation works, and why"
          lead="Guides explain the thinking behind each part of a design system. Plays cite their sections, so your agent reads the same reasoning you do."
        />
        <div className="flex flex-col gap-12 pb-8 max-w-[880px]">
          {topics.map(topic => {
            const guides = [...guidesForTopic(topic)].sort((a, b) => a.title.localeCompare(b.title))
            return (
              <section key={topic} id={topic} aria-labelledby={`t-${topic}`} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <IconBadge icon={TOPIC_ICONS[topic]} />
                  <h2 id={`t-${topic}`} className="text-heading-sm font-serif m-0">{TOPIC_LABELS[topic]}</h2>
                  <span className="text-caption text-on-surface-faint">{guides.length}</span>
                </div>
                <LinkList>
                  {guides.map(g => (
                    <LinkListItem key={g.id} href={`/guides/${g.topic}/${g.id.split('.')[2]}`} title={g.title} description={g.description} />
                  ))}
                </LinkList>
              </section>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
