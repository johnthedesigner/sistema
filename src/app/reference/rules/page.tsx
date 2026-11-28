import type { Metadata } from 'next'
import Link from 'next/link'
import { catalog, opinionHref, playHref, TOPIC_LABELS } from '@/lib/content/site'
import type { Topic } from '@/lib/content/schema'
import { Chip, Inline } from '@/components/site/ui'
import { DocPage, DocSection } from '@/components/site/DocPage'
import { CountLabel, TOPIC_ICONS } from '@/components/site/icons'

export const metadata: Metadata = {
  title: 'Rules',
  description: 'The checkable requirements Sistema plays apply, with values for each accessibility standard.',
}

export default function RulesPage() {
  const c = catalog()
  const topics = (Object.keys(TOPIC_LABELS) as Topic[]).filter(t => c.rules.some(r => r.id.startsWith(`${t}.`)))
  const inTopic = (t: Topic) => c.rules.filter(r => r.id.startsWith(`${t}.`)).sort((a, b) => a.id.localeCompare(b.id))
  const citedBy = (id: string) => c.plays.filter(p => p.rules.includes(id))
  const opinionsFor = (id: string) => c.opinions.filter(o => o.rules.includes(id))
  return (
    <DocPage
      crumbs={[{ label: 'Reference', href: '/reference' }, { label: 'Rules' }]}
      raw="/raw/rules"
      eyebrow={<CountLabel kind="rule" count={c.rules.length} label="rules" />}
      title="The rules plays apply"
      lead="Required rules must pass before a play is done. Advisory rules raise a flag and suggest a fix. Where a value depends on your accessibility standard, the rule lists it for each one, and the agent uses the standard recorded in sistema.json."
      toc={topics.map(t => ({ id: t, text: TOPIC_LABELS[t], icon: TOPIC_ICONS[t], count: inTopic(t).length }))}
    >
      {topics.map(t => (
        <DocSection key={t} id={t} title={TOPIC_LABELS[t]} icon={TOPIC_ICONS[t]}>
          <ul className="list-none m-0 p-0 rounded-radius-lg bg-surface-raised divide-y divide-border">
            {inTopic(t).map(r => (
              <li key={r.id} id={r.id} className="p-5 scroll-mt-24">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <code className="font-mono text-code text-on-surface">{r.id}</code>
                  <Chip>{r.severity === 'blocking' ? 'required' : 'advisory'}</Chip>
                  <Chip>{r.layer === 'standard' ? 'from your standard' : r.layer === 'project' ? 'project' : 'Sistema default'}</Chip>
                </div>
                <p className="text-body text-on-surface m-0"><Inline text={r.statement} /></p>
                <p className="text-body-sm text-on-surface-muted m-0 mt-2">Why: <Inline text={r.reason} /></p>
                {r.applies_when && <p className="text-body-sm text-on-surface-muted m-0 mt-2">Applies when: <Inline text={r.applies_when} /></p>}
                {r.parameters && (
                  <div className="overflow-x-auto mt-3">
                    <table className="text-body-sm border-collapse">
                      <tbody>
                        {Object.entries(r.parameters).map(([std, levels]) => (
                          <tr key={std}>
                            <td className="pr-4 py-1 font-mono text-caption text-on-surface-muted">{std}</td>
                            {Object.entries(levels).map(([lvl, v]) => (
                              <td key={lvl} className="pr-4 py-1 tabular-nums">
                                {lvl} <strong className="text-on-surface">{v}</strong>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {(citedBy(r.id).length > 0 || opinionsFor(r.id).length > 0) && (
                  <p className="text-caption text-on-surface-faint m-0 mt-3">
                    {citedBy(r.id).length > 0 && (
                      <>
                        Used by{' '}
                        {citedBy(r.id).map((p, i) => (
                          <span key={p.id}>
                            {i > 0 && ', '}
                            <Link href={playHref(p.id)} className="text-on-surface-muted">{p.title}</Link>
                          </span>
                        ))}
                        .{' '}
                      </>
                    )}
                    {opinionsFor(r.id).map(o => (
                      <span key={o.id}>
                        Opinion: <Link href={opinionHref(o.id)} className="text-on-surface-muted">{o.title}</Link>.{' '}
                      </span>
                    ))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </DocSection>
      ))}
    </DocPage>
  )
}
