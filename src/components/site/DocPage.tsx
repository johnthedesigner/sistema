/**
 * The documentation page pattern for Reference (D45): breadcrumbs, a header, the
 * content in a reading column, and a sticky "On this page" rail. Sections follow
 * the narrative where there is one; items in an undifferentiated list are
 * alphabetical (the caller sorts).
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AgentNote } from './ui'
import { IconBadge } from './icons'

export interface TocItem {
  id: string
  text: string
  icon?: LucideIcon
  count?: number
}

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export function DocPage({
  crumbs,
  raw,
  eyebrow,
  title,
  lead,
  meta,
  toc = [],
  children,
}: {
  crumbs: Array<{ label: string; href?: string }>
  raw?: string
  eyebrow?: ReactNode
  title: string
  lead?: ReactNode
  meta?: ReactNode
  toc?: TocItem[]
  children: ReactNode
}) {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-16">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-body-sm text-on-surface-muted mb-6">
          {crumbs.map((c, i) => (
            <span key={c.label} className="inline-flex items-center gap-2">
              {i > 0 && <span className="text-on-surface-faint" aria-hidden="true">/</span>}
              {c.href ? <Link href={c.href} className={`no-underline text-on-surface-muted hover:text-on-surface rounded-radius-sm ${focusRing}`}>{c.label}</Link> : <span className="text-on-surface">{c.label}</span>}
            </span>
          ))}
        </nav>
        <AgentNote raw={raw} />
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px] gap-10 md:gap-14">
          <div className="min-w-0">
            <header className="mb-10 max-w-[760px]">
              {eyebrow && <p className="text-label text-on-surface-muted m-0 mb-3">{eyebrow}</p>}
              <h1 className="text-heading-xl font-serif text-on-surface m-0">{title}</h1>
              {lead && <p className="text-body-lg text-on-surface-muted mt-4 mb-0">{lead}</p>}
              {meta && <p className="text-caption text-on-surface-faint mt-3 mb-0">{meta}</p>}
            </header>
            {children}
          </div>
          {toc.length > 1 && (
            <aside className="hidden md:block md:sticky md:top-24 self-start" aria-label="On this page">
              <p className="text-label text-on-surface m-0 mb-3">On this page</p>
              <ul className="list-none m-0 p-0 grid gap-1 border-l border-border">
                {toc.map(t => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className={`flex items-center gap-2 -ml-px pl-3 py-1 border-l border-transparent hover:border-border-strong text-body-sm text-on-surface-muted hover:text-on-surface no-underline ${focusRing}`}>
                      {t.icon && <t.icon size={14} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />}
                      <span className="flex-1">{t.text}</span>
                      {t.count !== undefined && <span className="text-caption text-on-surface-faint">{t.count}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </main>
  )
}

/** A section heading inside a documentation page, with an optional icon. */
export function DocSection({ id, title, icon, intro, children }: { id: string; title: string; icon?: LucideIcon; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`h-${id}`} className="scroll-mt-24 mb-14 last:mb-0">
      <div className="flex items-center gap-3 mb-2">
        {icon && <IconBadge icon={icon} size="sm" />}
        <h2 id={`h-${id}`} className="text-heading-md font-serif text-on-surface m-0">{title}</h2>
      </div>
      {intro && <p className="text-body text-on-surface-muted m-0 mb-5 max-w-[70ch]">{intro}</p>}
      {!intro && <div className="mb-4" />}
      {children}
    </section>
  )
}
