# Design Tokens

Design tokens are the core values that define the visual style of the system. They ensure consistency across all components.

## Usage

Import the combined `tokens` object or individual categories:

```typescript
import { tokens, colors, spacing } from './tokens';

const MyComponent = styled.div`
  padding: ${tokens.spacing.md};
  color: ${colors.text.primary};
  border-radius: ${tokens.radius.sm};
`;
```

## Available Tokens

- **Colors (`colors.ts`)**: Primary, secondary, accent, neutral, status, background, text, border.
- **Spacing (`spacing.ts`)**: `xs` to `xxxl` based on an 8px grid.
- **Typography (`typography.ts`)**: Font families, weights, sizes, line heights.
- **Border Radius (`radius.ts`)**: `none` to `xxl`, plus `circle`.
- **Elevation & Shadow (`elevation.ts`)**: Standard elevation shadows (`elevation`) and specific glassmorphism shadows (`glassShadow`, `shadowDepth`).
- **Animation (`animation.ts`)**: Easing functions, durations, transition helpers, keyframes, presets.
- **Transparency & Blur (`transparency.ts`)**: Semantic transparency scale (`transparency`) and blur values (`blur`).
- **Effects (`effects.ts`)**: Predefined `glass` and `overlay` effect styles.
- **Z-Index (`zIndex.ts`)**: Stacking order values.
- **Helpers (`helpers.ts`)**: Utility functions for color manipulation (`alpha`, `adjustBrightness`, `getContrastText`).

*Note: Graph-specific tokens (e.g., `colors.graph`, `nodeSize`) from the original system have been commented out in the source files as they are not part of this general template.* 