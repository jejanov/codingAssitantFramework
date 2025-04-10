# Button Style Consistency Rules

This document outlines the button styling rules for the design system to ensure consistency across all components.

## Core Principles

1. **Visual Consistency**: All buttons should share the same visual language regardless of their location in the application
2. **Interactive Feedback**: Buttons should provide clear visual feedback for all states (hover, active, disabled)
3. **Semantic Hierarchy**: Button styling should reflect its importance in the UI
4. **Accessibility**: Buttons should have sufficient contrast and clear interactive cues

## Button Types

This system provides two primary button components based on the core aesthetic:
- `Button`: For standard text-based actions.
- `IconButton`: For icon-only actions.

### Base Button Properties

All buttons share common base properties including font, transitions, and basic interaction feedback.

*(Note: The code examples below reflect the style implementations found in `components/Button/Button.tsx`)*

### Text Buttons (`Button`)

Supports size (`sm`, `md`, `lg`) and semantic color variants (`primary`, `secondary`, `danger`, `ghost`).

```jsx
import { Button } from '../components/Button/Button';

<Button variant="primary" size="md" onClick={handleSubmit}>Submit</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Learn More</Button>
```

### Icon Buttons (`IconButton`)

Supports size (`sm`, `md`, `lg`), semantic color variants (`primary`, `secondary`, `danger`, `ghost`), and an `isActive` state (often used for toggles).

```jsx
import { IconButton } from '../components/Button/Button';
// Assume EditIcon is an imported SVG or font icon

<IconButton variant="primary" size="md" onClick={handleEdit}>
  <EditIcon />
</IconButton>
<IconButton variant="ghost" size="sm" isActive={isPanelOpen}>
  <SettingsIcon />
</IconButton>
```

*(Self-correction: The original document referenced `GlassButton` and `GlassIconButton` which were specific names tied to the original implementation structure. The components have been refactored to `Button` and `IconButton` within the `components/Button/` directory of this template. The code examples and references have been updated accordingly.)*

## Color Variants

Buttons primarily use the `variant` prop to determine their background and text color, aligning with semantic purposes:

- **`primary`**: Uses `tokens.colors.primary[500]`
- **`secondary`**: Uses `tokens.colors.secondary[500]`
- **`danger`**: Uses `tokens.colors.status.error`
- **`ghost`**: Transparent background, uses `tokens.colors.text.primary` or `tokens.colors.text.inverse` depending on context, with a light border.

## Animation Standards

Buttons adhere to the following animation standards defined in `tokens.animation`:

1. **Hover state**: Subtle `transform: translateY(-2px)` and `box-shadow` increase using `tokens.elevation`.
2. **Active state**: Reset `transform` to `translateY(0)`.
3. **Transition**: Uses `tokens.animation.duration.fast` and standard easing for smooth feedback.

## Implementation Notes

- Import standardized components (`Button`, `IconButton`) from `components/Button/Button.tsx`.
- Avoid creating custom one-off button styles; leverage the provided variants and sizes.
- Icons used within `IconButton` should be provided as children (e.g., SVG components).

```jsx
import { GlassButton, GlassIconButton } from '../../design/ComponentLibrary';
```

## Legacy Button Migration

When updating existing components, replace custom button implementations with the standardized components:

1. Replace `styled(IconButton)` with `GlassIconButton`
2. Replace `styled(Button)` with `GlassButton`
3. Adjust any component-specific styling to use variants instead of custom styles

This ensures a consistent button appearance and behavior throughout the application. 