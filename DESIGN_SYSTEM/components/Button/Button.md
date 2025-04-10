# Button Component

Buttons allow users to trigger actions or navigate.

## Components

- **`Button`**: Standard button with text label and optional icons.
- **`IconButton`**: Compact button displaying only an icon.

## Button Props

These props apply to the standard `Button` component.

| Prop          | Type                                           | Default     | Description                                      |
| :------------ | :--------------------------------------------- | :---------- | :----------------------------------------------- |
| `variant`     | `'primary'`, `'secondary'`, `'danger'`, `'ghost'` | `'primary'` | Sets the button's background and text color style. |
| `size`        | `'sm'`, `'md'`, `'lg'`                         | `'md'`      | Sets the button's padding and font size.         |
| `children`    | `ReactNode`                                    | -           | The content of the button (usually text).        |
| `startIcon`   | `ReactNode`                                    | `undefined` | Icon element placed before the text.             |
| `endIcon`     | `ReactNode`                                    | `undefined` | Icon element placed after the text.              |
| `disabled`    | `boolean`                                      | `false`     | If true, the button is disabled and non-interactive. |
| `onClick`     | `(event: MouseEvent<HTMLButtonElement>) => void` | -           | Function called when the button is clicked.      |
| `className`   | `string`                                       | `undefined` | Optional CSS class name.                         |
| `...rest`     | `ButtonHTMLAttributes<HTMLButtonElement>`      | -           | Standard HTML button attributes.                 |


## IconButton Props

These props apply to the `IconButton` component.

| Prop          | Type                                           | Default     | Description                                          |
| :------------ | :--------------------------------------------- | :---------- | :--------------------------------------------------- |
| `variant`     | `'primary'`, `'secondary'`, `'danger'`, `'ghost'` | `'primary'` | Sets the button's background and icon color style.   |
| `size`        | `'sm'`, `'md'`, `'lg'`                         | `'md'`      | Sets the button's overall size and icon size.      |
| `isActive`    | `boolean`                                      | `false`     | If true, applies a distinct style (often for toggles). |
| `children`    | `ReactNode`                                    | -           | The icon element to display inside the button.       |
| `disabled`    | `boolean`                                      | `false`     | If true, the button is disabled and non-interactive. |
| `onClick`     | `(event: MouseEvent<HTMLButtonElement>) => void` | -           | Function called when the button is clicked.          |
| `aria-label`  | `string`                                       | **Required**| Provides an accessible name for the icon button.     |
| `className`   | `string`                                       | `undefined` | Optional CSS class name.                             |
| `...rest`     | `ButtonHTMLAttributes<HTMLButtonElement>`      | -           | Standard HTML button attributes.                     |

## Usage

```jsx
import { Button, IconButton } from './Button';
import AddIcon from '@mui/icons-material/AddOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

function Example() {
  return (
    <Column>
      {/* Standard Buttons */}
      <Row>
        <Button variant="primary" size="lg">Primary Large</Button>
        <Button variant="secondary" size="md">Secondary Medium</Button>
        <Button variant="danger" size="sm">Danger Small</Button>
        <Button variant="ghost" size="md">Ghost Medium</Button>
        <Button variant="primary" size="md" disabled>Disabled</Button>
      </Row>

      {/* Buttons with Icons */}
      <Row>
        <Button variant="primary" startIcon={<AddIcon />}>Add Item</Button>
        <Button variant="danger" endIcon={<DeleteIcon />}>Delete Item</Button>
      </Row>

      {/* Icon Buttons */}
      <Row>
        <IconButton variant="primary" aria-label="Add Item">
          <AddIcon />
        </IconButton>
        <IconButton variant="ghost" aria-label="Settings" isActive>
          <SettingsIcon />
        </IconButton>
        <IconButton variant="danger" aria-label="Delete Item" disabled>
          <DeleteIcon />
        </IconButton>
      </Row>
    </Column>
  );
}
```

## Dos and Don'ts

- **Do** use the `variant` prop to convey semantic meaning (primary action, secondary, destructive).
- **Do** use `IconButton` for actions without a clear text label, ensuring an `aria-label` is provided.
- **Do** use consistent sizing within a given context.
- **Don't** create custom button styles; use the provided variants and sizes.
- **Don't** use `IconButton` for navigation; use links or navigation components.
- **Don't** put interactive elements inside a button.

## Accessibility

- `IconButton` **requires** an `aria-label` prop to provide an accessible name for screen readers.
- Ensure sufficient color contrast between button text/icon and background, especially for custom variants (though default variants are designed with contrast in mind).
- Disabled states are automatically handled (`opacity`, `cursor`).

## Implementation Notes

- Buttons use Emotion for styling.
- Icons should typically be passed as SVG components (e.g., from `@mui/icons-material`).
- Hover and active states are handled via CSS pseudo-classes. 