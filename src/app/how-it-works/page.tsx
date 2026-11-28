import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { BadgeCheck, Blocks, Eye, FileText, FolderGit2, Package, Plug, Search, Terminal } from 'lucide-react'
import { AgentNote, ArrowRight } from '@/components/site/ui'
import { catalog } from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'How Sistema works',
  description: 'How Sistema builds a design system in your repository: your agent does the work in stages, you see each result in your browser, and nothing moves on until you approve.',
}

const section = 'max-w-[1180px] mx-auto px-5 md:px-10'
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const BEATS = [
  { icon: Search, title: 'It learns your project', text: 'Your agent reads what’s already in your repository, then asks only what your files don’t answer: what the product is, who uses it, and the accessibility standard it has to meet.' },
  { icon: Eye, title: 'It shows you options', text: 'How much color, which grays, how round, which typeface. Each question is answered by looking: the options are drawn on a screen like yours, with your words, side by side.' },
  { icon: Blocks, title: 'It builds the foundations', text: 'Color, type, shape, and spacing, as tokens. Ramps and contrast come from Sistema’s tools, checked against your standard in every theme, then compiled into CSS your app uses.' },
  { icon: BadgeCheck, title: 'You approve', text: 'At each stage your agent builds a page you open in your browser. You see the result itself, not a description of it. Nothing moves on until you say so.' },
]

/** The image for each beat; the first beat shows the agent's questions instead. */
const BEAT_SHOTS = [
  null,
  { src: '/images/how-it-works/visual-direction.png', w: 2160, h: 1350, alt: 'A question from the visual direction page: how much color, with three options and one drawn on a sample screen.', caption: 'The visual direction page, from Sistema’s own site.' },
  { src: '/images/how-it-works/token-check.png', w: 2160, h: 1350, alt: 'The token check page: rows, chips, messages, menus, and buttons built only from the role tokens.', caption: 'The token check page: the tokens, in use, in each theme.' },
  { src: '/images/how-it-works/relay-components-light.png', w: 1440, h: 1100, alt: 'A components showcase with buttons, fields, menus, and tables in every state.', caption: 'Components for Relay, Sistema’s example project, in every state.' },
]

const FILES: Array<[string, string]> = [
  ['tokens/src/*.json', 'Every token value, in the open DTCG format.'],
  ['Compiled CSS', 'What your app uses. Generated, never edited by hand.'],
  ['DESIGN.md', 'How the system looks and how to use it, for people and agents.'],
  ['DECISIONS.md', 'Every decision and why, so nobody has to guess later.'],
  ['sistema.json', 'Where the project is, so any session can pick up.'],
  ['AGENTS.md note', 'Points every new session back to the system.'],
  ['sistema-review/', 'The pages you approved, kept with the work.'],
]

const WAYS = [
  { icon: Terminal, title: 'Paste a prompt', text: 'Copy a prompt into Claude Code, Cursor, Codex, or another coding agent. Nothing to install.', when: 'Quickest to try, and works anywhere your agent can fetch a page.', href: '/start' },
  { icon: Plug, title: 'Connect the MCP server', text: 'Add Sistema to your agent once. Its plays, guides, and tools are there in every session.', when: 'For regular use, in clients that support MCP.', href: '/connect' },
  { icon: Package, title: 'Install Agent Skills', text: 'Download a skill per workflow into your project. The plays travel with it.', when: 'When you want the method in the repo, without a server.', href: '/connect' },
]

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-label text-link m-0 mb-3">{children}</p>
}

function Shot({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption?: string }) {
  return (
    <figure className="m-0">
      <div className="rounded-radius-xl overflow-hidden bg-surface-raised shadow-featured">
        <Image src={src} alt={alt} width={width} height={height} className="block w-full h-auto" sizes="(min-width: 1180px) 620px, 100vw" />
      </div>
      {caption && <figcaption className="text-caption text-on-surface-muted mt-3">{caption}</figcaption>}
    </figure>
  )
}

export default function HowItWorksPage() {
  const c = catalog()
  return (
    <main>
      {/* 1. Hero */}
      <section className={`${section} pt-14 md:pt-24 pb-16 md:pb-24`}>
        <AgentNote raw="/raw/agents" />
        <div className="max-w-[860px] mx-auto text-center">
          <Eyebrow>How Sistema works</Eyebrow>
          <h1 className="text-heading-xl md:text-display font-serif text-on-surface m-0">Your agent builds the design system. You approve every stage.</h1>
          <p className="text-body-lg text-on-surface-muted mt-6 mb-0 mx-auto max-w-[62ch]">
            Sistema guides your coding agent through building a design system in your own repository. It does the work in stages, shows you each result in your browser, and waits for your approval before going on.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/start" className={`inline-flex items-center gap-2 h-control-height px-5 rounded-radius-md bg-primary text-on-primary text-label no-underline hover:bg-primary-hover ${focusRing}`}>Start a design system <ArrowRight size={13} /></Link>
            <Link href="/audit" className={`inline-flex items-center h-control-height px-5 rounded-radius-md border border-border-strong text-on-surface text-label no-underline hover:bg-surface-hover ${focusRing}`}>Audit what you have</Link>
          </div>
        </div>
        <ol className="list-none m-0 p-0 mt-16 md:mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BEATS.map((b, i) => (
            <li key={b.title} className="rounded-radius-xl bg-surface-raised p-5 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-radius-full bg-primary-container text-on-primary-container text-label shrink-0">{i + 1}</span>
              <span className="text-label text-on-surface">{b.title}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 2. Why foundations */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <Eyebrow>Why foundations</Eyebrow>
            <h2 className="text-heading-xl font-serif m-0">AI builds screens fast. Without foundations, each one drifts.</h2>
            <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
              Ask an agent for three screens and you can get three versions of the same button, each with its own blue, radius, and padding. The product looks unfinished, and every fix happens in many places. Decided foundations give every screen the same starting point. They don’t narrow what you can design. They free your time for it.
            </p>
          </div>
          <div className="rounded-radius-xl bg-surface-raised p-6 md:p-8 grid gap-6">
            {/* An illustration of drift: these values are deliberately mismatched, so they aren't tokens. */}
            <div>
              <p className="text-caption text-on-surface-muted m-0 mb-3">Three screens, three buttons</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center text-white" style={{ background: '#2563EB', borderRadius: 4, padding: '7px 14px', fontSize: 13 }}>Save</span>
                <span className="inline-flex items-center text-white font-semibold" style={{ background: '#1D4ED8', borderRadius: 999, padding: '10px 20px', fontSize: 15 }}>Save changes</span>
                <span className="inline-flex items-center text-white" style={{ background: '#3B82F6', borderRadius: 10, padding: '6px 18px', fontSize: 14 }}>Save</span>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-caption text-on-surface-muted m-0 mb-3">One system</p>
              <div className="flex flex-wrap items-center gap-3">
                {['Save', 'Save changes', 'Save'].map((t, i) => (
                  <span key={i} className="inline-flex items-center h-control-height px-4 rounded-radius-md bg-primary text-on-primary text-label">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four beats */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mb-12 md:mb-16">
          <Eyebrow>The work, in four beats</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Every stage ends with something you can see</h2>
        </div>
        <div className="grid gap-16 md:gap-24">
          {BEATS.map((b, i) => {
            const shot = BEAT_SHOTS[i]
            return (
              <div key={b.title} className="grid gap-8 md:gap-14 items-center md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                <div className={i % 2 ? 'md:order-2' : ''}>
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-radius-lg bg-primary-container text-on-primary-container"><b.icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
                  <p className="text-label text-on-surface-muted m-0 mt-5">Step {i + 1}</p>
                  <h3 className="text-heading-lg font-serif m-0 mt-1">{b.title}</h3>
                  <p className="text-body-lg text-on-surface-muted mt-4 mb-0">{b.text}</p>
                </div>
                <div className={i % 2 ? 'md:order-1' : ''}>
                  {shot ? (
                    <Shot src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} caption={shot.caption} />
                  ) : (
                    <figure className="m-0">
                      <div className="rounded-radius-xl bg-surface-raised p-6 md:p-8 font-mono text-code text-on-surface grid gap-3">
                        <p className="m-0 text-on-surface-muted">Found: a Tailwind theme with 14 colors, three type sizes, and no dark theme.</p>
                        <p className="m-0">What is the product, and who uses it to do what?</p>
                        <p className="m-0">Which accessibility standard must it meet? WCAG 2.2 AA fits most web products.</p>
                        <p className="m-0">Light theme, dark theme, or both?</p>
                      </div>
                      <figcaption className="text-caption text-on-surface-muted mt-3">An example: what your agent finds, then the only questions your files didn’t answer.</figcaption>
                    </figure>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. You see it before you approve it */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-10 md:gap-14 items-center">
          <div>
            <Eyebrow>Approvals</Eyebrow>
            <h2 className="text-heading-xl font-serif m-0">You see it before you approve it</h2>
            <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
              Each approval is a page in your repository’s <code className="font-mono text-code">sistema-review/</code> folder. It shows the decision itself: your colors as ramps, type at its real sizes, components in every state and theme. When there’s a choice to make, such as what to do with colors you already have, your current values sit next to each option.
            </p>
            <p className="text-body text-on-surface-muted mt-4 mb-0">
              Agents don’t always follow instructions exactly. The approvals are where you catch it: each one shows you the result, not the agent’s account of it.
            </p>
          </div>
          <Shot src="/images/how-it-works/relay-components-dark.png" width={1440} height={1100} alt="The same components showcase in the dark theme." caption="The same components in dark. One decision, both themes." />
        </div>
      </section>

      {/* 5. What lands in your repo */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-10 md:gap-14">
          <div>
            <Eyebrow>Your repository</Eyebrow>
            <h2 className="text-heading-xl font-serif m-0">Everything lands in your repo, in open formats</h2>
            <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
              Plain markdown, JSON, and the DTCG token format, so you can take it anywhere. Design tools can receive exports from the repository, but they aren’t the source. If your team needs a design tool to be the source of truth, Sistema isn’t a good fit, and that’s a reasonable choice.
            </p>
          </div>
          <ul className="list-none m-0 p-0 rounded-radius-xl bg-surface-raised divide-y divide-border">
            {FILES.map(([f, d]) => (
              <li key={f} className="flex items-start gap-4 px-5 py-4">
                {f.endsWith('/') ? <FolderGit2 size={18} strokeWidth={1.7} className="text-on-surface-muted mt-0.5 shrink-0" aria-hidden="true" /> : <FileText size={18} strokeWidth={1.7} className="text-on-surface-muted mt-0.5 shrink-0" aria-hidden="true" />}
                <span className="min-w-0">
                  <code className="block font-mono text-code text-on-surface">{f}</code>
                  <span className="block text-body-sm text-on-surface-muted mt-0.5">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. After the first run */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px]">
          <Eyebrow>After the first run</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Then it becomes routine</h2>
          <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
            Each later session reads where the system stands, confirms what you want, and follows a short route: document the system, add a component or a page, add a theme, bring in existing colors, check components or accessibility, change a decision, or plan what’s next. Not sure? Say so, and your agent suggests something.
          </p>
          <p className="text-body text-on-surface-muted mt-4 mb-0">
            Already have a design system, or a product with an established look? <Link href="/audit" className="text-link">Start with an audit.</Link> It reports what’s consistent, what fails, and what’s missing before anything changes.
          </p>
          <p className="text-body text-on-surface-muted mt-4 mb-0">
            Each route is a short sequence of <Link href="/plays" className="text-link">plays</Link>, Sistema’s {c.plays.length} steps, and each <Link href="/workflows" className="text-link">workflow</Link> puts plays in order.
          </p>
        </div>
      </section>

      {/* 7. Three ways to run it */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mb-10">
          <Eyebrow>Your agent, your client</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Three ways to run it</h2>
          <p className="text-body-lg text-on-surface-muted mt-5 mb-0">The same plays, guides, and tools reach your agent whichever way you choose.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {WAYS.map(w => (
            <Link key={w.title} href={w.href} className={`group flex flex-col rounded-radius-xl bg-surface-raised p-6 no-underline hover:bg-surface-hover transition-colors motion-reduce:transition-none ${focusRing}`}>
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-radius-lg bg-primary-container text-on-primary-container"><w.icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="text-heading-sm font-serif text-on-surface mt-5">{w.title}</span>
              <span className="text-body text-on-surface-muted mt-2">{w.text}</span>
              <span className="text-body-sm text-on-surface mt-4">{w.when}</span>
              <span className="mt-auto pt-5 text-on-surface-faint group-hover:text-on-surface"><ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. What Sistema decides, and what it leaves to you */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mb-10">
          <Eyebrow>Opinions and taste</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">What Sistema decides, and what it leaves to you</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-radius-xl bg-surface-raised p-6 md:p-8">
            <h3 className="text-heading-sm font-serif m-0">Sistema has opinions about</h3>
            <ul className="m-0 mt-4 pl-5 list-disc grid gap-2 text-body text-on-surface-muted">
              <li>Process: direction before values, approvals you can see, evidence before “done”.</li>
              <li>Structure: tokens named for their job, written once, compiled for every theme.</li>
              <li>The quality floor: contrast for your standard, visible states, a craft baseline.</li>
            </ul>
            <p className="text-body-sm text-on-surface-muted mt-5 mb-0">Each one is published with its reason and when you’d choose otherwise. <Link href="/reference/opinions" className="text-link">Read the opinions.</Link></p>
          </div>
          <div className="rounded-radius-xl bg-primary-container text-on-primary-container p-6 md:p-8">
            <h3 className="text-heading-sm font-serif m-0">The look is yours</h3>
            <ul className="m-0 mt-4 pl-5 list-disc grid gap-2 text-body">
              <li>How much color, and which.</li>
              <li>Warm or cool grays, how round, how panels separate.</li>
              <li>Typefaces, density, and what stands out.</li>
            </ul>
            <p className="text-body-sm mt-5 mb-0">Sistema proposes an answer to each, says why, and writes down what you choose.</p>
          </div>
        </div>
      </section>

      {/* 9. Who it's for */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px]">
          <Eyebrow>Who it’s for</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Built for the web first</h2>
          <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
            Sistema is built for web products first, with React and Tailwind as the default path. Other web stacks work with more of your agent’s judgment. For native apps, the direction, foundations, and tokens apply. Components and checks are web-only for now.
          </p>
        </div>
      </section>

      {/* 10. Closing */}
      <section className={`${section} pb-8`}>
        <div className="rounded-radius-xl bg-surface-brand text-on-surface-brand px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <h2 className="text-heading-xl font-serif m-0">Start with one prompt</h2>
            <p className="text-body-lg m-0 mt-4 max-w-[48ch]">Copy it into your agent, in your project folder. It reads your project first and asks before it builds anything.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/start" className={`inline-flex items-center h-control-height px-5 rounded-radius-md bg-surface-raised text-on-surface text-label no-underline ${focusRing}`}>Start a design system</Link>
            <Link href="/audit" className={`inline-flex items-center h-control-height px-5 rounded-radius-md text-on-surface-brand text-label no-underline shadow-[inset_0_0_0_1px_currentColor] ${focusRing}`}>Audit what you have</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
