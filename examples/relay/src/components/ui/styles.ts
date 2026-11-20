/**
 * Shared class strings for Relay's components. One place for the focus ring,
 * the form-control frame, floating layers, and list items, so every component
 * gets the same treatment. Role tokens only (DESIGN.md).
 */

/** The keyboard focus ring: 2px `border-focus`, offset 2px (DESIGN.md Colors). */
export const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-border-focus"

/** Same ring for a frame whose focus is on an inner control (input groups). */
export const focusWithinRing =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-border-focus"

/** Invalid state: thicker `error` edge (always paired with a text message). */
export const invalidEdge =
  "aria-invalid:border-error aria-invalid:ring-1 aria-invalid:ring-inset aria-invalid:ring-error"

/** Frame shared by text fields, selects, and the combobox. */
export const controlFrame =
  "rounded-md border border-input bg-surface-raised text-body text-on-surface transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50"

/** Menus, select and combobox lists, tooltips, dialogs: floating layers.
 * Separated by shadow-overlay (and, in dark, the lighter overlay tone), not a border. */
export const floatingLayer =
  "rounded-xl bg-surface-overlay text-on-surface shadow-overlay"

/**
 * An item inside a menu or list. Highlight is surface-overlay-hover plus an inset
 * focus ring, so the active item shows for keyboard users in both themes.
 */
export const listItem =
  "relative flex min-h-8 w-full cursor-default items-center gap-2 rounded-sm px-2 text-body text-on-surface outline-none select-none data-highlighted:bg-surface-overlay-hover data-highlighted:outline-2 data-highlighted:outline-solid data-highlighted:-outline-offset-2 data-highlighted:outline-border-focus data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

/** Open/close animation for floating layers; none when reduced motion is on. */
export const floatingMotion =
  "duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none"
