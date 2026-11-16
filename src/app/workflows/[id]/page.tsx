import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PromptBox } from '@/components/PromptBox'
import { workflowSteps } from '@/lib/content/render'
import type { Milestone } from '@/lib/content/schema'
import { absolute, catalog, playHref, workflowHref, workflowPrompt } from '@/lib/content/site'
import { AgentNote, Container, GITHUB_BLOB, MilestoneChip, RailBox, RailLink } from '@/components/site/ui'

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
          <span className="text-on-surface-subtle">/</span>
          <span className="text-on-surface">{workflow.title}</span>
        </nav>
        <AgentNote raw={`/raw/workflows/${id}`} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-10">
          <div className="min-w-0">
            <h1 className="font-serif font-medium text-on-surface m-0 mb-3.5 text-[28px] md:text-[40px]" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {workflow.title}
            </h1>
            <p className="text-on-surface-muted font-serif m-0 mb-7" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 640 }}>
              {workflow.description}
            </p>

            <PromptBox label={`workflow · ${id}`} body={workflowPrompt(workflow.id)} playSlug={workflow.id} expanded />
            <p className="text-[12.5px] text-on-surface-muted mt-3 m-0">
              Paste it into Claude Code, Cursor, or another coding agent, in your project folder. If the run stops, say &ldquo;keep going&rdquo; in a new session. The agent finds its place from your repo.
            </p>

            <h2 className="font-serif font-medium mt-12 mb-4" style={{ fontSize: 22 }}>
              {workflow.sequence ? 'What happens, in order' : 'Every session starts by checking where things stand'}
            </h2>
            {workflow.sequence ? <SequenceOutline id={workflow.id} /> : <RoutesOutline id={workflow.id} />}
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

function SequenceOutline({ id }: { id: string }) {
  const c = catalog()
  const workflow = c.workflowById.get(id)!
  const { steps } = workflowSteps(workflow, c.playById)
  const groups: Array<{ milestone: Milestone; steps: typeof steps }> = []
  for (const s of steps) {
    const last = groups[groups.length - 1]
    if (last && last.milestone === s.play.milestone) last.steps.push(s)
    else groups.push({ milestone: s.play.milestone, steps: [s] })
  }
  return (
    <div className="flex flex-col gap-6">
      {groups.map(g => (
        <section key={g.milestone}>
          <div className="flex items-center gap-3 mb-3">
            <MilestoneChip milestone={g.milestone} />
            <div className="flex-1 h-px bg-border" />
          </div>
          <ol className="m-0 p-0 list-none flex flex-col gap-2">
            {g.steps.map(s => (
              <li key={s.play.id}>
                <Link href={playHref(s.play.id)} className="flex gap-3 border border-border rounded-radius-md p-3 bg-surface no-underline hover:border-border-strong">
                  <span className="font-mono text-[12px] text-on-surface-subtle w-5 shrink-0 pt-0.5">{s.number}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-on-surface">
                      {s.play.title}
                      {s.optional && <span className="font-normal text-on-surface-subtle"> · if it applies</span>}
                    </span>
                    <span className="block text-[12.5px] text-on-surface-muted leading-[1.45] mt-0.5">{s.play.description}</span>
                  </span>
                </Link>
                {s.gateAfter.map(g => (
                  <div key={g.gate} className="flex gap-3 items-start mt-2 ml-8 p-3 rounded-radius-md border border-dashed" style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-brand-yellow-50)' }}>
                    <span className="text-[12px] font-semibold text-on-surface shrink-0">You approve</span>
                    <span className="text-[12.5px] text-on-surface-muted leading-[1.45]">{g.prompt}</span>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

function RoutesOutline({ id }: { id: string }) {
  const c = catalog()
  const workflow = c.workflowById.get(id)!
  const start = workflow.start_with ? c.playById.get(workflow.start_with) : undefined
  return (
    <div>
      {start && (
        <p className="text-[14px] text-on-surface-muted leading-[1.55] m-0 mb-5 max-w-[640px]">
          <Link href={playHref(start.id)} className="text-primary font-medium">{start.title}</Link> reads the system&apos;s state and confirms what you want to do. Then the agent follows one of these:
        </p>
      )}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {Object.entries(workflow.routes ?? {}).map(([slug, route]) => (
          <div key={slug} className="border border-border rounded-radius-lg p-4 bg-surface">
            <p className="text-[14px] font-semibold text-on-surface m-0 mb-2">{route.title}</p>
            <ol className="m-0 pl-4 list-decimal text-[12.5px] leading-[1.6]">
              {route.plays.map(pid => (
                <li key={pid}>
                  <Link href={playHref(pid)} className="text-on-surface-muted hover:text-primary">{c.playById.get(pid)?.title}</Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
