/**
 * A workflow's outline as the agent shows it: plays grouped by milestone, with the
 * approvals marked (site-structure.md section 4). Routes workflows list their routes.
 */
import Link from 'next/link'
import { workflowSteps } from '@/lib/content/render'
import type { Milestone } from '@/lib/content/schema'
import { catalog, playHref } from '@/lib/content/site'

const MILESTONE: Record<Milestone, string> = { direction: 'Direction', foundations: 'Foundations', patterns: 'Patterns', maintain: 'Ongoing' }
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export function SequenceOutline({ id }: { id: string }) {
  const c = catalog()
  const { steps } = workflowSteps(c.workflowById.get(id)!, c.playById)
  const groups: Array<{ milestone: Milestone; steps: typeof steps }> = []
  for (const s of steps) {
    const last = groups[groups.length - 1]
    if (last && last.milestone === s.play.milestone) last.steps.push(s)
    else groups.push({ milestone: s.play.milestone, steps: [s] })
  }
  return (
    <div className="grid gap-8">
      {groups.map(g => (
        <section key={g.milestone}>
          <p className="text-caption text-on-surface-faint m-0 mb-2">{MILESTONE[g.milestone]}</p>
          <ol className="m-0 p-0 list-none grid gap-1">
            {g.steps.map(s => (
              <li key={s.play.id}>
                <Link href={playHref(s.play.id)} className={`grid grid-cols-[28px_1fr] gap-3 rounded-radius-md px-3 py-2.5 no-underline hover:bg-surface-hover ${focusRing}`}>
                  <span className="text-label text-on-surface-faint tabular-nums pt-px">{s.number}</span>
                  <span>
                    <span className="block text-label text-on-surface">
                      {s.play.title}
                      {s.optional && <span className="text-on-surface-faint font-normal"> · if it applies</span>}
                    </span>
                    <span className="block text-body-sm text-on-surface-muted">{s.play.description}</span>
                  </span>
                </Link>
                {s.gateAfter.map(gate => (
                  <div key={gate.gate} className="ml-[52px] my-2 rounded-radius-md bg-brand-yellow-subtle px-3 py-2.5">
                    <span className="block text-label text-on-surface">You approve</span>
                    <span className="block text-body-sm text-on-surface-muted">{gate.prompt}</span>
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

export function RoutesOutline({ id }: { id: string }) {
  const c = catalog()
  const workflow = c.workflowById.get(id)!
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(workflow.routes ?? {}).map(([slug, route]) => (
        <div key={slug} className="rounded-radius-lg bg-surface-subtle p-5">
          <p className="text-heading-sm m-0 mb-2">{route.title}</p>
          <ol className="m-0 pl-5 list-decimal text-body-sm text-on-surface-muted">
            {route.plays.map(pid => (
              <li key={pid}>
                <Link href={playHref(pid)} className={`text-link hover:underline rounded-radius-sm ${focusRing}`}>{c.playById.get(pid)?.title}</Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
