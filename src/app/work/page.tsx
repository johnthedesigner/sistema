import type { Metadata } from 'next'
import { PromptBox } from '@/components/site/PromptBox'
import { EntryHeader, Section } from '@/components/site/EntryPage'
import { RoutesOutline } from '@/components/site/WorkflowOutline'
import { promptOptions } from '@/lib/content/prompts'

export const metadata: Metadata = {
  title: 'Work on my system',
  description: 'Day-to-day work on a design system: add a component or theme, audit, review, and plan.',
}

export default function WorkPage() {
  const { suggestions, routes } = promptOptions()
  const work = suggestions.find(o => o.id === 'workflow.session')!
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Work on my system" raw="/raw/workflows/session"
        lead="Each session starts by reading where the system stands and confirming what you want to do. Pick what you want, fill in the line, and copy the prompt." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><PromptBox suggestions={[work]} routes={routes} initial="workflow.session" /></div>
      </div>
      <Section title="What each one does" raised>
        <RoutesOutline id="workflow.session" />
        <p className="text-body-sm text-on-surface-muted mt-6 mb-0">After you’ve started a design system, the note in your agent instructions file already points your agent here.</p>
      </Section>
    </main>
  )
}
