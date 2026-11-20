import { SITE_URL } from '@/lib/site-url'
import { json, options, trackEvent } from '@/lib/tools/http'
import { LIMITS } from '@/lib/tools/limits'
import { LIMITS as TYPE_LIMITS, NAMING, RATIOS } from '@/lib/type-scale'
import { CHIPS, DENSITY, DISPLAY_FONTS, FONTS, PRESENCE, SEPARATION, SPECIMEN_LIMITS, THEMES, WARMTH } from '@/lib/specimen'

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
    tools: [
      {
        name: 'contrast',
        does: 'WCAG contrast ratios for color pairs, with pass or fail for text, large text, and UI components under the standard you name (default WCAG 2.2 AA).',
        get: u('/api/contrast?fg=<color>&bg=<color>&label=<name>&standard=<standard>'),
        example: u('/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&label=on-primary&standard=wcag-2.2%20AA'),
        post: { url: u('/api/contrast'), body: '{"standard": "wcag-2.2 AA", "pairs": [{"foreground", "background", "label"}]}' },
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
        limits: { radius_px: SPECIMEN_LIMITS.radius, presence: PRESENCE, neutral: WARMTH, separation: SEPARATION, density: DENSITY, chips: CHIPS, theme: THEMES, fonts: FONTS, display_fonts: DISPLAY_FONTS },
        docs: u('/reference/tools#specimen'),
      },
    ],
  })
}

export const OPTIONS = options
