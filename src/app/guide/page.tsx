import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How Sistema works',
  description: 'Sistema gives your AI agent structured prompts and grounded reference material for design system work — so it reasons from evidence, not training data.',
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11.5px] font-medium border border-border bg-surface-sunken text-on-surface-muted">
      {children}
    </span>
  )
}

function OutlineLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a
      href={href}
      {...props}
      className="inline-flex items-center h-[28px] px-3 text-[12px] font-medium rounded-radius-md text-on-surface border border-border bg-surface hover:bg-surface-sunken transition-colors no-underline"
    >
      {children}
    </a>
  )
}

export default function GuidePage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-12 md:py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-3">
          How it works
        </p>
        <h1
          className="font-serif font-medium text-on-surface m-0 mb-4 text-[28px] md:text-[36px]"
          style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          AI-assisted design systems, grounded in real precedent.
        </h1>
        <p className="text-on-surface-muted m-0" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Sistema gives your AI agent structured prompts and reference material from production design systems —
          so instead of generating conventions from training data, it reasons from evidence. The result is a design
          system that reflects real decisions, not guesses.
        </p>
      </div>

      {/* Three-path CTA: Bootstrap full-width, then Audit + Plays 2-up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
        {/* Bootstrap — full width */}
        <div className="sm:col-span-2 border border-primary rounded-radius-lg p-5 bg-surface flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Starting a new design system?</p>
            <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">
              The Bootstrap Campaign runs an 11-step sequence — from positioning through scaffolding components — with each step building on the last.
            </p>
          </div>
          <Link
            href="/campaigns/bootstrap"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline shrink-0"
          >
            Start the Bootstrap Campaign →
          </Link>
        </div>

        {/* Audit */}
        <div className="border border-border rounded-radius-lg p-5 bg-surface flex flex-col gap-3">
          <div>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Auditing an existing system?</p>
            <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">
              The Audit &amp; Refactor Campaign surfaces token drift, accessibility failures, and undocumented decisions — then produces a prioritized task list.
            </p>
          </div>
          <Link
            href="/campaigns/audit-and-refactor"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-surface border border-border bg-surface hover:bg-surface-sunken transition-colors no-underline mt-auto"
          >
            Audit &amp; Refactor Campaign →
          </Link>
        </div>

        {/* Individual plays */}
        <div className="border border-border rounded-radius-lg p-5 bg-surface flex flex-col gap-3">
          <div>
            <p className="font-semibold text-on-surface text-[14.5px] mb-1">Extending an existing system?</p>
            <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">
              Run individual plays for specific tasks — add a component, generate dark mode, audit token coverage, or run a retrospective.
            </p>
          </div>
          <Link
            href="/playbooks"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-surface border border-border bg-surface hover:bg-surface-sunken transition-colors no-underline mt-auto"
          >
            Browse plays →
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-12" />

      {/* Three concepts */}
      <section className="mb-12">
        <h2
          className="font-serif font-medium text-on-surface m-0 mb-6 text-[20px] md:text-[22px]"
          style={{ letterSpacing: '-0.015em' }}
        >
          Three things to understand
        </h2>

        <div className="flex flex-col gap-6">
          {/* Plays */}
          <div className="border border-border rounded-radius-lg p-5 bg-surface">
            <p className="font-semibold text-on-surface text-[14.5px] mb-2">Plays</p>
            <p className="text-[13.5px] text-on-surface-muted leading-[1.55] m-0 mb-3">
              A play is a structured prompt for a specific design system task. Each one tells the agent what to do,
              which KB documents to fetch as references, and what output to produce. You copy the prompt into your
              AI agent, fill in your project context, and run it.
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip>generate color tokens</Chip>
              <Chip>specify a component</Chip>
              <Chip>audit token coverage</Chip>
              <Chip>scaffold components</Chip>
              <Chip>25 plays total</Chip>
              <OutlineLink href="/playbooks">Browse all plays →</OutlineLink>
            </div>
          </div>

          {/* KB */}
          <div className="border border-border rounded-radius-lg p-5 bg-surface">
            <p className="font-semibold text-on-surface text-[14.5px] mb-2">Knowledge Base</p>
            <p className="text-[13.5px] text-on-surface-muted leading-[1.55] m-0 mb-3">
              The KB contains structured documentation from production design systems, standards, and design theory.
              Plays fetch specific KB pages at runtime — so the agent is reasoning from Material Design, Carbon, WCAG,
              and OKLCH perception science rather than its training weights. You can also reference KB pages directly
              in your own prompts.
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Chip>Material Design 3</Chip>
              <Chip>Carbon (IBM)</Chip>
              <Chip>WCAG 2.2</Chip>
              <Chip>OKLCH foundations</Chip>
              <Chip>Sistema principles</Chip>
              <OutlineLink href="/kb">Explore the Knowledge Base →</OutlineLink>
            </div>
          </div>

          {/* DESIGN.md */}
          <div className="border border-border rounded-radius-lg p-5 bg-surface">
            <p className="font-semibold text-on-surface text-[14.5px] mb-2">DESIGN.md</p>
            <p className="text-[13.5px] text-on-surface-muted leading-[1.55] m-0 mb-3">
              A plain-text file at the root of your project that captures your design system decisions — brand color,
              token architecture, type choices, spacing approach. Every play reads it at the start of a session and
              updates it as decisions are made. It&apos;s how the agent stays consistent across sessions without
              being re-briefed every time. The format follows the Google Stitch DESIGN.md convention.
            </p>
            <OutlineLink href="https://stitch.withgoogle.com/docs/design-md/format/" external>
              Read the spec →
            </OutlineLink>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border mb-12" />

      {/* How a play works */}
      <section className="mb-12">
        <h2
          className="font-serif font-medium text-on-surface m-0 mb-2 text-[20px] md:text-[22px]"
          style={{ letterSpacing: '-0.015em' }}
        >
          How a play works
        </h2>
        <p className="text-[13.5px] text-on-surface-muted leading-[1.55] m-0 mb-6">
          Each play page has a prompt you copy directly into your AI of choice. The prompt is structured in steps —
          it tells the agent to read your DESIGN.md, fetch relevant KB content, and produce a specific output. You
          fill in your project details where indicated, then run it.
        </p>

        <ol className="flex flex-col gap-4 list-none p-0 m-0">
          {[
            { n: 1, label: 'Open a play', detail: 'Find the play for your current task — either from a campaign step or by browsing the playbook.' },
            { n: 2, label: 'Copy the prompt', detail: 'The play page generates a complete prompt with your project\'s Sistema URL pre-filled for KB fetches.' },
            { n: 3, label: 'Paste into Claude or your coding agent', detail: 'Plays work in Claude.ai, Claude Code, Cursor, or any AI assistant with web access. A coding agent is recommended for plays that write files.' },
            { n: 4, label: 'Review and commit', detail: 'The play produces a specific output — a file, a token set, a component — that you review and commit.' },
          ].map(({ n, label, detail }) => (
            <li key={n} className="flex gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary text-[11px] font-semibold flex items-center justify-center mt-0.5">
                {n}
              </span>
              <div>
                <p className="font-medium text-on-surface text-[13.5px] mb-0.5">{label}</p>
                <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Divider */}
      <div className="border-t border-border mb-12" />

      {/* What plays cover */}
      <section className="mb-12">
        <h2
          className="font-serif font-medium text-on-surface m-0 mb-2 text-[20px] md:text-[22px]"
          style={{ letterSpacing: '-0.015em' }}
        >
          What plays cover
        </h2>
        <p className="text-[13.5px] text-on-surface-muted leading-[1.55] m-0 mb-5">
          Plays span the full design system lifecycle — from initial positioning through ongoing maintenance.
        </p>

        <div className="flex flex-col divide-y divide-border border border-border rounded-radius-lg overflow-hidden">
          {[
            { label: 'System definition', plays: ['Establish context', 'Positioning brief', 'Visual language', 'Generate DESIGN.md'] },
            { label: 'Token generation', plays: ['Color scheme', 'Type scale', 'Shape tokens', 'Spacing tokens', 'Color roles', 'Dark mode', 'Style Dictionary'] },
            { label: 'Components', plays: ['Scaffold core components', 'Specify a component', 'Implement a component', 'Add a component'] },
            { label: 'Docs & examples', plays: ['Generate page examples', 'Documentation site', 'Voice and tone'] },
            { label: 'Maintenance', plays: ['Session start', 'Audit token coverage', 'Accessibility audit', 'Component audit', 'Retrospective', 'Plan next iteration'] },
            { label: 'Migration', plays: ['Migrate Tailwind config'] },
          ].map(({ label, plays }) => (
            <div key={label} className="flex flex-row items-center gap-4 px-4 py-3">
              <p className="font-medium text-on-surface text-[12.5px] w-[140px] shrink-0 m-0">{label}</p>
              <p className="text-[12.5px] text-on-surface-muted m-0 min-w-0 flex-1 truncate">{plays.join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="rounded-radius-lg border border-primary bg-surface p-5">
        <p className="font-semibold text-on-surface text-[14.5px] mb-1">Ready to start?</p>
        <p className="text-[13px] text-on-surface-muted m-0 leading-[1.5] mb-4">
          New projects start with the Bootstrap Campaign. Existing systems can run the Audit &amp; Refactor Campaign or jump straight to an individual play.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/campaigns/bootstrap"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-primary bg-primary hover:opacity-90 transition-opacity no-underline"
          >
            Bootstrap Campaign →
          </Link>
          <Link
            href="/campaigns/audit-and-refactor"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-surface border border-border bg-surface hover:bg-surface-sunken transition-colors no-underline"
          >
            Audit &amp; Refactor Campaign
          </Link>
          <Link
            href="/playbooks"
            className="inline-flex items-center justify-center h-[34px] px-4 text-[13px] font-medium rounded-radius-md text-on-surface border border-border bg-surface hover:bg-surface-sunken transition-colors no-underline"
          >
            Browse all plays
          </Link>
        </div>
      </div>

    </main>
  )
}
