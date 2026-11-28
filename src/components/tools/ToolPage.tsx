/**
 * The tool page pattern (D46): what the tool does in Sistema first, then a
 * demonstration (sticky controls on the left, the result on the right, together
 * the full content width), then what it assumes, then the request agents send.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import { catalog, playHref } from '@/lib/content/site'
import type { ToolName } from '@/lib/content/schema'
import { AgentNote } from '@/components/site/ui'
import { IconBadge, KindLabel, TOOL_ICONS } from '@/components/site/icons'

const container = 'max-w-[1180px] mx-auto px-5 md:px-10'
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export function ToolPage({
  tool,
  title,
  lead,
  how,
  children,
  limits,
  request,
}: {
  tool: ToolName
  title: string
  lead: ReactNode
  /** How Sistema uses the tool, in a sentence or two. */
  how: ReactNode
  /** The demonstration (a client component using DemoLayout). */
  children: ReactNode
  /** What the tool assumes and doesn't do. */
  limits: ReactNode
  /** The request agents send, exactly. */
  request: string
}) {
  const users = catalog().plays.filter(p => p.tools.includes(tool)).sort((a, b) => a.title.localeCompare(b.title))
  return (
    <main>
      <div className={`${container} pt-10 md:pt-14`}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-body-sm text-on-surface-muted mb-6">
          <Link href="/tools" className={`no-underline text-on-surface-muted hover:text-on-surface rounded-radius-sm ${focusRing}`}>Tools</Link>
          <span className="text-on-surface-faint" aria-hidden="true">/</span>
          <span className="text-on-surface">{title}</span>
        </nav>
        <AgentNote raw="/raw/agents" />

        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14 items-start">
          <div>
            <p className="text-label text-on-surface-muted m-0 mb-3"><KindLabel kind="tool" label="Tool" /></p>
            <h1 className="text-heading-xl font-serif text-on-surface m-0">{title}</h1>
            <p className="text-body-lg text-on-surface-muted mt-4 mb-0 max-w-[62ch]">{lead}</p>
          </div>
          <section aria-labelledby="how" className="rounded-radius-xl bg-surface-raised p-5 md:p-6">
            <div className="flex items-center gap-3">
              <IconBadge icon={TOOL_ICONS[tool]} size="sm" />
              <h2 id="how" className="text-label text-on-surface m-0">How Sistema uses it</h2>
            </div>
            <p className="text-body-sm text-on-surface-muted mt-3 mb-0">{how}</p>
            {users.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-caption text-on-surface-faint mr-1">Used by</span>
                {users.map(p => (
                  <Link key={p.id} href={playHref(p.id)} className={`inline-flex items-center h-6 px-2.5 rounded-radius-full bg-surface text-caption text-on-surface no-underline hover:bg-primary-container hover:text-on-primary-container ${focusRing}`}>{p.title}</Link>
                ))}
              </div>
            )}
          </section>
        </header>
      </div>

      <section aria-labelledby="try" className={`${container} pt-14 md:pt-20`}>
        <h2 id="try" className="text-heading-md font-serif text-on-surface m-0 mb-2">Try it</h2>
        <p className="text-body text-on-surface-muted m-0 mb-8">A demonstration of what the tool does when a play calls it.</p>
        {children}
      </section>

      <section className={`${container} pt-16 md:pt-24 pb-8`}>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14 border-t border-border pt-12">
          <div>
            <h2 className="text-heading-sm font-serif text-on-surface m-0 mb-3">What it assumes</h2>
            <div className="text-body text-on-surface-muted grid gap-3">{limits}</div>
          </div>
          <div>
            <h2 className="text-heading-sm font-serif text-on-surface m-0 mb-3">For agents</h2>
            <p className="text-body text-on-surface-muted m-0 mb-3">Plays send this request, and read the JSON it returns. <Link href={`/reference/tools#${tool}`} className="text-link">Full reference</Link>.</p>
            <pre className="font-mono text-code bg-surface-raised rounded-radius-lg p-4 m-0 overflow-x-auto whitespace-pre-wrap break-all text-on-surface">{request}</pre>
          </div>
        </div>
      </section>
    </main>
  )
}
