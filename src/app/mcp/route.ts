/**
 * Sistema's MCP server (V4.1, D32 and D33). Stateless Streamable HTTP through
 * mcp-handler, at /mcp. Connect with the site URL plus /mcp, adding ?c=<visit ID>
 * from the connect page so usage is counted like /raw and the APIs (D13).
 *
 * Tools: search, read, next_step (content, from src/lib/mcp/content.ts), and
 * palette, contrast, type_scale, specimen, which call the same route handlers
 * as the HTTP APIs, so every channel returns the same results and errors.
 * Prompts: one per workflow, the same starter the paste-in prompt fetches.
 */
import { AsyncLocalStorage } from 'node:async_hooks'
import { NextRequest } from 'next/server'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { loadCatalog } from '@/lib/content/load'
import { buildContext } from '@/lib/content/context'
import { renderWorkflowStarter, workflowSlug } from '@/lib/content/render'
import { KINDS, nextStep, read, search } from '@/lib/mcp/content'
import { trackEvent } from '@/lib/tools/http'
import { POST as palettePost } from '@/app/api/palette/route'
import { POST as contrastPost } from '@/app/api/contrast/route'
import { POST as typeScalePost } from '@/app/api/type-scale/route'
import { POST as specimenPost } from '@/app/api/specimen/route'

const current = new AsyncLocalStorage<Request>()

const text = (t: string, isError = false) => ({ content: [{ type: 'text' as const, text: t }], ...(isError ? { isError: true } : {}) })

/** Record the call against the visit ID in the server URL. */
function track(tool: string, props: Record<string, unknown> = {}) {
  const req = current.getStore()
  if (req) trackEvent(req, 'mcp_call', { tool, ...props })
}

/** Call an API route handler with a JSON body, carrying the visit ID, and return its JSON as text. */
async function viaApi(handler: (r: NextRequest) => Promise<Response> | Response, path: string, body: unknown) {
  const outer = current.getStore()
  const c = outer ? new URL(outer.url).searchParams.get('c') : null
  const origin = outer ? new URL(outer.url).origin : 'http://localhost'
  const res = await handler(new NextRequest(`${origin}${path}${c ? `?c=${encodeURIComponent(c)}` : ''}`, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }))
  const json = await res.json()
  return text(JSON.stringify(json, null, 2), res.status >= 400)
}

const handler = createMcpHandler(
  server => {
    const catalog = loadCatalog()

    server.registerTool(
      'search',
      {
        title: 'Search Sistema',
        description: 'Find Sistema plays, workflows, guides, rules, opinions, and file formats. Returns IDs to pass to read.',
        inputSchema: z.object({
          query: z.string().min(1).describe('Words to look for, such as "dark theme contrast"'),
          kind: z.enum(KINDS).optional().describe('Only this kind of item'),
          topic: z.string().optional().describe('Only this topic, such as color or typography'),
        }),
      },
      async ({ query, kind, topic }) => {
        track('search', { kind, topic })
        const hits = search(catalog, query, kind, topic)
        return text(hits.length ? JSON.stringify(hits, null, 2) : 'Nothing matched. Try fewer or different words.')
      },
    )

    server.registerTool(
      'read',
      {
        title: 'Read a Sistema item',
        description: 'Return one play, workflow, guide, rule, opinion, or file format as plain text, or one section of it (id#section, or the section argument).',
        inputSchema: z.object({
          id: z.string().min(1).describe('An ID from search, such as "color.scheme" or "guide.color.architecture#pairs-to-check"'),
          section: z.string().optional().describe('A heading anchor, such as "pairs-to-check"'),
        }),
      },
      async ({ id, section }) => {
        track('read', { id, section })
        const r = read(catalog, id, section)
        return r.ok ? text(r.text) : text(r.error, true)
      },
    )

    server.registerTool(
      'next_step',
      {
        title: 'Next step in a workflow',
        description: "Given the project's sistema.json, return the approval that is waiting or the next play's full procedure. Pass the file's contents as state.",
        inputSchema: z.object({
          workflow: z.string().min(1).describe('start, patterns, or session'),
          state: z.record(z.string(), z.unknown()).optional().describe("The contents of the project's sistema.json"),
        }),
      },
      async ({ workflow, state }) => {
        track('next_step', { workflow })
        const r = nextStep(catalog, workflow, (state ?? {}) as Parameters<typeof nextStep>[2])
        return r.ok ? text(r.text) : text(r.error, true)
      },
    )

    server.registerTool(
      'palette',
      {
        title: 'Generate palettes',
        description: "Sistema's palette tool: a 19-stop ramp (50 to 950) for each seed color, with contrast against white and black for every stop.",
        inputSchema: z.object({ colors: z.record(z.string(), z.string()).describe('Names to seed colors, such as {"accent": "#0070FF"}') }),
      },
      async ({ colors }) => viaApi(palettePost, '/api/palette', { colors }),
    )

    server.registerTool(
      'contrast',
      {
        title: 'Check contrast',
        description: "Check color pairs against the project's accessibility standard. Up to 200 pairs. Set purpose per pair: text, large_text, ui, or informational.",
        inputSchema: z.object({
          pairs: z.array(z.object({ foreground: z.string(), background: z.string(), label: z.string().optional(), purpose: z.enum(['text', 'large_text', 'ui', 'informational']).optional() })).min(1).max(200),
          standard: z.string().optional().describe('As in sistema.json project.a11y_standard, such as "wcag-2.2 AA"'),
        }),
      },
      async ({ pairs, standard }) => viaApi(contrastPost, '/api/contrast', { pairs, standard }),
    )

    server.registerTool(
      'type_scale',
      {
        title: 'Build a type scale',
        description: 'Sizes and line heights from a base size and ratio, with role names placed on steps, checked against the rules.',
        inputSchema: z.object({
          base: z.number().optional(),
          ratio: z.union([z.number(), z.string()]).optional().describe('A number or a name, such as "major-third"'),
          down: z.number().int().optional(),
          up: z.number().int().optional(),
          names: z.enum(['numeric', 'tailwind', 'steps']).optional(),
          roles: z.record(z.string(), z.number().int()).optional().describe('Role names to steps, such as {"body": 0, "label": -1}'),
          standard: z.string().optional(),
        }),
      },
      async args => viaApi(typeScalePost, '/api/type-scale', args),
    )

    server.registerTool(
      'specimen',
      {
        title: 'Render a specimen',
        description: "Render a product screen from visual choices (accent, grays, color presence, radius, chips, separation, density, typefaces, theme, layout) with the product's own content. Returns every role with its ramp stop, the type and spacing values, and a render URL.",
        inputSchema: z.object({
          accent: z.string().optional(),
          neutral: z.string().optional().describe('cool, warm, neutral, tinted, or a color'),
          presence: z.enum(['quiet', 'brand', 'tinted']).optional(),
          radius: z.number().optional(),
          chips: z.enum(['scaled', 'pill']).optional(),
          separation: z.enum(['tone', 'line', 'shadow']).optional(),
          density: z.enum(['compact', 'comfortable', 'spacious']).optional(),
          font: z.string().optional(),
          display_font: z.string().optional(),
          theme: z.enum(['light', 'dark']).optional(),
          layout: z.enum(['operations', 'dashboard', 'record', 'marketing', 'article', 'shop']).optional(),
          content: z.record(z.string(), z.unknown()).optional(),
        }),
      },
      async args => viaApi(specimenPost, '/api/specimen', args),
    )

    const ctx = buildContext(catalog)
    for (const w of catalog.workflows) {
      server.registerPrompt(
        workflowSlug(w.id),
        { title: w.title, description: w.description },
        async () => {
          track('prompt', { workflow: w.id })
          return { messages: [{ role: 'user' as const, content: { type: 'text' as const, text: renderWorkflowStarter(w, ctx, catalog.workflowById) } }] }
        },
      )
    }
  },
  { serverInfo: { name: 'sistema', version: '2.0.0' } },
)

async function serve(request: Request) {
  return current.run(request, () => handler(request))
}

export { serve as GET, serve as POST, serve as DELETE }
