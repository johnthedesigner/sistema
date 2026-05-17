---
system: mailchimp
category: content
topic: writing-for-accessibility
content_type: guidance
status: latest
retrieved: 2026-05-16
source_url: https://styleguide.mailchimp.com/writing-for-accessibility/
tags: [accessibility, alt-text, headings, links, forms, plain-language]
---

# MailChimp — Writing for Accessibility

## Core principle

Accessible writing serves diverse audiences with varying abilities and interaction methods — including screen reader users, keyboard navigation users, and those with cognitive differences. Accessibility is not a checklist; it is a writing practice that benefits all readers.

Accessibility requirements may be legally mandated depending on the reader's location. Design for the broadest possible audience by default.

---

## Headings and structure

Headers must follow a nested, consecutive pattern without skipping levels:
- Page title → H1
- Top-level sections → H2
- Subsections → H3 and deeper

Do not skip heading levels for visual styling purposes. Do not create excessive nesting. Place the most critical information first in every section.

---

## Content organization

- Group related topics within paragraphs; separate distinct topics with headings
- Use actual list elements for list content — not run-on sentences with commas
- Outlines with key messages help establish logical organization before writing begins
- Keep sentences short and paragraphs focused on one idea

---

## Link text

Link text must describe its destination or the action it triggers. Generic phrases fail users of assistive technology who navigate by link text alone.

| Do | Don't |
|---|---|
| "Read the accessibility guide" | "Click here" |
| "Download the 2025 report (PDF)" | "Learn more" |
| "Contact our support team" | "Here" |

---

## Form labels

- Use explicit, clear labels for every input field — implemented with correct HTML label elements
- Minimize the number of form fields (shorter forms are more accessible)
- Explicitly mark required fields

---

## Alt text

Images fall into two categories with different alt text requirements:

**Creative or narrative images:** Provide detailed descriptive captions that communicate the content and intent. A photo of a team celebrating should describe what is happening, not just "Team photo."

**Functional images:** Describe the content so that a non-visual user receives identical information. A chart showing Q3 revenue by region should have alt text that summarizes the data, not "chart."

**Decorative images:** Use empty alt text (`alt=""`) so screen readers skip them.

Browser handling of alt attributes varies. Supplement with standard captions when the image carries significant content.

---

## Video and audio

All videos require closed captions or full transcripts. Present video information in an alternative format for users who cannot access audio or video.

---

## Visual contrast and color

Do not rely on color alone to communicate meaning — always provide a text label or pattern in addition to color coding. Maintain high contrast between text and background for users with low vision.

---

## Avoiding directional language

Do not use instructions that assume screen layout or visual position:

| Do | Don't |
|---|---|
| "Select from these options:" | "Select from the options in the right sidebar" |
| "Use the navigation menu" | "Click the menu at the top" |

Directional language fails on mobile, alternative layouts, and screen readers.

---

## Plain language

- Use short sentences with familiar vocabulary
- Explain abbreviations and acronyms on first mention
- Minimize jargon and domain-specific slang
- A simpler word is almost always more accessible than a technical equivalent
