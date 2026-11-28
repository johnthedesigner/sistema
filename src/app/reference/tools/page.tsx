import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL } from '@/lib/site-url'
import { stateSchemaUrl, TOOL_DOCS } from '@/lib/content/render'
import type { ToolName } from '@/lib/content/schema'
import { DocPage, DocSection } from '@/components/site/DocPage'
import { CountLabel, KIND_ICONS, TOOL_ICONS } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Tool APIs',
  description: 'How agents call Sistema’s tools, and where the sistema.json schema lives.',
}

const PAGES: Record<ToolName, string> = { palette: '/tools/palette', contrast: '/tools/contrast', type_scale: '/tools/type-scale', specimen: '/tools/specimen', validate: '/tools/validate', dark_mode: '/tools/dark-mode' }

export default function ToolsReferencePage() {
  const tools = Object.entries(TOOL_DOCS) as Array<[ToolName, (typeof TOOL_DOCS)[ToolName]]>
  return (
    <DocPage
      crumbs={[{ label: 'Reference', href: '/reference' }, { label: 'Tool APIs' }]}
      eyebrow={<CountLabel kind="tool" count={tools.length} label="tools" />}
      title="Tool APIs"
      lead="Plays tell agents to calculate rather than estimate. These are the calls they make, exactly as the plays give them. Each tool also has a page that shows what it does."
      toc={[...tools.map(([name, doc]) => ({ id: name, text: doc.title, icon: TOOL_ICONS[name] })), { id: 'schema', text: 'sistema.json schema', icon: KIND_ICONS.file }]}
    >
      {tools.map(([name, doc]) => (
        <DocSection key={name} id={name} title={doc.title} icon={TOOL_ICONS[name]} intro={<Link href={PAGES[name]} className="text-link">See the {doc.title.toLowerCase()} page</Link>}>
          <pre className="font-mono text-code bg-surface-raised rounded-radius-lg p-4 m-0 overflow-x-auto whitespace-pre-wrap text-on-surface">{doc.usage(SITE_URL)}</pre>
        </DocSection>
      ))}
      <DocSection id="schema" title="sistema.json schema" icon={KIND_ICONS.file} intro="The JSON Schema agents check sistema.json against before ending a session.">
        <pre className="font-mono text-code bg-surface-raised rounded-radius-lg p-4 m-0 overflow-x-auto text-on-surface">{stateSchemaUrl(SITE_URL)}</pre>
      </DocSection>
    </DocPage>
  )
}
