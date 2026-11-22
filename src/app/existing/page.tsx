import type { Metadata } from 'next'
import { PromptBox } from '@/components/site/PromptBox'
import { EntryHeader, Section, listClass } from '@/components/site/EntryPage'
import { promptOptions } from '@/lib/content/prompts'

export const metadata: Metadata = {
  title: 'Bring Sistema to an existing system',
  description: 'The same prompt as starting fresh. It finds what you have, keeps it, and fills the gaps, with your choice at every change.',
}

export default function ExistingPage() {
  const start = promptOptions().suggestions.find(o => o.id === 'workflow.start')!
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Bring Sistema to an existing system" raw="/raw/workflows/start"
        lead="Use the same prompt as starting fresh. Nothing you have is renamed, moved, or replaced without your choice." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><PromptBox single={start} /></div>
      </div>
      <Section title="It starts by finding what you have" raised>
        <p className="text-body text-on-surface-muted mt-0">It looks for a Tailwind theme, CSS variables, SCSS, token files, and the components that use them, and sorts each piece:</p>
        <ul className={listClass}>
          <li>already in Sistema’s format;</li>
          <li>present, but in another format;</li>
          <li>missing.</li>
        </ul>
        <p className="text-body text-on-surface-muted mb-0">Work that’s already done is skipped.</p>
      </Section>
      <Section title="Your existing colors">
        <p className="text-body text-on-surface-muted mt-0">Before mapping anything, the agent shows your colors as ramps, flags anything uneven, and offers options for each color:</p>
        <ul className={listClass}>
          <li><b className="text-on-surface font-medium">Keep exactly.</b> Only your colors; gaps and contrast problems are listed for you to decide.</li>
          <li><b className="text-on-surface font-medium">Keep and complete.</b> Your colors stay where they fit; the rest of each ramp is generated around them.</li>
          <li><b className="text-on-surface font-medium">Regenerate.</b> Your colors become seeds for new, even ramps.</li>
        </ul>
        <p className="text-body text-on-surface-muted mb-0">You can choose differently for each color.</p>
      </Section>
    </main>
  )
}
