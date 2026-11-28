import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE_URL } from '@/lib/site-url'
import type { Milestone } from '@/lib/content/schema'
import { MILESTONE_CHIP, MILESTONE_LABELS } from '@/lib/content/site'

export function ArrowRight({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Chip({ children, style }: { children: ReactNode; style?: { bg: string; color: string; border: string } }) {
  return (
    <span
      className={`inline-flex items-center h-[22px] px-2.5 rounded-radius-full text-caption font-medium ${style ? '' : 'bg-secondary-container text-on-secondary-container'}`}
      style={style ? { background: style.bg, color: style.color } : undefined}
    >
      {children}
    </span>
  )
}

export function MilestoneChip({ milestone }: { milestone: Milestone }) {
  return <Chip style={MILESTONE_CHIP[milestone]}>{MILESTONE_LABELS[milestone]}</Chip>
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-label text-on-surface-muted m-0 mb-2">{children}</p>
}

/**
 * Where agents find a page's plain text, without putting agent text in front of
 * people. A <link rel="alternate"> (React hoists it into <head>) for tools that
 * look there, and a corner button whose panel stays in the HTML, so fetch tools
 * that convert HTML to text read it while people see it only when they open it.
 * Uses the Popover API: Escape and clicking outside close it, with no script.
 * URLs are absolute (agent-facing text never uses bare paths).
 */
export function AgentNote({ raw }: { raw?: string }) {
  const page = raw ? `${SITE_URL}${raw}` : undefined
  const index = `${SITE_URL}/llms.txt`
  const link = 'block font-mono text-caption leading-snug text-link break-all no-underline hover:underline'
  return (
    <>
      <link rel="alternate" type="text/markdown" href={page ?? index} title="Plain text for agents" />
      <button
        type="button"
        popoverTarget="agent-note"
        aria-label="For agents"
        className="fixed z-30 right-4 bottom-4 md:right-6 md:bottom-6 inline-flex items-center gap-2 h-control-height-sm px-3 rounded-radius-full bg-surface-overlay shadow-overlay text-caption text-on-surface-muted hover:text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus print:hidden"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">For agents</span>
      </button>
      <div
        id="agent-note"
        popover="auto"
        className="m-0 inset-auto right-4 bottom-16 md:right-6 md:bottom-[72px] w-[min(360px,calc(100vw-32px))] rounded-radius-xl bg-surface-overlay shadow-overlay p-4 text-on-surface"
      >
        <p className="text-label m-0 mb-1">For agents</p>
        <p className="text-body-sm text-on-surface-muted m-0 mb-3">Agents read Sistema as plain text. Give your agent these links, or connect the MCP server.</p>
        {page && (
          <p className="m-0 mb-2">
            <span className="block text-caption text-on-surface-faint">This page</span>
            <a href={page} className={link}>{page}</a>
          </p>
        )}
        <p className="m-0 mb-3">
          <span className="block text-caption text-on-surface-faint">Index of everything</span>
          <a href={index} className={link}>{index}</a>
        </p>
        <Link href="/connect" className="text-caption text-link no-underline hover:underline">Connect the MCP server</Link>
      </div>
    </>
  )
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: ReactNode; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="font-serif text-heading-lg md:text-heading-xl text-on-surface m-0">{title}</h1>
      {lead && <p className="text-body-lg text-on-surface-muted m-0 mt-3 max-w-[62ch]">{lead}</p>}
      {children}
    </div>
  )
}

export function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">{children}</div>
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-serif text-heading-md m-0 mb-4">
      {children}
    </h2>
  )
}

export function CardLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="block rounded-radius-lg p-5 no-underline bg-surface-raised hover:bg-surface-hover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
      {children}
    </Link>
  )
}

/** A list of linked items in one column, alphabetical by the caller (D45). */
export function LinkList({ children }: { children: ReactNode }) {
  return <ul className="list-none m-0 p-0 rounded-radius-lg bg-surface-raised divide-y divide-border overflow-hidden">{children}</ul>
}

export function LinkListItem({ href, title, description, meta }: { href: string; title: ReactNode; description?: ReactNode; meta?: ReactNode }) {
  return (
    <li>
      <Link href={href} className="group flex items-start gap-4 px-5 py-4 no-underline hover:bg-surface-hover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-label text-on-surface">{title}</span>
            {meta}
          </span>
          {description && <span className="block text-body-sm text-on-surface-muted mt-1 max-w-[75ch]">{description}</span>}
        </span>
        <span className="text-on-surface-faint group-hover:text-on-surface mt-1 shrink-0"><ArrowRight size={13} /></span>
      </Link>
    </li>
  )
}

export function RailBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-radius-lg bg-surface-raised p-4">
      <Eyebrow>{title}</Eyebrow>
      {children}
    </div>
  )
}

export function RailLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 py-1.5 text-body-sm no-underline text-on-surface hover:text-link transition-colors motion-reduce:transition-none rounded-radius-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
    >
      <span className="min-w-0">{children}</span>
      <span className="text-on-surface-faint shrink-0">
        <ArrowRight />
      </span>
    </Link>
  )
}

/** Plain text with `backtick` spans rendered as code. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i} className="font-mono text-[0.92em] bg-surface-hover px-1 rounded-radius-sm">{part.slice(1, -1)}</code>
        ) : (
          part
        ),
      )}
    </>
  )
}

export const GITHUB_BLOB = 'https://github.com/johnthedesigner/sistema/blob/main'
