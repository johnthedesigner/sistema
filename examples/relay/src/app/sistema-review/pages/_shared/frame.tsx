"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3Icon,
  InboxIcon,
  LayoutListIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { focusRing } from "@/components/ui"
import { ThemeSwitch } from "../../components/theme-switch"

/*
 * App frame for the page examples (Sistema components.page-examples).
 * Built from tokens and the core components only. The sidebar navigation is not
 * a core component yet (gap: navigation); it is composed here from role tokens:
 * a surface-subtle zone, the current item on secondary-container (DESIGN.md:
 * the current page is not accented).
 */

const NAV = [
  { href: "/sistema-review/pages/board", label: "Board", icon: LayoutListIcon },
  { href: "#requests", label: "Requests", icon: InboxIcon, count: "3" },
  { href: "#techs", label: "Techs", icon: WrenchIcon },
  { href: "#customers", label: "Customers", icon: UsersIcon },
  { href: "#reports", label: "Reports", icon: BarChart3Icon },
]

const STEPS: { label: string; state: "done" | "current" | "pending" }[] = [
  { label: "1 Core components ✓", state: "done" },
  { label: "2 Page examples ✓", state: "done" },
  { label: "3 System reference (Storybook) ✓", state: "done" },
]
const STEP_STYLE = {
  done: "bg-success-container text-on-success-container",
  current: "bg-primary text-on-primary",
  pending: "bg-secondary-container text-on-secondary-container",
} as const

export function PageFrame({
  current,
  children,
  themeSwitch = true,
}: {
  current: "Board" | "Job"
  children: React.ReactNode
  /** Off in Storybook, where the toolbar sets the theme. */
  themeSwitch?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <nav aria-label="Workflow outline" className="bg-surface-subtle px-page-gutter py-1">
        <ol className="flex flex-wrap items-center gap-1">
          <li className="mr-1 text-label text-on-surface-muted">Build the patterns:</li>
          {STEPS.map((s) => (
            <li
              key={s.label}
              aria-current={s.state === "current" ? "step" : undefined}
              className={cn("rounded-xs px-1-5 text-label", STEP_STYLE[s.state])}
            >
              {s.label}
            </li>
          ))}
          {themeSwitch && <li className="ml-auto"><ThemeSwitch /></li>}
        </ol>
      </nav>
      <div className="flex flex-1">
        <aside
          aria-label="Relay"
          className="hidden w-52 shrink-0 flex-col gap-section-gap bg-surface-subtle px-3 py-section-gap md:flex"
        >
          <p className="px-2 text-heading">Relay</p>
          <ul className="flex flex-col gap-0-5">
            {NAV.map((n) => {
              const active = (current === "Board" || current === "Job") && n.label === "Board"
              return (
                <li key={n.label}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-control-height items-center gap-2 rounded-md px-2 text-body text-on-surface-muted hover:bg-surface-hover hover:text-on-surface aria-[current=page]:bg-secondary-container aria-[current=page]:text-on-secondary-container",
                      focusRing
                    )}
                  >
                    <n.icon aria-hidden className="size-4" />
                    <span className="flex-1">{n.label}</span>
                    {n.count && <span className="text-data text-on-surface-muted">{n.count}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-auto px-2 text-data text-on-surface-muted">Dana Whitfield · Dispatch</p>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col gap-section-gap px-page-gutter py-section-gap">
          {children}
        </main>
      </div>
      <footer className="px-page-gutter py-section-gap text-data text-on-surface-muted">
        Page example built from Relay&rsquo;s components and tokens. This project follows Sistema. &ldquo;Build the patterns&rdquo; is finished. For later design system work, fetch the URL in sistema.json &ldquo;continue&rdquo;.
      </footer>
    </div>
  )
}
