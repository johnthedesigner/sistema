/** Shared frame for the entry pages (/start, /existing, /work). */
import { AgentNote } from '@/components/site/ui'

export function EntryHeader({ eyebrow, title, lead, raw }: { eyebrow: string; title: string; lead: string; raw: string }) {
  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12">
      <AgentNote raw={raw} />
      <p className="text-caption uppercase tracking-[0.06em] text-on-surface-faint m-0 mt-6 mb-2">{eyebrow}</p>
      <h1 className="text-heading-xl font-serif m-0 max-w-[20ch]">{title}</h1>
      <p className="text-body-lg text-on-surface-muted mt-4 mb-0 max-w-[62ch]">{lead}</p>
    </div>
  )
}

export function Section({ title, children, raised }: { title: string; children: React.ReactNode; raised?: boolean }) {
  return (
    <section className={raised ? 'bg-surface-raised' : ''}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-12 md:py-16 grid md:grid-cols-[280px_1fr] gap-6 md:gap-12">
        <h2 className="text-heading-md font-serif m-0">{title}</h2>
        <div className="min-w-0 max-w-[720px]">{children}</div>
      </div>
    </section>
  )
}

export const listClass = 'm-0 pl-5 list-disc grid gap-2 text-body text-on-surface-muted marker:text-on-surface-faint'
