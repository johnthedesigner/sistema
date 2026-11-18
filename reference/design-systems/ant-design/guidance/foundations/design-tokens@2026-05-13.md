---
system: ant-design
category: design-systems
topic: design-tokens
content_type: guidance
status: latest
version_label: "Ant Design 5.x"
retrieved: 2026-05-13
source_url: https://ant.design/docs/react/customize-theme
tags: [design-tokens, tokens, theming, ant-design]
---

# Design Token Architecture

**Source:** `ant.design/docs/react/customize-theme`

Ant Design 5.x uses a three-layer algorithmic token architecture. The key insight is that changing a small number of "seed" values automatically propagates through a derivation algorithm to update dozens of dependent tokens — making system-wide visual changes low-effort and consistent.

---

## Three-layer architecture

```
Seed Tokens
    ↓ (algorithm)
Map Tokens
    ↓ (aliasing)
Alias Tokens
    ↓
Component Tokens
```

### Seed Tokens

High-level design intentions — the inputs you control. Examples:

| Seed Token | Default | What it controls |
|---|---|---|
| `colorPrimary` | `#1677ff` | Brand color; drives all primary interactive states |
| `colorSuccess` | `#52c41a` | Success state color |
| `colorWarning` | `#faad14` | Warning state color |
| `colorError` | `#ff4d4f` | Error / danger color |
| `colorInfo` | `#1677ff` | Informational color |
| `borderRadius` | `6` | Base border-radius; drives SM/LG/XS variants |
| `fontSize` | `14` | Base font size; drives heading scale |
| `motion` | `true` | Enable / disable all animations |

Most customization needs can be met at the seed level alone.

### Map Tokens

Derived values computed algorithmically from seed tokens. You generally do not set these directly — they are calculated from seed inputs via the preset algorithm. They represent the full expanded token vocabulary: hover colors, active colors, disabled states, border variants, etc.

### Alias Tokens

Named references to map tokens, used as the actual values in component styles. For example, `colorText` is an alias that points to a specific map token for primary text. You can override alias tokens when you need to break the derivation pattern for specific roles.

---

## ConfigProvider

All token customization is applied through the `<ConfigProvider>` component:

```tsx
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#your-brand',
          borderRadius: 4,
          fontSize: 14,
        },
      }}
    >
      <YourApp />
    </ConfigProvider>
  );
}
```

**Limitation:** Static methods (`message.success()`, `Modal.confirm()`, `notification.open()`) do not inherit ConfigProvider context. Use `Modal.useModal()` or wrap with the `App` component from antd.

---

## Preset algorithms

Ant Design ships three built-in derivation algorithms:

| Algorithm | Effect |
|---|---|
| `theme.defaultAlgorithm` | Standard light appearance — the default |
| `theme.darkAlgorithm` | Dark mode — recalculates all derived tokens for dark surfaces |
| `theme.compactAlgorithm` | Compact density — reduces `controlHeight` and spacing proportionally |

Algorithms can be combined:

```tsx
import { theme } from 'antd';

<ConfigProvider
  theme={{
    algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
  }}
>
```

---

## Component-level tokens

Override tokens for a specific component without affecting others:

```tsx
<ConfigProvider
  theme={{
    components: {
      Button: {
        colorPrimary: '#custom-color',
        borderRadius: 2,
        algorithm: true,  // re-derive hover/active from this seed
      },
      Table: {
        colorBgContainer: '#fafafa',
      },
    },
  }}
>
```

Setting `algorithm: true` on a component token tells the system to re-run the derivation algorithm from the overridden seed rather than using the static value directly.

---

## Consuming tokens in components

```tsx
import { theme } from 'antd';

const MyComponent = () => {
  const { token } = theme.useToken();

  return (
    <div style={{
      color: token.colorText,
      background: token.colorBgContainer,
      borderRadius: token.borderRadius,
      padding: `${token.paddingMD}px ${token.paddingLG}px`,
    }}>
      ...
    </div>
  );
};
```

For static contexts outside React lifecycle:

```tsx
const globalToken = theme.getDesignToken();
```

---

## Full token vocabulary

### Color tokens

| Category | Key tokens |
|---|---|
| Semantic | `colorPrimary`, `colorSuccess`, `colorWarning`, `colorError`, `colorInfo` |
| Text | `colorText`, `colorTextSecondary`, `colorTextTertiary`, `colorTextQuaternary`, `colorTextDisabled` |
| Background | `colorBgContainer`, `colorBgElevated`, `colorBgLayout`, `colorBgMask` |
| Border | `colorBorder`, `colorBorderSecondary`, `colorBorderDisabled` |
| Fill | `colorFill`, `colorFillSecondary`, `colorFillTertiary`, `colorFillQuaternary` |

### Size tokens

| Token | Default | Meaning |
|---|---|---|
| `controlHeight` | 32 | Default control height (input, button) |
| `controlHeightLG` | 40 | Large control height |
| `controlHeightSM` | 24 | Small control height |
| `controlHeightXS` | 16 | Extra-small control height |
| `fontSize` | 14 | Base font size |

### Spacing tokens

Margin and padding tokens use size suffixes: `XXS`, `XS`, `SM`, `MD` (base), `LG`, `XL`, `XXL`.

Example: `token.marginMD` (base margin), `token.paddingLG` (large padding).

### Radius tokens

| Token | Default |
|---|---|
| `borderRadius` | 6 |
| `borderRadiusLG` | 8 |
| `borderRadiusSM` | 4 |
| `borderRadiusXS` | 2 |

### Motion tokens

| Token | Default | Meaning |
|---|---|---|
| `motion` | `true` | Enable / disable all animations |
| `motionUnit` | `0.1` | Duration increment (seconds) |
| `motionBase` | `0` | Base duration offset |
| `motionEaseInOut` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | Standard easing |
| `motionEaseOutBack` | `cubic-bezier(0.12, 0.4, 0.29, 1.46)` | Overshoot easing |

### Shadow tokens

| Token | Usage |
|---|---|
| `boxShadow` | Primary elevation (popovers, dropdowns) |
| `boxShadowSecondary` | Secondary elevation |
| `boxShadowTertiary` | Subtle elevation |

### Breakpoints

| Token | px value |
|---|---|
| `screenXS` | 480 |
| `screenSM` | 576 |
| `screenMD` | 768 |
| `screenLG` | 992 |
| `screenXL` | 1200 |
| `screenXXL` | 1600 |

---

## Nested themes

Nest `ConfigProvider` components to apply localized themes to sections of the UI. Child themes inherit all unmodified parent tokens — only explicitly overridden tokens change:

```tsx
<ConfigProvider theme={{ token: { colorPrimary: '#blue' } }}>
  <MainContent />
  <ConfigProvider theme={{ token: { colorPrimary: '#red' } }}>
    <DangerZone />  {/* red primary, all other tokens inherited from parent */}
  </ConfigProvider>
</ConfigProvider>
```

---

## Architecture comparison

| System | Token layers | Derivation model |
|---|---|---|
| Ant Design 5.x | Seed → Map → Alias → Component | Algorithmic — seed drives derivatives |
| Material 3 | Reference → System → Component | Algorithmic (HCT tonal palettes) |
| Carbon | Primitive → Semantic | Manual mapping, no algorithm |
| Atlassian | All-semantic (no primitive exposed) | Manual, role + emphasis + state naming |
| Radix Themes | Config props → CSS variables | Config-first, no traditional token vocabulary |
