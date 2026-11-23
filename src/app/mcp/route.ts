/**
 * Sistema's MCP server (V4.1, D32 and D33). Stateless Streamable HTTP through
 * mcp-handler, at /mcp. Connect with the site URL plus /mcp, adding ?c=<visit ID>
 * from the connect page so usage is counted like /raw and the APIs (D13).
 *
 * Tools: search, read, next_step (content, from src/lib/mcp/content.ts), and
 * palette, contrast, type_scale, specimen, validate, dark_mode, which call the same route handlers
 * as the HTTP APIs, so every channel returns the same results and errors.
 * Prompts: one per workflow, the same starter the paste-in prompt fetches.
 */
import { AsyncLocalStorage } from 'node:async_hooks'
import { NextRequest } from 'next/server'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { loadCatalog } from '@/lib/content/load'
import { renderWorkflowStarter, workflowSlug } from '@/lib/content/render'
import { KINDS, mcpContext, nextStep, read, search } from '@/lib/mcp/content'
import { trackEvent } from '@/lib/tools/http'
import { validVisitId } from '@/lib/analytics/ids'
import { POST as palettePost } from '@/app/api/palette/route'
import { POST as contrastPost } from '@/app/api/contrast/route'
import { POST as typeScalePost } from '@/app/api/type-scale/route'
import { POST as specimenPost } from '@/app/api/specimen/route'
import { POST as validatePost } from '@/app/api/validate/route'
import { POST as darkModePost } from '@/app/api/dark-mode/route'

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
          state: z.string().optional().describe("The text of the project's sistema.json, as it is in the file. Leave it out if there is no sistema.json yet"),
        }),
      },
      async ({ workflow, state: stateText }) => {
        track('next_step', { workflow })
        let state: Record<string, unknown> = {}
        if (stateText?.trim()) {
          try {
            const parsed: unknown = JSON.parse(stateText)
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
            state = parsed as Record<string, unknown>
          } catch {
            return text('state must be the text of sistema.json: one JSON object, such as {"sistema": "2", "workflow": "start", "steps": {}}.', true)
          }
        }
        const r = nextStep(catalog, workflow, state as Parameters<typeof nextStep>[2])
        if (!r.ok) return text(r.error, true)
        // The visit ID is in the server URL, which the agent never sees: hand it over for sistema.json.
        const req = current.getStore()
        const c = req ? validVisitId(new URL(req.url).searchParams.get('c')) : null
        const recorded = (state as { telemetry?: { id?: unknown } }).telemetry?.id
        return text(c && recorded !== c ? `${r.text}\n\nIn \`sistema.json\`, set \`telemetry.id\` to \`${c}\`. It is the anonymous usage ID this server was connected with: Sistema counts how its workflows, plays, and tools are used, and records nothing about the person or the project's code.` : r.text)
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
          ratio: z.string().optional().describe('A number or a name, such as "1.25" or "major-third"'),
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
          content: z.string().optional().describe("The product's own words, as a JSON object in a string, using the fields the response lists in content_fields"),
        }),
      },
      async args => viaApi(specimenPost, '/api/specimen', args),
    )

    server.registerTool(
      'validate',
      {
        title: 'Validate token files',
        description: "Check the project's DTCG token files against Sistema's rules: format and aliases, required color roles, contrast for every implied pair in every theme, mode files, dark surface steps, visible states, line heights, and the spacing scale.",
        inputSchema: z.object({
          files: z.string().describe('Every file in tokens/src/, as a JSON object of file name to file contents, such as {"color.json": {...}, "color.dark.json": {...}, "palette.json": {...}}'),
          standard: z.string().optional().describe('As in sistema.json project.a11y_standard, such as "wcag-2.2 AA"'),
        }),
      },
      async args => viaApi(validatePost, '/api/validate', args),
    )

    server.registerTool(
      'dark_mode',
      {
        title: 'Map a dark theme',
        description: "Propose a dark theme from the light theme's color roles, as the color guide describes, with every pair checked in both themes and a passing stop suggested for each failure. Returns a color.dark.json to save.",
        inputSchema: z.object({
          files: z.string().optional().describe('color.json and palette.json, as a JSON object of file name to file contents'),
          roles: z.string().optional().describe('Instead of files: a JSON object of role to light ramp stop, such as {"surface": "neutral.50", "on-surface": "neutral.850"}'),
          colors: z.string().optional().describe('With roles: a JSON object of ramp name to seed color, such as {"neutral": "#6B7280"}'),
          standard: z.string().optional(),
        }),
      },
      async args => viaApi(darkModePost, '/api/dark-mode', args),
    )

    const ctx = mcpContext(catalog)
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
