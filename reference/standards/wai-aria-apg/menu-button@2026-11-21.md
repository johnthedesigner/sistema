---
system: wai-aria-apg
category: accessibility
topic: menu-button
content_type: pattern
status: latest
retrieved: 2026-11-21
source_url: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
license: W3C Software and Document License
tags: [wai-aria, apg, keyboard, components, accessibility]
---

> Notes from the W3C WAI-ARIA Authoring Practices Guide, retrieved 2026-11-21 from the official repository (w3c/aria-practices, content/patterns/menu-button). Navigation and example links stripped.

# Menu Button Pattern

## About This Pattern

 A menu button is a button that opens a menu as described in the Menu and Menubar Pattern.
 It is often styled as a typical push button with a downward pointing arrow or triangle to hint that activating the button will display a menu.

## Examples

- Action Menu Button Example Using aria-activedescendant: A button that opens a menu of actions or commands where focus in the menu is managed using aria-activedescendant.

- Action Menu Button Example Using element.focus(): A menu button made from an HTML `button` element that opens a menu of actions or commands where focus in the menu is managed using `element.focus()`.

- Navigation Menu Button: A menu button made from an HTML `a` element that opens a menu of items that behave as links.

## Keyboard Interaction

 With focus on the button:

- Enter: opens the menu and places focus on the first menu item.

- Space: Opens the menu and places focus on the first menu item.

- (Optional) Down Arrow: opens the menu and moves focus to the first menu item.

- (Optional) Up Arrow: opens the menu and moves focus to the last menu item.

- The keyboard behaviors needed after the menu is open are described in the Menu and Menubar Pattern.

## WAI-ARIA Roles, States, and Properties

- The element that opens the menu has role button.

- The element with role `button` has aria-haspopup set to either `menu` or `true`.

 When the menu is displayed, the element with role `button` has aria-expanded set to `true`.
 When the menu is hidden, `aria-expanded` is set to `false`.

 The element that contains the menu items displayed by activating the button has role menu.

 Optionally, the element with role `button` has a value specified for aria-controls that refers to the element with role `menu`.

- Additional roles, states, and properties needed for the menu element are described in the Menu and Menubar Pattern.
