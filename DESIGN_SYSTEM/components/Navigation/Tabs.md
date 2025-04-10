# Tabs Components

Components for creating tabbed navigation.

## Components

- **`TabsContainer`**: A flex container for holding a set of `Tab` components.
- **`Tab`**: An individual tab button, styled to indicate active/inactive states.

## TabsContainer Props

Accepts standard `div` attributes (`className`, `style`, etc.) and `children`.

| Prop       | Type        | Default | Description                                  |
| :--------- | :---------- | :------ | :------------------------------------------- |
| `children` | `ReactNode` | -       | A list of `Tab` components.                |

## Tab Props

| Prop           | Type      | Default | Description                                                                 |
| :------------- | :-------- | :------ | :-------------------------------------------------------------------------- |
| `active`       | `boolean` | `false` | If true, applies the active state styling (text weight, background, indicator). |
| `hasIndicator` | `boolean` | `true`  | *Note: Currently unused by styles, but intended for future indicator control.* |
| `children`     | `ReactNode` | -       | The text label for the tab.                                                 |
| `onClick`      | `() => void`| -       | Function called when the tab is clicked.                                    |

## Usage

```jsx
import React from 'react';
import { TabsContainer, Tab } from './Tabs';

function TabNavigation() {
  const [activeTab, setActiveTab] = React.useState('profile');

  return (
    <TabsContainer>
      <Tab
        active={activeTab === 'profile'}
        onClick={() => setActiveTab('profile')}
      >
        Profile
      </Tab>
      <Tab
        active={activeTab === 'settings'}
        onClick={() => setActiveTab('settings')}
      >
        Settings
      </Tab>
      <Tab
        active={activeTab === 'billing'}
        onClick={() => setActiveTab('billing')}
        // disabled // Can also be disabled like a standard button
      >
        Billing
      </Tab>
    </TabsContainer>
  );
}
```

## Implementation Notes

- `TabsContainer` is a simple flex `div`.
- `Tab` is a styled `button` element.
- The active state is primarily indicated by font weight, a subtle background gradient, and an animated underline indicator (`::after` pseudo-element).
- The styling uses `!important` for `background` and `backdrop-filter` on `TabsContainer` and `Tab` to override potential inherited glassmorphism effects, ensuring the tab background is clear or subtly graded as intended.

## Accessibility

- Ensure the `TabsContainer` has an appropriate ARIA role, likely `tablist`.
- Each `Tab` should have `role="tab"`.
- Use `aria-selected` on the active `Tab` component (`aria-selected="true"`).
- Associate the `TabsContainer` with the content panel it controls using `aria-controls` on the active `Tab` and an `id` on the panel.
- Implement keyboard navigation (arrow keys to move focus between tabs, Enter/Space to select).

*Note: Full accessibility often requires a more complex implementation using a state management hook or a dedicated tabs library component that handles focus management and ARIA attributes automatically.* 