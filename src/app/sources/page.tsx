import Link from 'next/link'
import type { Metadata } from 'next'
import {
  MaterialDesignLogo,
  CarbonLogo,
  AtlassianLogo,
  GitHubLogo,
  AntDesignLogo,
  RadixUILogo,
  ShopifyLogo,
  MailchimpLogo,
} from '@/components/logos/SourceLogos'

export const metadata: Metadata = {
  title: 'Sources — Sistema',
  description: 'The websites, documentation sites, and open-source repositories that the Sistema knowledge base is built from.',
}

const DESIGN_SYSTEMS = [
  {
    name: 'Material Design 3',
    org: 'Google',
    url: 'https://m3.material.io',
    accent: '#6750A4',
    Logo: MaterialDesignLogo,
    description: 'Color system, typography scale, shape tokens, component specifications, and the DESIGN.md format specification.',
    kbPath: '/kb/design-systems/material',
  },
  {
    name: 'Carbon',
    org: 'IBM',
    url: 'https://carbondesignsystem.com',
    accent: '#0F62FE',
    Logo: CarbonLogo,
    description: 'Token architecture, color roles, grid system, accessibility-first component patterns, and content guidelines.',
    kbPath: '/kb/design-systems/carbon',
  },
  {
    name: 'Atlassian Design System',
    org: 'Atlassian',
    url: 'https://atlassian.design',
    accent: '#0052CC',
    Logo: AtlassianLogo,
    description: 'Color foundations, typography, spacing, enterprise component patterns, and voice and tone guidelines.',
    kbPath: '/kb/design-systems/atlassian',
  },
  {
    name: 'Primer',
    org: 'GitHub',
    url: 'https://github.com/primer/design',
    accent: '#0969DA',
    Logo: GitHubLogo,
    description: 'Semantic color roles, spacing foundations, and developer-centric design token patterns.',
    kbPath: '/kb/design-systems/primer',
  },
  {
    name: 'Ant Design',
    org: 'Ant Group',
    url: 'https://ant.design',
    accent: '#1677FF',
    Logo: AntDesignLogo,
    description: 'Design values, color system, typography, and React component implementation patterns.',
    kbPath: '/kb/design-systems/ant-design',
  },
  {
    name: 'Radix UI',
    org: 'WorkOS',
    url: 'https://radix-ui.com',
    accent: '#6E56CF',
    Logo: RadixUILogo,
    description: 'Primitive component architecture, accessibility patterns, and headless UI composition model.',
    kbPath: '/kb/design-systems/radix',
  },
  {
    name: 'Polaris',
    org: 'Shopify',
    url: 'https://polaris.shopify.com',
    accent: '#008060',
    Logo: ShopifyLogo,
    description: 'Voice and tone, grammar and mechanics, actionable language, and error message patterns.',
    kbPath: '/kb/design-systems/polaris',
  },
  {
    name: 'Content Style Guide',
    org: 'MailChimp',
    url: 'https://styleguide.mailchimp.com',
    accent: '#C1A123',
    Logo: MailchimpLogo,
    description: 'Voice and tone framework, grammar and mechanics, and accessible writing guidelines.',
    kbPath: '/kb/design-systems/mailchimp',
  },
]

const SUPPORTING_SOURCES = [
  {
    category: 'Agent Skills',
    items: [
      {
        name: 'Impeccable',
        author: 'Philip Bakaus',
        url: 'https://github.com/pbakaus/impeccable',
        description: 'Open-source design skill for AI agents. 7 domain reference areas, 23 commands, and 27 deterministic anti-pattern rules. Apache 2.0.',
        kbPath: '/kb/skills/impeccable',
      },
      {
        name: 'frontend-design skill',
        author: 'Anthropic',
        url: 'https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md',
        description: 'Official Claude Code plugin for frontend design. Guides Claude toward distinctive, production-grade interfaces.',
        kbPath: '/kb/skills/anthropic-frontend-design',
      },
      {
        name: 'designer-skills',
        author: 'Julian Oczkowski',
        url: 'https://github.com/julianoczkowski/designer-skills',
        description: '8 agent skills encoding the design process, including grill-me, design-brief, and frontend-design. Apache 2.0.',
        kbPath: '/kb/skills/designer-skills',
      },
    ],
  },
  {
    category: 'Standards',
    items: [
      {
        name: 'WCAG 2.2',
        author: 'W3C',
        url: 'https://www.w3.org/TR/WCAG22/',
        description: 'Web Content Accessibility Guidelines — contrast ratios, focus requirements, and perceivability criteria.',
        kbPath: '/kb/standards/wcag',
      },
      {
        name: 'MDN Web Docs',
        author: 'Mozilla',
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
        name: 'Oklab / OKLCH',
        author: 'Björn Ottosson',
        url: 'https://bottosson.github.io/posts/oklab/',
        description: 'The perceptual color model behind OKLCH. Foundational reading for why OKLCH produces more uniform palettes than HSL.',
        kbPath: null,
      },
      {
        name: 'DESIGN.md Format',
        author: 'Google Stitch',
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
        name: 'Practical Typography',
        author: 'Matthew Butterick',
        url: 'https://practicaltypography.com',
        description: 'Line length, line spacing, font sizing, and typographic conventions that inform the principles section.',
        kbPath: null,
      },
      {
        name: 'The Elements of Typographic Style Applied to the Web',
        author: 'Richard Rutter',
        url: 'https://webtypography.net',
        description: "Web-specific translation of typographic principles from Robert Bringhurst's foundational text.",
        kbPath: null,
      },
    ],
  },
]

function ExternalIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-50" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SourcesPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-24">

        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-4">
            Knowledge Base · Sources
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-5 text-[36px] md:text-[56px]"
            style={{ lineHeight: 1.0, letterSpacing: '-0.03em' }}
          >
            Where the KB<br className="hidden sm:block" /> comes from.
          </h1>
          <p className="text-on-surface-muted font-serif text-[16px] md:text-[18px] leading-[1.55] m-0">
            Sistema draws on publicly available documentation from six design systems,
            three agent skill libraries, and established references in accessibility,
            color science, and typography theory.
          </p>
        </div>

        {/* Design systems grid */}
        <section className="mb-16 md:mb-20">
          <h2 className="font-mono text-[11px] tracking-[0.12em] uppercase text-on-surface-muted mb-6">
            Design Systems &amp; Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border rounded-radius-lg overflow-hidden">
            {DESIGN_SYSTEMS.map(ds => (
              <div
                key={ds.url}
                className="bg-surface-raised flex flex-col p-5 gap-3"
              >
                {/* Logo in brand color */}
                <div style={{ color: ds.accent }}>
                  <ds.Logo size={22} />
                </div>
                {/* Name + org */}
                <div>
                  <p className="font-sans font-semibold text-[15px] text-on-surface m-0 leading-tight">
                    {ds.name}
                  </p>
                  <p className="font-mono text-[11px] text-on-surface-subtle m-0 mt-0.5">
                    {ds.org}
                  </p>
                </div>
                {/* Description */}
                <p className="text-[13px] text-on-surface-muted leading-[1.5] m-0 flex-1">
                  {ds.description}
                </p>
                {/* Links */}
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href={ds.kbPath}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface-muted hover:text-on-surface transition-colors no-underline"
                  >
                    View in KB
                    <ArrowIcon />
                  </Link>
                  <span className="text-border">·</span>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-on-surface-subtle hover:text-on-surface-muted transition-colors no-underline"
                  >
                    Source
                    <ExternalIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supporting sources */}
        <section>
          <h2 className="font-mono text-[11px] tracking-[0.12em] uppercase text-on-surface-muted mb-8">
            Supporting Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {SUPPORTING_SOURCES.map(group => (
              <div key={group.category}>
                <p className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-on-surface-subtle mb-4 m-0">
                  {group.category}
                </p>
                <div className="flex flex-col divide-y divide-border">
                  {group.items.map(item => (
                    <div key={item.url} className="py-4 first:pt-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13.5px] font-semibold text-on-surface hover:text-primary transition-colors no-underline inline-flex items-center gap-1.5"
                          >
                            {item.name}
                            <ExternalIcon />
                          </a>
                          <span className="ml-2 text-[11px] font-mono text-on-surface-subtle">{item.author}</span>
                        </div>
                        {item.kbPath && (
                          <Link
                            href={item.kbPath}
                            className="inline-flex items-center gap-1 h-[26px] px-2.5 text-[11px] font-medium border border-border rounded-radius-md text-on-surface-muted hover:text-on-surface hover:bg-surface-sunken transition-colors no-underline shrink-0"
                          >
                            KB
                            <ArrowIcon />
                          </Link>
                        )}
                      </div>
                      <p className="text-[12.5px] text-on-surface-muted leading-[1.5] m-0">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-[13px] text-on-surface-muted leading-[1.55] max-w-2xl">
            All content in the Sistema knowledge base is either derived from or directly references these sources.
            DESIGN.md files were generated by Sistema using publicly available documentation and are not official documents from those teams.
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
