import type { Metadata } from 'next'
import { PromptBox } from '@/components/site/PromptBox'
import { EntryHeader, Section, listClass } from '@/components/site/EntryPage'
import { SequenceOutline } from '@/components/site/WorkflowOutline'
import { promptOptions } from '@/lib/content/prompts'

export const metadata: Metadata = {
  title: 'Start a design system',
  description: 'Your agent reads your project, shows you options, and builds checked foundations, stopping for your approval.',
}

export default function StartPage() {
  const start = promptOptions().suggestions.find(o => o.id === 'workflow.start')!
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Start a design system" raw="/raw/workflows/start"
        lead="Your agent reads your project, asks what it needs, shows you options for the look, and builds the foundations. It stops twice for your approval." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><PromptBox single={start} /></div>
      </div>
      <Section title="What happens" raised>
        <SequenceOutline id="workflow.start" />
        <p className="text-body-sm text-on-surface-muted mt-6 mb-0">Afterward, the agent offers to continue to the components.</p>
      </Section>
      <Section title="What you’ll be asked">
        <ul className={listClass}>
          <li>What the product is, and who uses it to do what.</li>
          <li>Whether the interface is dense, balanced, or sparse.</li>
          <li>Light theme, dark theme, or both.</li>
          <li>Web, mobile, or both, and roughly how large the system will be.</li>
          <li>Which accessibility standard it must meet. The agent helps you choose; WCAG 2.2 AA fits most web products.</li>
          <li>Then, with options shown on a screen like yours, using your words: how much color, which grays, how round, how panels separate, and which typeface.</li>
        </ul>
      </Section>
      <Section title="If something goes wrong" raised>
        <ul className={listClass}>
          <li>If the session ends, start a new one in the same folder. The agent picks up from <code>sistema.json</code>.</li>
          <li>If the agent loses track of Sistema, paste the prompt again.</li>
          <li>If you don’t know an answer yet, say so. The agent marks it as open and continues.</li>
        </ul>
      </Section>
    </main>
  )
}
