# Usage Analytics: Outline

**Task:** V2.7 (decision D13). **Date:** 2026-11-18. **Status:** awaiting owner review.

**Goal:** aggregate usage statistics, useful for a case study, that follow an anonymous ID from a visit to the site into what that visitor's agent does next: the prompt they copied, the plays their agent fetched, the tools it called, and later sessions on the same project. No personal data.

**Constraint (owner, 2026-11-18):** no tracking across visits. Nothing is stored on the visitor's device: no cookies, localStorage, sessionStorage, or fingerprint. A visit is never linked to an earlier or later visit. The aim is to avoid the EU consent banner obligation.

PostHog facts below were checked against PostHog's docs on 2026-11-18.

---

## 1. What exists today

- PostHog runs in the browser with its default settings, which store an ID in a cookie and localStorage. That conflicts with the constraint, so it changes.
- Copying a prompt adds `?play=…&sid=…` to plain-text links, using a new random ID per copy that isn't linked to anything. It also appends a "[Sistema context: …/api/context…]" line.
- `/api/context` sends one server-side event when an agent fetches that line.
- `/raw` pages are pre-built static files, so agent fetches of plays and workflows record nothing. The tool APIs record nothing.

All three pieces are replaced (section 6).

## 2. The ID, and how it travels

There is one anonymous ID per visit, a random UUID. It lives only in the page's memory and is gone when the tab closes or reloads. It moves only by being written into text the person copies, and from there into their own project.

1. **In the browser:** PostHog starts with `persistence: 'memory'` and `person_profiles: 'never'`, so it writes nothing to the device and builds no person profiles. Its in-memory ID is the visit ID. Client-side navigation keeps it; a reload starts a new one.
2. **In the copied prompt:** the URL in the prompt carries it as `c`, for example `…/raw/workflows/start?c=<id>`.
3. **In what the agent fetches:** a `/raw` response fetched with `c` writes `c` into every Sistema URL it contains: plays, guides, tool calls, and the `continue` URL. The agent passes it on without being asked to.
4. **In the project:** `project.assess` records it in `sistema.json` as `"telemetry": { "id": "<id>" }`, and the `continue` URL already carries it. Later sessions on that project, and later workflows, keep the same ID. The ID is in the person's own repository, where they can see it and remove it. Nothing is stored on their device by the website.
5. **In tool calls and MCP:** tool URLs carry `c` (V2.2 already accepts it). In V4, the MCP connect page puts it in the server URL.

**How `/raw` responses get the ID (recommended):** Next.js middleware sees requests to `/raw/...` that have a `c` parameter. It sends the event and rewrites the request to a dynamic handler that renders the same content with `c` added to each Sistema URL. Requests without `c` still get the pre-built static files, so the build's output checks keep covering them.

Alternatives considered:
- **Render every `/raw` page on request.** It's simpler, but the build would no longer produce static `/raw` files, and the output checks rely on those.
- **Ask the agent to add `c` to every URL.** Agents would forget, and it puts an analytics instruction into every prompt.

## 3. Events

All events are anonymous (`$process_person_profile: false`). Server events use `c` as the distinct ID when present, and a random ID otherwise.

| Event | Sent from | When | Properties |
|---|---|---|---|
| `$pageview` | browser | each page | path, referrer, UTM parameters from the landing URL |
| `prompt_copied` | browser | a prompt is copied | `kind` (workflow, play, route), `id`, `c` |
| `prompt_selected` | browser | a suggestion in the prompt box is chosen (V3) | `kind`, `id` |
| `tool_page_used` | browser | a tool page is used, debounced | `tool`, `standard` (contrast) |
| `agent_fetch` | server | an agent fetches `/raw/...` | `kind` (workflow, workflow_full, play, guide, file, rules, opinions, sources, agents, llms), `id`, `agent` (family from the user agent, such as claude, cursor, openai, other), `c` |
| `tool_call` | server | a tool API is called | `tool`, `method`, `items` (pairs, seeds, or steps), `standard`, `status`, `error` (kind only, never the input) |
| `api_index` | server | `/api` is fetched | `agent` |
| `mcp_*` | server (V4) | MCP connect and tool calls | the same properties as above |

**What these show in aggregate:**
- **The funnel:** visits, then copies, then *activation* (the first `agent_fetch` with that `c`), then *Foundations reached* (`tokens.pipeline` fetched), then *Start finished* (the patterns or session workflow fetched), then *returned* (a fetch with the same `c` a day or more later).
- **Progress and drop-off by play,** and time from copy to each milestone.
- **Which workflows, routes, and plays people start from.**
- **Tool use:** calls per run, batch sizes, error rates, and standards chosen.
- **Which agents people use.**

**What they can't show:** approvals and anything else that happens only on the person's machine. A finished workflow is inferred from the next fetch, not reported. I don't recommend adding a "report that you finished" instruction to the prompts just for analytics.

## 4. Privacy

- **No personal data:** no names, emails, IP addresses, or input values (colors, project names). Tool events record counts and outcomes, not inputs.
- **IP addresses:** in PostHog, set *Settings > Project > General > IP data capture* to discard. (The browser option `ip: false` no longer has any effect.) PostHog derives location from the IP before discarding it. Section 7 asks whether to keep country-level location for the case study or turn it off.
- **Server events** are sent from Vercel's servers, so they carry no visitor IP.
- **A plain-language note on the site** says what's collected, that nothing is stored on the device, how the ID travels, and how to opt out. The site footer links to it, and the agents page mentions it.
- **Opt-out:**
  - *Browser:* if the browser sends Global Privacy Control, PostHog doesn't start, and copied prompts carry no `c`.
  - *Project:* `"telemetry": false` in `sistema.json`. The starter then tells the agent to use `c=off`, and requests with `c=off` send nothing.
  - *Requests without `c`* are still counted, without any ID, so tool and play popularity stays measurable.
- **Not chosen: PostHog's cookieless mode.** It stores nothing on the device, but it ignores opt-out, needs a project setting, and links visits on PostHog's servers through a hash. That works against "no tracking across visits." Memory-only storage is simpler and clearly within the constraint.

## 5. Test traffic

- **Preview deployments** tag every event with `env: preview`. Dashboards filter to production.
- **The V5 harness and the slice runs** use IDs that start with `test-`. **The owner's own runs** use IDs that start with `internal-`. Dashboards exclude both.
- **The owner's own visits** in a browser can't be excluded without storing something on the device. They're a small share; filtering by `env` covers preview work.

## 6. Changes (built in V2.8)

- **Browser:**
  - Re-initialize PostHog: memory-only storage, no person profiles, GPC respected, and autocapture off (it records clicks on every element, which adds noise without helping the funnel).
  - Copying a prompt adds `c` to the prompt's Sistema URLs.
  - Remove the per-copy `sid`, the "Sistema context" line, and the `instrumentRawUrls` rewriting.
- **Server:**
  - Middleware for `/raw` and `/api`: it sends the event to PostHog without blocking the response (`POST https://us.i.posthog.com/i/v0/e/` with `$process_person_profile: false`), and rewrites `/raw` requests that carry `c` to the handler that injects it.
  - Delete `/api/context`.
- **Content model:**
  - `sistema.json` schema gains the optional `telemetry`.
  - `project.assess` records `telemetry.id` from the URL it was fetched with.
  - The starter's resume step keeps `c` on `continue`, and the starter honors `"telemetry": false`.
- **Site:** the privacy note page, a footer link, and a line on the agents page.
- **Tests:**
  - `c` survives from a copied prompt through a `/raw` fetch into a tool URL.
  - `c=off` sends nothing.
  - No event payload contains an IP address, a color value, or other input.
  - The browser code writes nothing to cookies or storage, checked in a real browser with Playwright.
- **Owner's PostHog settings:** discard IP data, set location capture to match decision 7.3, and build the dashboards (section 8).

## 7. Questions for the owner

1. **Approve the design:** a visit ID kept in memory only, carried in copied prompts and stored in the project's `sistema.json`, with the events above?
2. **How `/raw` gets the ID:** middleware plus a dynamic handler for requests with `c` (recommended), or render all `/raw` pages on request?
3. **Location:** keep country-level location from PostHog's IP lookup, which is useful for a case study ("used in 30 countries"), or turn the lookup off entirely?
4. **Opt-out meaning:** recommended: `c=off` sends nothing, and requests without any `c` are counted anonymously. Alternative: also send nothing for requests without `c`, which loses most tool and play popularity data.

## 8. Dashboards to set up (after V2.8)

- **Funnel:** visit, copy, activation, Foundations reached, Start finished, returned.
- **Plays by fetch count,** and drop-off between consecutive plays in Start.
- **Tool calls per day** by tool, with error rate.
- **Agent families** over time.
- **Time from copy to activation** and from activation to Start finished (medians).
