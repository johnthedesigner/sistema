import type { Metadata } from 'next'
import Link from 'next/link'
import { DesignMdCallout } from '@/components/shared/DesignMdCallout'

export const metadata: Metadata = {
  title: 'How to use Sistema',
  description: 'A practical guide to using Sistema\'s knowledge base and playbook in AI coding workflows.',
}

const VERCEL_URL = 'https://sistema-bay-seven.vercel.app'

const STAGES = [
  {
    stage: 1,
    label: 'System definition',
    description: 'Establish the design language — what the system is, what it references, its core decisions.',
    plays: [
      { slug: 'generate-design-md', title: 'Generate a DESIGN.md', output: 'A DESIGN.md file that describes your system\'s visual language for AI tools' },
      { slug: 'plan-token-architecture', title: 'Plan a Token Architecture', output: 'A token tier structure (primitive → semantic → component) scoped to your stack' },
    ],
  },
  {
    stage: 2,
    label: 'Primitive tokens',
    description: 'Generate the raw scale values — color palettes, type sizes, spacing, shape.',
    plays: [
      { slug: 'generate-color-scheme', title: 'Generate a Color Scheme', output: 'A full primitive color palette with tonal steps for each hue' },
      { slug: 'generate-type-scale', title: 'Generate a Primitive Type Scale', output: 'A type scale with size, weight, and line-height values for each role' },
      { slug: 'generate-shape-tokens', title: 'Generate Shape Tokens', output: 'Border-radius scale mapped to component categories' },
    ],
  },
  {
    stage: 3,
    label: 'Semantic layer',
    description: 'Map primitives to roles — assign meaning to values so components stay theme-agnostic.',
    plays: [
      { slug: 'generate-color-roles', title: 'Map an Existing Palette to Semantic Roles', output: 'Semantic color role assignments (background, surface, on-*, etc.)' },
      { slug: 'generate-dark-mode', title: 'Generate Dark Mode Token Values', output: 'Dark theme overrides for every semantic color role' },
      { slug: 'generate-style-dictionary', title: 'Generate a Style Dictionary Config', output: 'A Style Dictionary config that transforms your tokens to CSS, JS, and iOS/Android' },
    ],
  },
  {
    stage: 4,
    label: 'Components',
    description: 'Specify and implement components using the token layer.',
    plays: [
      { slug: 'specify-component', title: 'Write a Component Specification', output: 'A component spec with variants, states, token mappings, and accessibility requirements' },
      { slug: 'implement-component', title: 'Implement a Component', output: 'Working component code consuming semantic tokens, with documented variant props' },
    ],
  },
  {
    stage: 5,
    label: 'Migration and adoption',
    description: 'Integrate the system into an existing codebase.',
    plays: [
      { slug: 'migrate-tailwind-tokens', title: 'Migrate a Tailwind Config to Semantic Tokens', output: 'A migrated tailwind.config with semantic token references replacing raw values' },
      { slug: 'audit-component', title: 'Audit a Component Against System Standards', output: 'An audit report with specific violations and corrected code' },
    ],
  },
]

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-surface border border-border rounded-radius-md px-4 py-3 text-sm text-on-surface-muted overflow-x-auto whitespace-pre-wrap break-words">
      <code>{children}</code>
    </pre>
  )
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center mt-0.5">
      {n}
    </span>
  )
}

export default function GuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-3">How to use Sistema</h1>
        <p className="text-on-surface-muted text-lg">
          A practical walkthrough — from setting up your project to running plays end-to-end.
        </p>
      </div>

      {/* ── Section 1 ── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-on-surface mb-1">Adding a DESIGN.md to your project</h2>
        <p className="text-on-surface-muted mb-4">
          A DESIGN.md file is a short, structured description of your product&apos;s visual language — written specifically for AI coding tools to read before generating design system artifacts. It lives at the root of your repository alongside CLAUDE.md or similar agent context files.
        </p>

        <div className="mb-6">
          <DesignMdCallout />
        </div>

        <div className="space-y-5">
          <div className="flex gap-4">
            <StepNumber n={1} />
            <div>
              <p className="font-medium text-on-surface mb-1">Run the Generate a DESIGN.md play</p>
              <p className="text-on-surface-muted text-sm">
                Open the <Link href="/playbooks/generate-design-md" className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted">Generate a DESIGN.md</Link> play, fill in your project context, and paste the prompt into Claude Code or your preferred AI coding agent.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={2} />
            <div>
              <p className="font-medium text-on-surface mb-1">Save the output as <code className="text-sm bg-surface px-1.5 py-0.5 rounded-radius-sm">DESIGN.md</code></p>
              <p className="text-on-surface-muted text-sm mb-3">
                Place it at the root of your project. The file format follows the Google Labs DESIGN.md convention — a brief spec covering color, typography, spacing, shape, and key component decisions.
              </p>
              <CodeBlock>{`my-project/
├── DESIGN.md          ← place it here
├── CLAUDE.md          ← or alongside this
├── src/
└── ...`}</CodeBlock>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={3} />
            <div>
              <p className="font-medium text-on-surface mb-1">Reference it in future prompts</p>
              <p className="text-on-surface-muted text-sm mb-3">
                Once the file exists, every subsequent play in the playbook can reference it. The agent reads DESIGN.md to stay consistent with your established decisions rather than starting from scratch each time.
              </p>
              <CodeBlock>{`Read DESIGN.md first, then implement the Button component using the token values defined there.`}</CodeBlock>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border mb-14" />

      {/* ── Section 2 ── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-on-surface mb-1">Referencing KB content in prompts</h2>
        <p className="text-on-surface-muted mb-6">
          The Sistema knowledge base is publicly accessible at stable URLs. Every play in the playbook already includes fetch instructions pointing to specific KB pages — but you can reference any KB content directly in your own prompts.
        </p>

        <div className="space-y-5">
          <div className="flex gap-4">
            <StepNumber n={1} />
            <div>
              <p className="font-medium text-on-surface mb-1">Browse to the content you need</p>
              <p className="text-on-surface-muted text-sm">
                Find the relevant page in the <Link href="/kb" className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted">knowledge base</Link>. Each design system has guidance, implementation docs, and token assets — organized by category.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={2} />
            <div>
              <p className="font-medium text-on-surface mb-1">Use the page URL in your prompt</p>
              <p className="text-on-surface-muted text-sm mb-3">
                Tell the agent to fetch the page before generating. The KB serves raw markdown via the <code className="text-sm bg-surface px-1.5 py-0.5 rounded-radius-sm">/raw/</code> endpoint, which agents can read directly.
              </p>
              <CodeBlock>{`Fetch ${VERCEL_URL}/raw/design-systems/material/guidance/foundations/color-system and use it as the reference for generating color role tokens.`}</CodeBlock>
            </div>
          </div>

          <div className="flex gap-4">
            <StepNumber n={3} />
            <div>
              <p className="font-medium text-on-surface mb-1">Or use the bundle endpoint for multiple files</p>
              <p className="text-on-surface-muted text-sm mb-3">
                The <code className="text-sm bg-surface px-1.5 py-0.5 rounded-radius-sm">/bundle/</code> endpoint returns all files in a category as a single markdown document — useful when the agent needs the full picture of a topic.
              </p>
              <CodeBlock>{`Fetch ${VERCEL_URL}/bundle/design-systems/material to get all Material Design 3 guidance, then generate a token architecture for a mobile-first product.`}</CodeBlock>
            </div>
          </div>
        </div>

        <div className="mt-6 border border-border rounded-radius-lg p-4 bg-surface">
          <p className="text-xs font-medium text-on-surface-muted uppercase tracking-wider mb-2">URL patterns</p>
          <div className="space-y-1.5 text-sm font-mono text-on-surface-muted">
            <p><span className="text-on-surface-muted">/kb/</span>design-systems/material/guidance/foundations/color-system <span className="text-on-surface-muted">→ rendered page</span></p>
            <p><span className="text-on-surface-muted">/raw/</span>design-systems/material/guidance/foundations/color-system <span className="text-on-surface-muted">→ raw markdown</span></p>
            <p><span className="text-on-surface-muted">/bundle/</span>design-systems/material <span className="text-on-surface-muted">→ all files concatenated</span></p>
          </div>
        </div>
      </section>

      <div className="border-t border-border mb-14" />

      {/* ── Section 3 ── */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold text-on-surface mb-1">Running a playbook end-to-end</h2>
        <p className="text-on-surface-muted mb-6">
          Here&apos;s a complete example of using Sistema to build the color layer of a new design system — from a seed color to deployable CSS custom properties. This is Stages 1–3 in sequence.
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-on-surface-muted bg-surface px-2 py-0.5 rounded-radius-sm">Stage 1</span>
              <span className="text-sm font-medium text-on-surface">Define the system</span>
            </div>
            <p className="text-sm text-on-surface-muted mb-3">
              Open the <Link href="/playbooks/generate-design-md" className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted">Generate a DESIGN.md</Link> play. Fill in your product context — company name, product type, primary brand color. Paste into Claude Code. Save the output as <code className="text-sm bg-surface px-1.5 py-0.5 rounded-radius-sm">DESIGN.md</code>.
            </p>
            <CodeBlock>{`# DESIGN.md — Meridian Analytics

## Color
Primary: Blue (#2563EB). Semantic token model — no raw values in components.
Themes: light (default) + dark.
...`}</CodeBlock>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-on-surface-muted bg-surface px-2 py-0.5 rounded-radius-sm">Stage 2</span>
              <span className="text-sm font-medium text-on-surface">Generate primitive tokens</span>
            </div>
            <p className="text-sm text-on-surface-muted mb-3">
              Open the <Link href="/playbooks/generate-color-scheme" className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted">Generate a Color Scheme</Link> play. Enter your primary color. The play tells the agent to fetch Material Design 3&apos;s color system from Sistema as a structural reference, then generate your palette in the same format.
            </p>
            <CodeBlock>{`/* Generated: Meridian primitive palette */
--color-blue-10: #EFF6FF;
--color-blue-20: #DBEAFE;
...
--color-blue-60: #2563EB;  /* primary */
...`}</CodeBlock>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-on-surface-muted bg-surface px-2 py-0.5 rounded-radius-sm">Stage 3</span>
              <span className="text-sm font-medium text-on-surface">Map semantic roles</span>
            </div>
            <p className="text-sm text-on-surface-muted mb-3">
              Open the <Link href="/playbooks/generate-color-roles" className="text-on-surface underline underline-offset-2 hover:text-on-surface-muted">Map an Existing Palette to Semantic Roles</Link> play. Paste in the primitive tokens from Stage 2. The agent assigns each primitive to the correct semantic role — background, surface, primary, on-primary, etc. — producing deployable CSS custom properties for light and dark themes.
            </p>
            <CodeBlock>{`:root {
  --color-background: var(--color-gray-10);
  --color-surface: #FFFFFF;
  --color-primary: var(--color-blue-60);
  --color-on-primary: #FFFFFF;
  ...
}

[data-theme="dark"] {
  --color-background: var(--color-gray-100);
  --color-primary: var(--color-blue-40);
  ...
}`}</CodeBlock>
          </div>
        </div>

        <p className="text-sm text-on-surface-muted mt-6">
          At this point you have a committed, structured color system. Continue to Stage 4 to specify and implement components using these tokens.
        </p>
      </section>

      <div className="border-t border-border mb-14" />

      {/* ── Quick reference ── */}
      <section>
        <h2 className="text-xl font-semibold text-on-surface mb-1">Quick reference</h2>
        <p className="text-on-surface-muted mb-6">All plays by stage — what each one produces and when to use it.</p>

        <div className="space-y-8">
          {STAGES.map(({ stage, label, description, plays }) => (
            <div key={stage}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-xs font-mono text-on-surface-muted">Stage {stage}</span>
                <h3 className="text-sm font-semibold text-on-surface-muted">{label}</h3>
              </div>
              <p className="text-sm text-on-surface-muted mb-3">{description}</p>
              <div className="border border-border rounded-radius-lg overflow-hidden divide-y divide-border">
                {plays.map(play => (
                  <div key={play.slug} className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                    <Link
                      href={`/playbooks/${play.slug}`}
                      className="text-sm font-medium text-on-surface hover:text-on-surface-muted transition-colors"
                    >
                      {play.title} →
                    </Link>
                    <p className="text-sm text-on-surface-muted">{play.output}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
