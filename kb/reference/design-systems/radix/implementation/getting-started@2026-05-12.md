---
system: radix
category: design-systems
topic: getting-started
content_type: implementation
status: latest
version_label: "2026"
retrieved: 2026-05-12
source_url: https://www.radix-ui.com/themes/docs/overview/getting-started
tags: [installation, setup, react, next.js, radix]
---

# Getting Started

**Source:** `radix-ui.com/themes/docs/overview/getting-started`

---

## Installation

```bash
npm install @radix-ui/themes
```

## Setup

**1. Import the CSS file** at the root of your application:

```ts
import "@radix-ui/themes/styles.css";
```

**2. Wrap your app** in the `<Theme>` component inside `<body>`:

```jsx
import { Theme } from "@radix-ui/themes";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Theme>
          {children}
        </Theme>
      </body>
    </html>
  );
}
```

**3. Use components:**

```jsx
import { Flex, Text, Button } from "@radix-ui/themes";

export default function MyApp() {
  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes</Text>
      <Button>Let's go</Button>
    </Flex>
  );
}
```

---

## Theme configuration

Pass configuration props to `<Theme>` to customize the visual appearance:

```jsx
<Theme accentColor="crimson" grayColor="sand" radius="large" scaling="95%">
  <MyApp />
</Theme>
```

| Prop | Default | Options |
|---|---|---|
| `accentColor` | indigo | 27 color names |
| `grayColor` | auto-paired | gray, mauve, slate, sage, olive, sand |
| `radius` | medium | none, small, medium, large, full |
| `panelBackground` | translucent | solid, translucent |
| `scaling` | 100% | 90%, 95%, 100%, 105%, 110% |
| `appearance` | inherit | light, dark, inherit |

---

## ThemePanel (development)

Add `ThemePanel` inside your `<Theme>` to get a live configuration UI during development:

```jsx
import { Theme, ThemePanel } from "@radix-ui/themes";

<Theme>
  <MyApp />
  <ThemePanel />
</Theme>
```

Remove `ThemePanel` before shipping to production.

---

## Next.js CSS import order

When using the App Router, CSS import order may conflict with other stylesheets. Radix Themes must be imported before any overrides. If you encounter issues, configure your bundler to preserve CSS order, or use the `next.config` `transpilePackages` option.

For custom fonts via `next/font`, see the [Typography](../guidance/foundations/typography) guide.

---

## Radix Themes vs Radix Primitives

| | Radix Primitives | Radix Themes |
|---|---|---|
| Styling | Unstyled (headless) | Pre-styled with theme system |
| Use case | Full design control, custom systems | Out-of-the-box UI |
| Token system | None | CSS variables on `.radix-themes` |
| Package | `@radix-ui/react-*` (per-component) | `@radix-ui/themes` |

Radix Themes is built on Radix Primitives. Both share the same accessibility foundations (ARIA patterns, keyboard navigation). You can use Primitives directly alongside Themes if you need components not yet available in Themes.
