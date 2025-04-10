# Layout Components

These components provide basic building blocks for structuring UI layouts using Flexbox and CSS Grid.

## Components

- **`SectionContainer`**: A simple flex container (`flex-direction: column`) with a bottom margin (`tokens.spacing.lg`). Useful for grouping related sections vertically.
- **`Row`**: A horizontal flex container (`display: flex`, `align-items: center`) with wrapping enabled (`flex-wrap: wrap`) and a default gap (`tokens.spacing.sm`).
- **`Column`**: A vertical flex container (`display: flex`, `flex-direction: column`) with a default gap (`tokens.spacing.sm`).
- **`Spacer`**: A flexible element that expands to fill available space (`flex: 1`) within a flex container (`Row` or `Column`).
- **`Grid`**: A CSS Grid container.

## Props

Most layout components (`SectionContainer`, `Row`, `Column`, `Spacer`) primarily accept standard `div` attributes (`className`, `style`, etc.) and `children`.

**Grid Props:**

| Prop      | Type     | Default                | Description                                                    |
| :-------- | :------- | :--------------------- | :------------------------------------------------------------- |
| `columns` | `number` | `2`                    | Number of columns in the grid (`grid-template-columns`).       |
| `gap`     | `string` | `tokens.spacing.md`    | Gap between grid items (CSS `gap` property). Uses token value. |

## Usage

```jsx
import {
  SectionContainer,
  Row,
  Column,
  Spacer,
  Grid
} from './Layout';
import { Button } from '../Button/Button'; // Example usage with Button

function PageLayout() {
  return (
    <SectionContainer>
      <h2>Section Title</h2>
      <Row>
        <Button>Action 1</Button>
        <Spacer /> { /* Pushes Action 2 to the right */}
        <Button variant="secondary">Action 2</Button>
      </Row>
    </SectionContainer>

    <SectionContainer>
      <Column>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Column>
    </SectionContainer>

    <SectionContainer>
      <Grid columns={3} gap={tokens.spacing.lg}>
        <div>Grid Cell 1</div>
        <div>Grid Cell 2</div>
        <div>Grid Cell 3</div>
        <div>Grid Cell 4</div>
        <div>Grid Cell 5</div>
      </Grid>
    </SectionContainer>
  );
}
```

## Implementation Notes

- These are simple styled `div` elements using Emotion.
- They provide convenient shortcuts for common flexbox and grid layouts.
- Default gaps use `tokens.spacing` but can be overridden with `style` or `className` if necessary. 