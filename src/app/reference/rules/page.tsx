import type { Metadata } from 'next'
import Link from 'next/link'
import { catalog, opinionHref, playHref, TOPIC_LABELS } from '@/lib/content/site'
import type { Topic } from '@/lib/content/schema'
import { AgentNote, Chip, Container, Inline, PageHeader } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Rules',
  description: 'The checkable requirements Sistema plays apply, with values for each accessibility standard.',
}

export default function RulesPage() {
  const c = catalog()
  const topics = (Object.keys(TOPIC_LABELS) as Topic[]).filter(t => c.rules.some(r => r.id.startsWith(`${t}.`)))
  const citedBy = (id: string) => c.plays.filter(p => p.rules.includes(id))
  const opinionsFor = (id: string) => c.opinions.filter(o => o.rules.includes(id))
  return (
    <main>
      <Container>
        <AgentNote raw="/raw/rules" />
        <PageHeader
          eyebrow={`Reference · ${c.rules.length} rules`}
          title="The rules plays apply"
          lead="Required rules must pass before a play is done. Advisory rules raise a flag and suggest a fix. Where a value depends on your accessibility standard, the rule lists it for each one, and the agent uses the standard recorded in sistema.json."
        >
          <div className="flex gap-2 flex-wrap mt-5">
            {topics.map(t => (
              <a key={t} href={`#${t}`} className="inline-flex items-center h-[28px] px-3 rounded-full border border-border bg-surface-raised text-[12.5px] text-on-surface no-underline hover:border-border-strong">
                {TOPIC_LABELS[t]}
              </a>
            ))}
          </div>
        </PageHeader>

        <div className="flex flex-col gap-10">
          {topics.map(t => (
            <section key={t} id={t} className="scroll-mt-24">
              <div className="flex items-center gap-3.5 mb-3">
                <h2 className="text-[15px] font-semibold text-on-surface m-0">{TOPIC_LABELS[t]}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex flex-col gap-2.5">
                {c.rules
                  .filter(r => r.id.startsWith(`${t}.`))
                  .map(r => (
                    <div key={r.id} id={r.id} className=" rounded-radius-lg p-4 bg-surface-raised scroll-mt-24">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <code className="font-mono text-[12.5px] text-on-surface">{r.id}</code>
                        <Chip>{r.severity === 'blocking' ? 'required' : 'advisory'}</Chip>
                        <Chip>{r.layer === 'standard' ? 'from your standard' : r.layer === 'project' ? 'project' : 'Sistema default'}</Chip>
                      </div>
                      <p className="text-[14px] text-on-surface m-0 leading-[1.5]"><Inline text={r.statement} /></p>
                      <p className="text-[13px] text-on-surface-muted m-0 mt-1.5 leading-[1.5]">Why: <Inline text={r.reason} /></p>
                      {r.applies_when && <p className="text-[13px] text-on-surface-muted m-0 mt-1.5 leading-[1.5]">Applies when: <Inline text={r.applies_when} /></p>}
                      {r.parameters && (
                        <div className="overflow-x-auto mt-3">
                          <table className="text-[12.5px] border-collapse">
                            <tbody>
                              {Object.entries(r.parameters).map(([std, levels]) => (
                                <tr key={std}>
                                  <td className="pr-4 py-1 font-mono text-on-surface-muted">{std}</td>
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
                        <p className="text-[12px] text-on-surface-faint m-0 mt-3 leading-[1.6]">
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
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
