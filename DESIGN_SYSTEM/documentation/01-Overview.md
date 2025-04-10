# Design System Template

This directory contains a reusable design system template based on the aesthetic of the REX project's Network component.

## Overview

This design system provides:

- **Core Tokens:** Colors, spacing, typography, elevation, animation, etc. (See `tokens/`)
- **Glassmorphism:** A distinct visual style with transparency and blur effects. (See `components/Glass/`)
- **Base Components:** A set of common UI components built with Emotion and designed to work with the tokens and glassmorphism style. (See `components/`)
- **Documentation:** Guidelines on how to use the system. (See `documentation/`)

## Getting Started

*(Instructions on how to consume/use this template - e.g., copy, install as package - would go here)*

## Key Concepts

- **Tokens:** Use the exported values from `tokens/index.ts` for all styling.
- **Glassmorphism Hierarchy:** Understand the `container`, `interactive`, `emphasized`, and `content` hierarchies for applying glass effects. (See `documentation/06-Glassmorphism.md`)
- **Component Usage:** Refer to individual component documentation (when available) for props and examples.

## Structure

```
design-system-template/
├── tokens/         # Core design tokens (colors, spacing, etc.)
│   ├── index.ts
│   └── ...
├── components/     # Reusable UI components
│   ├── Button/
│   ├── Glass/
│   ├── Input/
│   ├── Layout/
│   └── ...
├── documentation/  # Usage guides and principles
│   ├── 01-Overview.md (This file)
│   ├── 02-Tokens.md
│   ├── 03-Button_Styles.md
│   ├── 04-Animation_Guide.md
│   ├── 05-Stacking_Context.md
│   ├── 06-Glassmorphism.md
│   └── ...
└── README.md       # Top-level README (points here)
``` 