# Stacking Context & Z-Index Guidelines

## Overview

This document outlines the principles for managing stacking contexts and z-index values in our UI components. Following these guidelines will help maintain visual consistency and prevent common issues with overlapping elements.

## Z-Index Token System

We've established a standardized z-index system with semantic naming, defined in `tokens/zIndex.ts`, to ensure consistent layering across the application. These values are available in the `tokens.zIndex` object.

```typescript
// Example usage
import { tokens } from '../tokens';
import styled from '@emotion/styled';

const StyledHeader = styled.header`
  z-index: ${tokens.zIndex.header};
`;
```

### Z-Index Hierarchy

Our z-index system follows this semantic hierarchy (from back to front):

| Category | Token | Value | Purpose |
|----------|-------|-------|---------|
| **Base Layers** | `background` | -1 | Background elements that should always be at the bottom |
| | `canvas` | 0 | Base canvas elements (like the graph visualization - *Note: Canvas may not be relevant in all consuming projects*) |
| | `base` | 1 | Standard UI elements with no special stacking |
| **Content Layers** | `content` | 10 | Primary content elements |
| | `contentEmphasis` | 15 | Emphasized content elements |
| **UI Components** | `controls` | 20 | Control panels and UI element containers |
| | `header` | 25 | Header elements |
| | `footer` | 25 | Footer elements |
| **Interactive Elements** | `dropdown` | 30 | Dropdown menus and select components |
| | `tooltip` | 35 | Tooltips that should appear above other interactive elements |
| | `popover` | 40 | Popovers and dropdown panels |
| **Overlay Layers** | `overlay` | 50 | Full-screen overlays |
| | `modal` | 60 | Modal dialogs |
| | `toast` | 70 | Toast notifications |
| **Top-Level Layers** | `loading` | 80 | Loading indicators and spinners |
| | `dialog` | 90 | Critical dialog boxes |
| | `notification` | 95 | Important notifications |
| | `max` | 100 | Reserved for highest priority elements |

## Common Stacking Context Issues

### 1. New Stacking Context Creation

The following CSS properties create new stacking contexts, which can isolate z-index values:

- `position: relative/absolute/fixed` with a z-index value
- `opacity` less than 1
- `transform`, `filter`, or `backdrop-filter` properties
- `will-change` property
- `contain: layout/paint`
- `isolation: isolate`

### 2. Best Practices

- **Use semantic z-index tokens**: Always use the pre-defined tokens instead of arbitrary values.
- **Avoid transforms in container elements**: If you must use transforms, be aware they create new stacking contexts.
- **Don't skip levels**: If you need something between existing levels, discuss adding a new token.
- **Minimize nesting of stacking contexts**: Keep your DOM hierarchy as flat as possible.
- **Use `isolation: isolate`**: When you need to create a new stacking context without changing z-index.

## Troubleshooting Common Issues

### Elements Not Appearing on Top

If an element with a higher z-index isn't appearing on top:

1. Check if it's inside a parent with a lower z-index.
2. Verify if the parent or element has properties that create a new stacking context.
3. Use the browser's DevTools to inspect the computed styles and stacking context.

### Glassmorphism Components

Our glassmorphism components (`components/Glass/`) use `backdrop-filter`, which creates a new stacking context. When nesting these components:

- Avoid unnecessary nesting of `GlassPanel` components.
- Be mindful of applying transforms to glassmorphism containers.

## Example: Proper Component Layering

```jsx
import { tokens } from '../tokens';
import { GlassPanel } from '../components/Glass/Glass';
import styled from '@emotion/styled';

// Assume ContentPanel, ControlPanel, Tooltip are styled components

// Good example with proper layering
<GlassPanel 
  hierarchy="container" 
  level="primary" 
  style={{ zIndex: tokens.zIndex.base }}
>
  <ContentPanel 
    style={{ zIndex: tokens.zIndex.content }}
  />
  
  <ControlPanel 
    style={{ zIndex: tokens.zIndex.controls }}
  />
  
  {isTooltipVisible && (
    <Tooltip 
      style={{ zIndex: tokens.zIndex.tooltip }}
    />
  )}
</GlassPanel>
```

## Component-Specific Recommendations

### Headers and Navigation

- Use `tokens.zIndex.header` (25) for the main application header.
- Ensure dropdowns from the header use `tokens.zIndex.dropdown` (30).

### Modal Dialogs

- Use `tokens.zIndex.modal` (60) for the modal container (e.g., `GlassDialog`).
- Use `tokens.zIndex.overlay` (50) for the backdrop overlay.

### Tooltips and Popovers

- Use `tokens.zIndex.tooltip` (35) for tooltips (e.g., `GlassTooltip`).
- Use `tokens.zIndex.popover` (40) for larger popovers and contextual menus.

### Notifications

- Use `tokens.zIndex.toast` (70) for toast notifications.
- Use `tokens.zIndex.notification` (95) for critical system notifications (e.g., `ErrorContainer`).

## When to Add New Z-Index Values

The current z-index system should cover most use cases. If you find a scenario where existing values don't provide enough granularity:

1. Discuss with the team before adding new values.
2. Document the new use case.
3. Update this guide and the `tokens/zIndex.ts` file.
4. Consider if a larger refactoring of stacking contexts might be needed. 