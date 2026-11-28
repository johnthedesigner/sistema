/**
 * Shared frame for the entry pages (/start, /audit, /update, /connect).
 * The hero has room above it and, below its prompt, as much again as the gap
 * between sections, so it reads as one block. Sections separate by space and a
 * hairline, not by alternating backgrounds.
 */
import { AgentNote } from '@/components/site/ui'

const container = 'max-w-[1180px] mx-auto px-5 md:px-10'

export function EntryHeader({ eyebrow, title, lead, raw }: { eyebrow: string; title: string; lead: string; raw: string }) {
  return (
    <div className={`${container} pt-14 md:pt-20`}>
      <AgentNote raw={raw} />
      <p className="text-label text-on-surface-muted m-0 mb-3">{eyebrow}</p>
      <h1 className="text-heading-xl font-serif m-0 max-w-[20ch]">{title}</h1>
      <p className="text-body-lg text-on-surface-muted mt-4 mb-0 max-w-[62ch]">{lead}</p>
    </div>
  )
}

/** The hero's prompt (or other main control), with the space that closes the hero. */
export function EntryLead({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${container} pt-8 pb-16 md:pb-20`}>
      <div className="max-w-[760px]">{children}</div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={container}>
      <div className="border-t border-border py-12 md:py-16 grid md:grid-cols-[280px_1fr] gap-6 md:gap-12">
        <h2 className="text-heading-md font-serif m-0">{title}</h2>
        <div className="min-w-0 max-w-[720px]">{children}</div>
      </div>
    </section>
  )
}

export const listClass = 'm-0 pl-5 list-disc grid gap-2 text-body text-on-surface-muted marker:text-on-surface-faint'
