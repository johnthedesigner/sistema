---
system: atlassian
category: implementation
topic: getting-started
content_type: implementation
status: latest
version_label: "v1 (current)"
retrieved: 2026-05-12
source_url: https://atlassian.design/get-started
tags: [getting-started, installation, atlaskit, tokens, react, primitives]
---

# Atlassian Design System — Getting Started

## Overview

The Atlassian Design System is implemented through **Atlaskit** — a collection of packages providing components, design tokens, icons, and utilities for building Atlassian product interfaces. All packages are published to npm under the `@atlaskit/` scope.

The repository source is available on Bitbucket: `bitbucket.org/atlassian/atlassian-frontend-mirror`.

---

## Core Packages

| Package | Purpose |
|---|---|
| `@atlaskit/tokens` | Design tokens (CSS custom properties, JS constants) |
| `@atlaskit/primitives` | Layout and composition primitives (Box, Stack, Inline, Flex, Grid) |
| `@atlaskit/heading` | Heading component with correct token application |
| `@atlaskit/button` | Button component variants |
| `@atlaskit/icon` | Icon components |
| `@atlaskit/theme` | Global theme setup and theming utilities |

---

## Installation

Install the tokens package first — all other components depend on it:

```bash
yarn add @atlaskit/tokens
```

Install individual component packages as needed:

```bash
yarn add @atlaskit/primitives
yarn add @atlaskit/button
yarn add @atlaskit/heading
```

---

## Setting Up Tokens

Tokens are applied via a theme stylesheet that sets CSS custom properties (`--ds-*`). Include the light theme to activate tokens:

```html
<link rel="stylesheet" href="node_modules/@atlaskit/tokens/css/atlassian-light.css" />
```

Or apply programmatically in React:

```tsx
import { setGlobalTheme } from '@atlaskit/tokens';

// Apply light theme (default)
setGlobalTheme({ colorMode: 'light' });

// Apply dark theme
setGlobalTheme({ colorMode: 'dark' });

// Auto-detect from system preference
setGlobalTheme({ colorMode: 'auto' });
```

---

## Using Tokens in Code

The `token()` function provides type-safe access to design token values:

```tsx
import { token } from '@atlaskit/tokens';

const buttonStyle = {
  background: token('color.background.brand.bold'),
  color: token('color.text.inverse'),
  borderRadius: token('radius.medium'),
  padding: `${token('space.100')} ${token('space.200')}`,
};
```

A Babel plugin transforms `token()` calls into CSS variable references at build time:

```bash
yarn add --dev @atlaskit/tokens/babel-plugin
```

---

## Using Primitives

The `@atlaskit/primitives` package provides layout components that consume spacing and color tokens directly:

```tsx
import { Box, Stack, Inline } from '@atlaskit/primitives';

function Card() {
  return (
    <Box
      backgroundColor="elevation.surface.raised"
      padding="space.300"
      borderRadius="border.radius.200"
    >
      <Stack space="space.200">
        <Heading size="medium">Card title</Heading>
        <Text>Card content</Text>
      </Stack>
    </Box>
  );
}
```

---

## Build Requirements

- **React** 16.8+ (hooks required)
- **Node.js** 18+
- **Bundler**: Webpack, Vite, or similar (SSR supported)
- **Babel** (optional, for `token()` transform)

No specific CSS preprocessor is required — tokens are available as CSS custom properties.

---

## Resources

- [Atlaskit component library](https://atlassian.design/components)
- [Design token reference](https://atlassian.design/components/tokens/all-tokens)
- [Source code (Bitbucket)](https://bitbucket.org/atlassian/atlassian-frontend-mirror)
