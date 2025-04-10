# Overlay Components

Overlay components display content on top of the main interface, often used for dialogs, menus, or tooltips.

## Components

- **`GlassDialog`**: A modal dialog component based on MUI's `Dialog`, styled with the glassmorphism effect.
- **`GlassDropdownMenu`**: A container for dropdown menus, styled with glassmorphism. Designed for absolute positioning.
- **`GlassMenuItem`**: An individual item within a `GlassDropdownMenu`, with hover effects.
- **`GlassTooltip`** (from `components/Glass/RelatedComponents.tsx`): A tooltip component styled with glassmorphism.

## GlassDialog Props

This component inherits all props from **MUI `Dialog`** ([MUI Dialog API](https://mui.com/material-ui/api/dialog/)), including:

- `open`: (boolean, required) Controls visibility.
- `onClose`: (function) Callback when the dialog requests to be closed.
- `children`: (ReactNode) The content of the dialog.
- `fullWidth`, `maxWidth`, etc.

It also accepts the following props to control the glass effect on the `DialogPaper`:

| Prop        | Type                                                     | Default       | Description                                                           |
| :---------- | :------------------------------------------------------- | :------------ | :-------------------------------------------------------------------- |
| `hierarchy` | `'container'`, `'interactive'`, `'emphasized'`, `'content'` | `'emphasized'`| Semantic hierarchy for the dialog paper's glass effect.               |
| `level`     | `'primary'`, `'secondary'`, `'tertiary'`                | `'primary'`   | Fine-tunes the effect within the chosen hierarchy for the dialog paper. |
| `intensity` | `'light'`, `'medium'`, `'heavy'`, `'intense'`            | `'heavy'`     | *Legacy:* Overrides the default blur intensity for the dialog paper.  |

## GlassDropdownMenu Props

Accepts standard `div` attributes (`className`, `style`, etc.) and `children`.

| Prop       | Type        | Default | Description                                    |
| :--------- | :---------- | :------ | :--------------------------------------------- |
| `children` | `ReactNode` | -       | Typically a list of `GlassMenuItem` components. |

## GlassMenuItem Props

Accepts standard `div` attributes (`className`, `style`, `onClick`) and `children`.

| Prop       | Type         | Default | Description                                          |
| :--------- | :----------- | :------ | :--------------------------------------------------- |
| `children` | `ReactNode`  | -       | Content of the menu item.                          |
| `onClick`  | `() => void` | -       | Function called when the menu item is clicked.       |

## GlassTooltip Props

Inherits `GlassProps` (see `components/Glass/Glass.md`) for styling.
Accepts standard `Box` props from MUI and `children`.

| Prop       | Type        | Default | Description                |
| :--------- | :---------- | :------ | :------------------------- |
| `children` | `ReactNode` | -       | Content of the tooltip.    |

## Usage

```jsx
import React from 'react';
import { GlassDialog, GlassDropdownMenu, GlassMenuItem } from './Overlay'; // Assuming re-export
import { GlassTooltip } from '../Glass/RelatedComponents'; // Adjust path as needed
import { Button, IconButton } from '../Button/Button';
import InfoIcon from '@mui/icons-material/InfoOutlined';

function OverlayExamples() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  return (
    <Column style={{ gap: tokens.spacing.lg }}>
      {/* Dialog Example */}
      <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
      <GlassDialog open={dialogOpen} onClose={() => setDialogOpen(false)} hierarchy="emphasized" level="primary">
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is the content of the glass dialog.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setDialogOpen(false)} variant="primary">Confirm</Button>
        </DialogActions>
      </GlassDialog>

      {/* Dropdown Menu Example (Basic Positioning) */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Button onClick={handleMenuClick}>Open Menu</Button>
        {Boolean(menuAnchorEl) && (
          <GlassDropdownMenu style={{ top: '100%', left: 0, marginTop: '4px' }}>
            <GlassMenuItem onClick={handleMenuClose}>Profile</GlassMenuItem>
            <GlassMenuItem onClick={handleMenuClose}>Settings</GlassMenuItem>
            <GlassMenuItem onClick={handleMenuClose}>Logout</GlassMenuItem>
          </GlassDropdownMenu>
        )}
      </div>

      {/* Tooltip Example */}
      <IconButton aria-label="Info">
         <InfoIcon />
         {/* Basic Tooltip Display Logic (Needs a Tooltip library/wrapper for positioning) */}
         {/* <GlassTooltip>Information text here</GlassTooltip> */}
      </IconButton>

    </Column>
  );
}
```

*Note: The Dropdown Menu and Tooltip examples show basic structure. Proper positioning usually requires a library like MUI's `Menu` or `Tooltip` components, or Popper.js.*

## Implementation Notes

- `GlassDialog` wraps MUI's `Dialog` and applies glass styling to the `MuiDialog-paper` and backdrop.
- `GlassDropdownMenu` and `GlassMenuItem` are styled `div` elements providing the glass look for custom menu implementations.
- `GlassTooltip` is a styled MUI `Box` applying glass styles.
- These components use `tokens.zIndex` values (`modal`, `dropdown`, `tooltip`) to ensure proper stacking.

## Accessibility

- **Dialogs:** Follow MUI's accessibility guidelines for dialogs (managing focus, labeling).
- **Menus:** Ensure proper keyboard navigation (arrow keys, Enter/Space to select) and ARIA roles (`menu`, `menuitem`) if building custom menus.
- **Tooltips:** Tooltips should generally provide supplementary, non-essential information. Ensure interactive elements triggering tooltips are focusable and provide appropriate labels. 