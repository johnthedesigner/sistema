---
id: project.migrate-brief
title: Move from a living brief
description: Turn an older Sistema LIVING_BRIEF.md into DESIGN.md, DECISIONS.md, and sistema.json, checking each claim against the code and asking the person to settle any conflict.
topic: project
kind: change
milestone: direction
entry: true
requires: []
produces: [sistema.json, DECISIONS.md, AGENTS.md, "design-md#overview", "design-md#colors", "design-md#typography", "design-md#layout", "design-md#elevation-depth", "design-md#shapes", "design-md#components", "design-md#dos-donts"]
tools: []
knowledge: []
rules: [project.read-before-asking, project.migrate.every-line-placed, project.state.valid, project.state.pointer, visual-language.design-md.roles-not-values]
evidence: A placement table covering every line of the brief, the conflicts found and how the person settled each one, a valid sistema.json, a DECISIONS.md with one entry per brief log entry, and DESIGN.md with the specification's eight sections.
overrides: []
last_reviewed: 2026-11-17
---
Earlier versions of Sistema kept project state in one file, `LIVING_BRIEF.md`. Sistema now splits it in three: DESIGN.md holds the visual language agents read, DECISIONS.md holds the dated decisions and their reasons, and `sistema.json` holds the project rules and workflow progress. This play moves the brief's content into those files. It changes no tokens or components.

1. **Read everything first:** `LIVING_BRIEF.md`, any existing DESIGN.md, DECISIONS.md, and `sistema.json`, the agent instructions file (`AGENTS.md` or `CLAUDE.md`), `package.json`, and the token source files. The brief may be out of date, so treat it as a claim to check, not as the truth.

2. **Place every line of the brief.** Make a table with one row per brief item (a field, a decision, a log entry, an open question) and where it goes:

   | Brief item | Goes to |
   |---|---|
   | Product, audience, stance | DESIGN.md Overview, and the positioning statement in DECISIONS.md |
   | Density, theme, platform, stack, accessibility standard | `sistema.json` `project` |
   | Key decisions for color, type, spacing, shape, elevation | The matching DESIGN.md section, as roles and how to use them. The reasons go to DECISIONS.md |
   | Motion and other concerns with no DESIGN.md section | Do's and Don'ts, plus a DECISIONS.md entry |
   | Decision log entries | DECISIONS.md, one line each, with their original dates |
   | Resolved open questions | DECISIONS.md |
   | Unresolved open questions and known gaps | `Provisional:` lines in the DESIGN.md section they affect |
   | Current state inventory (files, components, pages) | Nowhere: the repo already shows it. Say so in the table |

   Every row needs a destination or the reason it was left out. Don't drop anything silently.

3. **Check the brief against the code and against DESIGN.md.** For each value or claim the brief states, look at the token files and components. List every conflict: the brief says one thing, the code or DESIGN.md says another, or two parts of the brief disagree. An older log entry that a later entry replaced is history, not a conflict; carry both over. Show the list with what each source says, and ask the person which is right. Don't choose for them. If the code has drifted from a deliberate decision, the answer may be to keep the decision and fix the code later; note that in DECISIONS.md.

4. **Write DECISIONS.md.** If it exists, add to it. Otherwise its first line is `This project follows Sistema. To continue, fetch the URL in sistema.json "continue".`, then a heading. Write one line per entry in the form `<date> | <title> | <what was decided and why>`, oldest first. Mark carried-over entries `(from LIVING_BRIEF.md)`. Add the positioning statement, rewritten from the brief's identity section in 100 to 200 words, and one entry per conflict the person settled.

5. **Write DESIGN.md.** Use the specification's eight sections, in its order: `{{sistema_url}}/raw/files/design-md#sections`. Keep what the existing body says unless a settled conflict changed it. Name roles, not values. Leave any existing front matter alone: the token pipeline regenerates it from the DTCG token files. If the file holds token values as bare YAML with no `---` lines around them, wrap them in `---` lines so they become front matter, and write the body below. If the token sources are not DTCG JSON under `tokens/src/`, note in DECISIONS.md that the token pipeline play should move them. Add the pointer line at the top if it is missing: `<!-- This project follows Sistema. To continue, fetch the URL in sistema.json "continue". -->`

6. **Write `sistema.json`,** in the shape the workflow starter gives. Fill `project` from the brief and the settled conflicts. If the brief doesn't name an accessibility standard, ask for one. Set `workflow` and `continue` to the workflow you are running, and `milestone` to `maintain` if that workflow is Work on the system. Record only this play in `steps`. Earlier work goes in DECISIONS.md, not in `steps`, because it was not done by Sistema's current plays. The plays that follow check their own outputs.

7. **Add the Sistema section to the agent instructions file,** as the Assess play describes, if it is missing. If the file tells agents to read `LIVING_BRIEF.md`, show those lines and offer replacement text that points to DESIGN.md and DECISIONS.md. Change them only if the person agrees.

8. **Keep the brief.** Add one line at its top: `Moved to DESIGN.md, DECISIONS.md, and sistema.json on <date>. Kept for reference.` Ask whether the person wants to delete it.

9. **Show the evidence:** the placement table, the conflicts and their resolutions, the count of log entries in the brief and in DECISIONS.md, the final `sistema.json`, and DESIGN.md's section headings with every provisional item. Then continue with the workflow.
