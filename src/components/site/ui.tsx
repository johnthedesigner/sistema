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
  return <p className="text-caption uppercase tracking-[0.06em] text-on-surface-faint m-0 mb-2">{children}</p>
}

/**
 * One line for agents at the top of a page: where its plain-text version is,
 * and the index. URLs are absolute (agent-facing text never uses bare paths).
 */
export function AgentNote({ raw }: { raw?: string }) {
  return (
    <p className="font-mono text-caption text-on-surface-faint m-0 mb-5 break-words">
      For agents: {raw ? <>plain text at {`${SITE_URL}${raw}`} · </> : null}index at {`${SITE_URL}/llms.txt`}
    </p>
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
