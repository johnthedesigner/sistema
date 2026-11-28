import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Palette, contrast, type scale, specimen, token validator, and dark mode tools for design system work, each with a page and an API.',
  robots: { index: false, follow: false },
}

const TOOLS = [
  {
    slug: 'palette',
    href: '/tools/palette',
    title: 'Palette generator',
    description: 'Generate 19-stop OKLCH color ramps from any seed hex. The same algorithm the color scheme play uses through the palette API. Export as CSS variables, Tailwind config, or Figma Variables.',
    playRef: 'color.scheme',
    api: `${SITE_URL}/api/palette`,
  },
  {
    slug: 'contrast',
    href: '/tools/contrast',
    title: 'Contrast checker',
    description: 'Check any foreground and background pair against the accessibility standard your project follows, using the same rules plays check. Also an API that checks many pairs at once.',
    playRef: 'accessibility.audit',
    api: `${SITE_URL}/api/contrast`,
  },
  {
    slug: 'type-scale',
    href: '/tools/type-scale',
    title: 'Type scale calculator',
    description: 'Pick a base size and ratio to see how sizes distribute, with a suggested line height for each and the step names your component library uses. The same calculation the type scale play gets from the API.',
    playRef: 'typography.scale',
    api: `${SITE_URL}/api/type-scale`,
  },
  {
    slug: 'specimen',
    href: '/tools/specimen',
    title: 'Specimen',
    description: 'See how a few visual choices (color presence, warmth, roundness, how panels separate, density, typeface, theme) change a whole product screen, with every option of one choice side by side.',
    playRef: 'visual-language.direction',
    api: `${SITE_URL}/api/specimen`,
  },
  {
    slug: 'validate',
    href: '/tools/validate',
    title: 'Token validator',
    description: "Check DTCG token files against Sistema's rules: the format and aliases, the required color roles, contrast for every pair in every theme, mode files, line heights, and the spacing scale.",
    playRef: 'tokens.pipeline',
    api: `${SITE_URL}/api/validate`,
  },
  {
    slug: 'dark-mode',
    href: '/tools/dark-mode',
    title: 'Dark mode mapping',
    description: 'Propose a dark theme from your light color roles, as the color guide describes, with every pair checked in both themes and a passing stop suggested for each failure.',
    playRef: 'color.scheme',
    api: `${SITE_URL}/api/dark-mode`,
  },
]

export default function ToolsPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">

        <div className="mb-9">
          <p className="font-mono text-[11.5px] text-on-surface-muted mb-2.5">
            Tools · {TOOLS.length} available
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3 text-[26px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 720 }}
          >
            Computational tools for design system work.
          </h1>
          <p
            className="text-on-surface-muted m-0"
            style={{ maxWidth: 620, fontSize: 15, lineHeight: 1.55 }}
          >
            Each tool has a page you can use and an API that plays call, so agents get exact values instead of estimates.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {TOOLS.map(tool => (
            <div key={tool.slug} className="relative rounded-radius-lg bg-surface-raised group">
              <Link href={tool.href} className="absolute inset-0 z-0" aria-label={tool.title} />

              <div className="p-5 md:p-6 relative z-10 pointer-events-none">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2
                    className="font-serif font-medium text-on-surface m-0 text-[20px] md:text-[22px]"
                    style={{ letterSpacing: '-0.015em' }}
                  >
                    {tool.title}
                  </h2>
                  {tool.api && (
                    <div className="hidden md:flex items-center gap-2 shrink-0 pointer-events-auto">
                      <span className="font-mono text-[11px] text-on-surface-muted bg-surface-subtle px-2 py-0.5 rounded break-all">
                        {tool.api}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[13.5px] text-on-surface-muted leading-[1.5] m-0 mb-4 max-w-2xl">
                  {tool.description}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/plays/${tool.playRef}`}
                    className="pointer-events-auto inline-flex items-center h-[26px] px-2.5 text-[11.5px] font-mono border border-border rounded bg-surface-subtle text-on-surface-muted hover:text-on-surface hover:bg-surface-raised transition-colors no-underline"
                  >
                    {tool.playRef}
                  </Link>
                  <span className="ml-auto font-mono text-[12px] text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    Open →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
