---
system: wai-aria-apg
category: accessibility
topic: disclosure
content_type: pattern
status: latest
retrieved: 2026-11-21
source_url: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
license: W3C Software and Document License
tags: [wai-aria, apg, keyboard, components, accessibility]
---

> Notes from the W3C WAI-ARIA Authoring Practices Guide, retrieved 2026-11-21 from the official repository (w3c/aria-practices, content/patterns/disclosure). Navigation and example links stripped.

# Disclosure (Show/Hide) Pattern

## About This Pattern

 A disclosure is a widget that enables content to be either collapsed (hidden) or expanded (visible).
 It has two elements: a disclosure button and a section of content whose visibility is controlled by the button.
 When the controlled content is hidden, the button is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content.
 When the content is visible, the arrow or triangle typically points down.

## Examples

- Disclosure (Show/Hide) of Image Description

- Disclosure (Show/Hide) of Answers to Frequently Asked Questions

- Disclosure (Show/Hide) Navigation Menu

- Disclosure (Show/Hide) Navigation Menu with Top-Level Links

- Disclosure (Show/Hide) Card

## Keyboard Interaction

When the disclosure control has focus:

- Enter: activates the disclosure control and toggles the visibility of the disclosure content.

- Space: activates the disclosure control and toggles the visibility of the disclosure content.

## WAI-ARIA Roles, States, and Properties

- The element that shows and hides the content has role button.

 When the content is visible, the element with role `button` has aria-expanded set to `true`.
 When the content area is hidden, it is set to `false`.

 Optionally, the element with role `button` has a value specified for aria-controls that refers to the element that contains all the content that is shown or hidden.
