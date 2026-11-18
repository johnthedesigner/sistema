import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'
import { ContrastChecker } from '@/components/contrast/ContrastChecker'

export const metadata: Metadata = {
  title: 'Contrast Checker — Sistema Tools',
  description: 'Check WCAG 2.2 contrast ratios between any two colors. The same algorithm used by Sistema plays to verify semantic color role pairings.',
  robots: { index: false, follow: false },
}

export default function ContrastCheckerPage() {
  return (
    <main>
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="max-w-[720px]">

          <div className="mb-7">
            <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
              <Link href="/tools" className="hover:text-on-surface transition-colors no-underline">Tools</Link>
              {' · '}Contrast checker
            </p>
            <h1
              className="font-serif font-medium text-on-surface m-0 mb-3"
              style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              WCAG contrast, calculated exactly.
            </h1>
            <p
              className="text-on-surface-muted font-serif font-normal m-0"
              style={{ fontSize: 15, lineHeight: 1.55 }}
            >
              Check any foreground/background pair against WCAG 2.2 AA and AAA thresholds.
              The same calculation used by the{' '}
              <Link href="/plays/color.scheme" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken">
                color.scheme
              </Link>
              {' '}and{' '}
              <Link href="/plays/accessibility.audit" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken">
                accessibility.audit
              </Link>
              {' '}plays via <span className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface">GET {SITE_URL}/api/contrast</span>.
            </p>
          </div>

          <ContrastChecker />

        </div>
      </div>
    </main>
  )
}
