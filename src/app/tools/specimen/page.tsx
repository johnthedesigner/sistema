import type { Metadata } from 'next'
import Link from 'next/link'
import { SpecimenTool } from '@/components/specimen/SpecimenTool'

export const metadata: Metadata = {
  title: 'Specimen',
  description: 'See how a few visual choices change a whole product screen, one choice at a time.',
  robots: { index: false, follow: false },
}

export default function SpecimenPage() {
  return (
    <main>
      <div className="max-w-[1480px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="mb-8 max-w-[760px]">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            <Link href="/tools" className="hover:text-on-surface transition-colors no-underline">Tools</Link>
            {' · '}Specimen
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3"
            style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            See a choice before you make it.
          </h1>
          <p className="text-on-surface-muted font-serif font-normal m-0" style={{ fontSize: 15, lineHeight: 1.55 }}>
            The same product screen, rendered from a few visual choices with Sistema&apos;s craft baseline applied: quiet panels,
            one featured item that stands out, a block of brand color, and borders only where they show what can be clicked or typed in.
            Pick a choice to compare and every option appears side by side. The{' '}
            <Link
              href="/plays/visual-language.direction"
              className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken"
            >
              visual-language.direction
            </Link>{' '}
            play uses the same tool, with the product&apos;s own content.
          </p>
        </div>
        <SpecimenTool />
      </div>
    </main>
  )
}
