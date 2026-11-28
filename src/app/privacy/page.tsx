import type { Metadata } from 'next'
import Link from 'next/link'
import { AgentNote, Container, PageHeader, SectionTitle } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Sistema records about how it is used, and what it never stores.',
}

const P = ({ children }: { children: React.ReactNode }) => <p className="text-body-sm text-on-surface m-0 mb-4">{children}</p>

export default function PrivacyPage() {
  return (
    <main>
      <Container>
        <AgentNote />
        <div className="max-w-[720px]">
          <PageHeader
            eyebrow="Privacy"
            title="Sistema counts how it's used, without tracking you"
            lead="Sistema records anonymous usage so it can see which workflows, plays, and tools help, and where people get stuck. It doesn't know who you are."
          />

          <SectionTitle>Nothing that identifies you is stored</SectionTitle>
          <P>
            The site sets no cookies. The only thing it writes to your browser&apos;s storage is your theme choice (system, light, or
            dark), if you pick one in the footer, so it stays the same when you come back. Each visit gets a random ID that lives only in
            the open page. When you reload or close the tab, it&apos;s gone, so one visit is never linked to another.
          </P>

          <SectionTitle>The ID travels with a copied prompt</SectionTitle>
          <P>
            When you copy a prompt, its Sistema links carry that visit&apos;s ID as <code className="font-mono text-body-sm">c</code>. When your
            agent fetches those links, Sistema can count how far the workflow got and which tools it called. The agent records the ID in
            your project&apos;s <code className="font-mono text-body-sm">sistema.json</code> as <code className="font-mono text-body-sm">telemetry.id</code>,
            so later sessions on that project count toward the same run. It&apos;s in your repository, where you can see it.
          </P>

          <SectionTitle>What is recorded</SectionTitle>
          <ul className="text-body-sm text-on-surface m-0 mb-4 pl-5 list-disc">
            <li>Pages viewed on the site, where visitors came from, and which prompts were copied.</li>
            <li>Which plays, workflows, and guides agents fetch, and which kind of agent fetched them (for example Claude or Cursor).</li>
            <li>Tool calls, including what was sent to the tools: colors, ratios, and role names. These describe a design system, not a person.</li>
            <li>Approximate location (country, region, and city).</li>
          </ul>

          <SectionTitle>What is never recorded</SectionTitle>
          <ul className="text-body-sm text-on-surface m-0 mb-4 pl-5 list-disc">
            <li>Your name, email, or any account. Sistema has no accounts.</li>
            <li>IP addresses. Location is worked out before the address is discarded.</li>
            <li>Your project&apos;s code, or anything your agent reads in your repository.</li>
            <li>Anything that links one visit to the site with another.</li>
          </ul>

          <SectionTitle>Where it goes</SectionTitle>
          <P>
            Usage events go to PostHog, an analytics service, and are used only to improve Sistema and to describe its use in aggregate, for
            example in a case study. Questions go to the{' '}
            <a href="https://github.com/johnthedesigner/sistema/issues" className="text-primary">issue tracker</a>.
            See also <Link href="/sources" className="text-primary">Sources</Link>.
          </P>
        </div>
      </Container>
    </main>
  )
}
