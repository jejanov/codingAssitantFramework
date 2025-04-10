# Input Components

Input components allow users to enter and edit text.

## Components

- **`TextInput`**: Standard single-line text input field.
- **`TextArea`**: Standard multi-line text area field.

## TextInput Props

| Prop           | Type                                     | Default     | Description                                      |
| :------------- | :--------------------------------------- | :---------- | :----------------------------------------------- |
| `type`         | `string`                                 | `'text'`    | Input type (e.g., 'text', 'password', 'email').    |
| `value`        | `string`                                 | `undefined` | The current value of the input.                  |
| `onChange`     | `(event: ChangeEvent<HTMLInputElement>) => void` | -           | Function called when the input value changes.    |
| `placeholder`  | `string`                                 | `undefined` | Placeholder text shown when the input is empty.  |
| `disabled`     | `boolean`                                | `false`     | If true, the input is disabled.                  |
| `readOnly`     | `boolean`                                | `false`     | If true, the input value cannot be changed.     |
| `required`     | `boolean`                                | `false`     | If true, the input must have a value.          |
| `id`           | `string`                                 | `undefined` | Input element ID (useful for labels).          |
| `name`         | `string`                                 | `undefined` | Input element name.                            |
| `className`    | `string`                                 | `undefined` | Optional CSS class name.                         |
| `...rest`      | `InputHTMLAttributes<HTMLInputElement>`  | -           | Standard HTML input attributes.                  |

## TextArea Props

| Prop           | Type                                       | Default     | Description                                      |
| :------------- | :----------------------------------------- | :---------- | :----------------------------------------------- |
| `value`        | `string`                                   | `undefined` | The current value of the text area.              |
| `onChange`     | `(event: ChangeEvent<HTMLTextAreaElement>) => void` | -           | Function called when the value changes.          |
| `placeholder`  | `string`                                   | `undefined` | Placeholder text shown when the area is empty.   |
| `rows`         | `number`                                   | `undefined` | Specifies the visible number of lines.           |
| `disabled`     | `boolean`                                  | `false`     | If true, the text area is disabled.              |
| `readOnly`     | `boolean`                                  | `false`     | If true, the text area value cannot be changed. |
| `required`     | `boolean`                                  | `false`     | If true, the text area must have a value.      |
| `id`           | `string`                                   | `undefined` | Text area element ID (useful for labels).      |
| `name`         | `string`                                   | `undefined` | Text area element name.                        |
| `className`    | `string`                                   | `undefined` | Optional CSS class name.                         |
| `...rest`      | `TextareaHTMLAttributes<HTMLTextAreaElement>` | -           | Standard HTML textarea attributes.               |

## Usage

```jsx
import { TextInput, TextArea } from './Input';

function ExampleForm() {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  return (
    <Column style={{ gap: tokens.spacing.md }}>
      <TextInput
        id="user-name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextArea
        id="item-description"
        placeholder="Describe the item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <TextInput
        placeholder="Disabled input"
        disabled
      />
    </Column>
  );
}
```

## Styling & Glassmorphism

- Both `TextInput` and `TextArea` incorporate the design system's glassmorphism effect using `tokens.transparency.interactive.secondary` for the background and `blur.medium`.
- On focus, the background transparency increases slightly (`interactive.tertiary`), and the border color uses `tokens.colors.primary[300]`, providing clear visual feedback.
- They use standard `tokens.spacing.md` for padding and `tokens.radius.md` for border radius.

## Accessibility

- **Labels:** Always associate a `<label>` element with each `TextInput` and `TextArea`. Use the `htmlFor` attribute on the label and match it with the input's `id`.
  ```jsx
  <label htmlFor="user-name">Name</label>
  <TextInput id="user-name" ... />
  ```
- **Placeholders:** Placeholders are **not** a substitute for labels. They should provide hints or examples, not critical information.
- **Required Fields:** Clearly indicate required fields visually (e.g., with an asterisk) and use the `required` attribute.
- **Disabled State:** The `disabled` attribute makes the input non-interactive and it's styled accordingly.

## Implementation Notes

- These components are styled HTML `<input>` and `<textarea>` elements using Emotion.
- They inherit standard HTML attributes.
- `TextArea` has resizing disabled (`resize: none;`) by default to maintain layout consistency; use the `rows` prop to control initial height. 