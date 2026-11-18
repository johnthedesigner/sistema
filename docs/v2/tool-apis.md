# Tool APIs: Outline

**Task:** V2.0. **Date:** 2026-11-17. **Status:** awaiting owner review.

This sets the public shape of every tool API before V2 builds them. In V4, the MCP server exposes the same tools (`palette`, `contrast`, `type_scale`), so these shapes are expensive to change later. Items marked ⚑ need your decision; everything else is a recommendation you can just accept.

---

## 1. Conventions for every tool

- **GET first, POST for batches.** Every tool answers a plain GET with query parameters, because some agents can only fetch URLs. POST takes the same inputs as JSON, for large batches. Both return the same response shape.
- **Colors** may be hex (`#1F5FD1` or `#15D`), `rgb(31 95 209)` or `rgb(31, 95, 209)`, or `oklch(0.52 0.18 260)`. Responses echo each color as hex and as OKLCH. Out-of-gamut OKLCH is mapped into sRGB, and the response says so.
- **Errors** return status 400 with `{ "error": "...", "example": "<a working GET URL>" }`. The example lets an agent fix its call without reading documentation.
- **JSON only.** Agents read JSON well, so there's no plain-text format.
- **Open to any origin** (CORS `*`), so browser-based agents and the tool pages can call them.
- **No authentication and no state.** The same input always gives the same output.
- **An index** at `GET /api` lists each tool, its GET and POST forms, limits, and a link to its documentation page.

## 2. Contrast

**GET, one pair:**
```
/api/contrast?fg=%23FFFFFF&bg=%231F5FD1&standard=wcag-2.2&level=AA
```

**GET, several pairs:** repeat `fg` and `bg` in order, up to 50 pairs. They're paired by position, so there's no separator to escape. Commas in `rgb()` and slashes in `oklch()` stay safe.
```
/api/contrast?fg=%23FFF&bg=%231F5FD1&fg=%2316191D&bg=%23FFF&label=on-primary&label=body
```

**POST:** `{ "standard": "wcag-2.2", "level": "AA", "pairs": [{ "foreground", "background", "label" }] }`, up to 200 pairs.

**Response:**
```json
{
  "standard": "wcag-2.2", "level": "AA",
  "results": [{
    "label": "on-primary",
    "foreground": { "hex": "#FFFFFF", "oklch": "oklch(1 0 0)" },
    "background": { "hex": "#1F5FD1", "oklch": "oklch(0.52 0.19 261)" },
    "ratio": 5.81,
    "checks": {
      "text":       { "rule": "color.contrast.text",       "required": 4.5, "pass": true },
      "large_text": { "rule": "color.contrast.large-text", "required": 3,   "pass": true },
      "ui":         { "rule": "color.contrast.ui",         "required": 3,   "pass": true }
    }
  }]
}
```

**What changes from today:** the response no longer hardcodes WCAG 2.x thresholds (`aa_text`, `aaa_text` and so on). The required values come from the rules registry for the standard and level asked for, so the API follows the project's choice like everything else in Sistema. Each check names its rule. Single-pair requests also return `results`, so there's one response shape.

⚑ **Decision A: the default when no standard is given.** Sistema doesn't set universal thresholds, but a bare call needs some answer.
- **Recommended:** default to `wcag-2.2` AA, and say so in the response (`"standard": "wcag-2.2", "level": "AA", "defaulted": true`). Plays always pass the project's standard from `sistema.json`.
- **Alternative:** return only the ratio, with no checks, unless a standard is given.

## 3. Palette

**GET:** each query parameter is a named seed, up to 12.
```
/api/palette?primary=%231F5FD1&neutral=oklch(0.55%200.01%20260)
```

**POST:** `{ "colors": { "primary": "#1F5FD1", "neutral": "oklch(0.55 0.01 260)" } }`, unchanged except for the new color formats.

**Response:** unchanged, plus `oklch` on each stop. (Stop values below are illustrative.)
```json
{ "palettes": { "primary": { "seed": "#1F5FD1", "stops": {
  "50":  { "hex": "#F4F7FE", "oklch": "oklch(0.97 0.01 260)", "contrast_white": 1.06, "contrast_black": 19.8 },
  "...": {},
  "950": { "hex": "...", "oklch": "...", "contrast_white": 18.0, "contrast_black": 1.17 }
} } } }
```

Stops stay 50 to 950 (19 stops), placed by contrast against white, as now. Seed names may be any lowercase name. A seed called `standard`, `level`, or `format` is rejected with a message, so those names stay free for future options.

## 4. Type scale (new)

**GET:**
```
/api/type-scale?base=16&ratio=major-third&down=2&up=6&names=tailwind
```

**Inputs:**

| Parameter | Meaning | Default |
|---|---|---|
| `base` | Body size in px | 16 |
| `ratio` | A number (`1.25`) or a name (`minor-third`, `major-third`, `perfect-fourth`, and so on) | `major-third` (1.25) |
| `down`, `up` | Steps below and above the base | 2 and 6 |
| `names` | How steps are named: `tailwind` (`xs` … `9xl`, on Tailwind's ladder), `numeric` (`1` … `n`, smallest first), or `steps` (`-2` … `6`) | `numeric` |
| `roles` | Optional. Role names placed on steps, for example `roles=caption:-2,label:-1,body:0,heading-sm:2,heading-lg:4,display:6` | none |
| `round` | Round sizes to whole px (`true`) or keep exact values | `true` |

**Response:**
```json
{
  "base": 16, "ratio": 1.25, "names": "numeric",
  "steps": [
    { "step": -2, "name": "1", "role": "caption", "px": 10, "rem": 0.625, "line_height": 1.5,
      "notes": ["10px is below the size most interface text uses; check legibility for this typeface"] },
    { "step": 0, "name": "3", "role": "body", "px": 16, "rem": 1, "line_height": 1.5 },
    { "step": 6, "name": "9", "role": "display", "px": 61, "rem": 3.8125, "line_height": 1.1 }
  ],
  "checks": [{ "rule": "typography.line-height.by-role", "pass": true }]
}
```

**How it relates to the rules and guides:**
- **Line height is suggested per size.** It falls as size grows, following the typography guide's "Per-size calibration", and is always unitless. It's a starting suggestion. The play still sets the final value per role, for its typeface and measure.
- **Checks only test what a calculation can prove:** every step has a unitless line height, and, when a `standard` is given, body text meets that standard's line-height requirement (rule `typography.line-height.body`). Weight and tracking aren't the tool's job, so `typography.roles.distinct` stays with the play.
- **Guide ranges become notes, not failures,** for example a very small size or a display line height above the guide's range. This follows the opinion that guide numbers are guidance.
- **Naming isn't assumed.** The tool names steps in the convention asked for and places roles only where the caller names them. This matches the typography guide's "Naming type".

⚑ **Decision B: what the default page and API show for the smallest steps.** Today's page shows a 9px caption at a 1.333 ratio.
- **Recommended:** default to `ratio=major-third` with `down=2`, which gives 10px and 13px below a 16px base, and attach a note to any size under 12px. Nothing is blocked, because the registry has no minimum text size.
- **Alternative:** add a registry rule for a minimum interface text size, and have the tool check it. That would be a new Sistema default, so it belongs in the opinions first.

## 5. The index

`GET /api` returns:
```json
{ "tools": [
  { "name": "contrast", "get": "/api/contrast?fg=...&bg=...&standard=...&level=...", "post": "/api/contrast", "limits": { "get_pairs": 50, "post_pairs": 200 }, "docs": "/reference/tools#contrast" },
  { "name": "palette", "...": "..." },
  { "name": "type_scale", "...": "..." }
] }
```
In the published response, these URLs are absolute. `llms.txt` and `/raw/agents` link to the index.

## 6. What happens to callers

- **Plays** that call the tools get the new GET forms in their tool blocks (generated from one place, `TOOL_DOCS`), with the project's standard passed through.
- **The tool pages** (`/tools/contrast`, `/tools/palette`, `/tools/type-scale`) call the same code. The type scale page's defaults come from the API's defaults, so the page and the API can't disagree again.
- **No compatibility layer** is needed for the old contrast response shape (`aa_text` and so on), because there are no outside users.

## 7. Questions for the owner

1. Approve the conventions (section 1) and the shapes as outlined?
2. ⚑ Decision A: should contrast default to WCAG 2.2 AA (stated in the response) when no standard is given, or return only the ratio?
3. ⚑ Decision B: should small type sizes get advisory notes (recommended), or should there be a new minimum-size rule?
