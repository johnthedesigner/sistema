---
system: carbon
category: implementation
topic: getting-started
content_type: implementation
status: latest
version_label: "v11"
retrieved: 2026-05-12
source_url: https://carbondesignsystem.com/developing/frameworks/react/
tags: [react, installation, getting-started, sass, components, icons]
---

# Carbon Design System — Getting Started (React)

## Overview

The `@carbon/react` package provides reusable React components, styles, and icons for building IBM products. Adopting the library gives consistent markup, styles, and behavior across prototype and production work.

---

## Installation

```bash
npm install --save @carbon/react
# or
yarn add @carbon/react
```

Ensure that the [`peerDependencies`](https://github.com/search?q=repo%3Acarbon-design-system%2Fcarbon+peerDependencies+language%3AJSON+path%3Apackages%2Freact&type=code) for `@carbon/react` are installed to avoid errors.

---

## Using Components

Import components directly from the package:

```tsx
import { Button } from '@carbon/react';

function MyComponent() {
  return <Button>Example usage</Button>;
}
```

Components require a build pipeline (Next.js, Vite, Parcel, Webpack, etc.) — they are not designed to be used without a bundler.

---

## Including Styles

Include styles in your root/global stylesheet:

```scss
// All Carbon component styles
@use '@carbon/react';

// Or: styles for a specific component only
@use '@carbon/react/scss/components/button';
```

Styles are written in Sass. A Sass compiler must be present in your build pipeline.

---

## Using Icons

Icons are available from the `@carbon/react/icons` entrypoint:

```tsx
import { Add } from '@carbon/react/icons';

function MyComponent() {
  return <Add />;
}
```

The full icon library is at [carbondesignsystem.com/elements/icons/library](https://carbondesignsystem.com/elements/icons/library/).

---

## Theming

By default, Carbon uses the White theme. To switch themes, configure the Sass module before importing styles:

```scss
@use '@carbon/react/scss/themes';
@use '@carbon/react/scss/theme' with (
  $theme: themes.$g100
);
```

See the [Themes](../guidance/foundations/themes.md) guidance for full details on custom theming.

---

## Resources

- [Carbon React Storybook](https://react.carbondesignsystem.com/) — interactive component explorer with usage docs
- [React tutorial](https://carbondesignsystem.com/developing/react-tutorial/overview/) — full walkthrough for webpack-based apps
- [GitHub repo](https://github.com/carbon-design-system/carbon/tree/main/packages/react)
