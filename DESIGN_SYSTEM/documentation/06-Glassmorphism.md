# Glassmorphism & Transparency Guide

## Overview

This design system utilizes a "glassmorphism" aesthetic, characterized by blurred, semi-transparent backgrounds that mimic frosted glass. This guide explains the core concepts and how to apply them consistently using the provided tokens and components.

## Core Components

- **`GlassPanel` (`components/Glass/Glass.tsx`)**: The primary component for applying the glass effect to general content areas.
- **`ContainerGlass`**, **`InteractiveGlass`**, **`EmphasizedGlass`**: Lower-level primitives used by `GlassPanel` and other components, representing the different semantic layers.
- **`GlassDialog`**, **`GlassTooltip`**, **`GlassDropdownMenu`**, etc.: Specialized components that incorporate the glass effect.

## Transparency & Blur System

Consistency is achieved through a semantic system combining transparency and blur, defined in `tokens/transparency.ts`.

### Transparency Hierarchy

The `hierarchy` prop determines the base level of transparency. Choose based on the element's role:

- **`container`** (Default): Most transparent (~70-80% transparent, uses `blur.light`). For main background panels where underlying gradients or images should show through clearly.
- **`interactive`**: Medium transparency (~60-70% transparent, uses `blur.light` or `blur.medium`). For elements users interact with (buttons, inputs) requiring slightly more visual distinction.
- **`emphasized`**: Least transparent (~50-60% transparent, uses `blur.medium` or `blur.heavy`). For important UI sections needing more visual weight (modals, tooltips).
- **`content`**: Maximum opacity (~10-30% transparent, uses `blur.medium` or `blur.heavy`). Not typically used for background panels, but represents the opacity level needed for high-contrast foreground content.

### Hierarchy Levels

The `level` prop (`primary`, `secondary`, `tertiary`) fine-tunes the opacity *within* a chosen `hierarchy`, providing subtle variations. `primary` is the default.

### Blur Intensity

Blur (`blur.light`, `blur.medium`, `blur.heavy`, `blur.intense`) is generally tied to the `hierarchy`, but can sometimes be adjusted via the (legacy) `intensity` prop if needed.

## Usage

Use the `GlassPanel` component for most cases, specifying the `hierarchy` and optionally the `level`:

```jsx
import { GlassPanel } from '../components/Glass/Glass';
import { tokens } from '../tokens';

<GlassPanel hierarchy="container" level="primary">
  {/* Content for a primary background panel */}
</GlassPanel>

<GlassPanel hierarchy="interactive" level="secondary">
  {/* Content for a secondary interactive element background */}
</GlassPanel>

<GlassPanel hierarchy="emphasized" level="primary">
  {/* Content for an emphasized section */}
</GlassPanel>
```

## Shadows

Glassmorphism components use a dedicated shadow system (`tokens.glassShadow`) designed to complement the transparency. Shadow depth is often automatically determined by the `hierarchy` and `level` via `tokens.shadowDepth`, but can be overridden with the `shadow` prop (values 1-5).

```jsx
<GlassPanel hierarchy="container" shadow={3}> 
  {/* Overrides the default shadow for container hierarchy */}
</GlassPanel>
```

## Borders & Highlights

Glass components include subtle top-border highlights (`::before` pseudo-element) to enhance the glass edge effect.

## Performance Considerations

- `backdrop-filter` can be performance-intensive.
- The `container` hierarchy uses the lightest blur (`blur.light`) by default.
- Avoid excessive nesting of `GlassPanel` components.
- Components include `will-change: transform, backdrop-filter, box-shadow;` to hint potential changes to the browser.

## Accessibility

- Ensure sufficient contrast between text/content and the semi-transparent background, especially for `container` and `interactive` hierarchies.
- Test color combinations and transparency levels against accessibility guidelines (WCAG). 