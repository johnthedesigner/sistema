/**
 * Server-side helpers shared by the site's pages: labels, links, prompts, and
 * lookups across the catalog. Pages read content only through loadCatalog().
 */
import { SITE_URL } from '../site-url'
import { loadCatalog, type Catalog } from './load'
import type { Guide, Play, Workflow } from './parse'
import { workflowUrl, playUrl } from './render'
import type { Milestone, OpinionGroup, Topic } from './schema'

export const MILESTONE_LABELS: Record<Milestone, string> = {
  direction: 'Direction',
  foundations: 'Foundations',
  patterns: 'Patterns',
  maintain: 'Work on my system',
}

/** Chip colors per milestone, from the site's stage tokens. */
export const MILESTONE_CHIP: Record<Milestone, { bg: string; color: string; border: string }> = {
  direction: { bg: 'var(--stage-1-bg)', color: 'var(--stage-1-text)', border: 'var(--stage-1-border)' },
  foundations: { bg: 'var(--stage-3-bg)', color: 'var(--stage-3-text)', border: 'var(--stage-3-border)' },
  patterns: { bg: 'var(--stage-4-bg)', color: 'var(--stage-4-text)', border: 'var(--stage-4-border)' },
  maintain: { bg: 'var(--stage-6-bg)', color: 'var(--stage-6-text)', border: 'var(--stage-6-border)' },
}

export const TOPIC_LABELS: Record<Topic, string> = {
  project: 'Project',
  'visual-language': 'Visual language',
  content: 'Content',
  color: 'Color',
  typography: 'Typography',
  shape: 'Shape',
  depth: 'Depth',
  spacing: 'Spacing',
  motion: 'Motion',
  tokens: 'Tokens',
  components: 'Components',
  accessibility: 'Accessibility',
  quality: 'Quality',
  ai: 'AI',
}

export const OPINION_GROUP_LABELS: Record<OpinionGroup, { title: string; intro: string }> = {
  method: { title: 'How Sistema works', intro: "These are part of the method. Setting one aside means Sistema can't do part of its job." },
  process: { title: 'Process', intro: 'How the work runs.' },
  structure: { title: 'Structure', intro: 'How the system is built.' },
  'quality-floor': { title: 'Quality floor', intro: 'What every system meets.' },
  boundary: { title: "What Sistema doesn't set", intro: 'Where Sistema stops and your decisions begin.' },
}

// ─── links ──────────────────────────────────────────────────────────────────

export const playHref = (id: string) => `/plays/${id}`
export const workflowHref = (id: string) => `/workflows/${id.replace(/^workflow\./, '')}`
export const ruleHref = (id: string) => `/reference/rules#${id}`
export const opinionHref = (id: string) => `/reference/opinions#${id}`
export function guideHref(ref: string): string {
  const [id, section] = ref.split('#')
  const [, topic, name] = id.split('.')
  return `/guides/${topic}/${name}${section ? `#${section}` : ''}`
}

/** Absolute plain-text URL for a site path, for agent notes. */
export const absolute = (path: string) => `${SITE_URL}${path}`

// ─── prompts ────────────────────────────────────────────────────────────────

export const fetchPrompt = (url: string) => `Fetch ${url} and follow it.`
export const workflowPrompt = (id: string) => fetchPrompt(workflowUrl(SITE_URL, id))
export const playPrompt = (id: string) => fetchPrompt(playUrl(SITE_URL, id))

// ─── lookups ────────────────────────────────────────────────────────────────

export function catalog(): Catalog {
  return loadCatalog()
}

/** Play IDs in a workflow, in order (sequence, or start_with then routes). */
export function workflowPlayIds(w: Workflow): string[] {
  if (w.sequence) return w.sequence.filter((i): i is string => typeof i === 'string').map(i => i.replace(/\?$/, ''))
  return [...new Set([...(w.start_with ? [w.start_with] : []), ...Object.values(w.routes ?? {}).flatMap(r => r.plays)])]
}

export function workflowsIncluding(playId: string): Workflow[] {
  return catalog().workflows.filter(w => workflowPlayIds(w).includes(playId))
}

export function playsForTopic(topic: string): Play[] {
  return catalog().plays.filter(p => p.topic === topic)
}

export function guidesForTopic(topic: string): Guide[] {
  return catalog().guides.filter(g => g.topic === topic)
}

/** Workflows shown first: start, then patterns, then session. */
export function orderedWorkflows(): Workflow[] {
  const order = ['workflow.start', 'workflow.patterns', 'workflow.session']
  return [...catalog().workflows].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
}

/** Topics that have any guide or play, in TOPIC_LABELS order. */
export function activeTopics(kind: 'guides' | 'plays'): Topic[] {
  const c = catalog()
  const has = new Set((kind === 'guides' ? c.guides : c.plays).map(x => x.topic))
  return (Object.keys(TOPIC_LABELS) as Topic[]).filter(t => has.has(t))
}

/** Guide heading anchors used on the page match the slugs plays cite. */
export { headingSlug } from './parse'
