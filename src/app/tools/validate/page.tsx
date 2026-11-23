import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, PageHeader } from '@/components/site/ui'
import { TokenValidator } from '@/components/tools/TokenValidator'
import { siteTokenFiles, standardOptions } from '@/lib/tools/example-tokens'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'Token validator',
  description: "Check DTCG token files against Sistema's rules: format and aliases, required color roles, contrast in every theme, mode files, line heights, and the spacing scale.",
  robots: { index: false, follow: false },
}

export default function ValidatePage() {
  return (
    <main>
      <Container>
        <PageHeader
          eyebrow={<><Link href="/tools" className="no-underline text-on-surface-faint hover:text-on-surface">Tools</Link> · Token validator</>}
          title="Check your token files."
          lead={<>Every check comes from Sistema&apos;s rules, for the standard you choose: the DTCG format and aliases, the required color roles, contrast for every pair the roles imply in every theme, mode files, dark surface steps, visible states, line heights, and the spacing scale. The <Link href="/plays/tokens.pipeline" className="text-link">pipeline</Link> and <Link href="/plays/color.scheme" className="text-link">color</Link> plays call it before compiling.</>}
        />
        <div className="max-w-[880px] pb-20">
          <TokenValidator example={siteTokenFiles()} standards={standardOptions()} />
          <p className="text-body-sm text-on-surface-muted mt-10 mb-0">
            Agents use the API: <code className="font-mono text-caption">POST {SITE_URL}/api/validate</code> with <code className="font-mono text-caption">{'{"files": {...}, "standard": "wcag-2.2 AA"}'}</code>. See <Link href="/reference/tools#validate" className="text-link">the tool reference</Link>.
          </p>
        </div>
      </Container>
    </main>
  )
}
