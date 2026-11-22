import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'
import { ContrastChecker } from '@/components/contrast/ContrastChecker'
import { contrastTable } from '@/lib/tools/contrast'

export const metadata: Metadata = {
  title: 'Contrast checker',
  description: 'Check the contrast between two colors against WCAG 2.2, WCAG 2.1, Section 508, or EN 301 549, using the same rules Sistema plays check.',
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
              className="text-on-surface-muted m-0"
              style={{ fontSize: 15, lineHeight: 1.55 }}
            >
              Check any foreground and background pair against the standard your project follows. The required values come from Sistema&apos;s rules. The{' '}
              <Link href="/plays/color.scheme" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-subtle">
                color.scheme
              </Link>
              {' '}and{' '}
              <Link href="/plays/accessibility.audit" className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-subtle">
                accessibility.audit
              </Link>
              {' '}plays run the same checks through <span className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface break-all">GET {SITE_URL}/api/contrast</span>.
            </p>
          </div>

          <ContrastChecker table={contrastTable()} />

        </div>
      </div>
    </main>
  )
}
