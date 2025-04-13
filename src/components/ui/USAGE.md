# Mermaid Chart Components

This package contains React components for creating and displaying Mermaid charts in your application.

## Components

### MermaidChart

The `MermaidChart` component is a versatile wrapper around the Mermaid.js library, allowing you to render any Mermaid diagram in your React application with customizable styling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| definition | string | (required) | The Mermaid diagram definition |
| className | string | '' | Additional CSS class for styling |
| width | string | '95%' | Width of the SVG element |
| height | string | '95%' | Height of the SVG element |
| backgroundColor | string | 'transparent' | Background color of the SVG |
| textFontSize | string | '16px' | Font size for node text |
| textFontWeight | string | 'bold' | Font weight for node text |
| borderRadius | string | '8' | Border radius for nodes and clusters |

#### Basic Usage

```jsx
import { MermaidChart } from './components/ui';

const MyComponent = () => {
  const diagramDefinition = `
    graph TD
      A[Start] --> B[Process]
      B --> C[End]
  `;

  return (
    <MermaidChart 
      definition={diagramDefinition} 
      height="300px"
    />
  );
};
```

### LlmArchitectureChart

The `LlmArchitectureChart` is a specialized component built on top of `MermaidChart` specifically for rendering LLM architecture diagrams. It provides a pre-defined diagram structure with two view options: 'basic' and 'full'.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| view | 'basic' \| 'full' | 'basic' | Which view of the architecture to display |
| className | string | '' | Additional CSS class for styling |
| height | string | '400px' | Height of the chart container |
| width | string | '100%' | Width of the chart container |
| style | CSSProperties | undefined | Additional inline styles |

#### Basic Usage

```jsx
import { LlmArchitectureChart } from './components/ui';

const MyComponent = () => {
  return (
    <div>
      <h2>Foundation Layer</h2>
      <LlmArchitectureChart view="basic" height="300px" />
      
      <h2>Complete Architecture</h2>
      <LlmArchitectureChart view="full" height="500px" />
    </div>
  );
};
```

## Interactive Example

An interactive example is available in the `ChartExample` component, which demonstrates how to create a UI for switching between the different views of the LLM architecture.

```jsx
import { ChartExample } from './components/ui';

const App = () => {
  return (
    <div>
      <h1>LLM Architecture Demo</h1>
      <ChartExample />
    </div>
  );
};
```

## Customizing Mermaid Charts

You can create your own custom Mermaid chart by passing a Mermaid diagram definition to the `MermaidChart` component. Refer to the [Mermaid.js documentation](https://mermaid.js.org/) for details on the syntax for creating different types of diagrams.

### Example: Creating a Custom Flow Chart

```jsx
import { MermaidChart } from './components/ui';

const CustomFlowChart = () => {
  const definition = `
    graph LR
      A[Input] --> B{Process}
      B -->|Yes| C[Output 1]
      B -->|No| D[Output 2]
      
      classDef green fill:#9f6,stroke:#333,stroke-width:2px;
      classDef orange fill:#f96,stroke:#333,stroke-width:2px;
      
      class A,C green
      class B,D orange
  `;
  
  return (
    <MermaidChart
      definition={definition}
      height="300px"
      textFontSize="14px"
    />
  );
};
```

## Best Practices

1. **Performance**: Mermaid diagrams can be computationally expensive to render. If you have multiple diagrams on a page, consider lazy loading them as they come into view.

2. **Responsive Design**: The components are designed to be responsive by default, but you may need to adjust the height and width props depending on your layout.

3. **Error Handling**: The `MermaidChart` component includes built-in error handling that will display an error message if the diagram fails to render.

4. **Custom Styling**: Use the styling props to match the diagram to your application's design system. For more advanced styling, you can also use the className prop to apply custom CSS.

## Troubleshooting

- **Diagram Not Rendering**: Ensure that your Mermaid syntax is correct. You can test it in the [Mermaid Live Editor](https://mermaid.live/) before using it in your application.

- **Text Overflow**: If node text is being cut off, try adjusting the textFontSize prop or modify the diagram definition to use shorter labels.

- **SVG Size Issues**: If the SVG is not scaling correctly, check the width and height props and ensure your container has appropriate dimensions. 