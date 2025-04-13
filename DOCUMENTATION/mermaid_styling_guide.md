# Mermaid Styling Guide (Updated)

This guide provides a comprehensive overview of how to configure the look and styling of Mermaid diagrams. It includes examples and references to all available styling options, including `classDef`, layout direction, diagram-wide themes, looks, and visual effect approximations.

---

## ✅ Example Diagram with Custom Styling

```mermaid
graph TD

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI

    classDef llm fill:#2196F3,stroke:#1976D2,color:white,stroke-width:1.5px,rx:10,ry:10,font-size:14px,font-weight:bold
    classDef agent fill:#9C27B0,stroke:#7B1FA2,color:white,stroke-width:1.5px,rx:10,ry:10
    classDef integration fill:#4CAF50,stroke:#388E3C,color:white,stroke-width:1.5px,rx:10,ry:10
    classDef interface fill:#FF9800,stroke:#F57C00,color:white,stroke-width:1.5px,rx:10,ry:10

    class BaseLLM llm
    class MyAgent agent
    class MyAPI integration
    class UI interface
```

---

## 📘 Multiple Examples Demonstrating Styling Options

### 🎨 `classDef` with Layout Direction and Font Styling
```mermaid
graph LR

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI

    classDef llm fill:#2196F3,stroke:#1976D2,color:white,stroke-width:2px,rx:12,ry:12,font-size:16px,font-weight:bold
    classDef agent fill:#E91E63,stroke:#880E4F,color:#fff,stroke-width:2px,font-family:monospace
    classDef integration fill:#4CAF50,stroke:#1B5E20,color:white,stroke-width:1px,font-size:12px
    classDef interface fill:#FF9800,stroke:#EF6C00,color:white,stroke-width:1.5px,font-weight:lighter

    class BaseLLM llm
    class MyAgent agent
    class MyAPI integration
    class UI interface
```

### 🖍 `handDrawn` Look with Theme
```mermaid
---
config:
  look: handDrawn
  theme: forest
---
graph TD

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI
```

### 🎯 Direct Node Styling with `style`
```mermaid
graph TD

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI

    style BaseLLM fill:#00BCD4,stroke:#00796B,stroke-width:3px
    style MyAgent fill:#FF4081,stroke:#880E4F,stroke-width:2px,color:white
```

### ⚙️ Custom Theme Variables with Base Theme
```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#673AB7"
    primaryTextColor: "#ffffff"
    lineColor: "#03A9F4"
    fontFamily: "Courier New"
    fontSize: "18px"
---
graph TD

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI
```

### 🧊 Simulated Glassmorphism Effect
```mermaid
---
config:
  look: neo
  theme: dark
---
graph TD

    BaseLLM[Base LLM]
    MyAgent[Agent]
    MyAPI[Integration API]
    UI[User Interface]

    BaseLLM --> MyAgent --> MyAPI --> UI

    classDef glass fill:#ffffff20,stroke:#ffffffaa,color:#ffffff,font-size:14px,stroke-width:1.5px,rx:10,ry:10
    classDef borderless fill:#ffffff10,stroke:none,color:white,font-size:14px,rx:10,ry:10

    class BaseLLM glass
    class MyAgent glass
    class MyAPI borderless
    class UI glass
```
> While Mermaid doesn’t support real `backdrop-filter` effects, this approximation uses transparent fills and light strokes to emulate the feel of glass.

---

## 🎨 Styling with `classDef`

The `classDef` directive allows you to define reusable CSS-like styles.

### Common Attributes:
| Attribute       | Description                                        |
|----------------|----------------------------------------------------|
| `fill`         | Background color                                   |
| `stroke`       | Border color                                       |
| `stroke-width` | Border thickness                                   |
| `color`        | Font color                                         |
| `rx`, `ry`     | Border radius (rounded corners)                   |
| `font-size`    | Font size (e.g., `14px`)                           |
| `font-family`  | Font (e.g., `monospace`, `Arial`)                  |
| `font-weight`  | Text weight (`normal`, `bold`)                     |
| `padding`      | Internal padding                                   |
| `text-align`   | Text alignment (`left`, `center`, `right`)         |

Apply styles using:
```mermaid
classDef myStyle fill:#ccc,stroke:#333,color:black
class MyNode myStyle
```

### Direct Node Styling with `style`

You can apply styles directly to individual nodes:
```mermaid
style MyNode fill:#f9f,stroke:#333,stroke-width:4px
```
> Note: Only SVG-compatible CSS properties are supported. Some properties like `font-size` may not apply with `style`.

---

## 🔄 Layout Direction

Mermaid supports multiple layout directions:

```mermaid
graph TD    %% Top down
```

Options:
- `TD` or `TB`: Top-down (default)
- `LR`: Left to right
- `RL`: Right to left
- `BT`: Bottom to top

---

## 🎭 Themes & Looks

### Themes

Use `theme` to apply preset color and style schemes:
- `default`
- `neutral`
- `dark`
- `forest`
- `base`

Apply via:
```mermaid
%%{ init: { 'theme': 'forest' } }%%
```

### Looks

Looks apply a visual style to diagrams:
- `neo`: Modern
- `handDrawn`: Sketch-like (fun, informal)
- `classic`: Traditional appearance

Applied using frontmatter (works for flowcharts and state diagrams):
```mermaid
---
config:
  look: handDrawn
  theme: forest
---
```

### Theme Variables

For more granular control (especially with `base` theme):
```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: "#ff0000"
    primaryTextColor: "#ffffff"
    lineColor: "#00ff00"
    fontFamily: "Arial"
    fontSize: "16px"
---
```

---

## 🧪 Debugging Tips
- Use the [Mermaid Live Editor](https://mermaid.live) for real-time preview.
- In VS Code, install **Markdown Preview Mermaid Support** for live previews.
- For complex styles, inspect SVG elements in browser dev tools.

---

## ✅ Best Practices
- **Consistency**: Use `classDef` to style node types.
- **Readability**: Choose clear layout directions.
- **Customization**: Use themes and `look` for branding.
- **Maintainability**: Use frontmatter for full config control.

---

For more, visit the [Mermaid Official Docs](https://mermaid.js.org/).

