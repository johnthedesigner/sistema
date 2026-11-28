import type { Metadata } from 'next'
import { PromptBox } from '@/components/site/PromptBox'
import { EntryHeader, Section } from '@/components/site/EntryPage'
import { RoutesOutline } from '@/components/site/WorkflowOutline'
import { DEFAULT_ROUTE, promptOptions } from '@/lib/content/prompts'

export const metadata: Metadata = {
  title: 'Update my system',
  description: 'Day-to-day work on a design system Sistema set up: document it, add a component, page, or theme, check it, and plan what comes next.',
}

export default function UpdatePage() {
  const { suggestions, routes } = promptOptions()
  const work = suggestions.find(o => o.id === 'workflow.session')!
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Update my system" raw="/raw/workflows/session"
        lead="Each session starts by reading where the system stands and confirming what you want to do. Pick what you want, fill in the line, and copy the prompt. If you're not sure, choose that, and your agent will suggest something." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><PromptBox suggestions={[work]} routes={routes} initial="workflow.session" defaultRoute={DEFAULT_ROUTE} /></div>
      </div>
      <Section title="What each one does" raised>
        <RoutesOutline id="workflow.session" />
        <p className="text-body-sm text-on-surface-muted mt-6 mb-0">After you’ve started a design system, the note in your agent instructions file already points your agent here.</p>
      </Section>
    </main>
  )
}
