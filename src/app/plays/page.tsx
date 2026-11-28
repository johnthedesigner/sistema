import type { Metadata } from 'next'
import Link from 'next/link'
import { activeTopics, catalog, playHref, TOPIC_LABELS, orderedWorkflows, workflowHref } from '@/lib/content/site'
import { AgentNote, Container, LinkList, LinkListItem, MilestoneChip, PageHeader } from '@/components/site/ui'
import { CountLabel, IconBadge, KIND_ICONS, TOPIC_ICONS } from '@/components/site/icons'

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
          eyebrow={<CountLabel kind="play" count={plays.length} label="plays" />}
          title="Every step Sistema can run"
          lead="A play is one step, such as building the color scheme or auditing a component. Each one says what it needs, what it produces, and what it shows before it's done. Run one on its own when you need just that step."
        />

        <section aria-labelledby="workflows" className="rounded-radius-xl bg-surface-raised p-5 md:p-7 mb-14 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 md:gap-10">
          <div>
            <IconBadge icon={KIND_ICONS.workflow} />
            <h2 id="workflows" className="text-heading-md font-serif m-0 mt-4">Most of the time, run a workflow</h2>
            <p className="text-body text-on-surface-muted mt-3 mb-4">A workflow puts plays in order, stops for your approval between them, and keeps track of what&apos;s done, so a new session picks up where the last one stopped.</p>
            <Link href="/workflows" className="text-label text-link no-underline hover:underline">About workflows</Link>
          </div>
          <ul className="list-none m-0 p-0 grid gap-2">
            {workflows.map(w => (
              <li key={w.id}>
                <Link href={workflowHref(w.id)} className="block rounded-radius-lg bg-surface px-4 py-3 no-underline hover:bg-surface-hover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
                  <span className="block text-label text-on-surface">{w.title}</span>
                  <span className="block text-body-sm text-on-surface-muted mt-0.5">{w.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-12 max-w-[880px]">
          {activeTopics('plays').map(topic => {
            const inTopic = plays.filter(p => p.topic === topic).sort((a, b) => a.title.localeCompare(b.title))
            return (
              <section key={topic} id={topic} aria-labelledby={`t-${topic}`}>
                <div className="flex items-center gap-3 mb-4">
                  <IconBadge icon={TOPIC_ICONS[topic]} />
                  <h2 id={`t-${topic}`} className="text-heading-sm font-serif m-0">{TOPIC_LABELS[topic]}</h2>
                  <span className="text-caption text-on-surface-faint">{inTopic.length}</span>
                </div>
                <LinkList>
                  {inTopic.map(play => (
                    <LinkListItem key={play.id} href={playHref(play.id)} title={play.title} description={play.description} meta={<MilestoneChip milestone={play.milestone} />} />
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
