# Iconography Guidelines

## Overview

Icons are a crucial part of creating intuitive and visually consistent interfaces. This guide outlines how to use icons effectively within our design system, ensuring clarity, consistency, and accessibility.

## Recommended Library: Material Symbols

To ensure a cohesive and modern look, we recommend using **Material Symbols (Outlined style)** as the primary source for icons.

- **Library:** [Material Symbols](https://fonts.google.com/icons?icon.style=Outlined)
- **Style:** Outlined (preferred for its clean aesthetic)

Using a single, comprehensive library helps maintain visual consistency and provides a wide range of options.

## Implementation

For React-based projects (like the main REX application), the easiest way to implement Material Symbols is using the `@mui/icons-material` package.

```bash
npm install @mui/icons-material
# or
yarn add @mui/icons-material
```

Then, import icons as individual React components:

```jsx
import SettingsIcon from '@mui/icons-material/SettingsOutlined'; // Note: Use Outlined version
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton } from '../components/Button/Button'; // Assuming Button component usage

function MyComponent() {
  return (
    <>
      <IconButton variant="ghost" size="md">
        <SettingsIcon />
      </IconButton>
      <Button variant="primary" startIcon={<AddCircleOutlineIcon />}>
        Add Item
      </Button>
    </>
  );
}
```

## Usage Guidelines

- **Consistency:** Always use icons from the recommended library (Material Symbols - Outlined) unless a specific custom icon is absolutely necessary and approved.
- **Clarity:** Choose icons that clearly represent the action or concept.
- **Size:**
    - Use standard sizes that align with typography and spacing tokens. Common sizes correspond to font sizes (e.g., 16px, 20px, 24px).
    - Within `IconButton`, the icon size is often determined by the button's `size` prop.
    - When used alongside text (e.g., in a Button `startIcon`), ensure the icon size is appropriate for the text size (usually `1em` or slightly larger).
- **Color:**
    - Icons should typically inherit their color via `currentColor` from the parent element (e.g., the button text color).
    - Avoid applying colors directly to the icon component unless necessary for specific semantic meaning (e.g., using `tokens.colors.status.error` for a delete icon, if appropriate contextually).
- **Pairing with Text:** When icons accompany text labels (like in buttons or menu items), ensure adequate spacing using `tokens.spacing`.

## Custom Icons

- Custom icons should be used sparingly and only when a suitable icon is not available in Material Symbols.
- Custom SVGs should be optimized and ideally wrapped in a consistent React component structure similar to `@mui/icons-material` for consistent sizing and color application.
- Ensure custom icons visually match the stroke weight and style of the Material Symbols Outlined set.

## Accessibility

- **Decorative Icons:** If an icon is purely decorative and provides no additional information (e.g., an icon next to a clear text label), hide it from screen readers using `aria-hidden="true"`.
- **Interactive Icons (Icon Buttons):**
    - `IconButton` components **must** have an accessible name provided via `aria-label`.
    - Example: `<IconButton aria-label="Settings"><SettingsIcon /></IconButton>`
- **Semantic Icons:** If an icon conveys meaning or status not present in adjacent text, provide alternative text (e.g., using `aria-label` on a container or providing visually hidden text).

*Adhering to these guidelines ensures our icons contribute positively to a clean, elegant, and accessible user experience.* 