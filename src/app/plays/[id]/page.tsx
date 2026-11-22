import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PromptBox } from '@/components/site/PromptBox'
import { describeToken } from '@/lib/content/render'
import {
  catalog,
  guideHref,
  playHref,
  playPrompt,
  ruleHref,
  TOPIC_LABELS,
  workflowHref,
  workflowPlayIds,
  workflowsIncluding,
} from '@/lib/content/site'
import { AgentNote, Chip, Container, GITHUB_BLOB, Inline, MilestoneChip, RailBox, RailLink } from '@/components/site/ui'

export const dynamicParams = false

export function generateStaticParams() {
  return catalog().plays.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const play = catalog().playById.get((await params).id)
  return play ? { title: play.title, description: play.description } : {}
}

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const c = catalog()
  const play = c.playById.get(id)
  if (!play) notFound()

  const workflows = workflowsIncluding(id)
  const rules = play.rules.map(r => c.ruleById.get(r)).filter(r => r !== undefined)
  const guideRefs = play.knowledge.map(ref => {
    const [gid, section] = ref.split('#')
    const guide = c.guideById.get(gid)
    return { ref, title: guide?.title ?? gid, section }
  })

  return (
    <main>
      <Container>
        <nav className="flex items-center gap-2 text-[12.5px] text-on-surface-muted mb-4 flex-wrap">
          <Link href="/plays" className="no-underline text-on-surface-muted hover:text-on-surface">Plays</Link>
          <span className="text-on-surface-faint">/</span>
          <Link href={`/plays#${play.topic}`} className="no-underline text-on-surface-muted hover:text-on-surface">{TOPIC_LABELS[play.topic]}</Link>
          <span className="text-on-surface-faint">/</span>
          <span className="font-mono text-on-surface">{play.id}</span>
        </nav>
        <AgentNote raw={`/raw/plays/${play.id}`} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-10">
          <div className="min-w-0">
            <div className="flex gap-2 mb-3 flex-wrap">
              <MilestoneChip milestone={play.milestone} />
              <Chip>{play.kind}</Chip>
              {play.entry && <Chip>can start here</Chip>}
            </div>
            <h1 className="font-serif font-medium text-on-surface m-0 mb-3.5 text-[28px] md:text-[36px]" style={{ lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {play.title}
            </h1>
            <p className="text-on-surface-muted m-0 mb-2" style={{ fontSize: 16, lineHeight: 1.55, maxWidth: 640 }}>
              {play.description}
            </p>
            <p className="text-[12px] text-on-surface-faint m-0 mb-7">Last reviewed {play.last_reviewed}</p>

            <PromptBox single={{ id: play.id, kind: 'workflow', label: play.title, prompt: playPrompt(play.id) }} label={`Prompt for ${play.title}`} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <ContractList title="What it needs" items={play.requires.map(describeToken)} empty="Nothing. It can run first." />
              <ContractList title="What it produces" items={play.produces.map(describeToken)} empty="No files. It reports in the session." />
            </div>

            <div className="mt-6 rounded-radius-lg p-4 bg-surface-raised">
              <h2 className="text-[14px] font-semibold m-0 mb-1.5">What it shows before it&apos;s done</h2>
              <p className="text-[13.5px] text-on-surface-muted m-0 leading-[1.55]"><Inline text={play.evidence} /></p>
            </div>

            {rules.length > 0 && (
              <div className="mt-8">
                <h2 className="text-[15px] font-semibold m-0 mb-3">Rules it applies</h2>
                <ul className="m-0 p-0 list-none flex flex-col gap-2">
                  {rules.map(rule => (
                    <li key={rule.id} className="text-[13.5px] leading-[1.5]">
                      <Link href={ruleHref(rule.id)} className="font-mono text-[12.5px] text-primary no-underline">{rule.id}</Link>
                      <span className="text-on-surface-faint"> · {rule.severity === 'blocking' ? 'required' : 'advisory'}</span>
                      <br />
                      <span className="text-on-surface-muted"><Inline text={rule.statement} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {play.tools.length > 0 && (
              <p className="mt-6 text-[13px] text-on-surface-muted">
                Tools it uses: {play.tools.map(t => t.replace('_', ' ')).join(', ')}. See <Link href="/reference/tools" className="text-primary">tool details</Link>.
              </p>
            )}
          </div>

          <aside className="flex flex-col gap-3.5 md:sticky md:top-24 self-start min-w-0">
            {workflows.length > 0 && (
              <RailBox title="In these workflows">
                {workflows.map(w => {
                  const ids = workflowPlayIds(w)
                  const i = ids.indexOf(play.id)
                  const prev = w.sequence && i > 0 ? c.playById.get(ids[i - 1]) : undefined
                  const next = w.sequence && i < ids.length - 1 ? c.playById.get(ids[i + 1]) : undefined
                  return (
                    <div key={w.id} className="mb-2 last:mb-0">
                      <RailLink href={workflowHref(w.id)}>{w.title}</RailLink>
                      {(prev || next) && (
                        <p className="text-[11.5px] text-on-surface-faint m-0 mt-1 leading-[1.5]">
                          {prev && <>After <Link href={playHref(prev.id)} className="text-on-surface-muted">{prev.title}</Link>. </>}
                          {next && <>Before <Link href={playHref(next.id)} className="text-on-surface-muted">{next.title}</Link>.</>}
                        </p>
                      )}
                    </div>
                  )
                })}
              </RailBox>
            )}
            {guideRefs.length > 0 && (
              <RailBox title="Guide sections it cites">
                {guideRefs.map(g => (
                  <RailLink key={g.ref} href={guideHref(g.ref)}>
                    {g.title}
                    {g.section && <span className="block text-[11.5px] text-on-surface-faint font-mono truncate">#{g.section}</span>}
                  </RailLink>
                ))}
              </RailBox>
            )}
            <RailBox title="Running it">
              <p className="text-[12.5px] leading-[1.5] text-on-surface-muted m-0 mb-2">
                Plays work best inside a workflow, which reads your project state and keeps track of what&apos;s done.
              </p>
              <a href={`${GITHUB_BLOB}/${play.file}`} className="text-[12.5px] text-primary no-underline">Edit on GitHub</a>
            </RailBox>
          </aside>
        </div>
      </Container>
    </main>
  )
}

function ContractList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className=" rounded-radius-lg p-4 bg-surface-raised">
      <h2 className="text-[14px] font-semibold m-0 mb-2">{title}</h2>
      {items.length ? (
        <ul className="m-0 pl-4 list-disc text-[13px] text-on-surface-muted leading-[1.55]">
          {items.map(i => <li key={i}><Inline text={i} /></li>)}
        </ul>
      ) : (
        <p className="text-[13px] text-on-surface-muted m-0">{empty}</p>
      )}
    </div>
  )
}
