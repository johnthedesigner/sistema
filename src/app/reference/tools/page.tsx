import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'
import { stateSchemaUrl, TOOL_DOCS } from '@/lib/content/render'
import { AgentNote, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Tool APIs',
  description: 'How agents call Sistema’s palette and contrast tools, and where the sistema.json schema lives.',
}

const PAGES: Record<string, string> = { palette: '/tools/palette', contrast: '/tools/contrast', type_scale: '/tools/type-scale', specimen: '/tools/specimen' }

export default function ToolsReferencePage() {
  return (
    <main>
      <Container>
        <AgentNote />
        <PageHeader
          eyebrow="Reference"
          title="Tool APIs"
          lead="Plays tell agents to calculate rather than estimate. These are the calls they make. Each tool also has a page you can use yourself."
        />
        <div className="flex flex-col gap-4 max-w-[860px]">
          {Object.entries(TOOL_DOCS).map(([name, doc]) => (
            <section key={name} id={name} className=" rounded-radius-lg p-4 bg-surface-raised">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h2 className="text-[16px] font-semibold m-0">{doc.title}</h2>
                <Link href={PAGES[name]} className="text-[12.5px] text-primary">Open the tool</Link>
              </div>
              <pre className="font-mono text-[12px] leading-[1.6] bg-surface-subtle rounded-radius-md p-3 m-0 overflow-x-auto whitespace-pre-wrap">{doc.usage(SITE_URL)}</pre>
            </section>
          ))}
          <section className=" rounded-radius-lg p-4 bg-surface-raised">
            <h2 className="text-[16px] font-semibold m-0 mb-2">sistema.json schema</h2>
            <p className="text-[13px] text-on-surface-muted m-0 mb-2">The JSON Schema agents check sistema.json against before ending a session.</p>
            <pre className="font-mono text-[12px] bg-surface-subtle rounded-radius-md p-3 m-0 overflow-x-auto">{stateSchemaUrl(SITE_URL)}</pre>
          </section>
        </div>
      </Container>
    </main>
  )
}
