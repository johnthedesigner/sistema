import type { Metadata } from 'next'
import { orderedWorkflows, workflowHref, workflowPlayIds } from '@/lib/content/site'
import { AgentNote, Container, LinkList, LinkListItem, PageHeader } from '@/components/site/ui'
import { CountLabel } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Workflows run plays in order, with your approval at each stage.',
}

export default function WorkflowsPage() {
  // In the order a project meets them, not alphabetical: each one hands off to the next.
  const workflows = orderedWorkflows()
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow={<CountLabel kind="workflow" count={workflows.length} label="workflows" />}
          title="Workflows run the plays in order"
          lead="Start builds the foundations, or Audit takes stock of what you have first. Patterns builds components on them. Update the system handles everything after that. Each one hands off to the next."
        />
        <div className="max-w-[880px] pb-8">
          <LinkList>
            {workflows.map(w => (
              <LinkListItem key={w.id} href={workflowHref(w.id)} title={w.title} description={w.description} meta={<span className="text-caption text-on-surface-faint"><CountLabel kind="play" count={workflowPlayIds(w).length} label="plays" /></span>} />
            ))}
          </LinkList>
        </div>
      </Container>
    </main>
  )
}
