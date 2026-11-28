import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight as Arrow, BadgeCheck, Blocks, Eye, FileText, FolderGit2, Package, Plug, Search, Terminal } from 'lucide-react'
import { AgentNote, ArrowRight } from '@/components/site/ui'
import { catalog } from '@/lib/content/site'

export const metadata: Metadata = {
  title: 'How Sistema works',
  description: 'How Sistema builds a design system in your repository: your agent does the work in stages, you see each result in your browser, and nothing moves on until you approve.',
}

const section = 'max-w-[1180px] mx-auto px-5 md:px-10'
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const BEATS = [
  { icon: Search, title: 'It learns your project', short: 'Reads your repository and asks only what’s missing.', text: 'Your agent reads what’s already in your repository, then asks only what your files don’t answer: what the product is, who uses it, and the accessibility standard it has to meet.' },
  { icon: Eye, title: 'It shows you options', short: 'Each choice drawn on a screen like yours.', text: 'How much color, which grays, how round, which typeface. Each question is answered by looking: the options are drawn on a screen like yours, with your words, side by side.' },
  { icon: Blocks, title: 'It builds the foundations', short: 'Tokens from Sistema’s tools, checked in every theme.', text: 'Color, type, shape, and spacing, as tokens. Ramps and contrast come from Sistema’s tools, checked against your standard in every theme, then compiled into CSS your app uses.' },
  { icon: BadgeCheck, title: 'You approve', short: 'You see each stage before it moves on.', text: 'At each stage your agent builds a page you open in your browser. You see the result itself, not a description of it. Nothing moves on until you say so.' },
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

/** A screenshot of a real Sistema page, framed and lifted like the featured item. */
function Shot({ src, alt, width, height, caption, className = '' }: { src: string; alt: string; width: number; height: number; caption?: string; className?: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className="rounded-radius-xl overflow-hidden bg-surface-raised shadow-featured">
        <Image src={src} alt={alt} width={width} height={height} className="block w-full h-auto" sizes="(min-width: 1180px) 540px, 100vw" />
      </div>
      {caption && <figcaption className="text-caption text-on-surface-muted mt-3">{caption}</figcaption>}
    </figure>
  )
}

/**
 * One small screen, for the "Why foundations" comparison. drift: three screens an
 * agent made without a system, each inventing its own values (deliberately raw,
 * since they're the problem being shown). system: the same screen from the tokens.
 */
const DRIFT: Array<{ card: CSSProperties; title: CSSProperties; button: CSSProperties; bar: string }> = [
  { card: { background: '#FFFFFF', borderRadius: 2, boxShadow: 'inset 0 0 0 1px #D4D4D8' }, title: { fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#111827' }, button: { background: '#2563EB', color: '#FFFFFF', borderRadius: 2, padding: '5px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }, bar: '#E5E7EB' },
  { card: { background: '#F5F3FF', borderRadius: 18, boxShadow: '0 10px 24px rgb(76 29 149 / 0.25)' }, title: { fontFamily: 'ui-rounded, system-ui, sans-serif', fontSize: 17, fontWeight: 800, color: '#4C1D95' }, button: { background: 'linear-gradient(90deg, #7C3AED, #DB2777)', color: '#FFFFFF', borderRadius: 999, padding: '8px 16px', fontSize: 13, fontWeight: 700 }, bar: '#DDD6FE' },
  { card: { background: '#F0FDF4', borderRadius: 8, boxShadow: 'inset 0 0 0 2px #22C55E' }, title: { fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 400, color: '#14532D' }, button: { background: '#FFFFFF', color: '#0EA5E9', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 500, boxShadow: 'inset 0 0 0 1px #0EA5E9' }, bar: '#BBF7D0' },
]

function DriftScreen({ i, label }: { i: number; label: string }) {
  const d = DRIFT[i]
  return (
    <div className="w-[116px] p-3 flex flex-col gap-2 text-left" style={d.card}>
      <span style={d.title}>{label}</span>
      <span className="block h-1.5 w-[80%] rounded-full" style={{ background: d.bar }} />
      <span className="block h-1.5 w-[60%] rounded-full" style={{ background: d.bar }} />
      <span className="self-start mt-1" style={d.button}>Save</span>
    </div>
  )
}

function SystemScreen({ label }: { label: string }) {
  return (
    <div className="w-[116px] p-3 flex flex-col gap-2 text-left rounded-radius-lg bg-surface-raised shadow-control">
      <span className="font-serif text-label text-on-surface">{label}</span>
      <span className="block h-1.5 w-[80%] rounded-full bg-surface-selected" />
      <span className="block h-1.5 w-[60%] rounded-full bg-surface-selected" />
      <span className="self-start mt-1 inline-flex items-center h-7 px-3 rounded-radius-md bg-primary text-on-primary text-caption font-medium">Save</span>
    </div>
  )
}

export default function HowItWorksPage() {
  const c = catalog()
  return (
    <main>
      {/* 1. Hero, with the work as a timeline that keeps going */}
      <section className="overflow-x-clip">
      <div className={`${section} pt-14 md:pt-24 pb-16 md:pb-24`}>
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

        <ol className="relative list-none m-0 p-0 mt-16 md:mt-24 grid gap-8 lg:grid-cols-5 lg:gap-4">
          {/* The line: solid through the four stages, then dashed and open past the fifth. */}
          <span aria-hidden="true" className="hidden lg:block absolute top-5 left-[10%] w-[60%] h-0.5 bg-primary" />
          {/* Past the fifth stage, dotted and running off the edge of the window: the work keeps going. */}
          <span aria-hidden="true" className="hidden lg:block absolute top-[19px] left-[70%] -right-[50vw] h-1 bg-[radial-gradient(circle,var(--color-primary)_1.5px,transparent_1.75px)] bg-[length:10px_4px] bg-repeat-x" />
          <span aria-hidden="true" className="lg:hidden absolute left-5 top-5 bottom-5 w-0.5 bg-primary" />
          {BEATS.map((b, i) => (
            <li key={b.title} className="relative flex lg:flex-col lg:items-center gap-4 lg:gap-0 lg:text-center">
              <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-radius-full bg-surface text-label text-primary ring-2 ring-primary shrink-0">{i + 1}</span>
              <span className="lg:mt-5">
                <span className="block text-label text-on-surface">{b.title}</span>
                <span className="block text-body-sm text-on-surface-muted mt-1 lg:max-w-[22ch] lg:mx-auto">{b.short}</span>
              </span>
            </li>
          ))}
          <li className="relative flex lg:flex-col lg:items-center gap-4 lg:gap-0 lg:text-center">
            <span className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-radius-full bg-primary text-on-primary shrink-0"><Arrow size={18} strokeWidth={2} aria-hidden="true" /></span>
            <span className="lg:mt-5">
              <span className="block text-label text-on-surface">Build on it</span>
              <span className="block text-body-sm text-on-surface-muted mt-1 lg:max-w-[22ch] lg:mx-auto">Components, pages, and whatever comes next start from solid ground.</span>
            </span>
          </li>
        </ol>
      </div>
      </section>

      {/* 2. Why foundations */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mx-auto text-center">
          <Eyebrow>Why foundations</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">AI builds screens fast. Without foundations, each one drifts.</h2>
          <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
            Ask an agent for three screens and you can get three versions of the same button, each with its own color, shape, and type. The product looks unfinished, and every fix happens in many places. Decided foundations give every screen the same starting point. They don’t narrow what you can design. They free your time for it.
          </p>
        </div>
        <div className="mt-12 md:mt-16 max-w-[1100px] mx-auto rounded-radius-xl bg-surface-raised shadow-featured p-6 md:p-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          <figure className="m-0 text-center">
            <div className="flex flex-wrap justify-center items-start gap-3 rounded-radius-lg bg-surface p-5">
              {['Orders', 'Team', 'Billing'].map((t, i) => <DriftScreen key={t} i={i} label={t} />)}
            </div>
            <figcaption className="text-label text-on-surface mt-5">Three screens, three systems</figcaption>
          </figure>
          <div className="flex md:flex-col items-center gap-3" aria-hidden="true">
            <span className="flex-1 h-px md:h-auto md:w-px md:min-h-[72px] bg-border" />
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-radius-full bg-surface text-label text-on-surface-muted font-serif italic">vs</span>
            <span className="flex-1 h-px md:h-auto md:w-px md:min-h-[72px] bg-border" />
          </div>
          <figure className="m-0 text-center">
            <div className="flex flex-wrap justify-center items-start gap-3 rounded-radius-lg bg-surface p-5">
              {['Orders', 'Team', 'Billing'].map(t => <SystemScreen key={t} label={t} />)}
            </div>
            <figcaption className="text-label text-on-surface mt-5">Three screens, one system</figcaption>
          </figure>
        </div>
      </section>

      {/* 3. Four beats, alternating, equal columns */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mx-auto text-center mb-12 md:mb-20">
          <Eyebrow>The work, in four beats</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Every stage ends with something you can see</h2>
        </div>
        <div className="grid gap-16 md:gap-28">
          {BEATS.map((b, i) => (
            <div key={b.title} className="grid gap-8 md:gap-16 items-center md:grid-cols-2">
              <div className={i % 2 ? 'md:order-2' : ''}>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-radius-lg bg-primary-container text-on-primary-container"><b.icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
                <p className="text-label text-on-surface-muted m-0 mt-5">Step {i + 1}</p>
                <h3 className="text-heading-lg font-serif m-0 mt-1">{b.title}</h3>
                <p className="text-body-lg text-on-surface-muted mt-4 mb-0">{b.text}</p>
              </div>
              <div className={i % 2 ? 'md:order-1' : ''}>
                {i === 0 && (
                  <figure className="m-0">
                    {/* A stylized session: what the agent finds, then only the questions the files didn't answer. */}
                    <div className="rounded-radius-xl overflow-hidden shadow-featured bg-surface-inverse text-on-surface-inverse">
                      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10" aria-hidden="true">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/25" /><span className="w-2.5 h-2.5 rounded-full bg-white/25" /><span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                        <span className="ml-3 text-caption opacity-70">your-project · agent session</span>
                      </div>
                      <div className="p-5 md:p-6 font-mono text-code grid gap-3">
                        <p className="m-0 opacity-70">Read package.json, tailwind.config.ts, src/styles, 38 components.</p>
                        <p className="m-0 opacity-70">Found: 14 colors, three type sizes, no dark theme.</p>
                        <p className="m-0">What is the product, and who uses it to do what?</p>
                        <p className="m-0">Which accessibility standard must it meet? WCAG 2.2 AA fits most web products.</p>
                        <p className="m-0">Light theme, dark theme, or both?</p>
                      </div>
                    </div>
                    <figcaption className="text-caption text-on-surface-muted mt-3">An example session: what your agent finds, then only the questions your files didn’t answer.</figcaption>
                  </figure>
                )}
                {i === 1 && <Shot src="/images/how-it-works/vd-question.png" width={2880} height={1800} alt="A question from the visual direction page: how much color, with three options and the chosen one drawn on a sample screen." caption="A question on the visual direction page, from Sistema’s own site." />}
                {i === 2 && <Shot src="/images/how-it-works/token-check-light.png" width={2220} height={870} alt="The token check page: rows, chips, messages, menus, and buttons built only from the role tokens." caption="The token check: the compiled tokens in use, from Sistema’s own site." />}
                {i === 3 && <Shot src="/images/how-it-works/vd-answers.png" width={1440} height={1040} alt="The end of the visual direction page: the answers, ready to copy back to the agent." caption="Your answers go back to your agent, with anything you’d change." />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. You see it before you approve it */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
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
          <figure className="m-0">
            <div className="relative pb-[18%] pr-[10%]">
              <div className="rounded-radius-xl overflow-hidden shadow-featured">
                <Image src="/images/how-it-works/token-check-light.png" alt="" width={2220} height={870} loading="eager" className="block w-full h-auto" sizes="(min-width: 1180px) 500px, 90vw" />
              </div>
              <div className="absolute right-0 bottom-0 w-[90%] rounded-radius-xl overflow-hidden shadow-overlay">
                <Image src="/images/how-it-works/token-check-dark.png" alt="The same token check in the dark theme, overlapping the light one." width={2220} height={870} loading="eager" className="block w-full h-auto" sizes="(min-width: 1180px) 500px, 90vw" />
              </div>
            </div>
            <figcaption className="text-caption text-on-surface-muted mt-3">The same tokens in light and dark. One decision, both themes.</figcaption>
          </figure>
        </div>
      </section>

      {/* 5. What lands in your repo */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <Eyebrow>Your repository</Eyebrow>
            <h2 className="text-heading-xl font-serif m-0">Everything lands in your repo, in open formats</h2>
            <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
              Plain markdown, JSON, and the DTCG token format, so you can take it anywhere. Design tools can receive exports from the repository, but they aren’t the source. If your team needs a design tool to be the source of truth, Sistema isn’t a good fit, and that’s a reasonable choice.
            </p>
          </div>
          <ul className="list-none m-0 p-0 rounded-radius-xl bg-surface-raised shadow-featured divide-y divide-border">
            {FILES.map(([f, d]) => (
              <li key={f} className="flex items-start gap-4 px-5 py-4">
                {f.endsWith('/') ? <FolderGit2 size={18} strokeWidth={1.7} className="text-primary mt-0.5 shrink-0" aria-hidden="true" /> : <FileText size={18} strokeWidth={1.7} className="text-primary mt-0.5 shrink-0" aria-hidden="true" />}
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
        <div className="max-w-[760px] mx-auto text-center">
          <Eyebrow>After the first run</Eyebrow>
          <h2 className="text-heading-xl font-serif m-0">Then it becomes routine</h2>
          <p className="text-body-lg text-on-surface-muted mt-5 mb-0">
            Each later session reads where the system stands, confirms what you want, and follows a short route: document the system, add a component or a page, add a theme, bring in existing colors, check components or accessibility, change a decision, or plan what’s next. Not sure? Say so, and your agent suggests something.
          </p>
          <p className="text-body text-on-surface-muted mt-4 mb-0">
            Already have a design system, or a product with an established look? <Link href="/audit" className="text-link">Start with an audit.</Link> It reports what’s consistent, what fails, and what’s missing before anything changes. Each route is a short sequence of <Link href="/plays" className="text-link">plays</Link>, Sistema’s {c.plays.length} steps, and each <Link href="/workflows" className="text-link">workflow</Link> puts plays in order.
          </p>
        </div>
      </section>

      {/* 7. Three ways to run it */}
      <section className={`${section} py-16 md:py-24 border-t border-border`}>
        <div className="max-w-[760px] mx-auto text-center mb-10 md:mb-14">
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
        <div className="max-w-[760px] mx-auto text-center mb-10 md:mb-14">
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
        <div className="max-w-[760px] mx-auto text-center">
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
