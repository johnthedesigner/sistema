import type { Metadata } from 'next'
import Link from 'next/link'
import { TypeScaleCalculator } from '@/components/type-scale/TypeScaleCalculator'

export const metadata: Metadata = {
  title: 'Type scale calculator',
  robots: { index: false, follow: false },
}

export default function TypeScalePage() {
  return (
    <main>
      <div className="max-w-[900px] mx-auto px-5 md:px-10 pt-8 md:pt-10 pb-20">
        <div className="mb-8">
          <p className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-on-surface-muted mb-2.5">
            <Link href="/tools" className="hover:text-on-surface transition-colors no-underline">Tools</Link>
            {' · '}Type Scale
          </p>
          <h1
            className="font-serif font-medium text-on-surface m-0 mb-3"
            style={{ fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Type scale calculator.
          </h1>
          <p
            className="text-on-surface-muted font-serif font-normal m-0 max-w-xl"
            style={{ fontSize: 15, lineHeight: 1.55 }}
          >
            Pick a base size and ratio to explore how a modular scale distributes across sizes.
            Use these values to inform the{' '}
            <Link
              href="/plays/typography.scale"
              className="font-mono text-[13px] bg-surface-raised border border-border rounded px-1.5 py-0.5 text-on-surface no-underline hover:bg-surface-sunken"
            >
              typography.scale
            </Link>{' '}
            play, which calls the same calculation and then sets weights, letter spacing, and roles.
          </p>
        </div>

        <TypeScaleCalculator />
      </div>
    </main>
  )
}
