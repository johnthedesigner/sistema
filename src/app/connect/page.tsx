import type { Metadata } from 'next'
import { ConnectClients } from '@/components/site/ConnectClients'
import { EntryHeader, Section, listClass } from '@/components/site/EntryPage'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  title: 'Connect the MCP server',
  description: 'Use Sistema as an MCP server: the same workflows, guides, and tools as the prompts, in any client that supports MCP.',
}

export default function ConnectPage() {
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Connect the MCP server" raw="/raw/agents"
        lead="The same workflows, guides, and tools as the copied prompts, available inside your agent. Add the server once, then ask your agent to start." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><ConnectClients base={SITE_URL} /></div>
      </div>
      <Section title="Then ask your agent" raised>
        <ul className={listClass}>
          <li>“Start a design system with Sistema.” The agent uses the server’s <code>start</code> prompt and follows it, as with the copied prompt.</li>
          <li>In Claude Code, the workflows also appear as commands: <code>/mcp__sistema__start</code>, <code>/mcp__sistema__patterns</code>, and <code>/mcp__sistema__session</code>.</li>
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
    </main>
  )
}
