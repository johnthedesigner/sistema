import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sources — Sistema',
  description: 'The websites, documentation sites, and open-source repositories that the Sistema knowledge base is built from.',
}

const SOURCES = [
  {
    category: 'Design Systems',
    items: [
      {
        name: 'Material Design 3 (Google)',
        url: 'https://m3.material.io',
        description: 'Color system, typography scale, shape tokens, component specifications, and the DESIGN.md format specification.',
        kbPath: '/kb/design-systems/material',
      },
      {
        name: 'Carbon Design System (IBM)',
        url: 'https://carbondesignsystem.com',
        description: 'Token architecture, color roles, grid system, accessibility-first component patterns, and content guidelines (voice, writing style, inclusive language).',
        kbPath: '/kb/design-systems/carbon',
      },
      {
        name: 'Atlassian Design System',
        url: 'https://atlassian.design',
        description: 'Color foundations, typography, spacing, enterprise component patterns, and content guidelines (voice and tone, language and grammar).',
        kbPath: '/kb/design-systems/atlassian',
      },
      {
        name: 'Ant Design',
        url: 'https://ant.design',
        description: 'Design values, color system, typography, and React component implementation patterns.',
        kbPath: '/kb/design-systems/ant-design',
      },
      {
        name: 'Radix UI',
        url: 'https://radix-ui.com',
        description: 'Primitive component architecture, accessibility patterns, and headless UI composition model.',
        kbPath: '/kb/design-systems/radix',
      },
      {
        name: 'Primer (GitHub)',
        url: 'https://github.com/primer/design',
        description: 'Semantic color roles, spacing foundations, and developer-centric design token patterns.',
        kbPath: '/kb/design-systems/primer',
      },
      {
        name: 'Shopify Polaris',
        url: 'https://polaris.shopify.com',
        description: 'Voice and tone, grammar and mechanics, actionable language, and error message patterns. One of the most complete content design systems in production.',
        kbPath: '/kb/design-systems/polaris',
      },
    ],
  },
  {
    category: 'Content Design',
    items: [
      {
        name: 'MailChimp Content Style Guide',
        url: 'https://styleguide.mailchimp.com',
        description: 'Voice and tone framework (plainspoken, genuine, translators, dry humor), grammar and mechanics, and accessible writing guidelines.',
        kbPath: '/kb/design-systems/mailchimp',
      },
    ],
  },
  {
    category: 'Agent Skills',
    items: [
      {
        name: 'Impeccable (Philip Bakaus)',
        url: 'https://github.com/pbakaus/impeccable',
        description: 'Open-source design skill for AI agents. 7 domain reference areas (typography, color, spatial, motion, interaction, responsive, UX writing), 23 commands, and 27 deterministic anti-pattern rules. Apache 2.0. Primary source for the AI slop problem framing and quality signal vocabulary.',
        kbPath: '/kb/skills/impeccable',
      },
      {
        name: 'Anthropic frontend-design skill',
        url: 'https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md',
        description: 'Official Anthropic Claude Code plugin for frontend design. 42-line skill that guides Claude toward distinctive, production-grade interfaces. The most widely-deployed design skill in the Claude ecosystem and the foundation Impeccable extends.',
        kbPath: '/kb/skills/anthropic-frontend-design',
      },
      {
        name: 'designer-skills (Julian Oczkowski)',
        url: 'https://github.com/julianoczkowski/designer-skills',
        description: 'Collection of 8 agent skills encoding the design process. Includes grill-me (decision-tree interrogation), design-brief (structured brief with codebase exploration), and frontend-design (8 named aesthetic philosophies with concrete implementation parameters). Apache 2.0.',
        kbPath: '/kb/skills/designer-skills',
      },
    ],
  },
  {
    category: 'Standards',
    items: [
      {
        name: 'WCAG 2.2 (W3C)',
        url: 'https://www.w3.org/TR/WCAG22/',
        description: 'Web Content Accessibility Guidelines — contrast ratios, focus requirements, and perceivability criteria.',
        kbPath: '/kb/standards/wcag',
      },
      {
        name: 'MDN Web Docs (Mozilla)',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/',
        description: 'CSS custom properties, color functions, and web platform references.',
        kbPath: null,
      },
    ],
  },
  {
    category: 'Color Science',
    items: [
      {
        name: 'Björn Ottosson — Oklab / OKLCH',
        url: 'https://bottosson.github.io/posts/oklab/',
        description: 'The perceptual color model behind OKLCH. Foundational reading for understanding why OKLCH produces more uniform palettes than HSL.',
        kbPath: null,
      },
      {
        name: 'Google Stitch — DESIGN.md Format',
        url: 'https://stitch.withgoogle.com/docs/design-md/format/',
        description: 'Specification for the DESIGN.md format that Sistema uses to encode design systems for AI agents.',
        kbPath: null,
      },
    ],
  },
  {
    category: 'Typography',
    items: [
      {
        name: 'Practical Typography (Matthew Butterick)',
        url: 'https://practicaltypography.com',
        description: 'Line length, line spacing, font sizing, and typographic conventions that inform the principles section.',
        kbPath: null,
      },
      {
        name: 'The Elements of Typographic Style Applied to the Web',
        url: 'https://webtypography.net',
        description: 'Web-specific translation of typographic principles from Robert Bringhurst\'s foundational text.',
        kbPath: null,
      },
    ],
  },
]

function ExternalIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SourcesPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">
        {/* Header */}
        <div className="mb-10 md:mb-14 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/kb" className="text-[13px] text-on-surface-muted hover:text-on-surface transition-colors no-underline">
              Knowledge Base
            </Link>
            <span className="text-on-surface-subtle">/</span>
            <span className="text-[13px] text-on-surface">Sources</span>
          </div>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-4 text-[32px] md:text-[48px]"
            style={{ lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            Sources
          </h1>
          <p className="text-on-surface-muted font-serif text-[16px] md:text-[18px] leading-[1.55] m-0">
            The Sistema knowledge base is built from publicly available documentation, design specifications, and academic writing.
            These are the primary sources.
          </p>
        </div>

        {/* Source categories */}
        <div className="space-y-12">
          {SOURCES.map(group => (
            <section key={group.category}>
              <h2 className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-4">
                {group.category}
              </h2>
              <div className="border border-border rounded-radius-lg divide-y divide-border overflow-hidden">
                {group.items.map(item => (
                  <div key={item.url} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-semibold text-on-surface hover:text-primary transition-colors no-underline inline-flex items-center gap-1.5"
                        >
                          {item.name}
                          <ExternalIcon />
                        </a>
                      </div>
                      <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0">
                        {item.description}
                      </p>
                    </div>
                    {item.kbPath && (
                      <Link
                        href={item.kbPath}
                        className="inline-flex items-center gap-1.5 h-[30px] px-3 text-[12px] font-medium border border-border rounded-radius-md text-on-surface-muted hover:text-on-surface hover:bg-surface-sunken transition-colors no-underline shrink-0 self-start"
                      >
                        View in KB
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-[13px] text-on-surface-muted leading-[1.55] max-w-2xl">
            All content in the Sistema knowledge base is either derived from or directly references these sources.
            DESIGN.md files in the design-systems section were generated by Sistema using publicly available documentation
            and are not official documents from those teams.
            If you believe any content misrepresents a source, please{' '}
            <a
              href="https://github.com/anthropics/claude-code/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary no-underline hover:underline"
            >
              open an issue
            </a>.
          </p>
        </div>
      </div>
    </main>
  )
}
