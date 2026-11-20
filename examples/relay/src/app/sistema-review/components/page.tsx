import type { Metadata } from "next"
import { Showcase } from "./showcase"
import { ThemeSwitch } from "./theme-switch"

export const metadata: Metadata = { title: "Relay — component showcase" }

const STEPS: { label: string; state: "done" | "current" | "waiting" | "pending" }[] = [
  { label: "Start a design system ✓", state: "done" },
  { label: "1 Scaffold the core components ✓", state: "done" },
  { label: "◆ components-approved ✓", state: "done" },
  { label: "2 Page examples (optional)", state: "pending" },
  { label: "3 System reference (optional)", state: "pending" },
]

const STEP_STYLE = {
  done: "bg-success-container text-on-success-container",
  current: "bg-primary text-on-primary",
  waiting: "bg-warning-container text-on-warning-container",
  pending: "bg-secondary-container text-on-secondary-container",
} as const

export default function ComponentShowcasePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <nav aria-label="Workflow outline" className="bg-surface-subtle px-page-gutter py-2">
        <ol className="flex flex-wrap items-center gap-1">
          <li className="mr-1 text-label text-on-surface-muted">Build the patterns:</li>
          {STEPS.map((s) => (
            <li
              key={s.label}
              aria-current={s.state === "current" ? "step" : undefined}
              className={`rounded-xs px-1-5 text-label ${STEP_STYLE[s.state]}`}
            >
              {s.label}
            </li>
          ))}
        </ol>
      </nav>
      <main className="mx-auto flex max-w-6xl flex-col gap-section-gap px-page-gutter py-section-gap">
        <header className="flex flex-wrap items-end justify-between gap-component-gap">
          <div>
            <p className="text-overline text-on-surface-muted">Sistema review</p>
            <h1 className="text-title">Relay core components</h1>
            <p className="text-body text-on-surface-muted">
              Every component in each variant and state, built from the compiled tokens. Switch the theme to check light and dark.
            </p>
          </div>
          <ThemeSwitch />
        </header>
        <Showcase />
      </main>
      <footer className="px-page-gutter py-section-gap text-data text-on-surface-muted">
        This project follows Sistema. &ldquo;Start a design system&rdquo; is finished; &ldquo;Build the patterns&rdquo; is in progress. For later design system work, fetch the URL in sistema.json &ldquo;continue&rdquo;.
      </footer>
    </div>
  )
}
