import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tools — Sistema',
  description: 'Computational tools for design system work — palette generation, contrast checking, and more.',
  robots: { index: false, follow: false },
}

const TOOLS = [
  {
    slug: 'palette',
    href: '/tools/palette',
    title: 'Palette generator',
    description: 'Generate 19-stop OKLCH color ramps from any seed hex. The same algorithm the generate-color-scheme play uses via /api/palette. Export as CSS variables, Tailwind config, or Figma Variables.',
    playRef: 'generate-color-scheme',
    api: '/api/palette',
  },
  {
    slug: 'contrast',
    href: '/tools/contrast',
    title: 'Contrast checker',
    description: 'Check any foreground/background pair against WCAG 2.2 AA and AAA thresholds. The same calculation plays use to verify semantic role pairings — available as /api/contrast for use directly in your prompts.',
    playRef: 'accessibility-audit',
    api: '/api/contrast',
  },
  {
    slug: 'type-scale',
    href: '/tools/type-scale',
    title: 'Type scale calculator',
    description: 'Explore modular type scales — pick a base size and ratio to see how sizes distribute from caption to display. Use the output to inform your typography direction when running generate-type-scale.',
    playRef: 'generate-type-scale',
    api: null,
  },
]

export default function ToolsPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-20">

        <div className="mb-9">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            Tools · {TOOLS.length} available
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3 text-[26px] md:text-[36px]"
            style={{ lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 720 }}
          >
            Computational tools for design system work.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0"
            style={{ maxWidth: 620, fontSize: 15, lineHeight: 1.55 }}
          >
            Each tool has a human-facing interface. Two also expose a machine-facing API endpoint that plays can call directly —
            replacing AI-estimated values with exact calculations.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {TOOLS.map(tool => (
            <div key={tool.slug} className="relative border border-border rounded-radius-lg bg-surface group">
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
                    <div className="flex items-center gap-2 shrink-0 pointer-events-auto">
                      <span className="font-mono text-[11px] text-on-surface-muted bg-surface-sunken border border-border px-2 py-0.5 rounded">
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
                    href={`/playbooks/${tool.playRef}`}
                    className="pointer-events-auto inline-flex items-center h-[26px] px-2.5 text-[11.5px] font-mono border border-border rounded bg-surface-sunken text-on-surface-muted hover:text-on-surface hover:bg-surface transition-colors no-underline"
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
