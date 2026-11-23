import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, PageHeader } from '@/components/site/ui'
import { DarkModeMapper } from '@/components/tools/DarkModeMapper'
import { siteTokenFiles, standardOptions } from '@/lib/tools/example-tokens'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'Dark mode mapping',
  description: 'Propose a dark theme from your light color roles, as the color guide describes, with every pair checked in both themes and a passing stop suggested for each failure.',
  robots: { index: false, follow: false },
}

export default function DarkModePage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow={<><Link href="/tools" className="no-underline text-on-surface-faint hover:text-on-surface">Tools</Link> · Dark mode mapping</>}
          title="A dark theme from your light one."
          lead={<>Surfaces step one stop at a time from the dark end, text and fills take the mirrored stop, and brand surfaces keep theirs, as <Link href="/guides/color/architecture#stops-in-a-dark-theme" className="text-link">the color guide</Link> describes. Every pair is checked in both themes, and each failure gets the nearest stop that passes. It&apos;s a starting point: choose by eye where the numbers allow.</>}
        />
        <div className="max-w-[880px] pb-20">
          <DarkModeMapper example={siteTokenFiles(['color.json', 'palette.json'])} standards={standardOptions()} />
          <p className="text-body-sm text-on-surface-muted mt-10 mb-0">
            Agents use the API: <code className="font-mono text-caption">POST {SITE_URL}/api/dark-mode</code> with <code className="font-mono text-caption">{'{"files": {"color.json": {...}, "palette.json": {...}}}'}</code>. See <Link href="/reference/tools#dark_mode" className="text-link">the tool reference</Link>.
          </p>
        </div>
      </Container>
    </main>
  )
}
