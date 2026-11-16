import type { Metadata } from 'next'
import { loadCatalog } from '@/lib/content/load'
import { renderAgents } from '@/lib/content/render-reference'
import { SITE_URL } from '@/lib/site-url'
import { Markdown } from '@/components/site/Markdown'
import { AgentNote, Container, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'For agents',
  description: 'How AI coding agents should use Sistema: where to start, how to resume, and how to call the tools.',
}

export default function AgentsPage() {
  const text = renderAgents(loadCatalog(), SITE_URL).replace(/^# .*\n+/, '')
  return (
    <main>
      <Container>
        <AgentNote raw="/raw/agents" />
        <PageHeader
          eyebrow="For agents"
          title="Sistema, for agents"
          lead="This page is written for AI coding agents. People can read it too: it's exactly what your agent sees."
        />
        <div className="max-w-[820px]">
          <Markdown>{text}</Markdown>
        </div>
      </Container>
    </main>
  )
}
