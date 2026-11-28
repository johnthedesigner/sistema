import type { Metadata } from 'next'
import { orderedWorkflows, workflowHref, workflowPlayIds } from '@/lib/content/site'
import { AgentNote, ArrowRight, CardLink, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Workflows',
  description: 'Workflows run plays in order, with your approval at each stage.',
}

export default function WorkflowsPage() {
  const workflows = orderedWorkflows()
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow={`${workflows.length} workflows`}
          title="Workflows run the plays in order"
          lead="Start builds the foundations, or Audit takes stock of what you have first. Patterns builds components on them. Update the system handles everything after that. Each one hands off to the next."
        />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {workflows.map(w => (
            <CardLink key={w.id} href={workflowHref(w.id)}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11.5px] text-on-surface-faint">{workflowPlayIds(w).length} plays</span>
                <ArrowRight size={13} />
              </div>
              <p className="text-[16px] font-semibold text-on-surface m-0 mb-2">{w.title}</p>
              <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.5]">{w.description}</p>
            </CardLink>
          ))}
        </div>
      </Container>
    </main>
  )
}
