# AI Coding Workshop Presentation App

## High-Level Vision

The AI Coding Workshop Presentation App is a web-based slide presentation that demonstrates the power of AI coding tools (Cursor.ai, Claude 3.7, and Claude Code) by being built with those very tools during a live workshop. This meta-recursive approach makes the medium the message - showcasing AI coding capabilities through a product created by those same capabilities.

The application will guide viewers through what these tools are, why they're transformative for software development, and how developers can integrate them into their workflows.

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────┐
│                React Frontend                    │
├─────────────┬─────────────────┬─────────────────┤
│  Navigation │     Slides      │  Interactivity  │
├─────────────┴─────────────────┴─────────────────┤
│               State Management                   │
├─────────────────────────────────────────────────┤
│               Express Backend                    │
└─────────────────────────────────────────────────┘
```

### Key Architectural Principles

- **Component-Based UI**: Modular slide components with consistent interfaces
- **Centralized State**: React Context API for managing presentation state
- **Declarative Animations**: Framer Motion for handling transitions
- **Dynamic Content Loading**: Slide content loaded from markdown files
- **Typed Interfaces**: TypeScript for type safety and developer experience
- **Minimal Backend**: Express.js for serving assets and slide content

### Data Flow

- Slides loaded dynamically from markdown instruction files
- Navigation events trigger state updates and transitions
- Interactive elements communicate through context providers
- Audio effects triggered by slide events and user interactions

### State Management

- **SlideContext**: Current slide, navigation, transitions
- **AnimationContext**: Animation sequences and timing
- **AudioContext**: Sound effect management
- **ThemeContext**: Visual theming and appearance

## Tech Stack

### Frontend
- **Framework**: React 18.2.0 with TypeScript 5.0.2
- **Build Tool**: Vite 4.3.0
- **Styling**: Tailwind CSS 3.3.1
- **Routing**: React Router 6.10.0
- **State Management**: React Context API

### Visualization & Interaction
- **Animation**: Framer Motion 10.12.4
- **Code Highlighting**: Prism.js 1.29.0
- **Typing Effects**: typewriter-effect 2.19.0
- **Audio**: howler.js 2.2.3
- **Charts** (optional): Recharts 2.5.0

### Backend & Development
- **Server**: Node.js 18.16.0 with Express 4.18.2
- **Testing**: Vitest 0.30.1 with React Testing Library 14.0.0
- **Linting**: ESLint 8.38.0 with Prettier 2.8.7

## File Structure

```
ai-coding-workshop/
├── public/                 # Static assets
│   ├── fonts/              # Custom fonts
│   ├── images/             # Static images
│   └── sounds/             # Audio effects
├── src/                    # Source code
│   ├── assets/             # Dynamic assets
│   ├── components/         # React components
│   │   ├── code/           # Code-related components
│   │   ├── layout/         # Layout components
│   │   ├── slides/         # Slide components
│   │   └── ui/             # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # Service utilities
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── server/                 # Express server
├── slide_instructions/     # Slide content markdown files
└── tests/                  # Test files
```

## Slide Instructions

The `slide_instructions/` directory contains markdown files that define the content and behavior for each slide. These files serve as the source of truth for presentation content, allowing for updates without code changes.

## Coding Standards

- Use functional React components with hooks
- Follow TypeScript best practices with proper typing
- Keep components focused on single responsibility
- Use descriptive naming for functions and variables
- Follow file naming conventions: PascalCase for components, camelCase for utilities

## Constraints

- Presentation must be completable within a 30-minute live demo
- All content must be responsive and work on standard presentation displays
- Bundle size should remain lean for quick loading
- UI should feel modern, polished, and professionally designed
- Animations should enhance understanding, not distract from content

## Success Criteria

- Clean, maintainable code architecture
- Smooth, engaging visual transitions between slides
- Accurate representation of AI coding workflows
- Demonstrates clear business value of AI coding tools
- Intuitive navigation and interaction patterns
- Serves as a compelling showcase of modern web development