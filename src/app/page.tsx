import type { Metadata } from 'next'
import Link from 'next/link'
import { PromptBox } from '@/components/site/PromptBox'
import { DEFAULT_ROUTE, promptOptions } from '@/lib/content/prompts'
import { BookMarked, BookOpen, Compass, Play, Wrench, type LucideIcon } from 'lucide-react'
import { AgentNote, ArrowRight } from '@/components/site/ui'
import { catalog } from '@/lib/content/site'

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

/** The site's main sections (the top navigation), as cards. Counts come from the content. */
function sections(): Array<{ title: string; text: string; href: string; icon: LucideIcon; count?: string; wide?: boolean }> {
  const c = catalog()
  return [
    { title: 'How Sistema works', text: 'The whole story: stages, approvals you can see, and what lands in your repository.', href: '/how-it-works', icon: Compass, wide: true },
    { title: 'Plays', text: 'Every step Sistema can run, and the workflows that put them in order.', href: '/plays', icon: Play, count: `${c.plays.length} plays, ${c.workflows.length} workflows` },
    { title: 'Guides', text: 'How each foundation works in practice, with the sources behind it.', href: '/guides', icon: BookOpen, count: `${c.guides.length} guides` },
    { title: 'Reference', text: 'Opinions with their reasons, the rules plays check, and the files Sistema writes.', href: '/reference', icon: BookMarked, count: `${c.opinions.length} opinions, ${c.rules.length} rules` },
    { title: 'Tools', text: 'Palette, contrast, type scale, specimen, token validator, and dark mode mapping.', href: '/tools', icon: Wrench, count: '6 tools' },
  ]
}

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
        <h1 className="text-heading-xl md:text-display font-serif text-on-surface m-0 mx-auto max-w-[16ch] text-center">
          Firm foundations for AI-built apps. More room to design.
        </h1>
        <p className="text-body-lg text-on-surface-muted mt-5 mb-10 mx-auto max-w-[60ch] text-center">
          Sistema guides your coding agent through building a design system in your repository, with you approving each stage. Every new screen starts from solid ground, and your time goes to design.
        </p>
        <div className="max-w-[820px] mx-auto">
          <PromptBox suggestions={suggestions} routes={routes} initial="workflow.start" defaultRoute={DEFAULT_ROUTE} center />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections().map(({ title, text, href, icon: Icon, count, wide }) => (
            <Link key={href} href={href} className={`group relative flex flex-col rounded-radius-xl p-6 md:p-7 no-underline transition-colors motion-reduce:transition-none ${focusRing} ${
              wide ? 'lg:col-span-2 bg-primary-container text-on-primary-container hover:bg-surface-selected' : 'bg-surface-raised hover:bg-surface-hover'
            }`}>
              <span aria-hidden="true" className={`inline-flex items-center justify-center w-11 h-11 rounded-radius-lg ${wide ? 'bg-surface-raised text-on-surface' : 'bg-primary-container text-on-primary-container'}`}>
                <Icon size={22} strokeWidth={1.7} />
              </span>
              <span className={`block font-serif text-heading-md mt-5 ${wide ? '' : 'text-on-surface'}`}>{title}</span>
              <span className={`block text-body mt-2 max-w-[48ch] ${wide ? '' : 'text-on-surface-muted'}`}>{text}</span>
              <span className={`mt-auto pt-5 flex items-center justify-between text-caption ${wide ? '' : 'text-on-surface-faint'}`}>
                <span>{count ?? 'Start here'}</span>
                <span className="transition-transform motion-reduce:transition-none group-hover:translate-x-0.5"><ArrowRight size={14} /></span>
              </span>
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
