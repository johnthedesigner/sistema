import type { Metadata } from 'next'
import { PromptBox } from '@/components/site/PromptBox'
import { EntryHeader, Section, listClass } from '@/components/site/EntryPage'
import { promptOptions } from '@/lib/content/prompts'

export const metadata: Metadata = {
  title: 'Audit what you have',
  description: 'For a product that already has a look, a theme, or a design system: see what’s consistent, what fails, and what’s missing, before anything changes.',
}

export default function AuditPage() {
  const audit = promptOptions().suggestions.find(o => o.id === 'workflow.audit')!
  return (
    <main>
      <EntryHeader eyebrow="Get started" title="Audit what you have" raw="/raw/workflows/audit"
        lead="For a product that already has a look, a theme file, or a design system. Your agent takes stock and reports back. Nothing in your code changes until you choose what happens next." />
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-4">
        <div className="max-w-[760px]"><PromptBox single={audit} /></div>
      </div>
      <Section title="What it looks at" raised>
        <p className="text-body text-on-surface-muted mt-0">Whatever form your system takes: a Tailwind theme, CSS variables, SCSS, token files, and the components and pages that use them. It counts every color, size, and spacing value in use, and where.</p>
      </Section>
      <Section title="What you get">
        <ul className={listClass}>
          <li>What’s consistent and worth keeping.</li>
          <li>What’s inconsistent: near-duplicates, the same job done different ways, values typed straight into components.</li>
          <li>What fails: contrast against your accessibility standard, with every ratio.</li>
          <li>What’s missing: roles, states, a dark theme, a scale.</li>
          <li>A page in your browser that shows it all, and a recommendation.</li>
        </ul>
      </Section>
      <Section title="Then you choose" raised>
        <ul className={listClass}>
          <li><strong className="font-medium text-on-surface">Bring it into Sistema.</strong> The start workflow continues from the audit and keeps what’s consistent. Your existing colors stay exactly as they are unless you choose otherwise.</li>
          <li><strong className="font-medium text-on-surface">Fix specific findings.</strong> Each one comes with the Sistema route that does it.</li>
          <li><strong className="font-medium text-on-surface">Stop here.</strong> The report is yours either way.</li>
        </ul>
      </Section>
    </main>
  )
}
