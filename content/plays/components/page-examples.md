---
id: components.page-examples
title: Build page examples
description: Compose one or two realistic pages from the real components and tokens, so the person can judge the system at the scale of a screen, in every theme.
topic: components
kind: create
milestone: patterns
entry: true
requires: ["project:component-library"]
produces: []
tools: []
knowledge:
  - guide.spacing.layout#the-scale-as-a-unified-system
  - guide.quality.visual-quality-signals#reflexes
rules: [tokens.usage.no-raw-values, spacing.never-arbitrary, content.voice.baseline]
evidence: The page routes, screenshots of each page in every theme at desktop, tablet, and phone width, the list of gaps, and a passing build.
overrides: []
last_reviewed: 2026-11-20
---
1. **Propose two page types** from the positioning statement, for example a dashboard with navigation, a table, and summary figures; a detail view; or a settings page with forms. Ask the person to confirm or change them.

2. **Build each page as a route** (for example `/sistema-review/pages/<name>`) from the real components. No new one-off styles: if a page needs something the components don't cover, note it as a gap. The emphasis surfaces the emphasis map names (a featured item, a brand block) are tokens, not new styles: build them from those tokens and note in the gap list that they have no component yet.

3. **Write real content** for the product: names, numbers, and messages a user of this product would see, in the voice of VOICE_AND_TONE.md if it exists. No placeholder text.

4. **Check it at full desktop width, at 768px, and at phone width (390px),** in every theme. Take screenshots and look at them: hierarchy, density, color use against the commitment level, alignment, and how navigation works at each width. Run the build without disturbing a running dev server (build into a separate folder, or stop the server first).

5. Show the evidence and the list of gaps, and ask the person to open the pages.
