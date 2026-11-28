import type { Metadata } from 'next'
import Link from 'next/link'
import { PromptBox } from '@/components/site/PromptBox'
import { promptOptions } from '@/lib/content/prompts'
import { AgentNote } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Sistema: firm foundations for AI-built apps',
  description: 'Sistema guides your AI coding agent through building a design system in your repository, with your approval at each stage.',
  openGraph: {
    title: 'Sistema: firm foundations for AI-built apps',
    description: 'Sistema guides your AI coding agent through building a design system in your repository, with your approval at each stage.',
  },
}

const STAGES = [
  ['It learns your project', 'It reads what’s there and asks only what’s missing.'],
  ['It shows you options', 'How much color, which grays, how round, which typeface: each shown on a screen like yours, with your words.'],
  ['You choose', 'Pick an option for each question, or ask for changes.'],
  ['It builds the foundations', 'Color, type, shape, and spacing, from Sistema’s tools, checked and compiled.'],
  ['You see the whole system', 'Every token in light and dark, before anything builds on it.'],
]

const LANDS = [
  ['Tokens', 'Every color, type, shape, and spacing value, in the open DTCG format.'],
  ['CSS, wired in', 'Your app uses the system from the first commit.'],
  ['DESIGN.md', 'How the system looks and how to use it, for people and agents.'],
  ['A decision log', 'What was decided and why.'],
  ['A note for your agent', 'Points every future session to the system and to where you left off.'],
]

const GROWS = [
  ['Accessible color by design', 'Ramps built on contrast targets, and every pair checked against your standard.'],
  ['Themes from day one', 'Light and dark are two views of the same roles. Density and reduced motion are modes too.'],
  ['Made for agents', 'Tokens named for their job, tools for what agents would guess, and “done” meaning shown and checked.'],
]

const MATERIAL = [
  ['How it works', 'Stages, approvals, and what lands in your repo.', '/how-it-works'],
  ['Guides', 'How each foundation works in practice.', '/guides'],
  ['Opinions', 'Defaults with reasons, and how to override them.', '/reference/opinions'],
  ['Tools', 'Palette, contrast, type scale, and specimen.', '/tools'],
]

const section = 'max-w-[1180px] mx-auto px-5 md:px-10'
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

export default function Home() {
  const { suggestions, routes } = promptOptions()
  return (
    <main>
      <div className={`${section} pt-8 md:pt-12`}>
        <AgentNote raw="/raw/agents" />
      </div>

      <section className={`${section} pt-6 md:pt-10 pb-16 md:pb-24`}>
        <h1 className="text-heading-xl md:text-display font-serif text-on-surface m-0 max-w-[16ch]">
          Firm foundations for AI-built apps. More room to design.
        </h1>
        <p className="text-body-lg text-on-surface-muted mt-5 mb-10 max-w-[60ch]">
          Sistema guides your coding agent through building a design system in your repository, with you approving each stage. Every new screen starts from solid ground, and your time goes to design.
        </p>
        <div className="max-w-[760px]">
          <PromptBox suggestions={suggestions} routes={routes} initial="workflow.start" />
        </div>
      </section>

      <section className="bg-surface-raised">
        <div className={`${section} py-16 md:py-24 grid md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16`}>
          <div>
            <h2 className="text-heading-xl font-serif m-0">See every stage before you build on it</h2>
            <p className="text-body text-on-surface-muted mt-4 max-w-[40ch]">After each stage you see the result in your browser. Nothing moves on until you approve.</p>
          </div>
          <ol className="list-none m-0 p-0 grid gap-6">
            {STAGES.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[32px_1fr] gap-4">
                <span className="text-label text-on-primary-container bg-primary-container rounded-radius-full w-8 h-8 grid place-items-center" aria-hidden="true">{i + 1}</span>
                <div>
                  <p className="text-heading-sm m-0">{t}</p>
                  <p className="text-body text-on-surface-muted m-0 mt-1">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${section} py-16 md:py-24 grid md:grid-cols-2 gap-12 md:gap-16`}>
        <div>
          <h2 className="text-heading-lg font-serif m-0 mb-6">Everything lands in your repo</h2>
          <dl className="m-0 grid gap-4">
            {LANDS.map(([t, d]) => (
              <div key={t}>
                <dt className="text-label text-on-surface">{t}</dt>
                <dd className="m-0 text-body text-on-surface-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-heading-lg font-serif m-0 mb-6">Foundations that grow with you</h2>
          <dl className="m-0 grid gap-4">
            {GROWS.map(([t, d]) => (
              <div key={t}>
                <dt className="text-label text-on-surface">{t}</dt>
                <dd className="m-0 text-body text-on-surface-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${section} pb-16 md:pb-24`}>
        <h2 className="text-heading-lg font-serif m-0 mb-2">Fast and consistent</h2>
        <p className="text-body-lg text-on-surface-muted m-0 mb-10 max-w-[64ch]">
          AI tools let anyone build working screens quickly. Without decided foundations, each screen invents its own colors and spacing, and the product drifts. Settled foundations don’t narrow what you can design. They free your time for it.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MATERIAL.map(([t, d, href]) => (
            <Link key={href} href={href} className={`block rounded-radius-lg bg-surface-raised p-panel-padding no-underline hover:bg-surface-hover transition-colors motion-reduce:transition-none ${focusRing}`}>
              <span className="block text-heading-sm text-on-surface">{t}</span>
              <span className="block text-body-sm text-on-surface-muted mt-1">{d}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${section} pb-8`}>
        <div className="rounded-radius-xl bg-surface-brand text-on-surface-brand px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <h2 className="text-heading-xl font-serif m-0">Your product, your look</h2>
            <p className="text-body-lg m-0 mt-4 opacity-90 max-w-[48ch]">
              Sistema has opinions about process, structure, and craft. What your product looks like is your call, and Sistema writes it down.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/start" className={`inline-flex items-center h-control-height px-5 rounded-radius-md bg-surface-raised text-on-surface text-label no-underline ${focusRing}`}>Start a design system</Link>
            <Link href="/how-it-works" className={`inline-flex items-center h-control-height px-5 rounded-radius-md text-on-surface-brand text-label no-underline shadow-[inset_0_0_0_1px_currentColor] ${focusRing}`}>How it works</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
