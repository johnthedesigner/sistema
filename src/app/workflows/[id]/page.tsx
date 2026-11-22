import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PromptBox } from '@/components/site/PromptBox'
import { SequenceOutline as Outline, RoutesOutline as Routes } from '@/components/site/WorkflowOutline'
import { absolute, catalog, workflowHref, workflowPrompt } from '@/lib/content/site'
import { AgentNote, Container, GITHUB_BLOB, RailBox, RailLink } from '@/components/site/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return catalog().workflows.map(w => ({ id: w.id.replace(/^workflow\./, '') }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const w = catalog().workflowById.get(`workflow.${(await params).id}`)
  return w ? { title: w.title, description: w.description } : {}
}

export default async function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = catalog()
  const workflow = c.workflowById.get(`workflow.${id}`)
  if (!workflow) notFound()
  const next = workflow.continue_with ? c.workflowById.get(workflow.continue_with) : undefined
  const previous = c.workflows.find(w => w.continue_with === workflow.id)

  return (
    <main>
      <Container>
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-4">
          <Link href="/workflows" className="no-underline text-on-surface-muted hover:text-on-surface">Workflows</Link>
          <span className="text-on-surface-faint">/</span>
          <span className="text-on-surface">{workflow.title}</span>
        </nav>
        <AgentNote raw={`/raw/workflows/${id}`} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-10">
          <div className="min-w-0">
            <h1 className="font-serif font-medium text-on-surface m-0 mb-3.5 text-[28px] md:text-[40px]" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {workflow.title}
            </h1>
            <p className="text-on-surface-muted m-0 mb-7" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 640 }}>
              {workflow.description}
            </p>

            <PromptBox single={{ id: workflow.id, kind: 'workflow', label: workflow.title, prompt: workflowPrompt(workflow.id) }} label={`Prompt for ${workflow.title}`} />
            <p className="text-[12.5px] text-on-surface-muted mt-3 m-0">
              Paste it into Claude Code, Cursor, or another coding agent, in your project folder. If the run stops, say &ldquo;keep going&rdquo; in a new session. The agent finds its place from your repo.
            </p>

            <h2 className="font-serif font-medium mt-12 mb-4" style={{ fontSize: 22 }}>
              {workflow.sequence ? 'What happens, in order' : 'Every session starts by checking where things stand'}
            </h2>
            {workflow.sequence ? <Outline id={workflow.id} /> : <Routes id={workflow.id} />}
          </div>

          <aside className="flex flex-col gap-3.5 md:sticky md:top-24 self-start min-w-0">
            {previous && (
              <RailBox title="Comes after">
                <RailLink href={workflowHref(previous.id)}>{previous.title}</RailLink>
              </RailBox>
            )}
            {next && (
              <RailBox title="Then continues to">
                <RailLink href={workflowHref(next.id)}>{next.title}</RailLink>
                <p className="text-[12px] text-on-surface-muted m-0 mt-2 leading-[1.5]">The agent offers this when the workflow is done.</p>
              </RailBox>
            )}
            <RailBox title="If your agent can&apos;t fetch URLs">
              <p className="text-[12.5px] text-on-surface-muted m-0 leading-[1.5]">
                A full version includes every play in one document: <span className="font-mono break-all">{absolute(`/raw/workflows/${id}/full`)}</span>
              </p>
            </RailBox>
            <a href={`${GITHUB_BLOB}/${workflow.file}`} className="text-[12.5px] text-primary no-underline px-1">Edit on GitHub</a>
          </aside>
        </div>
      </Container>
    </main>
  )
}
