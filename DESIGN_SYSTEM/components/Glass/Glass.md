# Glass Components

These components provide the core glassmorphism effect for the UI.

## Overview

The glassmorphism style is achieved using `backdrop-filter` for blur and semi-transparent `background-color`. The system uses a semantic hierarchy (`container`, `interactive`, `emphasized`) and levels (`primary`, `secondary`, `tertiary`) to control the transparency, blur, and shadow consistently. See `documentation/06-Glassmorphism.md` for detailed principles.

## Components

- **`GlassPanel`**: The primary component for creating glass panels. It applies padding and the glass effect based on hierarchy/level.
- **`ContainerGlass`**: Lower-level primitive for container-hierarchy glass effects (most transparent), no padding.
- **`InteractiveGlass`**: Lower-level primitive for interactive-hierarchy glass effects (medium transparency), no padding. Includes hover/active states.
- **`EmphasizedGlass`**: Lower-level primitive for emphasized-hierarchy glass effects (least transparent), no padding.

## GlassProps

All glass components accept the `GlassProps` interface:

| Prop           | Type                                                     | Default     | Description                                                                                                |
| :------------- | :------------------------------------------------------- | :---------- | :--------------------------------------------------------------------------------------------------------- |
| `hierarchy`    | `'container'`, `'interactive'`, `'emphasized'`, `'content'` | `'container'` | Semantic hierarchy determining base transparency, blur, and shadow.                                        |
| `level`        | `'primary'`, `'secondary'`, `'tertiary'`                | `'primary'` | Fine-tunes the effect within the chosen hierarchy.                                                         |
| `borderRadius` | `keyof tokens.radius` or `string`                        | `'md'`      | Specifies the border radius using token keys (e.g., 'sm', 'lg') or a custom value.                           |
| `shadow`       | `1`, `2`, `3`, `4`, `5`                                  | *Varies*    | Overrides the default shadow based on `tokens.glassShadow`. Default determined by hierarchy/level. |
| `opacity`      | `number` (0-1)                                           | *Varies*    | Overrides the default background opacity determined by hierarchy/level.                                    |
| `intensity`    | `'light'`, `'medium'`, `'heavy'`, `'intense'`            | *Varies*    | *Legacy:* Overrides the default blur intensity. Prefer using `hierarchy`/`level`.                          |
| `children`     | `ReactNode`                                              | -           | Content to render inside the glass component.                                                              |
| `className`    | `string`                                                 | `undefined` | Optional CSS class name.                                                                                   |
| `...rest`      | `BoxProps` from `@mui/material`                          | -           | Standard MUI Box props (as these components are based on `styled(Box)`).                                 |

## Usage

### `GlassPanel` (Recommended for most cases)

```jsx
import { GlassPanel } from './Glass';

function Card() {
  return (
    <GlassPanel hierarchy="container" level="primary" borderRadius="lg">
      {/* Card Content */}
    </GlassPanel>
  );
}

function EmphasizedSection() {
  return (
    <GlassPanel hierarchy="emphasized" level="secondary">
      {/* Important Content */}
    </GlassPanel>
  );
}
```

### Lower-level Primitives (Advanced usage)

Use these when you need a glass effect without the default padding of `GlassPanel`, or for building custom components.

```jsx
import { ContainerGlass, InteractiveGlass } from './Glass';
import styled from '@emotion/styled';

const CustomGlassButton = styled(InteractiveGlass)`
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  border: none;
  cursor: pointer;
  // ... other button styles
`;

function MyComponent() {
  return (
    <ContainerGlass hierarchy="container" level="tertiary">
      <CustomGlassButton hierarchy="interactive" level="primary">
        Click Me
      </CustomGlassButton>
    </ContainerGlass>
  );
}
```

## Related Components

Several other components in the system utilize these primitives:

- `EmptyStateContainer` (in `components/Glass/RelatedComponents.tsx`)
- `GlassTooltip` (in `components/Glass/RelatedComponents.tsx`)
- `GlassDialog` (in `components/Overlay/GlassOverlay.tsx`)
- `GlassDropdownMenu` (in `components/Overlay/GlassOverlay.tsx`)
- `TextInput`, `TextArea` (in `components/Input/Input.tsx`)

## Accessibility

- Ensure sufficient contrast between the content inside the glass component and its semi-transparent background.
- Contrast ratios may need careful checking, especially with `container` and `interactive` hierarchies.

## Implementation Notes

- Components are built using Emotion's `styled` function, wrapping MUI's `Box` component.
- Helper functions in `utils.ts` determine the correct token values based on props.
- A `::before` pseudo-element adds a subtle top highlight.
- `will-change` is used to optimize animation/transition performance. 