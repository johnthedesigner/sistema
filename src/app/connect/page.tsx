import type { Metadata } from 'next'
import { ConnectClients } from '@/components/site/ConnectClients'
import { EntryHeader, Section, listClass } from '@/components/site/EntryPage'
import { SITE_URL } from '@/lib/site-url'
import { loadCatalog } from '@/lib/content/load'
import { skillName } from '@/lib/content/render-skill'

export const metadata: Metadata = {
  title: 'Connect the MCP server',
  description: 'Use Sistema as an MCP server: the same workflows, guides, and tools as the prompts, in clients that support MCP.',
}

export default function ConnectPage() {
  const ORDER = ['workflow.start', 'workflow.patterns', 'workflow.session']
  const workflows = [...loadCatalog().workflows].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Connect the MCP server" raw="/raw/agents"
        lead="The same workflows, guides, and tools as the copied prompts, available inside your agent. Add the server once, then ask your agent to start." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><ConnectClients base={SITE_URL} /></div>
      </div>
      <Section title="Then ask your agent" raised>
        <ul className={listClass}>
          <li>“Start a design system with Sistema.” The agent calls the server’s <code>next_step</code> tool, which walks it through the workflow one step at a time. The prompt box’s “Use the MCP server” option gives you the exact words.</li>
          <li>Clients that list a server’s prompts show the workflows too. In Claude Code they are commands: <code>/mcp__sistema__start</code>, <code>/mcp__sistema__patterns</code>, and <code>/mcp__sistema__session</code>.</li>
          <li>Ask about anything: “What does Sistema say about dark mode surfaces?” uses the server’s search and read tools.</li>
        </ul>
      </Section>
      <Section title="What it offers">
        <ul className={listClass}>
          <li><b className="font-medium text-on-surface">Prompts:</b> one per workflow (start, patterns, session).</li>
          <li><b className="font-medium text-on-surface">Content tools:</b> search, read, and next step, which takes your project’s <code>sistema.json</code> and returns what to do next.</li>
          <li><b className="font-medium text-on-surface">Calculation tools:</b> palette, contrast, type scale, and specimen, the same as the APIs.</li>
        </ul>
        <p className="text-body-sm text-on-surface-muted mt-4 mb-0">The server can’t see your repository. Your agent reads and writes the project files; the server gives it procedures and calculations.</p>
      </Section>
      <Section title="Or install Agent Skills" raised>
        <p className="text-body text-on-surface-muted m-0 mb-4">Skills put the workflows inside your agent without a server. Each skill carries its workflow and plays, and calls the tools on this site. Unzip one into your project’s skills folder (<code>.claude/skills/</code> in Claude Code), then ask your agent to start.</p>
        <ul className={listClass}>
          {workflows.map(w => (
            <li key={w.id}>
              <a href={`/skills/${skillName(w.id)}.zip`} className="text-link" download>{skillName(w.id)}.zip</a>: {w.title}. {w.description}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  )
}
