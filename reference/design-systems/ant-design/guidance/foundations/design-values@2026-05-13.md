---
system: ant-design
category: design-systems
topic: design-values
content_type: guidance
status: latest
version_label: "Ant Design 5.x"
retrieved: 2026-05-13
source_url: https://ant.design/docs/spec/introduce
tags: [design-values, philosophy, enterprise, ant-design]
---

# Design Values

**Source:** `ant.design/docs/spec/introduce`

Ant Design is unique among major design systems in explicitly naming and documenting four core design values that govern its decisions. These values explain *why* the system is structured the way it is — they are governance principles, not just aspirational statements.

---

## The Four Values

### Natural (自然)

Behavior and interaction should feel intuitive and reduce cognitive friction. Ant Design draws from how people naturally perceive and act in the physical world: things that look similar behave similarly; things that look different signal different capabilities; cause and effect are immediate and legible.

In practice: interaction patterns that follow established conventions; animations that mimic physical motion rather than abstract transitions; affordances that match their purpose.

### Certain (确定性)

Designers and developers should be able to work with confidence. The system provides clear, consistent rules so there is no ambiguity about how a component should look or behave in a given context.

In practice: predictable component behavior; a complete default state for every component; no edge cases where the "correct" answer is undefined. This value is the primary reason Ant Design is prescriptive — ambiguity slows enterprise development teams.

### Meaningful (有意义)

Every design element should serve a clear purpose. Decoration for its own sake is avoided. This is directly connected to the restrained color philosophy: color is used to convey information, signal state, or guide attention — not to create visual interest.

In practice: functional colors (success/error/warning) with consistent semantics; sparse use of brand color; typography hierarchy that communicates importance.

### Growing (生长)

The system should be able to expand, adapt, and improve over time without breaking existing products. This means stable APIs, backward-compatible token changes, and a design vocabulary that can accommodate new component types without requiring a full redesign.

In practice: the algorithmic token architecture (seed tokens derive many outputs — a change to one seed propagates consistently); version migration guides; component API stability.

---

## Enterprise Context

Ant Design was created for Ant Financial's internal product ecosystem — complex back-office and financial applications where **task completion speed and error prevention matter more than visual expressiveness**. This context explains choices that might seem conservative in consumer product design:

- Color restraint: in a dashboard with 15 data series, competing accent colors create noise, not identity
- High information density: compact mode, small default control heights, tight spacing defaults
- Consistency over novelty: familiar patterns reduce training time for power users

The system is now used by Alibaba, Tencent, Baidu, Meituan, and Didi — all at significant scale in enterprise contexts.

---

## Contrast with Other Systems

| System | Primary design orientation |
|---|---|
| Ant Design | Enterprise task efficiency; certainty above expressiveness |
| Material Design 3 | Expressive, branded consumer products; emotion and delight |
| Carbon | IBM enterprise; data-dense, accessible, neutral |
| Radix Themes | Developer-tool aesthetic; config-first, composable |
| Atlassian | Team collaboration products; role-based emphasis patterns |
