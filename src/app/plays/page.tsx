import type { Metadata } from 'next'
import Link from 'next/link'
import { activeTopics, catalog, playHref, TOPIC_LABELS, orderedWorkflows, workflowHref } from '@/lib/content/site'
import { AgentNote, ArrowRight, CardLink, Container, MilestoneChip, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Plays',
  description: 'Every step Sistema can run, grouped by topic. Most of the time you run them through a workflow.',
}

export default function PlaysPage() {
  const { plays } = catalog()
  const workflows = orderedWorkflows()
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow={`${plays.length} plays`}
          title="Every step Sistema can run"
          lead="A play is one step, such as building the color scheme or auditing a component. You'll mostly run plays through a workflow, which puts them in order. Run one on its own when you need just that step."
        >
          <div className="flex gap-2 flex-wrap mt-5">
            {workflows.map(w => (
              <Link key={w.id} href={workflowHref(w.id)} className="inline-flex items-center gap-1.5 h-[30px] px-3 rounded-full border border-border bg-surface-raised text-[12.5px] font-medium text-on-surface no-underline hover:border-border-strong">
                {w.title} <ArrowRight size={11} />
              </Link>
            ))}
          </div>
        </PageHeader>

        <div className="flex flex-col gap-10">
          {activeTopics('plays').map(topic => (
            <section key={topic} id={topic}>
              <div className="flex items-center gap-3.5 mb-3">
                <h2 className="text-[15px] font-semibold text-on-surface m-0">{TOPIC_LABELS[topic]}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                {plays
                  .filter(p => p.topic === topic)
                  .map(play => (
                    <CardLink key={play.id} href={playHref(play.id)}>
                      <div className="flex items-center justify-between mb-2">
                        <MilestoneChip milestone={play.milestone} />
                        <ArrowRight size={13} />
                      </div>
                      <p className="text-[14px] font-semibold leading-[1.25] text-on-surface m-0 mb-2">{play.title}</p>
                      <p className="text-[12px] text-on-surface-muted m-0 leading-[1.45]">{play.description}</p>
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
