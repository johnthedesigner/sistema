import type { Metadata } from 'next'
import Link from 'next/link'
import { catalog, playHref } from '@/lib/content/site'
import type { ToolName } from '@/lib/content/schema'
import { AgentNote, Container, PageHeader } from '@/components/site/ui'
import { CountLabel, IconBadge, TOOL_ICONS } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'The tools Sistema\'s plays call so agents calculate instead of guessing: palette, contrast, type scale, specimen, token validator, and dark mode mapping.',
  robots: { index: false, follow: false },
}

const NAMES: Record<string, ToolName> = { palette: 'palette', contrast: 'contrast', 'type-scale': 'type_scale', specimen: 'specimen', validate: 'validate', 'dark-mode': 'dark_mode' }

const TOOLS = [
  {
    slug: 'palette',
    href: '/tools/palette',
    title: 'Palette generator',
    description: 'Generate 19-stop OKLCH color ramps from any seed hex. The same algorithm the color scheme play uses through the palette API. Export as CSS variables, Tailwind config, or Figma Variables.',
  },
  {
    slug: 'contrast',
    href: '/tools/contrast',
    title: 'Contrast checker',
    description: 'Check any foreground and background pair against the accessibility standard your project follows, using the same rules plays check. Also an API that checks many pairs at once.',
  },
  {
    slug: 'type-scale',
    href: '/tools/type-scale',
    title: 'Type scale calculator',
    description: 'Pick a base size and ratio to see how sizes distribute, with a suggested line height for each and the step names your component library uses. The same calculation the type scale play gets from the API.',
  },
  {
    slug: 'specimen',
    href: '/tools/specimen',
    title: 'Specimen',
    description: 'See how a few visual choices (color presence, warmth, roundness, how panels separate, density, typeface, theme) change a whole product screen, with every option of one choice side by side.',
  },
  {
    slug: 'validate',
    href: '/tools/validate',
    title: 'Token validator',
    description: "Check DTCG token files against Sistema's rules: the format and aliases, the required color roles, contrast for every pair in every theme, mode files, line heights, and the spacing scale.",
  },
  {
    slug: 'dark-mode',
    href: '/tools/dark-mode',
    title: 'Dark mode mapping',
    description: 'Propose a dark theme from your light color roles, as the color guide describes, with every pair checked in both themes and a passing stop suggested for each failure.',
  },
]

export default function ToolsPage() {
  const { plays } = catalog()
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow={<CountLabel kind="tool" count={TOOLS.length} label="tools" />}
          title="The tools Sistema's plays call"
          lead="Agents guess at numbers like contrast ratios and ramp stops. Sistema's plays send those questions to these tools instead, and every required value comes from the rules for your accessibility standard. Each page shows what a tool does and why, with a demonstration you can try."
        />
        <div className="grid gap-4 md:grid-cols-2 pb-8">
          {TOOLS.map(tool => {
            const users = plays.filter(p => p.tools.includes(NAMES[tool.slug])).sort((a, b) => a.title.localeCompare(b.title))
            return (
              <div key={tool.slug} className="relative rounded-radius-xl bg-surface-raised p-5 md:p-6 hover:bg-surface-hover transition-colors motion-reduce:transition-none">
                <IconBadge icon={TOOL_ICONS[NAMES[tool.slug]]} />
                <h2 className="text-heading-sm font-serif m-0 mt-4">
                  <Link href={tool.href} className="no-underline text-on-surface after:absolute after:inset-0 after:rounded-radius-xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-border-focus">{tool.title}</Link>
                </h2>
                <p className="text-body-sm text-on-surface-muted mt-2 mb-0">{tool.description}</p>
                {users.length > 0 && (
                  <div className="relative mt-4 flex flex-wrap items-center gap-1.5">
                    <span className="text-caption text-on-surface-faint mr-1">Used by</span>
                    {users.map(p => (
                      <Link key={p.id} href={playHref(p.id)} className="relative z-10 inline-flex items-center h-6 px-2.5 rounded-radius-full bg-surface text-caption text-on-surface no-underline hover:bg-primary-container hover:text-on-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-border-focus">{p.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </main>
  )
}
