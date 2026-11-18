---
system: material
category: getting-started
topic: web-implementation
content_type: implementation
status: latest
version_label: "M3"
retrieved: 2026-05-11
source_url: https://material-web.dev/about/quick-start/
tags: [web, npm, cdn, installation, "@material/web", theming]
---

# Material Design 3 — Web Implementation: Getting Started

## Package

**npm package:** `@material/web`
**GitHub:** https://github.com/material-components/material-web
**Documentation:** https://material-web.dev

Material Web (`@material/web`) is Google's official M3 web component library, built on the Web Components standard. Components are framework-agnostic and work in any web framework or plain HTML.

---

## Installation

### CDN (Prototyping)

For rapid prototyping without a build step, use `esm.run`:

```html
<head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <script type="importmap">
    {
      "imports": {
        "@material/web/": "https://esm.run/@material/web/"
      }
    }
  </script>
  <script type="module">
    import '@material/web/all.js';
    import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  </script>
</head>
```

### npm (Production)

```bash
npm install @material/web
```

Import individual components rather than the full bundle:

```js
// index.js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/outlined-text-field.js';
```

### Building for Production

Material Web uses bare module specifiers that require a bundler. Recommended: Rollup.

```bash
npm install rollup @rollup/plugin-node-resolve
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

---

## Component Usage

Use components as HTML custom elements:

```html
<script type="module" src="./index.js"></script>

<!-- Buttons -->
<md-filled-button>Primary action</md-filled-button>
<md-outlined-button>Secondary action</md-outlined-button>
<md-text-button>Tertiary action</md-text-button>
<md-elevated-button>Elevated action</md-elevated-button>
<md-tonal-button>Tonal action</md-tonal-button>

<!-- Form elements -->
<md-checkbox></md-checkbox>
<md-radio name="group"></md-radio>
<md-outlined-text-field label="Email" type="email"></md-outlined-text-field>
<md-filled-text-field label="Password" type="password"></md-filled-text-field>

<!-- Selection -->
<md-switch></md-switch>
<md-slider></md-slider>
```

---

## Applying a Theme

Theming is done via CSS custom properties on `:root`. All M3 system tokens can be overridden this way.

### Minimal Color Theme

```css
:root {
  /* Generated from Material Theme Builder or material-color-utilities */
  --md-sys-color-primary: #006A6A;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #6FF7F6;
  --md-sys-color-on-primary-container: #002020;
  --md-sys-color-secondary: #4A6363;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-surface: #FAFDFC;
  --md-sys-color-on-surface: #191C1C;
  --md-sys-color-error: #BA1A1A;
  --md-sys-color-on-error: #FFFFFF;
}
```

### Custom Typeface

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&display=swap');

:root {
  --md-ref-typeface-brand: 'Plus Jakarta Sans';
  --md-ref-typeface-plain: system-ui;
}
```

### Typography Classes (Optional)

The typescale stylesheet provides utility classes for applying typescale roles to HTML elements:

```js
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

```html
<h1 class="md-typescale-display-medium">Page Title</h1>
<p class="md-typescale-body-medium">Body text</p>
<span class="md-typescale-label-small">Caption</span>
```

Class naming convention: `.md-typescale-<role>-<size>`

---

## Component-Level Token Overrides

Each component exposes its own token set for customization. Tokens can be scoped globally or to a CSS selector:

```css
/* Global shape change */
:root {
  --md-filled-button-container-shape: 4px; /* Override pill to small */
}

/* Contextual color change */
.error-zone md-filled-button {
  --md-filled-button-container-color: var(--md-sys-color-error);
  --md-filled-button-label-text-color: var(--md-sys-color-on-error);
}
```

Refer to each component's documentation page on `material-web.dev` for the full list of available component tokens.

---

## Framework Integrations

| Framework | Package / Guide |
|---|---|
| React | Use directly — web components work with React 19+; for React 18 use wrappers |
| Angular | Use `@angular/material` (separate package implementing M3 natively) |
| Vue | Works directly with web components |
| Flutter | `package:flutter/material.dart` (separate native implementation) |
| Android | `com.google.android.material:material` (MDC-Android) or Jetpack Compose |

---

## Sources

- Quick Start: https://material-web.dev/about/quick-start/
- Theming Overview: https://material-web.dev/theming/material-theming/
- Component List: https://material-web.dev/components/
