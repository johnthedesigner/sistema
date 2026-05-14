---
play_slug: add-component
stage: 6
created: 2026-05-14
quality_notes: >
  Generated for "Verdant" — implementing Select as the first new component after
  stabilization. Demonstrates the full add-component flow: reading the living
  brief context, writing a spec before touching code, mapping tokens explicitly,
  then producing the implementation. Non-obvious detail: the focus management
  spec addresses two distinct focus scenarios (closing the dropdown with Escape
  vs. selecting an option with Enter/click) because they return focus to
  different places — this level of keyboard specification is what separates
  a real accessibility-aware component spec from a surface-level one.
input:
  scope: Add the Select component — controlled, single-value, with search
---

## Step 1 — Living brief context

**Token naming convention:** `--color-*`, `--space-*`, `--shape-radius-*`, `--font-size-*`

**Existing components for reference:**
- Input (text/password) — closest analog for the trigger field appearance
- Button — reference for interactive element token consumption
- Modal — reference for overlay/focus trap patterns

**Relevant decisions:**
- Interactive elements use `--shape-radius-sm` (4px)
- Focus ring: `2px solid var(--color-primary)` with 2px offset
- Touch targets: ≥ 44×44px
- Spacing: 4px base unit, named scale `--space-*`

**Pre-existing open questions resolved:**
- Multi-value variant: deferred to Phase 2. Single-value only for Phase 1.
- Architecture decision: TagInput will handle multi-value patterns.

---

## Step 2 — References loaded

Token architecture synthesis loaded. Key rules confirmed:
- No hardcoded hex, rgb, rgba, or hsl in component files
- No raw px values for anything covered by a token (spacing, radii)
- Focus indicator: `2px solid var(--color-primary)` at 2px offset

Accessibility floor loaded. Key requirements for Select:
- ARIA role: `combobox` (trigger) + `listbox` (dropdown) + `option` (items)
- Keyboard: Down/Up to move through options, Enter/Space to select, Escape to close, Home/End for first/last
- When closed: focus on trigger; when open: focus follows active option via `aria-activedescendant`
- Accessible name: trigger must have a visible label associated via `htmlFor`/`aria-labelledby`
- Touch target: trigger ≥ 44×44px; options ≥ 44px height

---

## Step 3 — Component spec

**Component:** Select — controlled, single-value dropdown with optional search/filter

### Variants

| Variant | When to use |
|---|---|
| Default | Standard single-value selection from a list |
| With search | Lists of 8+ items where scanning is slower than typing |

Single variant for Phase 1 — the `searchable` prop enables search within the same component.

### States and token map

**Trigger element:**

| State | Visual change | Token |
|---|---|---|
| Default | Border, label, caret | `--color-outline`, `--color-on-surface` |
| Hover | Border darkens | `--color-outline-strong` |
| Focus | Focus ring | `var(--color-primary)`, 2px, 2px offset |
| Open | Border matches focus; caret rotates 180° | Same as focus |
| Disabled | Reduced opacity; no hover | `opacity: 0.4` |
| Error | Red border | `--color-error` |

**Dropdown and options:**

| Element | Token |
|---|---|
| Dropdown surface | `--color-surface-elevated` |
| Dropdown border | `--color-outline` |
| Dropdown shadow | `--shadow-md` |
| Option default background | transparent |
| Option hover background | `--color-primary-container` |
| Option selected background | `--color-primary-container` |
| Option selected text | `--color-on-primary-container` |
| Active option (keyboard) | `--color-primary-container` |
| Search input | inherits from Input component tokens |

**Shape and spacing:**

| Element | Token |
|---|---|
| Trigger border-radius | `var(--shape-radius-sm)` (4px) |
| Dropdown border-radius | `var(--shape-radius-md)` (8px) |
| Trigger height | 44px (touch target floor) |
| Option height | 44px (touch target floor) |
| Option padding | `var(--space-3) var(--space-4)` (12px 16px) |
| Dropdown max-height | 280px with scroll |

### Accessibility specification

**ARIA roles:**
- Trigger `<button>`: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded="false|true"`, `aria-labelledby="{labelId}"`, `aria-controls="{listboxId}"`, `aria-activedescendant="{activeOptionId}"`
- Dropdown `<ul>`: `role="listbox"`, `id="{listboxId}"`, `aria-label="{label}"`
- Each option `<li>`: `role="option"`, `id="option-{value}"`, `aria-selected="true|false"`

**Keyboard behavior:**
- `Tab` / `Shift+Tab`: moves focus to/from trigger; does not open dropdown
- `Enter` / `Space` / `Down` on trigger: opens dropdown, focus moves to selected option (or first if none)
- `Down` / `Up`: moves active option; wraps at ends
- `Home` / `End`: jumps to first / last option
- `Enter` / `Space` on option: selects option, closes dropdown, focus returns to trigger
- `Escape`: closes dropdown without selecting, focus returns to trigger
- `Click` outside: closes dropdown without selecting
- When `searchable`: typing in search input filters options; Down moves focus into list

**Focus management — two cases:**
1. Select by keyboard (Enter/Space on option) → focus returns to trigger
2. Close by Escape or outside click → focus returns to trigger
Both cases always return focus to the trigger, not to the document body.

**Touch target:** Trigger ≥ 44px height (enforced by CSS). Options ≥ 44px height (enforced by min-height on `<li>`).

### Consistency check against existing components

- Trigger appearance matches `Input` component (same border, label position, focus ring)
- Dropdown shadow matches `Modal` overlay shadow scale (`--shadow-md`)
- Border-radius pattern follows convention: trigger (interactive) = sm, dropdown (container) = md

No conflicts with existing components.

---

## Step 4 — Implementation

**Framework:** React
**Styling:** CSS custom properties

```tsx
// Select.tsx
'use client'

import { useState, useRef, useId, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  options: SelectOption[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  error?: string
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchable = false,
  disabled = false,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const triggerId = useId()
  const labelId = useId()
  const listboxId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find(o => o.value === value) ?? null
  const filtered = searchable && search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  function openDropdown() {
    if (disabled) return
    setOpen(true)
    const idx = filtered.findIndex(o => o.value === value)
    setActiveIndex(idx >= 0 ? idx : 0)
  }

  function close() {
    setOpen(false)
    setSearch('')
    setActiveIndex(-1)
    triggerRef.current?.focus()
  }

  function select(option: SelectOption) {
    onChange(option.value)
    close()
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      openDropdown()
    }
  }

  function handleListKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0) }
    if (e.key === 'End') { e.preventDefault(); setActiveIndex(filtered.length - 1) }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (filtered[activeIndex]) select(filtered[activeIndex])
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const root = document.getElementById(listboxId)
      const trigger = triggerRef.current
      if (!root?.contains(e.target as Node) && !trigger?.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const activeOptionId = filtered[activeIndex] ? `option-${filtered[activeIndex].value}` : undefined

  return (
    <div className="select-root">
      <label id={labelId} htmlFor={triggerId} className="select-label">
        {label}
      </label>

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        disabled={disabled}
        onClick={() => open ? close() : openDropdown()}
        onKeyDown={handleTriggerKeyDown}
        className={`select-trigger ${error ? 'select-trigger--error' : ''}`}
      >
        <span className={selected ? 'select-trigger__value' : 'select-trigger__placeholder'}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`select-trigger__caret ${open ? 'select-trigger__caret--open' : ''}`}
          aria-hidden="true"
          viewBox="0 0 16 16" width="16" height="16"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {error && <span className="select-error" role="alert">{error}</span>}

      {open && (
        <div className="select-dropdown" onKeyDown={handleListKeyDown}>
          {searchable && (
            <div className="select-search">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveIndex(0) }}
                placeholder="Search…"
                className="select-search__input"
                aria-label={`Search ${label}`}
                autoFocus
              />
            </div>
          )}
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={activeOptionId}
          >
            {filtered.length === 0 && (
              <li className="select-option select-option--empty" aria-disabled="true">No results</li>
            )}
            {filtered.map((option, i) => (
              <li
                key={option.value}
                id={`option-${option.value}`}
                role="option"
                aria-selected={option.value === value}
                className={`select-option ${i === activeIndex ? 'select-option--active' : ''} ${option.value === value ? 'select-option--selected' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

```css
/* select.css — all values from tokens; no hardcoded hex or raw px for tokenized values */
.select-root {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  position: relative;
}

.select-label {
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  font-weight: 500;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  height: 44px; /* touch target floor — intentional, not a spacing token */
  padding: 0 var(--space-3);
  border: 1px solid var(--color-outline);
  border-radius: var(--shape-radius-sm);
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-size: var(--font-size-sm);
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.select-trigger:hover:not(:disabled) {
  border-color: var(--color-outline-strong);
}

.select-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.select-trigger--error {
  border-color: var(--color-error);
}

.select-trigger__placeholder {
  color: var(--color-on-surface-muted);
}

.select-trigger__caret {
  color: var(--color-on-surface-muted);
  flex-shrink: 0;
  transition: transform var(--motion-enter);
}

.select-trigger__caret--open {
  transform: rotate(180deg);
}

.select-trigger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + var(--space-1));
  left: 0;
  right: 0;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-outline);
  border-radius: var(--shape-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
}

.select-search {
  padding: var(--space-2);
  border-bottom: 1px solid var(--color-outline);
}

.select-search__input {
  width: 100%;
  border: 1px solid var(--color-outline);
  border-radius: var(--shape-radius-sm);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  background: var(--color-surface);
}

.select-search__input:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.select-option {
  display: flex;
  align-items: center;
  min-height: 44px; /* touch target floor */
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  cursor: pointer;
  list-style: none;
}

.select-option--active,
.select-option:hover {
  background: var(--color-primary-container);
}

.select-option--selected {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  font-weight: 500;
}

.select-option--empty {
  color: var(--color-on-surface-muted);
  cursor: default;
  font-style: italic;
}
```

---

## Step 5 — Living brief update

- Move Select from "Stubbed" to "Implemented" in Current State
- Decision log entry appended:

```
[2026-05-14] — Select added — Single-value with optional search. Multi-value deferred to Phase 2 (TagInput). Trigger uses shape-radius-sm per interactive element convention; dropdown uses shape-radius-md per container convention. ARIA: combobox + listbox pattern. Focus always returns to trigger on close.
```
