/**
 * v2 content model schemas (docs/v2/capability-model.md, decisions D1–D8).
 *
 * Plays and workflows are markdown files with YAML frontmatter under content/.
 * Rules are YAML lists under content/rules/<topic>.yaml. sistema.json lives in
 * the user's project and is described here so plays and tools agree on it.
 */
import { z } from 'zod'

export const TOPICS = [
  'project',
  'visual-language',
  'content',
  'color',
  'typography',
  'shape',
  'depth',
  'spacing',
  'motion',
  'tokens',
  'components',
  'accessibility',
  'quality',
  'ai',
] as const
export type Topic = (typeof TOPICS)[number]

export const KINDS = ['create', 'change', 'check', 'orient'] as const
export const MILESTONES = ['direction', 'foundations', 'patterns', 'maintain'] as const
export type Milestone = (typeof MILESTONES)[number]
export const TOOLS = ['palette', 'contrast', 'type_scale', 'specimen'] as const
export type ToolName = (typeof TOOLS)[number]

/** DESIGN.md body sections, in spec order (D6a). */
export const DESIGN_MD_SECTIONS = [
  'overview',
  'colors',
  'typography',
  'layout',
  'elevation-depth',
  'shapes',
  'components',
  'dos-donts',
] as const

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const topicPattern = TOPICS.join('|')

/** A play ID: <topic>.<name>, e.g. color.scheme */
export const PlayId = z.string().regex(new RegExp(`^(?:${topicPattern})\\.[a-z0-9]+(?:-[a-z0-9]+)*$`), 'play id must be <topic>.<name>')
/** A rule ID: <topic>.<name>[.<name>...], e.g. color.contrast.text */
export const RuleId = z.string().regex(new RegExp(`^(?:${topicPattern})(?:\\.[a-z0-9]+(?:-[a-z0-9]+)*)+$`), 'rule id must be <topic>.<name>')
/** A guide reference: guide.<topic>.<name>[#anchor] */
export const GuideRef = z.string().regex(new RegExp(`^guide\\.(?:${topicPattern})\\.[a-z0-9-]+(?:#[a-z0-9-]+)?$`), 'knowledge ref must be guide.<topic>.<name>#anchor')

/**
 * State tokens used in `requires` and `produces`:
 *   tokens/src/color.json      a repo path ("?" suffix in produces = optional output)
 *   design-md#colors           a DESIGN.md section
 *   gate:direction-approved    a recorded human approval
 *   project:a11y-standard      a project rule in sistema.json
 */
export const StateToken = z
  .string()
  .regex(/^(?:gate:[a-z0-9-]+|project:[a-z0-9-]+|design-md#[a-z0-9-]+|[\w./-]+\.[a-z0-9]+)\??$/, 'not a valid state token')
  .refine(t => !t.startsWith('design-md#') || (DESIGN_MD_SECTIONS as readonly string[]).includes(t.slice(10).replace(/\?$/, '')), {
    message: `design-md section must be one of: ${DESIGN_MD_SECTIONS.join(', ')}`,
  })

export const PlayFrontmatter = z
  .object({
    id: PlayId,
    title: z.string().min(3),
    description: z.string().min(20),
    topic: z.enum(TOPICS),
    kind: z.enum(KINDS),
    milestone: z.enum(MILESTONES),
    entry: z.boolean().default(false),
    requires: z.array(StateToken).default([]),
    produces: z.array(StateToken).default([]),
    tools: z.array(z.enum(TOOLS)).default([]),
    knowledge: z.array(GuideRef).default([]),
    rules: z.array(RuleId).default([]),
    evidence: z.string().min(10),
    overrides: z.array(z.string().regex(/^[a-z][a-z0-9_]*$/)).default([]),
    last_reviewed: z.iso.date(),
  })
  .strict()
  .refine(p => p.id.startsWith(`${p.topic}.`), { message: 'id must start with its topic', path: ['id'] })
export type PlayFrontmatter = z.infer<typeof PlayFrontmatter>

/** A workflow sequence item: a play ID ("?" suffix = optional) or a gate. */
export const SequenceItem = z.union([
  z.string().regex(new RegExp(`^(?:${topicPattern})\\.[a-z0-9-]+\\??$`), 'sequence item must be a play id'),
  z.object({ gate: z.string().regex(slug), prompt: z.string().min(10) }).strict(),
])
export type SequenceItem = z.infer<typeof SequenceItem>

export const WorkflowFrontmatter = z
  .object({
    id: z.string().regex(/^workflow\.[a-z0-9-]+$/),
    title: z.string().min(3),
    description: z.string().min(20),
    entry: z.boolean().default(true),
    sequence: z.array(SequenceItem).optional(),
    /** For route workflows: each route has a human label (shown on the site) and its plays. */
    routes: z.record(z.string().regex(slug), z.object({ title: z.string().min(3), plays: z.array(PlayId).min(1) }).strict()).optional(),
    continue_with: z.string().regex(/^workflow\.[a-z0-9-]+$/).optional(),
    /** For route workflows: the play that runs first and picks a route. */
    start_with: PlayId.optional(),
    last_reviewed: z.iso.date(),
  })
  .strict()
  .refine(w => Boolean(w.sequence) !== Boolean(w.routes), { message: 'a workflow has either a sequence or routes, not both' })
export type WorkflowFrontmatter = z.infer<typeof WorkflowFrontmatter>

/** A guide: Sistema's take on one foundation (D4, V1.12). Lives at content/guides/<topic>/<name>.md. */
/**
 * Sources Sistema draws on (content/sources.yaml, V1.16). Tier follows the
 * intake tiers in AGENTS.md: 1 open license, 2 official public docs with no
 * open license, 3 public research or writing with no open license.
 */
export const SOURCE_KINDS = ['design-system', 'library', 'standard', 'research', 'agent-skill'] as const
export const SourceEntry = z
  .object({
    id: z.string().regex(slug),
    name: z.string().min(2),
    publisher: z.string().min(2),
    url: z.url(),
    kind: z.enum(SOURCE_KINDS),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    license: z.string().min(3),
    note: z.string().optional(),
  })
  .strict()
export type SourceEntry = z.infer<typeof SourceEntry>
export const SourceList = z.array(SourceEntry)

/** A credit line: a page of a registered source that a guide or format page draws on. */
export const Credit = z.object({ source: z.string().regex(slug), url: z.url() }).strict()
export type Credit = z.infer<typeof Credit>

export const GuideFrontmatter = z
  .object({
    title: z.string().min(3),
    description: z.string().min(20),
    topic: z.enum(TOPICS),
    /** Pages of registered sources this guide draws on, shown as credit lines. */
    sources: z.array(Credit).default([]),
    /** Other Sistema guides this one builds on. */
    related: z.array(GuideRef).default([]),
    /** How to read the guide, when that isn't obvious from the title. */
    note: z.string().optional(),
    last_reviewed: z.iso.date(),
  })
  .strict()
export type GuideFrontmatter = z.infer<typeof GuideFrontmatter>

/** Sistema's pages on the file formats it reads and writes (content/files/<name>.md). */
export const FileFormatFrontmatter = z
  .object({
    title: z.string().min(3),
    description: z.string().min(20),
    sources: z.array(Credit).default([]),
    last_reviewed: z.iso.date(),
  })
  .strict()
export type FileFormatFrontmatter = z.infer<typeof FileFormatFrontmatter>

/**
 * Published opinions (plan 6, V1.8). `method` opinions are part of how Sistema
 * works and can't be overridden without losing part of the method; the other
 * groups are defaults a project may override in DECISIONS.md.
 */
export const OPINION_GROUPS = ['method', 'process', 'structure', 'craft', 'quality-floor', 'boundary'] as const
export type OpinionGroup = (typeof OPINION_GROUPS)[number]
export const OpinionId = z.string().regex(/^opinion\.[a-z0-9]+(?:-[a-z0-9]+)*$/, 'opinion id must be opinion.<name>')

export const OpinionFrontmatter = z
  .object({
    id: OpinionId,
    title: z.string().min(3),
    group: z.enum(OPINION_GROUPS),
    /** The default, in one sentence. */
    default: z.string().min(10),
    description: z.string().min(20),
    rules: z.array(RuleId).default([]),
    guides: z.array(GuideRef).default([]),
    last_reviewed: z.iso.date(),
  })
  .strict()
export type OpinionFrontmatter = z.infer<typeof OpinionFrontmatter>

/** Body sections each opinion must have, by group. */
export function opinionSections(group: OpinionGroup): string[] {
  return group === 'method' ? ['Why', 'What breaks without it'] : ['Why', "When you'd choose otherwise", 'If you override it']
}

export const Rule = z
  .object({
    id: RuleId,
    statement: z.string().min(10),
    reason: z.string().min(10),
    layer: z.enum(['standard', 'sistema-default', 'project']),
    severity: z.enum(['blocking', 'advisory']),
    measure: z
      .object({
        kind: z.enum(['range', 'min', 'max', 'enum', 'presence']),
        min: z.number().optional(),
        max: z.number().optional(),
        values: z.array(z.string()).optional(),
        unit: z.string().optional(),
      })
      .strict()
      .optional(),
    /** Values keyed by standard, then level, e.g. { "wcag-2.2": { AA: 4.5, AAA: 7 } } (D8). */
    parameters: z.record(z.string(), z.record(z.string(), z.union([z.number(), z.string()]))).optional(),
    applies_to: z.string().min(3),
    applies_when: z.string().optional(),
    checked_by: z.array(z.string()).default([]),
    sources: z.array(z.string()).default([]),
  })
  .strict()
  .refine(r => r.severity !== 'blocking' || r.checked_by.length > 0, {
    message: 'blocking rules need checked_by',
    path: ['checked_by'],
  })
export type Rule = z.infer<typeof Rule>

export const RuleFile = z.array(Rule)

/** Step status values in sistema.json. `in-progress` covers a play waiting at a gate. */
export const STEP_STATUSES = ['pending', 'in-progress', 'complete', 'skipped'] as const

/** sistema.json in the user's project (D7, revised in V1.5). */
export const SistemaState = z
  .object({
    sistema: z.literal('2'),
    workflow: z.string().optional(),
    /** URL of the workflow to resume from. Set while a workflow runs; the agent instructions file points here. */
    continue: z.url().optional(),
    milestone: z.enum(MILESTONES).optional(),
    project: z
      .object({
        /** The product's name, as the person calls it. Used in DESIGN.md front matter. */
        name: z.string().min(1),
        a11y_standard: z.string(),
        theme: z.enum(['light', 'dark', 'light-dark']),
        /** Which theme is primary when theme is light-dark. */
        theme_primary: z.enum(['light', 'dark']),
        density: z.enum(['dense', 'balanced', 'sparse']),
        platform: z.enum(['web', 'mobile', 'web-mobile']),
        stack: z.string(),
        /** The component foundation chosen in components.scaffold-core, e.g. shadcn, base-ui, native. */
        component_library: z.string(),
        /**
         * Modes beyond the theme (tokens.add-mode), by kind. The first value is the default,
         * for example { "density": ["comfortable", "compact"], "motion": ["standard", "reduced"] }.
         */
        modes: z
          .object({ density: z.array(z.string().min(1)).min(2), motion: z.array(z.string().min(1)).min(2) })
          .partial()
          .strict(),
      })
      .partial()
      .strict()
      .default({}),
    steps: z
      .record(
        PlayId,
        z
          .object({
            status: z.enum(STEP_STATUSES),
            date: z.iso.date().optional(),
            evidence: z.string().optional(),
          })
          .strict(),
      )
      .default({}),
    gates: z
      .record(
        z.string().regex(slug),
        z.object({ date: z.iso.date(), by: z.string().min(1), note: z.string().optional() }).strict(),
      )
      .default({}),
    routing: z.record(PlayId, PlayId).default({}),
    /** The anonymous usage ID (`c`) from the URL the workflow was fetched with (docs/v2/analytics.md). */
    telemetry: z.object({ id: z.string().min(1) }).strict().optional(),
  })
  .strict()
export type SistemaState = z.infer<typeof SistemaState>
