import { SITE_URL } from '@/lib/site-url'
import { json, options, trackEvent } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'
import { LIMITS as TYPE_LIMITS, NAMING, RATIOS } from '@/lib/type-scale'
import { CHIPS, DENSITY, DISPLAY_FONTS, FONTS, LAYOUTS, PRESENCE, SEPARATION, SPECIMEN_LIMITS, THEMES, WARMTH } from '@/lib/specimen'

/**
 * GET /api: a machine-readable index of the tool APIs (tool-apis.md section 5).
 * Every URL is absolute. Each tool also accepts an optional anonymous ID `c`.
 */
export function GET(request: Request) {
  trackEvent(request, 'api_index', {})
  const u = (path: string) => `${SITE_URL}${path}`
  return json({
    name: 'Sistema tool APIs',
    about: 'Use these tools instead of estimating. Every tool answers a GET with query parameters and a POST with JSON, and returns JSON. Errors include a working example URL.',
    colors: 'hex (#1F5FD1 or #15D), rgb(31 95 209), or oklch(0.52 0.19 261), URL-encoded in GET requests (# is %23)',
    docs: u('/reference/tools'),
    agents: u('/raw/agents'),
    mcp: { url: u('/mcp'), about: 'The same tools and content as an MCP server (Streamable HTTP): search, read, next_step, palette, contrast, type_scale, specimen, validate, dark_mode, and a prompt per workflow.' },
    tools: [
      {
        name: 'contrast',
        does: 'WCAG contrast ratios for color pairs, with pass or fail for text, large text, and UI components under the standard you name (default WCAG 2.2 AA).',
        get: u('/api/contrast?fg=<color>&bg=<color>&label=<name>&standard=<standard>'),
        example: u('/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&label=on-primary&standard=wcag-2.2%20AA'),
        post: { url: u('/api/contrast'), body: '{"standard": "wcag-2.2 AA", "pairs": [{"foreground", "background", "label", "purpose"}]}' },
        limits: LIMITS.contrast,
        docs: u('/reference/tools#contrast'),
      },
      {
        name: 'palette',
        does: 'A 19-stop ramp (50 to 950) for each named seed color, with each stop placed by contrast against white.',
        get: u('/api/palette?<name>=<color>&<name>=<color>'),
        example: u('/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)'),
        post: { url: u('/api/palette'), body: '{"colors": {"<name>": "<color>"}}' },
        limits: LIMITS.palette,
        docs: u('/reference/tools#palette'),
      },
      {
        name: 'type_scale',
        does: 'Type sizes from a base and ratio, named in the convention you choose, with roles placed on steps, suggested line heights, and checks against your standard.',
        get: u('/api/type-scale?base=<px>&ratio=<ratio>&down=<n>&up=<n>&names=<naming>&roles=<role>:<step>,<role>:<step>&standard=<standard>'),
        example: u('/api/type-scale?base=16&ratio=major-third&names=tailwind&roles=caption:-2,label:-1,body:0,heading-lg:4&standard=wcag-2.2%20AA'),
        post: { url: u('/api/type-scale'), body: '{"base": 16, "ratio": "major-third", "names": "tailwind", "roles": {"body": 0}, "standard": "wcag-2.2 AA"}' },
        limits: { base_px: TYPE_LIMITS.base, ratio: TYPE_LIMITS.ratio, down: TYPE_LIMITS.down, up: TYPE_LIMITS.up, names: NAMING, ratio_names: Object.keys(RATIOS) },
        docs: u('/reference/tools#type_scale'),
      },
      {
        name: 'specimen',
        does: 'Renders a product screen from a few visual choices (accent, warmth, color presence, radius, separation, density, typeface, theme) with Sistema\'s craft baseline applied, so options can be compared side by side. Returns the roles with the ramp stop each comes from, and a render URL.',
        get: u('/api/specimen?accent=<color>&neutral=<cool|neutral|warm>&presence=<quiet|brand|tinted>&radius=<px>&separation=<tone|line|shadow>&density=<compact|comfortable|spacious>&font=<family>&theme=<light|dark>&format=<json|html>'),
        example: u('/api/specimen?accent=%231E6B5C&neutral=warm&presence=brand&radius=10&separation=tone&font=Figtree'),
        post: { url: u('/api/specimen'), body: '{"accent": "#1E6B5C", "presence": "brand", "radius": 10, "content": {"product": "Relay"}}' },
        limits: { radius_px: SPECIMEN_LIMITS.radius, layout: LAYOUTS, presence: PRESENCE, neutral: WARMTH, separation: SEPARATION, density: DENSITY, chips: CHIPS, theme: THEMES, fonts: FONTS, display_fonts: DISPLAY_FONTS },
        docs: u('/reference/tools#specimen'),
      },
      {
        name: 'validate',
        does: 'Checks a project\'s DTCG token files against Sistema\'s rules: format and aliases, required color roles, contrast for every implied pair in every theme, mode files, dark surface steps, visible states, line heights, and the spacing scale.',
        get: u('/api/validate?files=<JSON: {"<file name>": <token file>}>&standard=<standard>'),
        example: u(`/api/validate?files=${encodeURIComponent(JSON.stringify({ 'color.json': { color: { surface: { $type: 'color', $value: '#FFFFFF' }, 'on-surface': { $type: 'color', $value: '#1F2937' } } } }))}`),
        post: { url: u('/api/validate'), body: '{"files": {"color.json": {...}, "color.dark.json": {...}, "palette.json": {...}}, "standard": "wcag-2.2 AA"}' },
        limits: LIMITS.validate,
        docs: u('/reference/tools#validate'),
      },
      {
        name: 'dark_mode',
        does: 'Proposes a dark theme from the light theme\'s color roles, as the color guide describes (surfaces step one stop, text and fills mirror), with every pair checked in both themes and a passing stop suggested for each failure. Returns a color.dark.json to save.',
        get: u('/api/dark-mode?roles=<JSON: {"<role>": "<ramp>.<stop>"}>&colors=<JSON: {"<ramp>": "<seed>"}>&standard=<standard>'),
        example: u(`/api/dark-mode?roles=${encodeURIComponent(JSON.stringify({ surface: 'neutral.50', 'surface-raised': 'white', 'on-surface': 'neutral.850' }))}&colors=${encodeURIComponent(JSON.stringify({ neutral: '#6B7280' }))}`),
        post: { url: u('/api/dark-mode'), body: '{"files": {"color.json": {...}, "palette.json": {...}}, "standard": "wcag-2.2 AA"}' },
        limits: LIMITS.dark_mode,
        docs: u('/reference/tools#dark_mode'),
      },
    ],
  })
}

export const OPTIONS = options
