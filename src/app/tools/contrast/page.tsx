import type { Metadata } from 'next'
import Link from 'next/link'
import { ContrastChecker } from '@/components/contrast/ContrastChecker'
import { ToolPage } from '@/components/tools/ToolPage'
import { contrastTable } from '@/lib/tools/contrast'
import { swatches } from '@/lib/tools/swatches'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'Contrast checker',
  description: 'How Sistema checks every color pair against your accessibility standard, with a demonstration you can try.',
  robots: { index: false, follow: false },
}

export default function ContrastPage() {
  return (
    <ToolPage
      tool="contrast"
      title="Contrast checker"
      lead="Every text color, icon, and control edge needs enough contrast with the surface under it. Sistema measures each pair with WCAG’s formula and judges it against the standard you chose, so no ratio is ever estimated."
      how="When a play builds or checks colors, it sends every pair that matters (each text role on each surface, in every theme) to this tool in one request, with the project’s standard. A pair that fails is moved to another stop and checked again before it’s written."
      limits={
        <>
          <p className="m-0">It measures with WCAG 2.x’s contrast formula, the one the listed standards use. APCA, a candidate for a future WCAG, models perception more closely and isn’t offered here; the <Link href="/guides/color/architecture#pairs-to-check" className="text-link">color guide</Link> explains the difference.</p>
          <p className="m-0">Colors must be opaque. Text over a translucent overlay or an image isn’t checked: work out the color it lands on first.</p>
          <p className="m-0">Large text follows WCAG’s definition (24px, or bold at 18.66px). The tool can’t see your type, so a play says which check applies to each pair.</p>
        </>
      }
      request={`POST ${SITE_URL}/api/contrast\n{"standard": "wcag-2.2 AA", "pairs": [{"foreground": "#1F2937", "background": "#FFFFFF", "label": "on-surface", "purpose": "text"}]}`}
    >
      <ContrastChecker
        table={contrastTable()}
        foregrounds={swatches([['neutral', 900], ['slate', 700], ['blue', 600], ['violet', 500], ['red', 600], ['green', 600], ['amber', 500], ['neutral', 400]])}
        backgrounds={swatches([['neutral', 50], ['stone', 100], ['blue', 100], ['amber', 100], ['neutral', 900], ['blue', 950], ['slate', 800], ['green', 50]])}
      />
    </ToolPage>
  )
}
