---
category: principles
topic: motion-architecture
content_type: synthesis
status: latest
retrieved: 2026-05-13
tags: [motion, animation, easing, duration, reduced-motion, accessibility, synthesis]
sources:
  - kb/reference/design-systems/ant-design/guidance/foundations/design-tokens
  - kb/reference/design-systems/atlassian/guidance/foundations/design-tokens
---

# Motion Architecture — Synthesis

## Overview

Motion in a design system is infrastructure, not decoration. A motion system defines the easing curves and duration ranges that all animations reference — ensuring that transitions across the product feel consistent and intentional rather than each component doing its own thing. When done well, motion is nearly invisible: users experience the UI as responsive and alive without noticing the animations themselves.

---

## `prefers-reduced-motion` is non-negotiable

This is the only requirement with no exception: every animated UI must respect the `prefers-reduced-motion` media query.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or per-animation:
```css
.element {
  transition: transform 250ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
  }
}
```

The population of users who set `prefers-reduced-motion` includes people with vestibular disorders, photosensitive epilepsy, and motion sickness — for whom some animations cause physical symptoms. This is not a preference; it is a medical accommodation.

**Design motion as an enhancement, not a requirement.** If the UI cannot be understood or operated without animation, the design has a structural problem. Animation should communicate state changes and spatial relationships, not be the only mechanism for doing so.

---

## Easing curve semantics

Easing curves are not interchangeable. Each curve has a semantic that matches specific interaction types:

**`ease-out` (fast start, slow finish):** For elements entering the screen or appearing — moving toward the user's attention. Fast start respects impatience; slow finish gives the element time to settle into its resting position. The most commonly used curve for UI entrances.

**`ease-in` (slow start, fast finish):** For elements exiting the screen or disappearing — moving away from the user's attention. Slow start acknowledges the element was present; fast finish gets it out of the way quickly.

**`ease-in-out` (slow start, fast finish, slow end):** For elements moving between two positions within the viewport — neither entering nor leaving. The deceleration at the end gives the destination some weight.

**`linear`:** For looping animations and progress indicators where acceleration would feel artificial. Also correct for opacity fades where easing adds no perceptual value.

Define these as named tokens rather than using the curve values directly:

```css
--motion-easing-enter:  cubic-bezier(0.0, 0.0, 0.2, 1);   /* ease-out */
--motion-easing-exit:   cubic-bezier(0.4, 0.0, 1, 1);     /* ease-in  */
--motion-easing-move:   cubic-bezier(0.4, 0.0, 0.2, 1);   /* ease-in-out */
--motion-easing-linear: linear;
```

The specific cubic-bezier values are less important than using them consistently. Pick curves that feel natural at your product's typical durations, then apply them semantically across all animations.

---

## Duration guidelines

Duration is about distance and importance, not a single universal value.

**100–150ms:** Micro-interactions. State changes that happen in-place with no movement: focus rings appearing, checkboxes ticking, toggle switches snapping. Short enough to feel instant; long enough to register as a deliberate state change.

**150–250ms:** Small movements. Dropdown menus opening, tooltips appearing, selection highlights spreading. The user triggered these and expects a quick response.

**250–350ms:** Moderate transitions. Panels sliding in, dialogs appearing, navigation drawers opening. These involve meaningful movement across a significant portion of the screen.

**350–500ms:** Large transitions. Full-screen transitions, complex layout reflows, large images loading into view. At this range, the animation is part of the experience rather than a response to input.

**Above 500ms:** Avoid for interactive responses. Only appropriate for cinematic introductions, loader animations, or contextual content that explicitly takes time (skeleton screens transitioning to content).

**The rule of thumb:** Longer animations should cover more distance. A 300ms transition for a 10px movement feels sluggish; a 300ms transition for a panel sliding in from off-screen feels correct. If an animation feels too slow, try reducing duration before adjusting the easing curve.

---

## Functional vs. expressive motion stance

Before building a motion system, establish where the product sits on the functional/expressive axis. This determines how prominent and extensive your motion system needs to be.

**Functional motion:** Animations exist to communicate state changes, spatial relationships, and cause-and-effect. They are short, unobtrusive, and serve a purpose a user could articulate if asked. Data dashboards, developer tools, admin interfaces — motion is here to help, not to impress.

Required animations in a functional stance:
- State changes (selected, active, disabled, loading)
- Appearance/disappearance of overlays (dropdowns, tooltips, dialogs)
- Focus ring transitions
- Skeleton-to-content transitions

**Expressive motion:** Animations contribute to the product's personality and emotional quality. Entrances have character; transitions have choreography; interactions feel pleasurable beyond their functional purpose. Consumer apps, creative tools, onboarding flows — motion is a design material.

Additional considerations in an expressive stance:
- Entrance choreography (sequential reveals, staggered lists)
- Page transition continuity (shared element transitions)
- Micro-delights (subtle reactions to successful actions)
- Brand-consistent easing curves that distinguish the product from generic defaults

**Both stances require `prefers-reduced-motion` support.** In an expressive system, reduced-motion mode does not mean no motion — it means functional motion only. State changes and overlay transitions are still useful; choreography and decorative motion are removed.

---

## Duration and easing token structure

A minimal motion token set that covers most product needs:

```css
/* Easing */
--motion-easing-enter:    cubic-bezier(0.0, 0.0, 0.2, 1);
--motion-easing-exit:     cubic-bezier(0.4, 0.0, 1.0, 1);
--motion-easing-move:     cubic-bezier(0.4, 0.0, 0.2, 1);
--motion-easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot */

/* Duration */
--motion-duration-instant:  100ms;  /* micro-interactions */
--motion-duration-fast:     150ms;  /* small state changes */
--motion-duration-moderate: 250ms;  /* component transitions */
--motion-duration-slow:     350ms;  /* panel/drawer transitions */

/* Composite tokens (easing + duration paired for common patterns) */
--motion-enter: var(--motion-duration-moderate) var(--motion-easing-enter);
--motion-exit:  var(--motion-duration-fast) var(--motion-easing-exit);
```

Components consume the composite tokens by default. When a component has unusual timing needs, it references the individual easing and duration tokens directly.

**The `motion: false` global disable:** Some systems (Ant Design) expose a `motion: false` global token that disables all animations at once. This is a useful escape hatch for testing, server-side rendering, and low-power environments — but it is not a substitute for `prefers-reduced-motion` support, which respects the user's OS-level setting automatically.
